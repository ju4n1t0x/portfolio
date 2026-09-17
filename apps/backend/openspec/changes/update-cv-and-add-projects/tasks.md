# Tasks: Update CV and Add Projects

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 45-80 |
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
| 1 | Refresh `app/db/context.md` CV sections and add both project entries | PR 1 | Single-file content update; include manual recruiter-query QA |

## Phase 1: CV Alignment

- [x] 1.1 Update `app/db/context.md` `## Perfil Profesional` to match the CV narrative: Java/Spring Boot primary, FastAPI/Python complementary, plus microservices, integrations, layered architecture, CI/CD, technical docs, and Data Science/AI support.
- [x] 1.2 Restructure `app/db/context.md` `## Habilidades Técnicas` into CV-style categories and normalize recruiter-searchable terms for languages, backend frameworks, databases, tools, cloud, and Data & AI.

## Phase 2: Experience and Education Refresh

- [x] 2.1 Rewrite the `Xinergia` experience bullets in `app/db/context.md` to include CRMs, ERPs, payment gateways, API-first security, CI/CD, and PostgreSQL without introducing unsupported claims.
- [x] 2.2 Update the `SteelMat` experience entry in `app/db/context.md` to title `Web Developer` and timeframe `04/2025–10/2025`; keep `Tutor UTN` and `Administrativo` content unchanged unless CV wording must be aligned.
- [x] 2.3 Adjust `## Educación` in `app/db/context.md` so UTN is completed in 2025 and UGR remains marked `En curso`.

## Phase 3: Featured Projects Expansion

- [x] 3.1 Add an `AislaMat` entry to `app/db/context.md` using the existing project template with `Stack`, `Features`, `Context`, and `Repo`, including `dev` branch facts: Laravel 13, Filament v5, Livewire v4, Fortify, Pest v4, landing page, budget simulator, and leads dashboard.
- [x] 3.2 Add an `Eficiencia Energética` entry to `app/db/context.md` with CRISP-DM academic context, CAMMESA demand dataset, stack, authenticated CSV upload, Docker, and Gradient Boosting prediction result `R²=0.929`.
- [x] 3.3 Review `## Proyectos Destacados` in `app/db/context.md` so all entries stay recruiter-relevant, use consistent labels, and avoid duplicate or conflicting facts across sections.

## Phase 4: Retrieval Optimization and Verification

- [x] 4.1 Tighten every edited bullet and summary in `app/db/context.md` so the first clause answers likely recruiter questions directly and keeps one fact per bullet.
- [x] 4.2 Manually verify `app/db/context.md` against spec scenarios for core stack, AI skills, integrations, AislaMat, ML experience, and education status before closing the change.
