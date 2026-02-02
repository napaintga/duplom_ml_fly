CREATE TABLE IF NOT EXISTS flight_search_raw (
    id uuid PRIMARY KEY,
    request_hash text UNIQUE NOT NULL,
    request_params jsonb NOT NULL,
    response_json jsonb NOT NULL,
    provider text NOT NULL DEFAULT 'serpapi_google_flights',
    deep_search boolean NOT NULL DEFAULT false,
    fetched_at timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS flights (
    id uuid PRIMARY KEY,
    search_id uuid NOT NULL REFERENCES flight_search_raw(id),
    origin text NOT NULL,
    destination text NOT NULL,
    depart_at timestamp NOT NULL,
    arrive_at timestamp,
    airline text,
    flight_number text,
    stops integer,
    duration_minutes integer,
    price_amount numeric,
    currency text,
    carbon_emissions integer,
    booking_url text,
    source_rank text NOT NULL
);

CREATE TABLE IF NOT EXISTS flight_price_history (
    id uuid PRIMARY KEY,
    flight_offer_id uuid NOT NULL REFERENCES flights(id),
    ts timestamp NOT NULL,
    price_amount numeric NOT NULL,
    currency text
);

CREATE TABLE IF NOT EXISTS flight_predictions (
    id uuid PRIMARY KEY,
    flight_id uuid NOT NULL REFERENCES flights(id),
    predicted_price numeric NOT NULL,
    lower_bound numeric,
    upper_bound numeric,
    model_name text,
    created_at timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
    id uuid PRIMARY KEY,
    flight_id uuid NOT NULL REFERENCES flights(id),
    user_id text,
    price_paid numeric,
    created_at timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_actual_vs_predicted (
    id uuid PRIMARY KEY,
    ts timestamp NOT NULL,
    actual numeric NOT NULL,
    predicted numeric NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_metrics (
    id uuid PRIMARY KEY,
    mae numeric,
    rmse numeric,
    mape numeric,
    model_name text,
    updated_at timestamp
);
