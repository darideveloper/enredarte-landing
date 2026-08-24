# gallery-data Specification

## Purpose
Provides the build-time data orchestration that sources gallery, curator, artist, artwork, and taxonomy data from the backend DRF API (`/apis/artworks/…`), acts as the single source of truth for both the homepage gallery section and the gallery detail pages, and exposes the API-faithful types imported from the `api-client` capability.

## Requirements

### Requirement: Resolve gallery curator from the art-curators endpoint
The system SHALL resolve each gallery's `curator` reference (`{ id, slug }`) into the full curator object (`name`, `email`, `website`, `photo`, `translations`) from the art-curators list fetched at build time, so the gallery detail page's curator block and the homepage card's curator line can render full curator data.

#### Scenario: Gallery curator resolves to full data
- **GIVEN** a gallery whose `curator` is the ref `{ id: 1, slug: "maria-rodriguez" }`
- **WHEN** the gallery's curator is resolved
- **THEN** the full `ArtCurator` (name, email, website, photo, bio translations) is available to the gallery detail page's curator block

#### Scenario: Gallery without a curator
- **GIVEN** a gallery whose `curator` is null
- **THEN** the curator block is omitted or renders a fallback without error

### Requirement: Source gallery and curator data from the API
The system SHALL source gallery and curator data from the backend DRF API at build time using the `api-client` types, instead of dummy fixtures. Bilingual content SHALL be read from the translation dictionary via a language-picking helper, not from an embedded `{es, en}` literal.

#### Scenario: Bilingual content is available
- **GIVEN** a gallery with both `es` and `en` translations present
- **WHEN** the active language is `es` or `en`
- **THEN** the gallery name/description and curator bio render in that language, falling back to the other language when the requested one is absent

### Requirement: Gallery and ArtCurator type shapes
`Gallery` SHALL include `id`, `slug`, `logo`, `is_primary`, a `curator` ref (`{ id, slug }`), ordered `artwork_links`, and language-keyed `translations` (`{ name, description }`). `ArtCurator` SHALL include `id`, `slug`, `name`, `email`, `website`, `photo`, and language-keyed `translations` (`{ bio }`). Gallery SHALL have no `status` or `sort_order` field, and `is_primary` SHALL reflect the backend's primary-gallery flag (at most one gallery is primary).

#### Scenario: Types mirror the backend
- **GIVEN** the gallery/curator data loaded from the API
- **THEN** `Gallery` exposes `id`, `slug`, `logo`, `is_primary`, `curator` (a `{id,slug}` ref), `artwork_links`, and language-keyed `translations`
- **AND** `Gallery` does NOT expose `sort_order`
- **AND** `ArtCurator` exposes `id`, `slug`, `name`, `email`, `website`, `photo`, and language-keyed `translations`

#### Scenario: No gallery status field
- **GIVEN** a gallery from the backend
- **THEN** it has no `status` field, and no `active`/`upcoming` distinction is represented

### Requirement: Resolve gallery artworks from artwork links
The system SHALL link each gallery to its artworks by resolving the gallery's `artwork_links` (each `{ id, artwork: { id, slug }, sort_order }`) against the fetched artwork catalog by slug, ordered by `sort_order`.

#### Scenario: Gallery exposes its own ordered artworks
- **GIVEN** a gallery with three `artwork_links` referencing artworks by slug
- **WHEN** the gallery's artworks are resolved
- **THEN** exactly those three artwork objects are returned in `sort_order`

#### Scenario: Artworks have stable slugs
- **GIVEN** the fetched artwork catalog
- **THEN** every artwork carries a unique `slug` used for gallery-to-artwork resolution

### Requirement: Single source of truth for the homepage gallery section
The homepage "Pabellón de Salas" section SHALL derive its cards from the galleries fetched from the API, so both the homepage and the detail pages consume the same data.

#### Scenario: Homepage cards match the shared data
- **GIVEN** the API returns a set of active galleries
- **WHEN** the homepage is rendered
- **THEN** the `Gallery` organism displays one card per gallery, with each card's title/meta derived from the API data and its `href` pointing to that gallery's detail page

#### Scenario: Card subtitle derives from array position
- **GIVEN** galleries returned by the API in order `[galeria-luz, espacio-urbano]`
- **WHEN** the homepage gallery section renders
- **THEN** the first card's subtitle reads "Sala 01" and the second reads "Sala 02", derived from the gallery's 0-based index in the API response array plus one

#### Scenario: First gallery is featured
- **GIVEN** galleries returned by the API
- **WHEN** the homepage gallery section renders
- **THEN** the first gallery in the array is rendered as the large/featured card (`isLarge: true`), and all subsequent galleries render as standard cards

### Requirement: Resolve the primary gallery hero view model
The data layer SHALL expose a hero view model derived from the gallery where `is_primary === true`, so the landing hero renders the real primary Sala instead of hardcoded copy. The view model SHALL include the gallery's localized `title` and `description`, the resolved curator name, and a featured artwork — the first gallery artwork in `artwork_links` `sort_order` — with its primary image `src`/`alt`, `title`, artist name, price, and localized `href`.

#### Scenario: Primary gallery drives the hero
- **GIVEN** `galeria-luz` is returned with `is_primary: true`
- **WHEN** the hero view model is resolved for language `es`
- **THEN** its `title` is the localized name of `galeria-luz`, its `description` is the localized description, its curator is the resolved curator name, and its featured artwork image/title/artist/price come from the first artwork of `galeria-luz`

#### Scenario: Featured artwork uses the primary image
- **GIVEN** the featured artwork has one image flagged `is_primary: true`
- **WHEN** the hero view model resolves the artwork image
- **THEN** the `src`/`alt` are taken from that primary image

### Requirement: Fall back when no gallery is primary
When no gallery is marked primary, the system SHALL fall back to the first gallery in the API response array.

#### Scenario: No primary gallery present
- **GIVEN** no gallery carries `is_primary: true`
- **WHEN** the hero view model is resolved
- **THEN** the first gallery in the API response array is used as the fallback source

### Requirement: Artwork cards link to the artwork detail page
The `toArtworkView` builder SHALL set each artwork view's `href` to the localized artwork detail path (`/obras/<slug>` for Spanish, `/en/obras/<slug>` for English) instead of the placeholder `"#"`, so every artwork card across the site (homepage `ImageCard`s and gallery `ImageRowCard`s) becomes navigable to its detail page.

#### Scenario: Artwork view href points to its detail page (Spanish, root)
- **GIVEN** an artwork with slug `horizonte-en-tres-tiempos` and active language `es`
- **WHEN** `toArtworkView` produces the view
- **THEN** the view's `href` is `/obras/horizonte-en-tres-tiempos`

#### Scenario: English href uses the locale prefix
- **GIVEN** an artwork with slug `horizonte-en-tres-tiempos` and active language `en`
- **WHEN** `toArtworkView` produces the view
- **THEN** the view's `href` is `/en/obras/horizonte-en-tres-tiempos`
