# seo Specification

## Purpose
The site's SEO layer: how metadata is resolved, the origin used for canonical/hreflang/OG/JSON-LD URLs, the social-graph tags emitted per page type, indexing/robots guards, and per-template JSON-LD structured data. Built on the existing `BaseSEO`/`PageSEO` component hierarchy.

## Requirements
### Requirement: Metadata resolution chain
The SEO engine SHALL resolve the page `<title>`, meta `description`, and meta `keywords` via the chain: explicit prop → i18n lookup (`pages.{key}.{field}`) → `SITE_TITLE`/`SITE_DESCRIPTION` constants. The `<title>` SHALL append the `| <Business Name>` tagline for non-home pages unless disabled via `useTagLine=false`. `PageSEO` SHALL forward the `keywords` prop to `BaseSEO`, and meta `keywords` SHALL render only when a non-empty value resolves.

#### Scenario: Keywords are forwarded through PageSEO and rendered
- **WHEN** a page component passes `keywords` to `PageSEO`
- **THEN** the rendered `<head>` contains `<meta name="keywords" content="...">` with the resolved value

#### Scenario: Blog index and post keywords render
- **WHEN** `BlogIndex` or `BlogPost` passes its computed `keywords`
- **THEN** the corresponding `<meta name="keywords">` tag is emitted in the page `<head>`

#### Scenario: Only one H1 per page
- **WHEN** `BlogPost` renders with a `banner_image`
- **THEN** exactly one `<h1>` element appears in the rendered HTML

### Requirement: Canonical URL origin from Astro.site
The SEO engine SHALL compute the canonical URL, OG URL, alternate (hreflang) URLs, and JSON-LD `url`/`image` using the `Astro.site` origin (the `PORTLESS_URL → SITE_URL → prod` chain from `astro.config.mjs`) rather than the hardcoded `BUSINESS_DATA.url`. Dev and branch-preview builds SHALL therefore emit their own branch-subdomain canonicals, kept out of the index by the dev `noindex` guard.

#### Scenario: Production canonical uses the configured site origin
- **WHEN** the site is built for production with `site` resolved from `PORTLESS_URL`/`SITE_URL`
- **THEN** the canonical and hreflang URLs use that origin, not a hardcoded domain

#### Scenario: Dev build stays out of the index
- **WHEN** a non-PROD build emits branch-subdomain canonicals
- **THEN** the page also emits `<meta name="robots" content="noindex, nofollow">` via the environment guard

### Requirement: Absolute alternate URLs with return links
The SEO engine SHALL emit alternate (hreflang) URLs as absolute URLs (full origin + path). When a caller supplies relative alternate paths, the engine SHALL absolutize them against the resolved origin. Each alternate SHALL be the self-consistent localized version that carries return links to its sibling languages.

#### Scenario: Relative alternates are absolutized
- **WHEN** a page supplies `alternateUrls` of `{ en: "/en/salas/foo", es: "/salas/foo" }`
- **THEN** the rendered hreflang tags reference full absolute URLs under the resolved origin

### Requirement: No blanket x-default
The SEO engine SHALL NOT emit an `hreflang="x-default"` alternate on every page. Since `en` and `es` already cover all supported locales, no blanket fallback is rendered.

#### Scenario: Auto-generated alternates omit x-default
- **WHEN** the engine auto-generates en/es alternates for a route-map page
- **THEN** the rendered `<head>` contains `hreflang="en"` and `hreflang="es"` alternates and NO `hreflang="x-default"` tag

### Requirement: Social graph tags per page type
The SEO engine SHALL emit a complete Open Graph and Twitter Card set: `og:type` mapped per page type (`Blog` → `blog`, `BlogPosting` → `article`, all other types → `website`), `og:locale`, `og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, and `twitter:image`. The engine SHALL emit `og:image:width`, `og:image:height`, and `og:image:alt` **when the image dimensions/alt are resolvable**; when the image is remote with unknown dimensions (e.g. a blog `banner_image`), the engine SHALL omit `og:image:width`/`og:image:height` rather than emit invalid values, while still emitting `og:image:alt` when an alt is available. Blog posts SHALL additionally emit `article:published_time` and `article:author`.

#### Scenario: Blog post emits article graph tags
- **WHEN** a `BlogPosting` page renders
- **THEN** the `<head>` contains `og:type=article`, `twitter:title/description/image`, and `article:published_time`/`article:author`

#### Scenario: Non-blog pages keep website default
- **WHEN** a gallery, artwork, artist, curator, legal, or index page renders
- **THEN** `og:type` is `website` and the standard OG/Twitter set is present

### Requirement: Per-template JSON-LD structured data
The SEO engine SHALL emit JSON-LD typed per page template via a `jsonType` prop, with template-specific fields supplied through an `extraJson` prop. Types and fields:
- `Blog` — blog index pages.
- `BlogPosting` — blog posts (headline, author as `Person`, datePublished).
- `ArtGallery` — gallery pages.
- `VisualArtwork` — artwork pages (creator, artMedium when available, offers).
- `Person` — artist and curator pages.
- `LocalBusiness` — home, legal, and index shells only.

The engine SHALL accept a nullable/empty `extraJson` and merge it under the base schema. The base schema SHALL carry `@context`, `@type`, `name`, `url`, and `image`. The base `url` (the page canonical) and `image` (the resolved `ogImage`) are already the correct per-template entity values, so the engine SHALL keep those from the base. The `extraJson` SHALL provide the template-specific `@type`, override the base `name` (e.g. `VisualArtwork` uses the artwork title, `BlogPosting` the post title, `Person` the person's name), and add any template-specific fields — so the template-specific entity, not the business entity, is the schema subject. For `VisualArtwork`, when the artwork is available, the engine SHALL emit an `Offer` with `priceCurrency` resolved from `lang` and `availability` from the artwork `status`.

#### Scenario: Blog post emits BlogPosting
- **WHEN** a `BlogPost` page passes `jsonType="BlogPosting"` with `extraJson` containing headline/author/datePublished/image/url
- **THEN** the rendered `<script type="application/ld+json">` contains `"@type": "BlogPosting"` and the supplied fields

#### Scenario: Artwork page emits VisualArtwork
- **WHEN** an `ArtworkPage` passes `jsonType="VisualArtwork"` with creator/medium/offers
- **THEN** the rendered JSON-LD contains `"@type": "VisualArtwork"` and the supplied fields

#### Scenario: Home keeps LocalBusiness
- **WHEN** the home page renders with default `jsonType`
- **THEN** the rendered JSON-LD remains `"@type": "LocalBusiness"`

### Requirement: Favicon links and assets
The site SHALL ship the finalized brand favicon set in `public/` — `favicon.svg`, `favicon.ico` (32×32), `favicon.png` (32×32), `apple-touch-icon.png` (180×180 opaque), `og-image.jpg` (1200×630), and `icon-192`/`icon-512` — replacing the placeholder assets. The layout SHALL emit `<link rel="icon">` entries for the SVG and ICO favicons plus an `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` tag. `og-image.jpg` shall be referenced by `BUSINESS_DATA.ogImage`.

#### Scenario: Apple touch icon linked and opaque
- **WHEN** the layout `<head>` renders
- **THEN** a `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` tag is present and the file is 180×180 opaque PNG (0% transparent)

#### Scenario: Favicon assets shipped
- **WHEN** the site builds with the copied `public/` assets
- **THEN** `favicon.svg`, `favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `og-image.jpg`, and `icon-192`/`icon-512` resolve with no 404s

### Requirement: Indexing guards preserved
The engine SHALL keep the environment-based guard (`!PROD → noindex, nofollow`) and the explicit `noIndex` prop guard. Pages marked `noIndex` SHALL NOT emit canonical self-references that conflict with the guard (they may omit hreflang/canonical ambiguity but SHALL remain no-indexed).

#### Scenario: noIndex page stays out of the index
- **WHEN** a compra, 404, or design-system page renders with `noIndex`
- **THEN** the page emits `<meta name="robots" content="noindex, nofollow">`

### Requirement: Analytics and tracking
The layout SHALL inject a GTM/GA4 snippet as an inline script, rendered only in production builds (`import.meta.env.PROD`) so dev/noindex pages are not polluted. Tracking IDs SHALL come from typed environment variables (`PUBLIC_GTM_ID` / `PUBLIC_GA4_ID`).

#### Scenario: Tracking snippet in production only
- **WHEN** the site is built in production mode
- **THEN** the GTM/GA4 inline snippet is present in the `<head>`

#### Scenario: No tracking in dev
- **WHEN** a non-PROD build renders
- **THEN** the tracking snippet is absent

### Requirement: RSS feed discovery
The SEO engine SHALL make each locale's RSS feed discoverable by emitting `<link rel="alternate" type="application/rss+xml">` head tags pointing at `/rss.xml` (es) and `/en/rss.xml` (en), and SHALL reference the sitemap in `robots.txt`. Feed links SHALL only point at routes that exist.

#### Scenario: Feed link tags emitted
- **WHEN** the layout `<head>` renders
- **THEN** it contains `<link rel="alternate" type="application/rss+xml">` tags pointing at the per-locale feed URLs

#### Scenario: Robots references sitemap
- **WHEN** `robots.txt` is generated
- **THEN** it references the sitemap URL (feeds are advertised via head link tags, not as sitemap entries)