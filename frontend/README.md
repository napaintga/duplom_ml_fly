# Flight Price Prediction Frontend

## Setup

```bash
cd frontend
npm install
```

## Environment

Copy the example and adjust as needed:

```bash
cp .env.example .env.local
```

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ML_BASE_URL=http://localhost:8000
VITE_ENABLE_DIRECT_ML=false
```

By default the UI calls the ASP.NET Core API Gateway. Set `VITE_ENABLE_DIRECT_ML=true`
only if you want the UI to call the ML service directly for predictions.

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Docker

Build and run:

```bash
docker build -t flight-frontend .
docker run -p 3000:80 flight-frontend
```

Or with Docker Compose from the repo root:

```bash
docker compose up --build
```

## Common issues

- **CORS**: ensure the API Gateway allows the frontend origin or rely on the Vite proxy for `/api`.
- **Proxy**: the Vite dev server proxies `/api` requests to `VITE_API_BASE_URL`.
- **Empty data**: confirm that backend endpoints in `src/shared/api/endpoints.ts` match your gateway routes.
