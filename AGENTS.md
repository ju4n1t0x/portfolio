# Portfolio — Juan Ignacio

## Project Overview

Professional portfolio with AI assistant integrated for recruiters.

## Architecture

Monorepo: `apps/frontend` + `apps/backend` share one domain.
Traefik is the entry point in prod (`/` → frontend, `/api/*` → backend,
forwarded as-is). Local dev mirrors it with `nginx/proxy.conf` via compose.
Auth = HttpOnly cookies (`SameSite=Lax`), valid only because same-origin
is preserved — do not split frontend/backend across domains without
revisiting cookie `Domain` + CORS. See `docs/deployment.md`.

```
┌─────────────────────────────────────────────────────────────────┐
│                     apps/frontend                                │
│                 Frontend (React 19, TypeScript)                 │
│                   Atomic Design + Zustand                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS /api/*
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     apps/backend                                 │
│              FastAPI + OpenRouter (RAG)                          │
│           Professional AI Assistant (Juan Ignacio)               │
└─────────────────────────────────────────────────────────────────┘
```

## Agents & Delegation

When working on this project, follow these delegation rules:

### Agent Selection

| If the task is about... | Delegate to | Documentation |
|------------------------|-------------|---------------|
| UI components, pages, styling | Frontend | See `apps/frontend/AGENTS.md` |
| API endpoints, AI | Backend | See `apps/backend/AGENTS.md` |
| Docker, CI/CD, deployment | DevOps | See `apps/backend/.agents/devops.md` |
| Code review, PR validation | Reviewer | See `apps/backend/.agents/reviewer.md` |
| Architecture decisions | Architect | See `apps/backend/.agents/architect.md` |
| New skills for AI agents | Skill Creation | See `skill-creator` skill |

### Frontend Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript 5.9 (strict mode)
- **State**: Zustand 5
- **Styling**: TailwindCSS + Shadcn
- **Forms**: react-hook-form + Zod
- **Architecture**: Atomic Design
- **Email**: Resend API

### Backend Stack

- **Framework**: FastAPI + Uvicorn
- **Language**: Python 3.12
- **AI**: OpenRouter (LLM) + RAG context
- **Validation**: Pydantic
- **Rate limiting**: slowapi (5/min on `/api/agentJuani`)

### Infrastructure

- **Local dev**: Docker Compose (proxy + backend + frontend)
- **Prod**: Two Dokploy apps, one domain (Traefik: `/api/*` → backend, `/` → frontend). See `docs/deployment.md`
- **Ports**: Frontend (5173 dev / 80 prod), Backend (8000)

## Git Workflow

```
dev → development
test → staging
main → production
```

## Quick Start

```bash
# Start all services
docker compose up --build

# Or run locally
cd apps/frontend && pnpm dev     # Frontend
cd apps/backend && uvicorn app.main:app --reload  # Backend
```

## Documentation Index

| Documentation | Location | Purpose |
|---------------|----------|---------|
| Frontend Standards | `apps/frontend/AGENTS.md` | TypeScript, React, Atomic Design rules |
| Backend Standards | `apps/backend/AGENTS.md` | Index to backend docs |
| Backend Agent Rules | `apps/backend/.agents/backend.md` | Python, FastAPI, Ollama, RAG |
| Architecture | `apps/backend/.agents/architect.md` | Module structure, POO |
| DevOps | `apps/backend/.agents/devops.md` | Docker, CI/CD, env vars |
| Code Review | `apps/backend/.agents/reviewer.md` | PR checklist |
| Product Spec | `apps/backend/specs/01-product-spec.md` | Features, API contract |
| Technical Design | `apps/backend/specs/02-architecture.md` | Architecture diagrams |
| Tasks | `apps/backend/specs/03-tasks.md` | Implementation status |
| Deployment | `docs/deployment.md` | Dokploy setup (two apps, one domain) |
