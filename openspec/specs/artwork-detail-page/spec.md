# artwork-detail-page Specification

## Purpose
Provides a build-time generated artwork detail page per artwork in both languages (`/obras/<slug>` for Spanish, `/en/obras/<slug>` for English) rendered through the existing catch-all route — a scroll-driven multi-image viewer on the left with a fixed editorial info panel on the right, real artwork hrefs everywhere, a slug-preserving language switch, and localized SEO metadata.

## Requirements

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
The artwork page SHALL render a two-part layout: the artwork images on the **left** and a fixed editorial info panel on the **right**, reusing existing atoms (`Image`, `Headline`, `Btn`) and the established paper/ink/crimson visual language.

#### Scenario: Layout shows images left, info right
- **GIVEN** an artwork with images and metadata
- **WHEN** the artwork detail page renders
- **THEN** the image viewer occupies the left column and the info panel occupies the right column

#### Scenario: Localized content renders
- **GIVEN** an artwork opened in Spanish
- **THEN** the title and description render in Spanish (from the artwork's translation dictionary)

### Requirement: Scroll-driven multi-image viewer
For an artwork with more than one image, the image viewer SHALL be pinned via the installed GSAP `ScrollTrigger` while a scrubbed timeline cycles through the artwork's images (crossfading and/or translating) as the user scrolls, with the right info panel remaining fixed for the duration of the pin. The pin SHALL end once the last image has been reached. The scrubbed timeline SHALL use `ease: "none"`, SHALL animate the image children (never the pinned element itself), and SHALL be reverted on `astro:after-swap` and re-initialized on `astro:page-load`, following the existing `src/lib/gsap.ts` lifecycle.

#### Scenario: Multiple images scrub on scroll
- **GIVEN** an artwork with three images
- **WHEN** the user scrolls through the pinned section
- **THEN** the viewer transitions through the three images in order, and the info panel stays fixed
- **AND** once the third image is reached, the pin releases and normal page scroll resumes

#### Scenario: Reduced-motion preference disables pinning
- **GIVEN** the user has `prefers-reduced-motion: reduce` active
- **WHEN** the artwork detail page renders
- **THEN** the images display without the pin-and-scrub effect (e.g. stacked or shown statically), via `gsap.matchMedia()`

### Requirement: Render the editorial info panel
The right info panel SHALL show the artwork's localized title, the artist name, the year, the dimensions, a localized description, the price (USD and/or MXN when present), the availability status, and a spec list of its localized discipline, technique, theme, format, and scale labels.

#### Scenario: Panel shows full artwork data
- **GIVEN** an artwork with title, artist, year, dimensions, description, price, status, and taxonomy refs
- **WHEN** the info panel renders
- **THEN** all of those fields are visible with the taxonomy labels localized to the active language
- **AND** the dimensions are shown alongside the year

#### Scenario: Missing optional fields are omitted
- **GIVEN** an artwork with no price and no description
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