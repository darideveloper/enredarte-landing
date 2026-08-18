## ADDED Requirements

### Requirement: Resolve gallery curator from the art-curators endpoint
The system SHALL resolve each gallery's `curator` reference (`{ id, slug }`) into the full curator object (`name`, `email`, `website`, `photo`, `translations`) from the art-curators list fetched at build time, so the gallery detail page's curator block and the homepage card's curator line can render full curator data.

#### Scenario: Gallery curator resolves to full data
- **GIVEN** a gallery whose `curator` is the ref `{ id: 1, slug: "maria-rodriguez" }`
- **WHEN** the gallery's curator is resolved
- **THEN** the full `ArtCurator` (name, email, website, photo, bio translations) is available to the gallery detail page's curator block

#### Scenario: Gallery without a curator
- **GIVEN** a gallery whose `curator` is null
- **THEN** the curator block is omitted or renders a fallback without error

## MODIFIED Requirements

### Requirement: Define gallery and curator data types
The system SHALL source gallery and curator data from the backend DRF API at build time using the `api-client` types, instead of dummy fixtures. `Gallery` SHALL include `id`, `slug`, `logo`, a `curator` reference (`{ id, slug }`), `sort_order`, ordered `artwork_links`, and language-keyed `translations` (`{ name, description }`); `ArtCurator` SHALL include `id`, `slug`, `name`, `email`, `website`, `photo`, and language-keyed `translations` (`{ bio }`). Bilingual content SHALL be read from the translation dictionary via a language-picking helper, not from an embedded `{es, en}` literal. The gallery `status` (`active` | `upcoming`) field SHALL NOT exist.

#### Scenario: Types mirror the backend
- **GIVEN** the gallery/curator data loaded from the API
- **THEN** `Gallery` exposes `id`, `slug`, `logo`, `curator` (a `{id,slug}` ref), `sort_order`, `artwork_links`, and language-keyed `translations`
- **AND** `ArtCurator` exposes `id`, `slug`, `name`, `email`, `website`, `photo`, and language-keyed `translations`

#### Scenario: No gallery status field
- **GIVEN** a gallery from the backend
- **THEN** it has no `status` field, and no `active`/`upcoming` distinction is represented

#### Scenario: Bilingual content is available
- **GIVEN** a gallery with both `es` and `en` translations present
- **WHEN** the active language is `es` or `en`
- **THEN** the gallery name/description and curator bio render in that language, falling back to the other language when the requested one is absent

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

#### Scenario: Card subtitle derives from sortOrder only
- **GIVEN** galleries with `sort_order` values of `1` and `4`
- **WHEN** the homepage gallery section renders
- **THEN** the cards' subtitles read "Sala 01" and "Sala 04" respectively, derived from `sort_order` only (no status/upcoming suffix)

## REMOVED Requirements

### Requirement: Expose API-facing types
**Reason**: The gallery/curator response types now live in the `api-client` capability (`src/lib/api/types.ts`), which the data layer consumes directly; the gallery-data module no longer declares its own type contract.
**Migration**: Import `Gallery` and `ArtCurator` from `src/lib/api/types.ts` (via the `api-client` capability) instead of defining them in `data/galleries.ts`.
