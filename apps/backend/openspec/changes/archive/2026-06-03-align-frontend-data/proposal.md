# Proposal: Align Frontend Data

## Intent

Sync recruiter-facing frontend data with `app/db/context.md`, the CV, and user clarifications so the portfolio UI stops showing stale role, project, and timeline details.

## Scope

### In Scope
- Update `portfolio/src/data/experiences.ts` for Xinergia wording/stack and SteelMat dates; keep Jerárquicos Salud out.
- Update `portfolio/src/data/projects.ts` by removing private Xinergia, adding AislaMat and Eficiencia Energética, and refreshing Portfolio wording.
- Update `portfolio/src/data/responses.ts` so `aboutResponse` says Backend Developer and matches current backend/data/AI focus.

### Out of Scope
- Changes to `contact.ts`, backend knowledge-base content, or any UI/layout/component logic.
- Creating new image assets; follow-up can add screenshots later.

## Capabilities

### New Capabilities
- `frontend-profile-data`: Defines accuracy rules for recruiter-facing data in frontend source files under `portfolio/src/data/`.

### Modified Capabilities
- None.

## Approach

Treat `backend/app/db/context.md` plus the clarified CV notes as source of truth. Apply minimal edits to the three target files only: preserve current shapes, replace stale text, add the two public projects with their verified stack/features, and use `images: []` for new projects until assets exist.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `portfolio/src/data/experiences.ts` | Modified | Fix Xinergia description/technologies and SteelMat period |
| `portfolio/src/data/projects.ts` | Modified | Remove Xinergia, add AislaMat + Eficiencia Energética, refresh Portfolio copy |
| `portfolio/src/data/responses.ts` | Modified | Align `aboutResponse` with Backend Developer positioning |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| New project copy drifts from backend source later | Med | Copy only verified stack/features from `context.md` |
| Missing screenshots leave cards visually sparse | Low | Use `images: []` now; add assets in a separate change |

## Rollback Plan

Revert the three frontend data files to the previous revision if any entry misrepresents timeline, stack, repo visibility, or professional focus.

## Dependencies

- Verified content in `backend/app/db/context.md`
- User clarification: Xinergia uses Laravel 12; Jerárquicos Salud stays excluded

## Success Criteria

- [ ] The three updated frontend data files match current CV/context facts without touching other frontend data modules.
- [ ] AislaMat and Eficiencia Energética appear with verified stack/features and empty image arrays until real assets exist.
