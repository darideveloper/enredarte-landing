## ADDED Requirements

### Requirement: SEO component hierarchy
The project SHALL implement a layered SEO component hierarchy: `BaseSEO.astro` (core engine) and `PageSEO.astro` (thin wrapper). SEO components SHALL inject metadata into `<head>` via Astro's `slot="seo"` pattern.

#### Scenario: PageSEO renders metadata in head
- **WHEN** a page component renders `<PageSEO currentPage="home" slot="seo" />` inside a Layout
- **THEN** the rendered HTML `<head>` SHALL contain title, description, canonical, and Open Graph tags

### Requirement: Title resolution chain
The page title SHALL resolve through a chain: explicit `title` prop → i18n translation (`pages.{currentPage}.title`) → `SITE_TITLE` constant.

#### Scenario: Title from i18n
- **WHEN** `PageSEO` is rendered with `currentPage="home"` and no explicit `title` prop
- **THEN** the title SHALL be the value from i18n at key `pages.home.title`

### Requirement: Auto-tagline for non-home pages
Non-home pages SHALL automatically append ` | {BUSINESS_DATA.name}` to the title, controlled by the `useTagLine` prop (default `true`).

#### Scenario: Tagline appended for sub-page
- **WHEN** on a non-home page with `useTagLine` true
- **THEN** the title SHALL be `"Page Title | Business Name"`

#### Scenario: No tagline for home page
- **WHEN** `currentPage="home"` and `useTagLine` is true
- **THEN** the title SHALL NOT include the tagline suffix

### Requirement: Canonical and hreflang tags
Every page SHALL emit a `<link rel="canonical">` tag and `<link rel="alternate" hreflang="...">` tags for all supported languages.

#### Scenario: Canonical URL is correct
- **WHEN** on English page `/services`
- **THEN** the canonical URL SHALL be `https://example.com/services`

#### Scenario: Hreflang alternates are generated
- **WHEN** on any page
- **THEN** the HTML SHALL include `<link rel="alternate" hreflang="en">` and `<link rel="alternate" hreflang="es">`

### Requirement: JSON-LD structured data
The SEO component SHALL generate JSON-LD structured data with `@type` polymorphism. The default type is `LocalBusiness`.

#### Scenario: JSON-LD script rendered
- **WHEN** `PageSEO` is rendered
- **THEN** the HTML SHALL include a `<script type="application/ld+json">` block with `@context`, `@type`, `name`, `url`, and `image`

### Requirement: Automatic sitemap
The project SHALL generate a sitemap at `/sitemap-index.xml` using `@astrojs/sitemap`.

#### Scenario: Sitemap is generated at build
- **WHEN** `astro build` runs
- **THEN** a sitemap file SHALL exist in the output directory

### Requirement: Dynamic robots.txt
The project SHALL serve a dynamic `robots.txt` at `/robots.txt` via `src/pages/robots.txt.ts`.

#### Scenario: Robots.txt allows all and points to sitemap
- **WHEN** a crawler requests `/robots.txt`
- **THEN** the response SHALL contain `Allow: /` and `Sitemap: <sitemap URL>`

### Requirement: Environment-based indexing
Non-production environments SHALL emit `<meta name="robots" content="noindex, nofollow">` to prevent staging/dev from appearing in search results.

#### Scenario: Noindex in dev
- **WHEN** `import.meta.env.PROD` is false
- **THEN** the HTML SHALL contain `<meta name="robots" content="noindex, nofollow">`
