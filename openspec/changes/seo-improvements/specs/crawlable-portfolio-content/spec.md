# Spec: Crawlable Portfolio Content

## Requirements

### Semantic HTML Landmarks
- All key content areas must have semantic HTML landmarks (`<main>`, `<nav>`, `<section>`, `<article>`)
- Each landmark must have a unique `aria-label` to distinguish duplicate roles
- Landmarks must be present in the initial DOM for crawler discovery

### Heading Hierarchy
- Exactly one `<h1>` per page (the welcome hero title)
- Section headings use `<h2>` without skipping levels
- About, Projects, Experience, and Contact sections each have their own `<h2>`

### Image Alt Text Quality
- All content images must have meaningful `alt` text describing the image
- Decorative images must have `alt=""` (empty, not omitted)
- Avatar images must include the person's name

### Static Crawlable Content Surface
- Portfolio content from `src/data/*` must be available as static JSON or data islands
- Content must be accessible without JavaScript execution
- Build-time generation from canonical `src/data/` sources

### Crawlable Data Mapping Consistency
- Single source of truth: `src/data/projects.ts`, `src/data/experiences.ts`, `src/data/contact.ts`, `src/data/responses.ts`
- Field mapping: `title` → `name`, `technologies` → `keywords`, `projectUrl || repoUrl` → `url`, `role` → `roleName`
- No manual duplication of data across files

## Scenarios

### Scenario 1: Initial DOM contains all section landmarks
- **Given** the page loads with no section selected
- **When** a crawler parses the HTML
- **Then** all four `<section>` elements (about, projects, experience, contact) are present in the DOM

### Scenario 2: Exactly one h1 in the document
- **Given** the page renders
- **When** counting `<h1>` elements
- **Then** exactly one `<h1>` exists (the welcome hero title)

### Scenario 3: Section headings use h2
- **Given** each section renders
- **When** inspecting section headings
- **Then** each section has an `<h2>` with its section name

### Scenario 4: Hidden sections remain crawlable
- **Given** a section is not currently active
- **When** a crawler parses the HTML
- **Then** the section's `<section>` and `<h2>` are still present (hidden via CSS, not removed)

### Scenario 5: Static JSON contains project data
- **Given** the build completes
- **When** reading `public/portfolio-content.json`
- **Then** all projects from `src/data/projects.ts` are present with mapped SEO fields

### Scenario 6: Static JSON contains experience data
- **Given** the build completes
- **When** reading `public/portfolio-content.json`
- **Then** all experiences from `src/data/experiences.ts` are present with mapped SEO fields

### Scenario 7: Field mapping is consistent
- **Given** a project with empty `projectUrl`
- **When** generating static JSON
- **Then** `repoUrl` is used as the fallback `url` field

### Scenario 8: Presente end date handled
- **Given** an experience with `"Presente"` as end date
- **When** generating structured data
- **Then** `endDate` is omitted (not set to invalid value)

## Acceptance Criteria
- [ ] `nav`, `main`, `section` landmarks with unique `aria-labels`
- [ ] Exactly one `h1`; all section headings are `h2`
- [ ] All images have descriptive `alt` or `alt=""` for decorative
- [ ] Projects/experiences data available as static JSON without JS execution
- [ ] Single source of truth from `src/data/*`

## Non-Functional Requirements
- Static data overhead ≤ 5KB gzipped
- WAVE/axe-core accessibility pass
- No manual duplication of data
