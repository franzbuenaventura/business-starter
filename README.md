# Business Starter 🚀

ReactJS + Express + SQLite, containerized with Docker.

## Quick Start (Development)

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api

## Production with Docker

```bash
docker compose up --build -d
```

App available at http://localhost:3001

## Tech Stack

| Layer      | Technology         |
|------------|--------------------|
| Frontend   | React 18 + Vite    |
| Backend    | Express            |
| Database   | SQLite (WAL mode)  |
| Container  | Docker + Compose   |

## Project Structure

```
business-starter/
├── src/              # React frontend
│   ├── App.jsx
│   └── main.jsx
├── server/           # Express API
│   └── index.js
├── Dockerfile        # Multi-stage build
├── docker-compose.yml
├── vite.config.js
└── package.json
```

## API Endpoints

- `GET /api/businesses` — list all
- `POST /api/businesses` — create `{ name, industry }`
- `DELETE /api/businesses/:id` — delete by id