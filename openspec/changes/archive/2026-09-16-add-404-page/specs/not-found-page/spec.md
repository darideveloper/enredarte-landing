# not-found-page Specification

## Purpose
Defines the branded 404 page for unknown URLs: a centered editorial block inside the shared `Layout` that keeps lost visitors in the salon experience and routes them back to the collection. The page builds to `dist/404.html`, which the existing nginx `error_page 404 /404.html` already serves.

## ADDED Requirements

### Requirement: Static 404 output contract
The system SHALL render unknown URLs with a static page built from `src/pages/404.astro` to `dist/404.html`, served by the existing nginx `error_page 404 /404.html` directive. No changes to `astro.config.mjs`, `nginx.conf`, or `[...path].astro` routing SHALL be required.

#### Scenario: Unknown URL serves the branded page
- **WHEN** a visitor requests a path that matches no generated route
- **THEN** the server responds with the contents of `dist/404.html` and HTTP status 404

#### Scenario: Build emits 404.html without backend access
- **WHEN** the site builds with the backend unreachable
- **THEN** `dist/404.html` is still emitted because the 404 page performs no API fetch

### Requirement: Vertically and horizontally centered content
The 404 content SHALL be centered on both axes within the space between Header and Footer using a self-contained section (`min-h-[60svh]` with `grid place-items-center` and `text-center`). The shared `Layout` SHALL NOT be modified.

#### Scenario: Content centered between header and footer
- **WHEN** the 404 page renders at desktop or mobile viewport
- **THEN** the editorial block is centered horizontally and sits in the vertical middle of the remaining space between Header and Footer

#### Scenario: No viewport overflow on mobile chrome
- **WHEN** the 404 page renders on a mobile browser with dynamic chrome
- **THEN** no vertical scrollbar appears from the centering itself (svh-based minimum height, not fixed `h-screen`)

### Requirement: Branded editorial block
The 404 page SHALL present the salon editorial pattern: a `Headline` eyebrow, a serif display `404`, a crimson hairline accent, bilingual description copy in the salon voice, and two recovery CTAs. Crimson usage SHALL stay within the ≤10% Crimson Rule and all surfaces SHALL default to `bg-paper`.

#### Scenario: Editorial hierarchy present
- **WHEN** the 404 page renders
- **THEN** it shows an uppercase eyebrow, a serif `404` display heading, a crimson hairline, and a description — in that order

#### Scenario: Sharp-cornered brand geometry preserved
- **WHEN** the 404 page renders
- **THEN** no `rounded` container, card, or button appears outside the system's allowed exceptions (inputs, decorative marks)

### Requirement: Bilingual copy via i18n dictionaries
The 404 copy SHALL be resolved from `pages.notFound.*` keys defined in both `src/messages/es.json` and `src/messages/en.json`, rendered ES-primary with an EN secondary line. No client-side language detection script SHALL be used.

#### Scenario: Spanish copy renders from dictionary
- **WHEN** the 404 page renders
- **THEN** the primary headline and description match the `pages.notFound` ES strings

#### Scenario: English secondary line renders from dictionary
- **WHEN** the 404 page renders
- **THEN** an English secondary line matching the `pages.notFound` EN strings is visible below the primary copy

#### Scenario: Keys exist in both languages
- **WHEN** the translation dictionaries are validated at build time
- **THEN** both `es.json` and `en.json` define every `pages.notFound.*` key the page consumes

### Requirement: Recovery navigation
The 404 page SHALL provide two recovery CTAs: a `Btn` primary linking to `/` and a `Btn` ghost linking to `/obras`. Both SHALL be plain anchors with no client-side routing dependency.

#### Scenario: Primary CTA returns home
- **WHEN** a visitor activates the primary CTA
- **THEN** the browser navigates to `/`

#### Scenario: Secondary CTA opens the collection
- **WHEN** a visitor activates the secondary CTA
- **THEN** the browser navigates to `/obras`

### Requirement: Search-engine exclusion
The 404 page SHALL emit `noindex` SEO metadata so error responses never enter search indexes.

#### Scenario: 404 response carries noindex
- **WHEN** the 404 page renders
- **THEN** the document head contains a `noindex` robots directive
