# artwork-detail-page Specification

## Purpose
Provides a build-time generated artwork detail page per artwork in both languages (`/obras/<slug>` for Spanish, `/en/obras/<slug>` for English) rendered through the existing catch-all route — a scroll-driven multi-image viewer on the left with a fixed editorial info panel on the right, real artwork hrefs everywhere, a slug-preserving language switch, and localized SEO metadata.

## Requirements

### Requirement: Inquiry CTA follows the spec data
The inquiry CTA SHALL render in normal document flow directly after the artwork's spec list, spaced by the info panel's standard `gap-8` rhythm, and SHALL NOT be anchored to the bottom of the panel container.

#### Scenario: CTA renders after the spec data
- **GIVEN** an artwork detail page with spec rows in the info panel
- **WHEN** the page renders
- **THEN** the inquiry CTA appears directly after the spec list in normal document flow, spaced by the panel's standard vertical gap

#### Scenario: CTA does not overflow short viewports
- **GIVEN** a desktop viewport whose height is short enough that the sticky info panel's content exceeds the viewport
- **WHEN** the page renders
- **THEN** the inquiry CTA remains inside the scrollable panel and does not overflow the panel or the viewport

### Requirement: Generate an artwork detail route per artwork
The system SHALL generate an artwork detail page for every artwork fetched from the API at build time, in both languages — `/obras/<slug>` for Spanish (root) and `/en/obras/<slug>` for English (`en/` prefix) — by extending the existing `[...path].astro` catch-all `getStaticPaths()` and adding an `artwork` entry to its `COMPONENT_MAP`. No separate route file SHALL be introduced.

#### Scenario: Spanish artwork page exists
- **GIVEN** an artwork with slug `horizonte-en-tres-tiempos`
- **WHEN** `/obras/horizonte-en-tres-tiempos` is requested
- **THEN** the artwork detail page renders with the Spanish artwork content

#### Scenario: English artwork page exists
- **GIVEN** an artwork with slug `horizonte-en-tres-tiempos`
- **WHEN** `/en/obras/horizonte-en-tres-tiempos` is requested
- **THEN** the artwork detail page renders with the English artwork content

#### Scenario: Unknown slug yields no page
- **GIVEN** a slug with no matching artwork
- **WHEN** it is requested
- **THEN** no artwork page is emitted for that slug

### Requirement: Render the artwork detail layout
The artwork page SHALL render an immersive two-part layout: the artwork images on the **left** spanning the full remaining viewport width (no `max-w-6xl` container and no horizontal padding), and a fixed-width editorial info panel on the **right** (`lg:grid-cols-[1fr_380px]`, `xl:grid-cols-[1fr_420px]`), reusing existing atoms (`Image`, `Headline`, `Btn`) and the established paper/ink/crimson visual language.

#### Scenario: Layout shows full-bleed images left, info right
- **GIVEN** an artwork with images and metadata
- **WHEN** the artwork detail page renders at `lg` viewport or wider
- **THEN** the image viewer occupies the full-bleed left column and the info panel occupies a fixed-width right column with no horizontal container padding

#### Scenario: Info panel is sticky on desktop
- **GIVEN** an artwork detail page at `lg` viewport or wider
- **WHEN** the user scrolls through the pinned image viewer
- **THEN** the info panel stays fixed in the viewport (`sticky top-0`, height `calc(100vh - 80px)`, `overflow-y-auto`) with a left border separator, and its bottom aligns with the viewport bottom

#### Scenario: Mobile stacks image above info
- **GIVEN** an artwork detail page below `lg` viewport
- **WHEN** the page renders
- **THEN** the image stacks full-width above the info panel, and the info panel uses a top border separator instead of the left border

#### Scenario: Localized content renders
- **GIVEN** an artwork opened in Spanish
- **THEN** the title and description render in Spanish (from the artwork's translation dictionary)

### Requirement: Scroll-driven multi-image viewer
For an artwork with more than one image, the image viewer SHALL be pinned via the installed GSAP `ScrollTrigger` while a scrubbed timeline cycles through the artwork's images (crossfading and/or translating) as the user scrolls, with the right info panel remaining fixed for the duration of the pin. The pin SHALL engage once the pinned section's top reaches the bottom of the sticky header (`start: "top 80px"`) so the scrub begins immediately with no scroll dead-zone. The pin SHALL end once the last image has been reached. The scrubbed timeline SHALL use `ease: "none"` and SHALL animate the image children, never the pinned element itself.

#### Scenario: Multiple images scrub on scroll
- **GIVEN** an artwork with three images
- **WHEN** the user scrolls through the pinned section on desktop
- **THEN** the viewer transitions through the three images in order, and the info panel stays fixed
- **AND** once the third image is reached, the pin releases and normal page scroll resumes

#### Scenario: Scrub begins below the sticky header
- **GIVEN** a multi-image artwork and the sticky header at the top of the viewport
- **WHEN** the user starts scrolling
- **THEN** the pinned scrub engages immediately when the section top reaches the header's bottom edge (`top 80px`), with no initial scroll distance without animation

#### Scenario: Reduced-motion preference disables pinning
- **GIVEN** the user has `prefers-reduced-motion: reduce` active
- **WHEN** the artwork detail page renders
- **THEN** the images display without the pin-and-scrub effect (e.g. stacked or shown statically), via `gsap.matchMedia()`

### Requirement: Viewer lifecycle follows the shared GSAP pattern
The scrubbed timeline SHALL be reverted on `astro:after-swap` and re-initialized on `astro:page-load`, following the existing `src/lib/gsap.ts` lifecycle.

#### Scenario: Lifecycle hooks revert and re-initialize
- **WHEN** `astro:after-swap` fires during a client-side navigation
- **THEN** the previous `gsap.matchMedia()` context is reverted
- **AND** when `astro:page-load` fires, the scrubbed timeline is re-initialized for the new page

### Requirement: Render the editorial info panel
The right info panel SHALL show the artwork's localized title, the artist name, the year, the dimensions, a localized description, the price (in the currency matching the active language), the availability status, and a spec list of its localized discipline, technique, theme, format, and scale labels.

#### Scenario: Panel shows full artwork data
- **GIVEN** an artwork with title, artist, year, dimensions, description, prices in both currencies, status, and taxonomy refs
- **WHEN** the info panel renders
- **THEN** all of those fields are visible with the taxonomy labels localized to the active language
- **AND** the dimensions are shown alongside the year
- **AND** the price is shown in MXN when `lang === "es"` and in USD when `lang === "en"`

#### Scenario: Spanish page falls back to USD when MXN is missing
- **GIVEN** an artwork with `price_mxn = 0` and `price_usd > 0`
- **WHEN** the info panel renders on a Spanish page
- **THEN** the price line is omitted (the chosen currency is missing); the artwork does not silently show USD on a Spanish page

#### Scenario: English page falls back gracefully when USD is missing
- **GIVEN** an artwork with `price_usd = 0` and `price_mxn > 0`
- **WHEN** the info panel renders on an English page
- **THEN** the price line is omitted (the chosen currency is missing); the artwork does not silently show MXN on an English page

#### Scenario: Missing optional fields are omitted
- **GIVEN** an artwork with no price in the active language and no description
- **THEN** the price and description rows are omitted without error

### Requirement: Language switch preserves the artwork slug
On an artwork detail page, the `LangBtns` language switcher SHALL link to the same artwork slug in the other language (e.g. `/en/obras/<slug>` from `/obras/<slug>`), via an optional path override prop on `LangBtns`.

#### Scenario: Switch language stays on the artwork
- **GIVEN** the user is on `/obras/horizonte-en-tres-tiempos` (Spanish)
- **WHEN** they click the English language button
- **THEN** they land on `/en/obras/horizonte-en-tres-tiempos` (same artwork, English content)

### Requirement: Emit localized SEO metadata
The artwork page SHALL emit a localized `<title>` and meta description (from the artwork's title/description and artist), a canonical URL equal to the current path, and an `og:image` pointing at the artwork's primary image, via the existing `PageSEO` component with explicit props.

#### Scenario: SEO metadata is present
- **GIVEN** a rendered artwork page
- **THEN** the document title and meta description reflect the active language
- **AND** the canonical URL matches the requested artwork path
- **AND** `og:image` points at the artwork's primary image