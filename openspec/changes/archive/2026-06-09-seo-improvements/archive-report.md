# Archive Report: SEO Improvements

## Change

- **Name**: `seo-improvements`
- **Archive date**: `2026-06-09`
- **Mode**: `hybrid` (OpenSpec + Engram)
- **Verification verdict**: `PASS WITH WARNINGS`

## What Changed

The completed change improved portfolio SEO in three delivered slices:

1. **Semantic HTML and crawlable sections**
   - Rendered messages once and kept crawler-visible sections as hidden landmarks only.
   - Enforced one page-level `h1` and section `h2` headings.
   - Added semantic structure in app, sidebar, and card components.

2. **Discoverability assets and static content surface**
   - Added `robots.txt`, `sitemap.xml`, `portfolio-content.json`, and branded touch icon assets.
   - Generated a static crawlable JSON surface from canonical portfolio data.

3. **Structured data and social metadata fixes**
   - Added `og:image:alt` and `twitter:image:alt`.
   - Linked WebSite JSON-LD back to Person as publisher.
   - Added CreativeWork image support.
   - Dropped invalid `MM/YYYY` date coercion from SEO serialization.

## Specs Synced to Source of Truth

| Domain | Action | Details |
|--------|--------|---------|
| `site-discoverability` | Created | Initial main spec copied from completed delta spec |
| `portfolio-structured-data` | Created | Initial main spec copied from completed delta spec |
| `crawlable-portfolio-content` | Created | Initial main spec copied from completed delta spec |

## What Was Verified

- All 9 of 9 implementation tasks were complete.
- `pnpm exec tsc --noEmit -p tsconfig.app.json` passed.
- Static asset validation passed for `portfolio-content.json`, `sitemap.xml`, `robots.txt`, `favicon.png`, and `apple-touch-icon.png`.
- Verification confirmed:
  - OG/Twitter image alt tags are emitted.
  - WebSite JSON-LD references Person.
  - CreativeWork JSON-LD includes project images when available.
  - Invalid `MM/YYYY` dates are dropped.
  - The page keeps exactly one `h1` and section headings as `h2`.
  - Dead `/favicon.ico` references were removed.

## Known Limitations

- Local build verification is environment-limited because the workspace uses **Node 18.20.8**, while **Vite 8 requires Node 20.19+ or 22.12+**.
- No runnable frontend/runtime SEO test harness exists in the workspace, so final verification remains static inspection + type-check evidence.

## Files Affected

### Product code and assets
- `portfolio/index.html`
- `portfolio/public/apple-touch-icon.png`
- `portfolio/public/portfolio-content.json`
- `portfolio/public/robots.txt`
- `portfolio/public/sitemap.xml`
- `portfolio/scripts/generate-seo-assets.mjs`
- `portfolio/src/App.tsx`
- `portfolio/src/components/atoms/SEO/SEO.tsx`
- `portfolio/src/components/molecules/ExperienceCard/ExperienceCard.tsx`
- `portfolio/src/components/molecules/ProjectCard/ProjectCard.tsx`
- `portfolio/src/components/organisms/ChatInterface/ChatInterface.tsx`
- `portfolio/src/components/organisms/Sidebar/Sidebar.tsx`
- `portfolio/src/config/site.ts`
- `portfolio/src/lib/seo/serializers.ts`

### SDD artifacts
- `openspec/changes/seo-improvements/proposal.md`
- `openspec/changes/seo-improvements/specs/site-discoverability/spec.md`
- `openspec/changes/seo-improvements/specs/portfolio-structured-data/spec.md`
- `openspec/changes/seo-improvements/specs/crawlable-portfolio-content/spec.md`
- `openspec/changes/seo-improvements/design.md`
- `openspec/changes/seo-improvements/tasks.md`
- `openspec/changes/seo-improvements/verify-report.md`
- `openspec/specs/site-discoverability/spec.md`
- `openspec/specs/portfolio-structured-data/spec.md`
- `openspec/specs/crawlable-portfolio-content/spec.md`

## Engram Traceability

- `proposal`: observation `#298`
- `spec`: observation `#300`
- `design`: observation `#301`
- `tasks`: observation `#303`
- `verify-report`: observation `#306`

## Notes

- `proposal.md` was restored into the OpenSpec change folder from Engram so the archived change keeps a complete audit trail in hybrid mode.
- No critical verification issues remained at archive time.
