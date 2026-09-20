# artwork-detail-page Specification

## Purpose
Provides a build-time generated artwork detail page per artwork in both languages (`/obras/<slug>` for Spanish, `/en/obras/<slug>` for English) rendered through the existing catch-all route — a sticky image stage on the left with a flowing editorial info panel on the right under a single page scroll, real artwork hrefs everywhere, a slug-preserving language switch, and localized SEO metadata.

## Requirements

### Requirement: Inquiry CTA follows the spec data
The conversion slot of the info panel SHALL render in normal document flow directly after the artwork's spec list, spaced by the info panel's standard `gap-8` rhythm, and SHALL NOT be anchored to the bottom of the panel container. For artworks with catalog `status == "available"` the slot SHALL host the buy widget (currency + email + submit) instead of the mailto inquiry CTA; for any other status it SHALL host the corresponding status badge. The full buy-widget behavior (request, redirect, error states, badges) is specified in `artwork-purchase`.

#### Scenario: CTA renders after the spec data
- **GIVEN** an artwork detail page with spec rows in the info panel
- **WHEN** the page renders
- **THEN** the conversion slot appears directly after the spec list in normal document flow, spaced by the panel's standard vertical gap

#### Scenario: CTA does not overflow short viewports
- **GIVEN** a desktop viewport whose height is short enough that the info panel's content exceeds the viewport
- **WHEN** the page renders
- **THEN** the page keeps a single scrollbar and the conversion slot is reached via normal page scroll — it never hides inside a nested scrollable panel

#### Scenario: Available artwork hosts the buy widget
- **GIVEN** an artwork with `status == "available"`
- **WHEN** the page renders
- **THEN** the conversion slot contains the buy widget and no mailto inquiry CTA

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
The artwork page SHALL render an immersive two-part layout: the artwork images on the **left** spanning the full remaining viewport width (no `max-w-6xl` container and no horizontal padding), and a fixed-width editorial info panel on the **right** (`lg:grid-cols-[1fr_380px]`, `xl:grid-cols-[1fr_420px]`), reusing existing atoms (`Image`, `Headline`, `Btn`) and the established paper/ink/crimson visual language. Clipping for the absolute-positioned image layers SHALL be scoped to the image zone so no `overflow` ancestor of the info panel vetoes its `position: sticky`.

#### Scenario: Layout shows full-bleed images left, info right
- **GIVEN** an artwork with images and metadata
- **WHEN** the artwork detail page renders at `lg` viewport or wider
- **THEN** the image viewer occupies the full-bleed left column and the info panel occupies a fixed-width right column with no horizontal container padding

#### Scenario: Image stage is sticky on desktop
- **GIVEN** an artwork detail page at `lg` viewport or wider
- **WHEN** the user scrolls through the info panel
- **THEN** the image zone stays fixed in the viewport (`sticky`, `top: 93px`, height `calc(100svh - 93px)`) with a left border separator on the flowing info column, and the page keeps a single scrollbar so the footer is only reachable past the conversion slot

#### Scenario: Mobile stacks image above info
- **GIVEN** an artwork detail page below `lg` viewport
- **WHEN** the page renders
- **THEN** the image stacks full-width above the info panel, and the info panel uses a top border separator instead of the left border

#### Scenario: Localized content renders
- **GIVEN** an artwork opened in Spanish
- **THEN** the title and description render in Spanish (from the artwork's translation dictionary)

### Requirement: Scroll-driven multi-image viewer
For an artwork with more than one image, a scrubbed GSAP `ScrollTrigger` timeline SHALL cycle through the artwork's images (crossfading and/or translating) as the user scrolls the section, while the sticky image stage holds the viewport and the info panel flows past it in normal page scroll. The timeline SHALL use the section as trigger (`start: "top 93px"`, `end: "bottom bottom"`, no `pin`) so the scrub begins once the section's top reaches the bottom of the sticky header (`start: "top 93px"`) with no scroll dead-zone and completes when the section's bottom reaches the viewport bottom. The scrubbed timeline SHALL use `ease: "none"` and SHALL animate the image children, never the stage element itself.

#### Scenario: Multiple images scrub on scroll
- **GIVEN** an artwork with three images
- **WHEN** the user scrolls through the section on desktop
- **THEN** the viewer transitions through the three images in order while the image stage stays sticky and the info panel scrolls past it
- **AND** once the third image is reached and the section ends, normal page scroll continues to the footer

#### Scenario: Scrub begins below the sticky header
- **GIVEN** a multi-image artwork and the sticky header at the top of the viewport
- **WHEN** the user starts scrolling
- **THEN** the scrub engages immediately when the section top reaches the header's bottom edge (`top 93px`), with no initial scroll distance without animation

#### Scenario: Reduced-motion preference disables scrub
- **GIVEN** the user has `prefers-reduced-motion: reduce` active
- **WHEN** the artwork detail page renders
- **THEN** the images display without the scrub effect (e.g. stacked or shown statically), via `gsap.matchMedia()`

### Requirement: Viewer lifecycle follows the shared GSAP pattern
The scrubbed timeline SHALL be reverted on `astro:after-swap` and re-initialized on `astro:page-load`, following the existing `src/lib/gsap.ts` lifecycle.

#### Scenario: Lifecycle hooks revert and re-initialize
- **WHEN** `astro:after-swap` fires during a client-side navigation
- **THEN** the previous `gsap.matchMedia()` context is reverted
- **AND** when `astro:page-load` fires, the scrubbed timeline is re-initialized for the new page

### Requirement: Render the editorial info panel
The right info panel SHALL show the artwork's localized title, the artist name, the year, the dimensions, a localized description, the price (in the currency matching the active language), the availability status, and a spec list of its localized discipline, technique, theme, format, and scale labels. The artwork localized description (from `Artwork.translations[lang].description` via `pickTranslation` and `toArtworkDetailView`) SHALL be rendered as markdown via the shared `markdown-rendering` renderer inside the `Markdown` atom (GFM, `breaks: true`, trusted CMS), not as escaped plain `<p>{artwork.description}</p>`.

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
#### Scenario: Artwork description renders as markdown
- **WHEN** the artwork description contains markdown (`**`, links, lists, paragraphs)
- **THEN** it is parsed via `renderMarkdown` and rendered with `set:html` in prose styling, with single `\n` → `<br>`

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

### Requirement: Artwork detail page records a view on mount
The artwork detail page SHALL carry its artwork slug into the browser (via a `data-` attribute) and SHALL run a page script that fires the `artwork-visit-counter` visit exactly once per mount on `astro:page-load` (initial load plus every ClientRouter navigation), in both languages and for every artwork status. The script SHALL NOT introduce a hydrated framework island and SHALL NOT alter layout, SEO metadata, or the conversion slot (buy widget / status badge) specified in `artwork-detail-page`.

#### Scenario: Slug reaches the browser
- **WHEN** `/obras/<slug>` or `/en/obras/<slug>` renders
- **THEN** the page markup exposes the artwork slug in a `data-` attribute readable by the visit script

#### Scenario: Available and sold works both count
- **WHEN** an artwork with `status == "sold"` (badge branch, no buy widget) mounts
- **THEN** the visit `POST` still fires exactly once
