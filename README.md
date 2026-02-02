# Duplom Flight Price Prediction Platform

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` and proxies `/api` to the ASP.NET Core
API Gateway defined by `VITE_API_BASE_URL` (default `http://localhost:5000`).

### Environment

```bash
cp frontend/.env.example frontend/.env.local
```

Adjust values as needed. By default the UI talks to the API Gateway. Set
`VITE_ENABLE_DIRECT_ML=true` if you explicitly want the UI to call the ML service.

### Docker

```bash
docker compose up --build
```

The container serves the frontend on `http://localhost:3000`.

## API Gateway (.NET)

```bash
cd backend/ApiGateway
dotnet restore
dotnet run
```

The API listens on `http://localhost:8080` (or `http://localhost:5000` when run via Docker Compose).

## ETL (SerpApi + Airflow)

```bash
cd etl
python serpapi_ingest.py
```

Airflow DAGs live in `etl/airflow/dags`. Configure SerpApi and Postgres env vars in `.env.local`
or your deployment environment before running the ETL.
