from datetime import datetime, timedelta
import logging
import os

from airflow import DAG
from airflow.operators.python import PythonOperator

from etl.serpapi_ingest import SearchParams, ingest_search

LOGGER = logging.getLogger("serpapi_airflow")

DEFAULT_ROUTES = [
    ("SFO", "LAX"),
    ("JFK", "LHR")
]


def run_ingest():
    outbound_date = os.getenv("SERPAPI_OUTBOUND_DATE", datetime.utcnow().strftime("%Y-%m-%d"))
    for origin, destination in DEFAULT_ROUTES:
        params = SearchParams(
            departure_id=origin,
            arrival_id=destination,
            outbound_date=outbound_date
        )
        search_id = ingest_search(params)
        LOGGER.info("SerpApi ingest complete for %s -> %s (%s)", origin, destination, search_id)


def publish_events():
    LOGGER.info("Publish events flight.data.updated to Kafka/RabbitMQ (stub)")


definition_args = {
    "owner": "data-platform",
    "depends_on_past": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5)
}

dag = DAG(
    "serpapi_google_flights",
    default_args=definition_args,
    description="Fetch Google Flights data via SerpApi",
    schedule="@hourly",
    start_date=datetime(2024, 1, 1),
    catchup=False
)

extract_load = PythonOperator(
    task_id="extract_transform_load",
    python_callable=run_ingest,
    dag=dag
)

publish = PythonOperator(
    task_id="publish_events",
    python_callable=publish_events,
    dag=dag
)

extract_load >> publish
