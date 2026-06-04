# Exploration: Align Frontend Data Files

## Current State

### experiences.ts
Has 3 entries: Xinergia (2025-Presente), SteelMat (2025-2026), UTN Tutor (2025-Presente).

### projects.ts
Has 3 entries: Xinergia API RESTful, SteelMat Corporate Site, Portfolio Personal.

### responses.ts
Has only one entry: `aboutResponse` — a short bio paragraph.

### contact.ts
Has 5 entries: contactFlowIntro, contactAskEmail, contactAskMessage, contactSuccessMessage, contactSendErrorMessage.

---

## Gaps vs. context.md and CV

### experiences.ts — 4 gaps

| # | Issue | Evidence |
|---|-------|----------|
| 1 | Missing Jerárquicos Salud entry | context.md lists it 2021–Presente; CV lists "Gestión y análisis de información administrativa y operativa" |
| 2 | Xinergia description doesn't mention Spring Boot / Java | context.md and CV focus on Java/Spring Boot as primary stack; current description only mentions PHP/Laravel |
| 3 | SteelMat period wrong | frontend says 2025–2026; context.md says 04/2025–10/2025 |
| 4 | UTN Tutor technologies list is outdated | Lists UML/HTML/CSS/JS; should include mentoring, academic support |

### projects.ts — 5 gaps

| # | Issue | Evidence |
|---|-------|----------|
| 1 | Missing **AislaMat** project | context.md describes Laravel 13, Filament v5, Livewire v4, Fortify, Pest v4 — Landing + budget simulator + leads dashboard |
| 2 | Missing **Eficiencia Energética** project | context.md describes FastAPI + React + TypeScript + PostgreSQL + scikit-learn + Pandas + NumPy + Docker, with Gradient Boosting R²=0.929 |
| 3 | Missing **Urban Flow** project | CV lists it as data analysis TP — Python, Pandas, NumPy, OpenCV, DVC |
| 4 | Portfolio project description outdated | Current mentions OpenRouter (context.md says OpenAI SDK); doesn't mention Atomic Design as clearly |
| 5 | Xinergia project missing PostgreSQL | context.md mentions PostgreSQL explicitly; current project entry only lists MySQL |

### responses.ts — 2 gaps

| # | Issue | Evidence |
|---|-------|----------|
| 1 | `aboutResponse` is outdated — doesn't reflect current focus | No mention of Java/Spring Boot; no mention of Data Science background; no mention of RAG/AI |
| 2 | No other response entries | CV mentions soft skills ("Comunicación efectiva, Liderazgo, Empatía..."); context.md has Interests section; responses.ts currently has only aboutResponse |

### contact.ts — No gaps

File is aligned and current. No changes needed.

---

## Image Asset Needs

| Project | Images Needed | Status |
|---------|--------------|--------|
| AislaMat | 2-3 screenshots (landing, budget simulator, leads dashboard) | Not present in `/src/assets` |
| Eficiencia Energética | Dashboard screenshot, EDA visualizations | Not present in `/src/assets` |
| Urban Flow | Optional — data viz screenshot | Not present in `/src/assets` |

Existing assets: Steelmat (3), Portfolio (2), avatar, hero — all accounted for.

---

## Recommended Changes Summary

### experiences.ts
1. **Add** Jerárquicos Salud entry (2021–Presente, administrativo, home office)
2. **Update** Xinergia description — reflect backend focus + Spring Boot as primary (context vs current is Laravel, need to clarify if PHP is correct or if context.md's Spring Boot is the target state)
3. **Fix** SteelMat period → `04/2025` to `10/2025`
4. **Update** UTN tutor description to reflect mentorship focus

### projects.ts
1. **Add** AislaMat entry (id: "4") — Laravel 13, Filament, Livewire, Fortify, Pest, budget simulator, leads dashboard
2. **Add** Eficiencia Energética entry (id: "5") — FastAPI, React, PostgreSQL, scikit-learn, CRISP-DM, R²=0.929
3. **Add** Urban Flow entry (id: "6") — Python, Pandas, NumPy, OpenCV, DVC
4. **Update** Portfolio project description — align tech stack with context.md (OpenAI SDK not OpenRouter)
5. **Update** Xinergia project — add PostgreSQL to technologies list

### responses.ts
1. **Rewrite** `aboutResponse` — align with context.md profile (Java/Spring Boot primary, Data Science, RAG/AI)
2. **Consider** adding structured response entries for: skills overview, project summary, interests, education — **verify with orchestrator** if this is within scope

---

## Risks

1. **Spring Boot vs Laravel ambiguity**: context.md says "Backend Developer... orientado a Java/Spring Boot como stack principal, con FastAPI/Python como complemento". But both context.md AND CV list Xinergia work as Laravel 12. Need clarification: should experiences.ts say Spring Boot or Laravel? Current frontend says Laravel. Which is the authoritative source?
2. **Image assets missing for new projects**: AislaMat, Eficiencia Energética, Urban Flow need screenshots. Without them, projects will show empty `images: []`.
3. **responses.ts scope creep**: Currently only has aboutResponse. The CV has rich content (skills, soft skills, interests). Should we add more response entries? Orchestrator should confirm scope.

---

## Ready for Proposal

**Yes** — with one clarification needed before tasks can be finalized: clarify Spring Boot vs Laravel for Xinergia experience entry.