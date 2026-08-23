## MODIFIED Requirements

### Requirement: Define gallery and curator data types
The system SHALL source gallery and curator data from the backend DRF API at build time using the `api-client` types, instead of dummy fixtures. `Gallery` SHALL include `id`, `slug`, `logo`, a `curator` reference (`{ id, slug }`), ordered `artwork_links`, and language-keyed `translations` (`{ name, description }`); `ArtCurator` SHALL include `id`, `slug`, `name`, `email`, `website`, `photo`, and language-keyed `translations` (`{ bio }`). Bilingual content SHALL be read from the translation dictionary via a language-picking helper, not from an embedded `{es, en}` literal. The gallery `status` (`active` | `upcoming`) field SHALL NOT exist. The `sort_order` field SHALL NOT exist on `Gallery` — the backend no longer returns it.

#### Scenario: Types mirror the backend
- **GIVEN** the gallery/curator data loaded from the API
- **THEN** `Gallery` exposes `id`, `slug`, `logo`, `curator` (a `{id,slug}` ref), `artwork_links`, and language-keyed `translations`
- **AND** `Gallery` does NOT expose `sort_order`
- **AND** `ArtCurator` exposes `id`, `slug`, `name`, `email`, `website`, `photo`, and language-keyed `translations`

#### Scenario: No gallery status field
- **GIVEN** a gallery from the backend
- **THEN** it has no `status` field, and no `active`/`upcoming` distinction is represented

#### Scenario: Bilingual content is available
- **GIVEN** a gallery with both `es` and `en` translations present
- **WHEN** the active language is `es` or `en`
- **THEN** the gallery name/description and curator bio render in that language, falling back to the other language when the requested one is absent

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
