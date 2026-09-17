# Design: Update CV and Add Projects

## Technical Approach

Update `app/db/context.md` in place because `Context` loads that file verbatim and `OpenAIService` injects it directly into the system prompt. The change stays content-only: refresh CV-backed sections, add two project entries, and tighten wording for recruiter retrieval without changing Python code or prompt assembly.

## Architecture Decisions

| Decision | Options | Choice | Rationale |
|---|---|---|---|
| Source of truth | CV only / repo only / CV + repo evidence | CV for profile, skills, experience, education; repo facts for project specifics | Matches proposal scope and prevents unsupported recruiter-facing claims. |
| Retrieval format | Free paragraphs / labeled markdown bullets | Keep existing markdown sections and project template, but use explicit labels and compact bullets | The model receives raw markdown, so headings and stable labels improve answer grounding. |
| AislaMat description | Early-stage summary / `dev` branch production-shaped summary | Describe verified `dev` branch stack and features | Spec requires Laravel 13 + Filament/Livewire/Fortify/Pest and avoids stale `main` assumptions. |

## Data Flow

Recruiter question
    ↓
`/api/agentJuani` → `AgentJuaniController`
    ↓
`OpenAIService`
    ↓
`Context()` reads `app/db/context.md`
    ↓
System prompt + full markdown context sent to model

Because no retrieval layer slices the file, information must be easy to scan in one pass: unique headings, one fact per bullet, and explicit stack/features labels.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/db/context.md` | Modify | Refresh recruiter-facing profile, skills, experience, education, and add AislaMat + Eficiencia Energética entries. |
| `openspec/changes/update-cv-and-add-projects/design.md` | Create | Record the implementation design for this content-only change. |

## Interfaces / Contracts

No code interfaces change. The content contract for `app/db/context.md` is:

```md
### {Project Name} ({Timeframe})
One-sentence recruiter summary.

- **Stack**: ...
- **Features**: ...
- **Context**: optional branch or academic context when relevant
- **URL**: optional
- **Repo**: ...
```

Conventions for recruiter-queryable content:
- Put the most answerable fact first in each paragraph/bullet.
- Use canonical labels (`Stack`, `Features`, `Repo`, `Context`) consistently.
- Prefer unambiguous nouns recruiters ask for directly: Java/Spring Boot, FastAPI/Python, CRMs, ERPs, payment gateways, CI/CD, PostgreSQL.
- Avoid duplicate or conflicting claims across sections.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | N/A | No unit-test harness exists for markdown content. |
| Integration | Context loading remains valid | Manually verify `app/services/context.py` still reads `context.md` unchanged after edit. |
| E2E | Recruiter-answer quality | Ask representative chat questions about stack, integrations, AI skills, AislaMat, and ML projects; confirm answers use updated facts. |

## Migration / Rollout

No migration required. Rollout is the `context.md` edit itself. If any claim is inaccurate, revert that file to the previous revision.

## Open Questions

- [ ] Exact final CV wording is external to the repo; implementation should preserve CV meaning while adapting phrasing to recruiter-friendly markdown.
