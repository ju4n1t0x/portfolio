# Deployment (Dokploy)

Prod = two Dokploy applications from this monorepo, sharing one domain.
Traefik is the entry point: it routes by path, replacing `nginx/proxy.conf`
(which exists for local dev only).

```
browser (juansasia.com)
  └── Traefik
        ├── PathPrefix(`/api`) → portfolio-backend:8000   (forwarded as-is, no strip)
        └── PathPrefix(`/`)    → portfolio-frontend:80    (catch-all)
```

Traefik prioritizes the longest matching rule, so `/api/*` wins over `/`.
Same-origin is preserved → HttpOnly cookies (`SameSite=Lax`) and
`VITE_API_URL=/api` work with zero auth changes.

## App 1 — portfolio-frontend

| Setting | Value |
|---|---|
| Provider | GitHub (this repo, branch `main`) |
| Build Path | `apps/frontend` |
| Dockerfile | `Dockerfile` (relative to build path) |
| Domain (Dokploy UI → Domains) | Host `juansasia.com`, Path `/`, container port `80`, HTTPS on |
| Build args | `VITE_API_URL=/api` |
| Env (runtime) | none required |

## App 2 — portfolio-backend

| Setting | Value |
|---|---|
| Provider | GitHub (this repo, branch `main`) |
| Build Path | `apps/backend` |
| Dockerfile | `Dockerfile` (relative to build path) |
| Domain (Dokploy UI → Domains) | Host `juansasia.com`, Path `/api`, **Strip Path OFF**, container port `8000`, HTTPS on |
| Env (Dokploy UI → Environment) | `SECRET_KEY`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `RESEND_API_KEY`, `FROM_EMAIL` (verified domain sender), `CONTACT_EMAIL` (inbox for contact form), `CLIENT_ID=portfolio-client`, `ENV=production` |
| Volume | mount a persistent volume at `/app/data` (sqlite `refresh.db` for refresh rotation) |
| Health check | `GET /docs` on port `8000` |

## Notes

- **Never enable Strip Path** on the `/api` domain: the backend serves
  `/api/*` natively and the frontend calls `/api/*` verbatim.
- Rate limiting (`5/minute` on `POST /api/agentJuani`) lives in the backend
  via `slowapi` — it applies identically in dev and prod.
- Cookies are `Secure` only when `ENV=production`; keep `ENV=dev` locally.
- Local dev still uses `docker compose up` at repo root (proxy + both apps).
