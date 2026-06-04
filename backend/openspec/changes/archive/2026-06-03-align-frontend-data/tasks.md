# Tasks: Align Frontend Data

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 35-70 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Align recruiter-facing frontend data with spec | PR 1 | Single review unit; include lint + manual UI verification |

## Phase 1: Source Alignment

- [x] 1.1 RED: Compare `backend/app/db/context.md` with `backend/openspec/changes/align-frontend-data/specs/` and list required field-level edits for `portfolio/src/data/experiences.ts`, `projects.ts`, and `responses.ts`.
- [x] 1.2 Confirm unchanged contracts before edits: keep current exports, IDs as strings, existing Portfolio/SteelMat image imports, and existing `projectUrl` values in `portfolio/src/data/projects.ts`.

## Phase 2: Content Updates

- [x] 2.1 Update `portfolio/src/data/experiences.ts` so Xinergia mentions e-learning, REST APIs, CRM/ERP/payment integrations, layered architecture, SOLID, CI/CD; set SteelMat role/dates to `Web Developer` and `04/2025-10/2025`; keep UTN concise per spec.
- [x] 2.2 Update `portfolio/src/data/projects.ts` to remove Xinergia, reorder entries to Portfolio -> SteelMat -> AislaMat -> Eficiencia Energética, and preserve current screenshot imports only for Portfolio and SteelMat.
- [x] 2.3 Add AislaMat and Eficiencia Energética entries in `portfolio/src/data/projects.ts` with the spec descriptions, public `repoUrl` values, and `images: []`; refresh Portfolio copy to mention RAG, FastAPI, JWT, Docker, and Dokploy.
- [x] 2.4 Update `portfolio/src/data/responses.ts` so `aboutResponse` positions Juan as `Backend Developer`, includes Java/Spring Boot orientation plus FastAPI/Python, APIs REST, microservicios, SOLID, CI/CD, Ciencia de Datos, and IA aplicada, and removes `full stack` wording.

## Phase 3: Verification

- [x] 3.1 GREEN: Run `pnpm run lint` from `portfolio/` to verify the edited literals still satisfy the frontend TypeScript/ESLint pipeline.
- [x] 3.2 Verify spec scenarios manually in the rendered UI/chat: no Xinergia project card, projects appear in the required order, AislaMat/Eficiencia Energética show empty images, and the about text reads `Backend Developer` without `full stack`.
- [x] 4.1 REFACTOR: Trim any leftover stale wording in `portfolio/src/data/experiences.ts`, `projects.ts`, and `responses.ts` so copy stays CV-aligned without changing component behavior.
