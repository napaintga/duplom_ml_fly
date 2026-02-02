import hashlib
import json
import logging
import os
import time
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, Dict, Iterable, List, Tuple

import psycopg2
import requests
from psycopg2.extras import Json

LOGGER = logging.getLogger("serpapi_ingest")

SERPAPI_BASE_URL = os.getenv("SERPAPI_BASE_URL", "https://serpapi.com/search")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
SERPAPI_DEFAULT_DEEP_SEARCH = os.getenv("SERPAPI_DEFAULT_DEEP_SEARCH", "false").lower() == "true"
SERPAPI_TIMEOUT_SECONDS = int(os.getenv("SERPAPI_TIMEOUT_SECONDS", "30"))
SERPAPI_RETRY_COUNT = int(os.getenv("SERPAPI_RETRY_COUNT", "3"))
SERPAPI_CACHE_HOURS = int(os.getenv("SERPAPI_CACHE_HOURS", "6"))

POSTGRES_CONNECTION = os.getenv("POSTGRES_CONNECTION", "")

@dataclass(frozen=True)
class SearchParams:
    departure_id: str
    arrival_id: str
    outbound_date: str
    currency: str = "USD"
    hl: str = "en"
    gl: str = "us"

    def to_query(self, deep_search: bool) -> Dict[str, Any]:
        return {
            "engine": "google_flights",
            "departure_id": self.departure_id,
            "arrival_id": self.arrival_id,
            "outbound_date": self.outbound_date,
            "currency": self.currency,
            "hl": self.hl,
            "gl": self.gl,
            "deep_search": str(deep_search).lower()
        }


def build_request_hash(params: Dict[str, Any]) -> str:
    encoded = json.dumps(params, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()


def request_serpapi(params: Dict[str, Any]) -> Dict[str, Any]:
    if not SERPAPI_API_KEY:
        raise RuntimeError("SerpApi key missing")

    query = {**params, "api_key": SERPAPI_API_KEY}
    delay = 1

    for attempt in range(1, SERPAPI_RETRY_COUNT + 1):
        try:
            response = requests.get(
                SERPAPI_BASE_URL,
                params=query,
                timeout=SERPAPI_TIMEOUT_SECONDS
            )
            if response.status_code >= 400:
                raise RuntimeError(f"SerpApi error {response.status_code}: {response.text}")
            return response.json()
        except Exception as exc:
            if attempt == SERPAPI_RETRY_COUNT:
                raise
            LOGGER.warning("SerpApi request failed (%s). Retrying in %s sec", exc, delay)
            time.sleep(delay)
            delay *= 2

    raise RuntimeError("SerpApi request failed after retries")


def response_has_results(payload: Dict[str, Any]) -> bool:
    best = payload.get("best_flights") or []
    other = payload.get("other_flights") or []
    return bool(best or other)


def normalize_flights(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    normalized: List[Dict[str, Any]] = []

    def parse_group(items: Iterable[Dict[str, Any]], rank: str) -> None:
        for item in items:
            flights = item.get("flights") or []
            first_leg = flights[0] if flights else {}
            normalized.append(
                {
                    "origin": first_leg.get("departure_airport", {}).get("id"),
                    "destination": first_leg.get("arrival_airport", {}).get("id"),
                    "depart_at": first_leg.get("departure_time"),
                    "arrive_at": first_leg.get("arrival_time"),
                    "airline": first_leg.get("airline"),
                    "flight_number": first_leg.get("flight_number"),
                    "stops": item.get("stops"),
                    "duration_minutes": item.get("total_duration"),
                    "price_amount": item.get("price", {}).get("amount"),
                    "currency": item.get("price", {}).get("currency"),
                    "carbon_emissions": item.get("carbon_emissions", {}).get("this_flight"),
                    "booking_url": item.get("booking_options", [{}])[0].get("booking_url"),
                    "source_rank": rank
                }
            )

    parse_group(payload.get("best_flights") or [], "best")
    parse_group(payload.get("other_flights") or [], "other")

    return normalized


def get_db_connection():
    if not POSTGRES_CONNECTION:
        raise RuntimeError("POSTGRES_CONNECTION is not set")
    return psycopg2.connect(POSTGRES_CONNECTION)


def is_cached(cursor, request_hash: str) -> Tuple[bool, str]:
    cursor.execute(
        """
        SELECT id, fetched_at
        FROM flight_search_raw
        WHERE request_hash = %s
        """,
        (request_hash,)
    )
    row = cursor.fetchone()
    if not row:
        return False, ""
    fetched_at = row[1]
    if fetched_at and fetched_at >= datetime.utcnow() - timedelta(hours=SERPAPI_CACHE_HOURS):
        return True, row[0]
    return False, row[0]


def upsert_raw(cursor, request_hash: str, params: Dict[str, Any], payload: Dict[str, Any], deep_search: bool) -> str:
    cursor.execute(
        """
        INSERT INTO flight_search_raw (id, request_hash, request_params, response_json, provider, deep_search, fetched_at)
        VALUES (gen_random_uuid(), %s, %s, %s, 'serpapi_google_flights', %s, %s)
        ON CONFLICT (request_hash)
        DO UPDATE SET response_json = EXCLUDED.response_json,
                      deep_search = EXCLUDED.deep_search,
                      fetched_at = EXCLUDED.fetched_at
        RETURNING id;
        """,
        (
            request_hash,
            Json(params),
            Json(payload),
            deep_search,
            datetime.utcnow(),
        ),
    )
    return cursor.fetchone()[0]


def insert_normalized(cursor, search_id: str, rows: List[Dict[str, Any]]) -> None:
    for row in rows:
        cursor.execute(
            """
            INSERT INTO flights (
                id, search_id, origin, destination, depart_at, arrive_at, airline, flight_number,
                stops, duration_minutes, price_amount, currency, carbon_emissions, booking_url, source_rank
            )
            VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """,
            (
                search_id,
                row.get("origin"),
                row.get("destination"),
                row.get("depart_at"),
                row.get("arrive_at"),
                row.get("airline"),
                row.get("flight_number"),
                row.get("stops"),
                row.get("duration_minutes"),
                row.get("price_amount"),
                row.get("currency"),
                row.get("carbon_emissions"),
                row.get("booking_url"),
                row.get("source_rank"),
            ),
        )


def append_price_history(cursor, search_id: str, rows: List[Dict[str, Any]]) -> None:
    cursor.execute(
        "SELECT id, price_amount, currency FROM flights WHERE search_id = %s",
        (search_id,),
    )
    offers = cursor.fetchall()
    for offer_id, price_amount, currency in offers:
        if price_amount is None:
            continue
        cursor.execute(
            """
            INSERT INTO flight_price_history (id, flight_offer_id, ts, price_amount, currency)
            VALUES (gen_random_uuid(), %s, %s, %s, %s);
            """,
            (
                offer_id,
                datetime.utcnow(),
                price_amount,
                currency,
            ),
        )


def ingest_search(params: SearchParams, deep_search: bool = SERPAPI_DEFAULT_DEEP_SEARCH) -> str:
    LOGGER.info("Starting SerpApi ingest for %s -> %s", params.departure_id, params.arrival_id)

    query_params = params.to_query(deep_search)
    request_hash = build_request_hash(query_params)

    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cached, cached_id = is_cached(cursor, request_hash)
            if cached:
                LOGGER.info("Cache hit for request %s", request_hash)
                return cached_id

            payload = request_serpapi(query_params)
            if not response_has_results(payload) and not deep_search:
                LOGGER.info("Fallback to deep_search for %s", request_hash)
                query_params = params.to_query(True)
                request_hash = build_request_hash(query_params)
                payload = request_serpapi(query_params)
                deep_search = True

            search_id = upsert_raw(cursor, request_hash, query_params, payload, deep_search)
            normalized = normalize_flights(payload)
            insert_normalized(cursor, search_id, normalized)
            append_price_history(cursor, search_id, normalized)

        connection.commit()

    LOGGER.info("Ingest completed for %s with %s offers", request_hash, len(normalized))
    return search_id


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    example = SearchParams(
        departure_id=os.getenv("SERPAPI_DEPARTURE_ID", "SFO"),
        arrival_id=os.getenv("SERPAPI_ARRIVAL_ID", "LAX"),
        outbound_date=os.getenv("SERPAPI_OUTBOUND_DATE", datetime.utcnow().strftime("%Y-%m-%d"))
    )
    ingest_search(example)
