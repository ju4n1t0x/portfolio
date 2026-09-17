# Portfolio - Juan Ignacio

Portfolio profesional con asistente AI integrado para recruiters.

## Stack

- **Frontend**: React 19, TypeScript, Zustand, TailwindCSS
- **Backend**: FastAPI, Python 3.12
- **AI**: Asistente basado en contexto (OpenRouter)

## Quick Start

```bash
# Levantar todo con Docker (dev local)
docker compose up --build

# O local
cd apps/backend && uvicorn app.main:app --reload
cd apps/frontend && pnpm dev
```

## Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 5173 | Interfaz de chat estilo ChatGPT |
| Backend API | 8000 | Endpoints FastAPI (todo bajo `/api`) |

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/agentJuani` | Chat con el asistente AI (rate-limit 5/min) |
| POST | `/api/sendEmail` | Formulario de contacto |
| POST | `/api/auth/token` | Emite cookies de sesión HttpOnly |
| POST | `/api/auth/refresh` | Rota el refresh token |
| POST | `/api/auth/logout` | Cierra sesión |

## Estructura

```
portfolio/
├── apps/
│   ├── frontend/         # React (deploy Dokploy: portfolio-frontend)
│   └── backend/          # FastAPI (deploy Dokploy: portfolio-backend)
├── nginx/proxy.conf      # Solo dev local (en prod: Traefik)
├── data/                 # Volumen backend (sqlite refresh.db)
├── docker-compose.yml    # Solo dev local
└── docs/deployment.md    # Guía de deploy en Dokploy
```

## Deploy

Prod = dos apps Dokploy bajo el mismo dominio (Traefik rutea `/api/*`
al backend y `/` al frontend). Ver `docs/deployment.md`.

## Development

```bash
# Backend tests
cd apps/backend && python -m pytest tests/ -q

# Frontend checks
cd apps/frontend && pnpm exec tsc -b && pnpm exec eslint src
```

## License

MIT
