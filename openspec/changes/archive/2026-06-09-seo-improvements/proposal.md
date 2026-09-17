# Proposal: SEO Improvements

## Summary

Improve portfolio crawlability and rich discovery by shipping static discoverability assets, expanding structured data, strengthening semantic HTML, and exposing a static crawlable content surface.

## Problem

The portfolio is a client-rendered SPA, so important content in `src/data/*` is weakly exposed to search engines and AI-oriented crawlers. The app also had incomplete social metadata and favicon issues that reduced discoverability quality.

## Scope

- Add static discoverability assets (`robots.txt`, `sitemap.xml`, branded icon assets)
- Expand JSON-LD beyond the basic Person schema
- Improve semantic landmarks and heading hierarchy
- Expose static crawlable portfolio data derived from canonical sources

## Constraints

- Keep changes reviewable in small slices
- Avoid adding new dependencies
- Reuse canonical data sources from `src/data/*` and `siteConfig`

## Planned Touchpoints

- `portfolio/public/robots.txt`
- `portfolio/public/sitemap.xml`
- `portfolio/public/favicon*`
- `portfolio/src/components/atoms/SEO/SEO.tsx`
- `portfolio/src/config/site.ts`
- `portfolio/src/data/*`
- `portfolio/src/App.tsx`
- `portfolio/src/components/organisms/Sidebar/Sidebar.tsx`
- `portfolio/src/components/molecules/*`

## Engram Traceability

- Proposal source observation: `#298`
