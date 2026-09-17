# Portfolio — Project Context

## Overview

Professional portfolio with AI assistant integrated for recruiters. Monorepo with frontend and backend.

## Architecture

```
portfolio/
├── frontend/          React 19 + Vite + TypeScript + Zustand + TailwindCSS + Shadcn
└── backend/           Python 3.12 + FastAPI + Uvicorn + Ollama (RAG)
```

## Backend Stack

| Component | Technology |
|-----------|-----------|
| Language | Python 3.12 |
| Framework | FastAPI + Uvicorn |
| AI/LLM | Ollama (qwen2.5:0.5b) + nomic-embed-text |
| Validation | Pydantic |
| Computing | numpy (cosine similarity) |
| Auth | python-jose (JWT) + python-dotenv |
| HTTP Client | httpx, openai |
| Email | resend |
| Testing | pytest + FastAPI TestClient |

## Backend Architecture

```
backend/app/
├── main.py                 # FastAPI app + CORS + routers
├── controllers/            # Request handlers (AgentJuani, Auth, Email)
├── services/               # Business logic (Ollama, Context, Email)
├── models/                 # Pydantic schemas (Answer, UserEmail, Token)
├── routes/                 # API route definitions (api_route, auth)
├── middleware/             # JWT auth middleware
└── db/                     # Context data (markdown-based RAG)
```

## Frontend Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 19 + Vite |
| Language | TypeScript 5.9 (strict) |
| State | Zustand 5 |
| Styling | TailwindCSS + Shadcn |
| Forms | react-hook-form + Zod |
| Architecture | Atomic Design |
| Package Manager | pnpm |

## Infrastructure

- Containerization: Docker Compose
- Services: Ollama (11434), Backend (8000), Frontend (5173)
- Git workflow: dev → test → main

## Testing Capabilities

- **Backend**: pytest with `fastapi.testclient.TestClient`
- **Test files**: `backend/tests/test_main.py` (1 test class)
- **Coverage**: not configured (pytest-cov not installed)
- **Integration/E2E**: none configured
- **Strict TDD**: enabled (pytest runner detected)

## Conventions

- Type hints required on all Python functions
- Relative imports using `from app.` prefix
- Pydantic BaseModel for all request/response schemas
- Controller-Service-Model pattern with dependency injection
- UTF-8 encoding specified in file operations
- Specific exception handling (no generic catch-all)
