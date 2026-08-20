# gallery-detail-page Specification

## Purpose
Generates and renders a per-gallery detail page in both languages, showing the gallery hero, full curator data, and an artworks section restricted to that gallery's artworks, with a minimal filter set, a slug-preserving language switch, and localized SEO metadata.

## Requirements

### Requirement: Generate a gallery detail route per gallery
The system SHALL generate a gallery detail page for every gallery fetched from the API at build time, in both languages — `/salas/<slug>` for English and `/es/salas/<slug>` for Spanish — by extending the existing `[...path].astro` catch-all `getStaticPaths()` and adding a `gallery` entry to its `COMPONENT_MAP`. No separate route file SHALL be introduced.

#### Scenario: English gallery page exists
- **GIVEN** a gallery with slug `tierra-mundo-y-memoria`
- **WHEN** `/salas/tierra-mundo-y-memoria` is requested
- **THEN** the gallery detail page renders with the English gallery content

#### Scenario: Spanish gallery page exists
- **GIVEN** a gallery with slug `tierra-mundo-y-memoria`
- **WHEN** `/es/salas/tierra-mundo-y-memoria` is requested
- **THEN** the gallery detail page renders with the Spanish gallery content

#### Scenario: Unknown slug yields no page
- **GIVEN** a slug with no matching gallery
- **WHEN** it is requested
- **THEN** no gallery page is emitted for that slug

### Requirement: Render the gallery hero
The gallery page SHALL render a hero section showing the gallery's localized name, a localized eyebrow/headline derived from the gallery's `sort_order` (e.g. "Sala 01"), its localized description, and a large representative image (the gallery logo/hero image). It SHALL reuse existing atoms (`Image`, `Title`, `Headline`).

#### Scenario: Hero shows localized gallery content
- **GIVEN** the user opens a gallery page in Spanish
- **THEN** the hero shows the Spanish gallery name and description (from the gallery's translation dictionary) and the gallery image
- **AND** the eyebrow derives from the gallery's `sort_order` only (e.g. "Sala 01", with no status suffix)

### Requirement: Render the curator block
The gallery page SHALL render the full curator data — photo, name, localized bio, email, and website — using a `CuratorCard` molecule composed from the existing `Image` atom and the card styling already used by `CardSummary`. The website SHALL be displayed as a link whose visible text is the website URL without its scheme (leading `http://` or `https://` removed), while the link target remains the full original URL.

#### Scenario: Curator information is displayed
- **GIVEN** a gallery whose curator has a photo, bio, email, and website
- **WHEN** the gallery page renders
- **THEN** the curator's photo, name, bio, email, and website are visible
- **AND** the bio is shown in the active language

#### Scenario: Website link hides the URL scheme
- **GIVEN** a curator whose website is `https://www.example.com/`
- **WHEN** the curator card renders the website link
- **THEN** the visible text reads `www.example.com` (no `https://` prefix and no trailing slash)
- **AND** the link's `href` is the full `https://www.example.com/`

#### Scenario: Email is unaffected
- **GIVEN** a curator with an email address
- **WHEN** the curator card renders
- **THEN** the email is displayed unchanged as a `mailto:` link

### Requirement: Restrict the artworks section to the gallery's artworks
The gallery page SHALL render an artworks section that shows only the artworks belonging to that gallery, using the existing `Filters` and `Artworks` React islands with only this gallery's artworks passed as facets and children.

#### Scenario: Only gallery artworks appear
- **GIVEN** a gallery whose artworks are a subset of the full catalog
- **WHEN** the artworks section renders
- **THEN** only that gallery's artworks are displayed, and no artwork from other galleries appears

### Requirement: Minimal filter set
The artworks section SHALL expose a minimal filter set limited to the `artist` and `technique` groups (not the full six groups used on the homepage).

#### Scenario: Only two filter groups render
- **GIVEN** the gallery artworks section
- **WHEN** it is rendered
- **THEN** the filter row offers exactly the `artist` and `technique` groups

### Requirement: Language switch preserves the gallery slug
On a gallery detail page, the `LangBtns` language switcher SHALL link to the same gallery slug in the other language (e.g. `/es/salas/<slug>` from `/salas/<slug>`), via an optional path override prop on `LangBtns`.

#### Scenario: Switch language stays on the gallery
- **GIVEN** the user is on `/salas/tierra-mundo-y-memoria`
- **WHEN** they click the Spanish language button
- **THEN** they land on `/es/salas/tierra-mundo-y-memoria` (same gallery, Spanish content)

#### Scenario: Existing pages keep current behavior
- **GIVEN** a page without a path override
- **WHEN** the language switcher is used
- **THEN** behavior is unchanged from today (route-map based links)

### Requirement: Emit localized SEO metadata
The gallery page SHALL emit a localized `<title>` and meta description (from the gallery's name/description), a canonical URL equal to the current path, and an `og:image` pointing at the gallery image, via the existing `PageSEO` component with explicit props.

#### Scenario: SEO metadata is present
- **GIVEN** a rendered gallery page
- **THEN** the document title and meta description reflect the active language
- **AND** the canonical URL matches the requested gallery path
