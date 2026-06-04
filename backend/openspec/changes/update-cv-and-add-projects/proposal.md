# Proposal: Update CV and Add Projects

## Intent

Sync `app/db/context.md` with the latest CV and verified repo evidence so the recruiter assistant presents current profile data and stronger project credibility.

## Scope

### In Scope
- Update `Perfil Profesional`, `Habilidades Técnicas`, `Experiencia`, and `Educación` only where the new CV changes wording or facts.
- Add `eficiencia_energetica` and a full-relevance `AislaMat` entry under `Proyectos Destacados`.
- Keep the change limited to `app/db/context.md`, including any small summary alignment needed for CV consistency.

### Out of Scope
- Editing application logic, embeddings, retrieval behavior, or any file outside `app/db/context.md`.
- Adding low-relevance or unsupported projects (`desi2025SasiaReColombaraCenturion`, `agroindustria`).

## Capabilities

### New Capabilities
- `professional-context-content`: Defines freshness, section coverage, and project relevance rules for recruiter-facing content in `app/db/context.md`.

### Modified Capabilities
- None.

## Approach

Use the CV PDF as the narrative source of truth and repo metadata as validation for project depth. Preserve the current markdown structure, refresh only changed sections, add both projects with the existing project template, and describe `AislaMat` as a production-shaped Laravel app on `dev` (Laravel 13, Filament v5, Livewire v4, Fortify, Pest) rather than early-stage.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/db/context.md` | Modified | Refresh CV-backed sections and add both verified project entries |
| `openspec/changes/update-cv-and-add-projects/proposal.md` | Modified | Update proposal with corrected AislaMat scope and tighter file boundary |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CV and repo details diverge | Med | Use CV for wording, repo/branch facts for project specifics, and avoid unsupported claims |
| `AislaMat` branch context becomes stale again | Med | Reference verified `dev` branch facts only, not assumptions from `main` |
| Context becomes too long/noisy | Low | Replace stale text instead of appending duplicate detail |

## Rollback Plan

Revert `app/db/context.md` to the previous revision if any updated section or project description introduces inaccurate recruiter-facing claims.

## Dependencies

- Latest CV content from `juan-sasia-backend-developer.pdf`
- Confirmed repo links and branch facts for `eficiencia_energetica` and `AislaMat`

## Success Criteria

- [ ] `app/db/context.md` reflects the latest CV across the sections that changed, without stale recruiter-facing claims.
- [ ] `AislaMat` is presented as a full-relevance Laravel project and `eficiencia_energetica` is added with consistent project formatting.
