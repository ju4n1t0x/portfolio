# Portfolio - Juan Ignacio

Portfolio profesional con asistente AI integrado para recruiters.

## Stack

- **Frontend**: React 19, TypeScript, Zustand, TailwindCSS
- **Backend**: FastAPI, Python 3.12, Ollama
- **AI**: Asistente basado en contexto

## Quick Start

```bash
# Levantar todo con Docker
docker compose up --build

# O local (requiere Ollama corriendo)
cd backend && uvicorn app.main:app --reload
cd portfolio && npm run dev
```

## Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 5173 | Interfaz de chat estilo ChatGPT |
| Backend API | 8000 | Endpoints FastAPI |
| Ollama | 11434 | LLM local (qwen2.5) |

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/chat` | Chat con el asistente AI |

## Estructura

```
portfolio/
├── portfolio/          # Frontend React
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── client/           # Ollama
│   │   ├── context/          # Curriculum context
│   │   └── scripts/          # Scripts de build
│   └── requirements.txt
└── docker-compose.yml
```

## Features

- Chat AI con contexto de CV (RAG)
- Modelo local via Ollama (no requiere API keys)

## Development

```bash
# Run tests (si existen)
pytest
```

## License

MIT
