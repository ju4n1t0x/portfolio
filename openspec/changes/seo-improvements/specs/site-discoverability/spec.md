# Spec: Site Discoverability

## Requirements

### robots.txt Crawl Directives
- Must serve at `/robots.txt` with `Content-Type: text/plain`
- Must allow Googlebot, GPTBot, and Google-Extended to crawl all pages
- Must reference the sitemap location

### XML Sitemap Generation
- Must serve at `/sitemap.xml` with valid XML structure
- Must include canonical URLs for all portfolio sections
- Must derive URLs from `src/lib/seo/constants.ts` or `siteConfig`
- Must include `changefreq` and `priority` for each URL

### Favicon Asset Replacement
- Must replace default Vite favicon with branded asset
- Must include `favicon.png` (32x32) and `apple-touch-icon.png` (180x180)
- Must remove dead `/favicon.ico` reference from `index.html`
- Must include proper `<link>` tags with `sizes` attributes

### Social Preview Meta Completeness
- Must include Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Must include Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Must include `og:image:alt` and `twitter:image:alt` for accessibility
- Must include canonical URL link tag

## Scenarios

### Scenario 1: robots.txt serves correct directives
- **Given** a crawler requests `/robots.txt`
- **When** the file is served
- **Then** it contains `User-agent: *`, `Allow: /`, and `Sitemap:` directive

### Scenario 2: AI crawlers are allowed
- **Given** GPTBot or Google-Extended requests robots.txt
- **When** parsing directives
- **Then** they are explicitly allowed to crawl all pages

### Scenario 3: sitemap.xml is valid XML
- **Given** a crawler requests `/sitemap.xml`
- **When** parsing the response
- **Then** it is valid XML with `<urlset>` and `<url>` entries

### Scenario 4: sitemap includes all sections
- **Given** the sitemap is generated
- **When** inspecting URLs
- **Then** root, about, projects, experience, and contact URLs are present

### Scenario 5: favicon displays correctly
- **Given** the page loads in a browser
- **When** inspecting the tab icon
- **Then** the branded favicon is displayed (not Vite default)

### Scenario 6: no dead favicon.ico reference
- **Given** the page loads
- **When** checking network requests
- **Then** no 404 for `/favicon.ico`

### Scenario 7: apple-touch-icon is served
- **Given** the page loads on iOS
- **When** adding to home screen
- **Then** the branded apple-touch-icon is used

### Scenario 8: social meta is complete
- **Given** the page is shared on social media
- **When** inspecting meta tags
- **Then** all OG and Twitter Card tags are present with valid values

## Acceptance Criteria
- [ ] Valid robots.txt with AI crawler allowances
- [ ] Valid sitemap.xml with all section URLs
- [ ] Branded favicon displayed, no dead .ico reference
- [ ] All social meta tags present with alt text

## Non-Functional Requirements
- Static file serving (no runtime generation)
- Favicon contrast at small sizes (WCAG AA)
- Sitemap URLs derived from siteConfig canonical source
