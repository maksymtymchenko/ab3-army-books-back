# Biblioteka Backend

Node.js + Express + MongoDB backend for the Biblioteka UI.

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

- `NODE_ENV` – `development` | `production`
- `PORT` – HTTP port (default `3000`)
- `MONGO_URI` – MongoDB connection string
- `LOG_LEVEL` – winston log level (`info`, `debug`, etc.)
- `RATE_LIMIT_WINDOW_MS` – reservation rate limit window in ms
- `RATE_LIMIT_MAX` – max reservations per IP per window
- `CORS_ORIGIN` – allowed CORS origin for frontend

## Running Locally

```bash
npm run dev
```

Server listens on `http://localhost:3000`.

## Running with Docker

```bash
docker-compose up --build
```

App: `http://localhost:3000`  
Mongo: `mongodb://localhost:27017` (exposed via compose)

## Build for Production

```bash
npm run build
npm start
```

## API

All routes are under `/api` and strictly follow `API.md`:

- `GET /api/books/home`
- `GET /api/books`
- `GET /api/books/filters`
- `GET /api/books/search`
- `GET /api/books/:id`
- `GET /api/categories`
- `POST /api/reservations`

Refer to `API.md` for full contracts (request params, responses, status codes).
