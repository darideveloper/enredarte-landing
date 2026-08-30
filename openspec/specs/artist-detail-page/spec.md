# artist-detail-page Specification

## Purpose
Generates and renders a per-artist detail page in both languages, showing the artist's info, their artworks as a static editorial list, the galleries where the artist is currently active, an entry point from artwork detail pages, a slug-preserving language switch, and localized SEO metadata.

## Requirements

### Requirement: Generate an artist detail route per artist
The system SHALL generate an artist detail page for every artist fetched from the API at build time, in both languages — `/artistas/<slug>` for Spanish (root) and `/en/artistas/<slug>` for English (`en/` prefix) — by extending the existing `[...path].astro` catch-all `getStaticPaths()` and adding an `artist` entry to its `COMPONENT_MAP`. No separate route file SHALL be introduced.

#### Scenario: Spanish artist page exists
- **GIVEN** an artist with slug `maria-fernanda-lopez`
- **WHEN** `/artistas/maria-fernanda-lopez` is requested
- **THEN** the artist detail page renders with the Spanish artist content

#### Scenario: English artist page exists
- **GIVEN** an artist with slug `maria-fernanda-lopez`
- **WHEN** `/en/artistas/maria-fernanda-lopez` is requested
- **THEN** the artist detail page renders with the English artist content

#### Scenario: Unknown slug yields no page
- **GIVEN** a slug with no matching artist
- **WHEN** it is requested
- **THEN** no artist page is emitted for that slug

### Requirement: Render the artist hero
The artist page SHALL render a hero section showing the artist's name as the page's `h1`, a localized eyebrow label, the localized bio, a metadata line of birth/death years and location when present, and contact/social links (email, website, and each social link from `social_links`). The hero SHALL include the artist's photo (or an initials fallback when no photo exists) as a portrait image, reusing existing atoms (`Headline`, `Image`) and the established paper/ink/crimson visual language.

#### Scenario: Hero shows localized artist content
- **GIVEN** the user opens an artist page in Spanish
- **THEN** the hero shows the artist's name, the Spanish bio (from the artist's translation dictionary), and the artist's photo
- **AND** the eyebrow reads the localized "Artista" label

#### Scenario: Metadata line composes years and location
- **GIVEN** an artist with `birth_year` 1985, no `death_year`, and a location resolved to `Los Cabos`
- **THEN** the metadata line reads `1985 · Los Cabos`
- **GIVEN** an artist with `birth_year` 1950 and `death_year` 2010
- **THEN** the metadata line reads `1950–2010`

#### Scenario: Contact links render with scheme stripped
- **GIVEN** an artist with email, a website `https://www.example.com/`, and one social link
- **WHEN** the hero renders
- **THEN** the email appears as a `mailto:` link, the website's visible text reads `www.example.com` (no scheme, no trailing slash) while its `href` stays the full URL, and the social link renders with its platform label

#### Scenario: Missing photo falls back to initials
- **GIVEN** an artist with no photo
- **THEN** the portrait area displays the artist's initials over the dark image container instead of an image

### Requirement: Render the artist's artworks
The artist page SHALL render an artworks section showing only the artworks belonging to that artist, as a static editorial list (no filter UI): the featured artwork as an `ImageBanner` followed by the remaining artworks as alternating `ImageRowCard`s, each tagged with its localized discipline, technique, and theme labels. It SHALL reuse `ImageBanner`, `ImageRowCard`, and the artwork view built by `toArtworkView`. The featured artwork SHALL be the artist's first highlighted artwork when any exist, otherwise the first artwork.

#### Scenario: Only the artist's artworks appear
- **GIVEN** an artist whose artworks are a subset of the full catalog
- **WHEN** the artworks section renders
- **THEN** only that artist's artworks are displayed, and no artwork by another artist appears

#### Scenario: Featured artwork leads the list
- **GIVEN** an artist with artworks, one of which is `is_highlighted`
- **WHEN** the artworks section renders
- **THEN** the highlighted artwork renders as the featured `ImageBanner` and the rest render as `ImageRowCard`s

#### Scenario: Row cards alternate
- **GIVEN** an artist with three artworks after the featured one
- **WHEN** the artworks section renders at desktop width
- **THEN** the second artwork's row reverses its image/info order relative to the first

### Requirement: Render the artist's active galleries
The artist page SHALL render a section listing the galleries where the artist is currently active, derived from the API: the set of galleries referenced by the `gallery_links` of the artist's artworks, deduplicated, restricted to galleries whose `is_active` is true, and ordered primary galleries first then by gallery index. The section SHALL show these galleries as `ImageCard`s built from `toSalaView` (gallery image, localized name, "Sala NN" subtitle, artwork count, and curator line), and SHALL omit the section entirely when no active gallery exists.

#### Scenario: Active galleries derive from the artist's works
- **GIVEN** an artist whose artworks link to galleries A, B, and C, where B is not `is_active`
- **THEN** the section shows exactly galleries A and C
- **AND** if A is the primary gallery, A renders before C

#### Scenario: Duplicate gallery links collapse
- **GIVEN** two of the artist's artworks both linked to the same gallery
- **THEN** that gallery appears exactly once in the section

#### Scenario: No active galleries hides the section
- **GIVEN** an artist with no artwork linked to any active gallery
- **THEN** the active-galleries section is not rendered

### Requirement: Artist name links from artwork detail
The artist name shown on an artwork detail page's info panel SHALL link to that artist's page (e.g. from `/obras/<slug>` to `/artistas/<slug>`), using the artist's slug carried on the artwork detail view.

#### Scenario: Artist name is a link
- **GIVEN** an artwork detail page for an artwork by artist `maria-fernanda-lopez`
- **THEN** the artist name in the info panel links to `/artistas/maria-fernanda-lopez` (Spanish) or `/en/artistas/maria-fernanda-lopez` (English)

### Requirement: Language switch preserves the artist slug
On an artist detail page, the `LangBtns` language switcher SHALL link to the same artist slug in the other language (e.g. `/en/artistas/<slug>` from `/artistas/<slug>`), via the existing localized-path override prop.

#### Scenario: Switch language stays on the artist
- **GIVEN** the user is on `/artistas/maria-fernanda-lopez` (Spanish)
- **WHEN** they click the English language button
- **THEN** they land on `/en/artistas/maria-fernanda-lopez` (same artist, English content)

### Requirement: Emit localized SEO metadata
The artist page SHALL emit a localized `<title>` and meta description (from the artist's name and bio), a canonical URL equal to the current path, and an `og:image` pointing at the artist's photo (or their featured artwork when no photo exists), via the existing `PageSEO` component with explicit props.

#### Scenario: SEO metadata is present
- **GIVEN** a rendered artist page
- **THEN** the document title and meta description reflect the active language
- **AND** the canonical URL matches the requested artist path
- **AND** `og:image` points at the artist's photo or featured artwork image