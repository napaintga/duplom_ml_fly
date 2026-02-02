# SerpApi Google Flights data source

## Overview

This project uses SerpApi's Google Flights engine to ingest flight offers. The
ETL stores both the raw response and normalized offers for audit and reproducibility.

## Environment variables

```env
SERPAPI_API_KEY=
SERPAPI_BASE_URL=https://serpapi.com/search
SERPAPI_DEFAULT_DEEP_SEARCH=false
SERPAPI_TIMEOUT_SECONDS=30
SERPAPI_RETRY_COUNT=3
SERPAPI_CACHE_HOURS=6
```

## Request parameters

The ETL sends a GET request to `SERPAPI_BASE_URL` with the following query:

- `engine=google_flights`
- `departure_id`
- `arrival_id`
- `outbound_date`
- `currency` (default `USD`)
- `hl` (default `en`)
- `gl` (default `us`)
- `deep_search` (`true` or `false`)
- `api_key`

## Deep search behavior

When `deep_search=false`, the ETL performs a faster request. If the response is
missing both `best_flights` and `other_flights`, the ETL retries with
`deep_search=true` to match Google Flights browser results.

## Response fields used

SerpApi returns arrays:

- `best_flights`
- `other_flights`

Both arrays are normalized into `flights` (offers) and linked to a raw search
record in `flight_search_raw`.

## Raw + normalized storage

- `flight_search_raw` stores request parameters, full JSON, and timestamps.
- `flights` stores normalized offers (route, times, airline, price).
- `flight_price_history` stores price snapshots for trend analysis.

## Error handling

- Missing API key raises `SerpApi key missing`.
- HTTP errors surface SerpApi status + response.
- Retry/backoff uses exponential delays based on `SERPAPI_RETRY_COUNT`.
