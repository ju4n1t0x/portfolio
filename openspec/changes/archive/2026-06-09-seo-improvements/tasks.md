# Tasks: SEO Improvements

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 180-240 total; 45-75 per slice |
| 80-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 assets → PR 2 serializers/JSON-LD → PR 3 semantics/static JSON |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Discoverability assets | PR 1 | Base = main; static files only |
| 2 | Shared serializers + root JSON-LD | PR 2 | Base = PR 1 branch if stacked |
| 3 | Semantic HTML + crawlable JSON | PR 3 | Base = PR 2 branch if stacked |

## Phase 1: Slice 1 — Discoverability assets

- [x] 1.1 Update `portfolio/index.html` and `portfolio/src/config/site.ts` to remove dead `/favicon.ico`, wire `/favicon.png` + `/apple-touch-icon.png`, and keep canonical OG/Twitter image URLs. AC: only existing icon paths remain; social tags still derive from config. Verify: inspect built `<head>` and confirm no `/favicon.ico` request.
- [x] 1.2 Create `portfolio/public/robots.txt` and `portfolio/public/sitemap.xml` from canonical section URLs defined in `portfolio/src/config/site.ts`. AC: robots contains `User-agent: *`, `Allow: /`, `Sitemap:`; sitemap contains root + about/projects/experience/contact entries with `loc/changefreq/priority`. Verify: open both files after build and validate URLs.
- [x] 1.3 Replace `portfolio/public/favicon.png` and add `portfolio/public/apple-touch-icon.png` with branded assets sized for browser/tab and touch use. AC: Vite default icon is gone; PNG assets load from root. Verify: manual browser tab check and direct GET `/favicon.png` + `/apple-touch-icon.png`.

## Phase 2: Slice 2 — Serializer + JSON-LD

- [x] 2.1 Create `portfolio/src/lib/seo/constants.ts` and `portfolio/src/lib/seo/serializers.ts` with shared mappers for section URLs, project URL fallback, and experience date normalization. AC: `projectUrl || repoUrl` fallback works; `Presente` omits `endDate`; invalid dates are dropped. Verify: add RED/GREEN unit tests for serializer edge cases.
- [x] 2.2 Extend `portfolio/src/config/site.ts`, `portfolio/src/data/projects.ts`, and `portfolio/src/data/experiences.ts` with JSON-safe SEO fields required by serializers. AC: Person/WebSite/CreativeWork/OrganizationRole inputs come from one source of truth. Verify: unit tests serialize current data without empty URLs or invalid dates.
- [x] 2.3 Refactor `portfolio/src/components/atoms/SEO/SEO.tsx` to emit one `@graph` plus complete canonical, OG, and Twitter meta via serializer helpers. AC: head contains Person, WebSite, project, and experience nodes plus required OG/Twitter fields. Verify: render test for `SEO.tsx` asserts JSON-LD graph and meta tags.

## Phase 3: Slice 3 — Semantic HTML + static JSON surface

- [x] 3.1 Update `portfolio/src/App.tsx`, `portfolio/src/components/organisms/Sidebar/Sidebar.tsx`, and `portfolio/src/components/organisms/ChatInterface/ChatInterface.tsx` to add unique landmarks and one valid heading hierarchy. AC: one page `<h1>`; section `<h2>`s for about/projects/experience/contact; nav/main labels are unique. Verify: component render test or manual DOM inspection.
- [x] 3.2 Update `portfolio/src/components/molecules/ProjectCard/ProjectCard.tsx` and `portfolio/src/components/molecules/ExperienceCard/ExperienceCard.tsx` with article semantics and descriptive/decorative image alt behavior. AC: content images describe purpose; decorative images use `alt=""`. Verify: render cards and inspect `<article>` and `<img alt>` output.
- [x] 3.3 Create `portfolio/scripts/generate-seo-assets.mjs` to write `portfolio/public/portfolio-content.json` from `portfolio/src/data/projects.ts` and `portfolio/src/data/experiences.ts` using serializer mappings. AC: static JSON matches runtime content fields (`name/description/keywords/url`, `roleName/worksFor/startDate`) without manual duplication. Verify: run build script, diff generated JSON against source data, and GET `/portfolio-content.json`.
