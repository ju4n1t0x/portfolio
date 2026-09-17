# Design: SEO Improvements

## Architecture

Add shared SEO serializers, keep `react-helmet-async`, extend `siteConfig`, and generate static SEO assets without new dependencies.

## JSON-LD Composition

Build one `@graph` from `siteConfig`, `projects`, and `experiences`, with centralized rules for URL fallback and valid dates.

- `buildPersonSchema()` — Person with `knowsAbout` from keywords
- `buildWebSiteSchema()` — WebSite with `description`
- `buildCreativeWorkSchema()` — One per project with `author` reference
- `buildItemListSchema()` — Experiences as ItemList
- `buildGraph()` — Composes all schemas into single @graph

## Favicon Pipeline

Replace `public/favicon.png`, add `apple-touch-icon.png`, and remove the dead `/favicon.ico` reference.

## Static Content Surface

Recommend one static JSON endpoint (`portfolio-content.json`) as the smallest solution that fits the review budget better than prerendering.

- Build script: `scripts/generate-seo-assets.mjs`
- Reads from `src/data/*.ts` directly
- Generates `public/portfolio-content.json`

## Component Changes

- `App.tsx` — add `<main role="main">` landmark
- `ChatInterface.tsx` — semantic wrapping, single h1, section h2s
- `Sidebar.tsx` — add `<nav aria-label="...">`
- `ProjectCard.tsx` — `<article>` semantics, alt text
- `ExperienceCard.tsx` — `<article>` semantics, alt text

## Build-time vs Runtime

- **Build time**: generate `robots.txt`, `sitemap.xml`, and static crawlable JSON
- **Runtime**: `SEO.tsx` renders canonical/meta/JSON-LD using the shared serializer layer
