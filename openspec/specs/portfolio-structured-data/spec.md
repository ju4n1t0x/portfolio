# Spec: Portfolio Structured Data

## Requirements

### Person JSON-LD Expansion
- Person schema must include: `name`, `jobTitle`, `url`, `image`, `description`, `sameAs`
- `knowsAbout` must be populated from site config keywords
- Person must have a stable `@id` for cross-referencing

### WebSite JSON-LD Schema
- WebSite schema must coexist with Person in the same `@graph`
- Must include `name`, `url`, `description`, `potentialAction` (SearchAction)
- Must reference the Person as `author` or `publisher`

### Project CreativeWork JSON-LD
- Each project must have a `CreativeWork` schema entry
- Must include: `name`, `description`, `url`, `image`, `keywords`, `author`
- URL fallback: if `projectUrl` is empty, use `repoUrl`
- Must reference the Person `@id` as `author`

### Experience Organization JSON-LD
- Each experience must have an `OrganizationRole` or `EmployeeRole` schema
- Must include: `roleName`, `worksFor` (Organization), `startDate`, `endDate`
- "Presente" end dates must be omitted (not set to invalid value)
- Invalid date formats (MM/YYYY) must be dropped

## Scenarios

### Scenario 1: Person schema includes all required fields
- **Given** the SEO component renders
- **When** parsing JSON-LD
- **Then** Person includes name, jobTitle, url, image, description, sameAs, knowsAbout

### Scenario 2: WebSite schema coexists with Person
- **Given** the page renders
- **When** parsing JSON-LD @graph
- **Then** both Person and WebSite schemas are present

### Scenario 3: Project with empty projectUrl uses repoUrl
- **Given** a project where `projectUrl` is empty
- **When** generating CreativeWork schema
- **Then** `url` is set to `repoUrl`

### Scenario 4: Experience with "Presente" end date
- **Given** an experience with `"Presente"` as end date
- **When** generating schema
- **Then** `endDate` is omitted from the schema

### Scenario 5: CreativeWork includes author reference
- **Given** a project CreativeWork
- **When** parsing JSON-LD
- **Then** `author` references the Person `@id`

### Scenario 6: Invalid date formats are dropped
- **Given** an experience with date "04/2025"
- **When** generating schema
- **Then** the date is dropped (not converted to invalid ISO)

## Acceptance Criteria
- [ ] Person includes name/jobTitle/url/image/description/sameAs/knowsAbout
- [ ] WebSite on root with name, url, description
- [ ] Each project has CreativeWork with author reference
- [ ] Each experience has OrganizationRole with valid dates
- [ ] Valid per Google Rich Results Test

## Non-Functional Requirements
- No re-render on schema computation (useMemo)
- Centralized schema field mapping
- Valid schema.org markup
