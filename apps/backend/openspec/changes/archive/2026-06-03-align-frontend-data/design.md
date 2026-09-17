# Design: Align Frontend Data

## Technical Approach

Apply a content-only sync across `portfolio/src/data/experiences.ts`, `projects.ts`, and `responses.ts`, using `backend/app/db/context.md` as the source of truth and the spec as the acceptance boundary. Keep existing TypeScript shapes, exports, import style, and chat rendering behavior unchanged; only replace stale recruiter-facing copy and reorder project entries to match the spec.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice / Rationale |
|---|---|---|---|
| Source of truth | Merge from multiple frontend strings vs. copy from backend context first | Multiple sources increase drift | Use `backend/app/db/context.md` first, then apply explicit spec constraints. This matches the proposal and avoids reintroducing stale CV text. |
| Scope of change | Refactor data model/components vs. edit content in place | Refactor adds risk for a copy-only change | Keep current arrays and `aboutResponse` string. `chatHelpers.tsx` and sidebar flows already consume these shapes correctly. |
| New project media | Add placeholder assets vs. empty arrays | Placeholder assets imply screenshots that do not exist | Set `images: []` for AislaMat and Eficiencia Energética, matching the spec and current `Project.images` contract. |

## Data Flow

`backend/app/db/context.md`  
→ extract verified facts per section (`Proyectos Destacados`, `Experiencia Profesional`, `Perfil Profesional`)  
→ map facts into existing frontend structures (`Experience[]`, `Project[]`, `aboutResponse`)  
→ preserve public URLs and existing image imports where assets already exist  
→ sidebar/chat helpers render updated content without component changes

    context.md -> data files -> chatHelpers/sidebar -> cards/messages

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `portfolio/src/data/experiences.ts` | Modify | Replace stale descriptions/roles/periods/technologies for Xinergia, SteelMat, and UTN; keep three entries only. |
| `portfolio/src/data/projects.ts` | Modify | Remove Xinergia, reorder to Portfolio → SteelMat → AislaMat → Eficiencia Energética, keep current imports for existing screenshots, add two new entries with empty image arrays and public repo URLs. |
| `portfolio/src/data/responses.ts` | Modify | Rewrite `aboutResponse` to emphasize Backend Developer positioning, Java/Spring Boot orientation, FastAPI/Python complement, APIs REST, microservices, SOLID, CI/CD, Data Science, and applied AI. |
| `backend/app/db/context.md` | Read only | Reference source for verified recruiter-facing facts. |

## Interfaces / Contracts

No interface changes. Existing contracts remain:

```ts
type Experience = { company: string; role: string; period: { start: string; end: string }; description: string; technologies: string[] }
type Project = { title: string; description: string; technologies: string[]; repoUrl?: string; projectUrl?: string; images: (string | URL)[] }
```

Implementation rules:
- Keep IDs as strings and unique.
- Keep existing `projectUrl` values for Portfolio and SteelMat.
- Use `repoUrl` GitHub links for public projects; do not reintroduce private Xinergia repo text.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Data shape compatibility | Verify edited literals still satisfy `Experience[]`, `Project[]`, and string exports through TypeScript/lint checks already used by frontend. |
| Integration | Chat rendering order/content | Manually verify sidebar actions still render About text, four project cards in spec order, and three experience cards with updated copy. |
| E2E | None configured | No E2E suite exists in `openspec/config.yaml`; do not add one in this change. |

## Migration / Rollout

No migration required. Roll out as a direct content update; rollback is reverting the three frontend data files.

## Open Questions

- [ ] None.
