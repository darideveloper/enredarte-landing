## MODIFIED Requirements

### Requirement: Define gallery and curator data types
The system SHALL source gallery and curator data from the backend DRF API at build time using the `api-client` types, instead of dummy fixtures. `Gallery` SHALL include `id`, `slug`, `logo`, `is_primary`, a `curator` reference (`{ id, slug }`), ordered `artwork_links`, and language-keyed `translations` (`{ name, description }`); `ArtCurator` SHALL include `id`, `slug`, `name`, `email`, `website`, `photo`, and language-keyed `translations` (`{ bio }`). Bilingual content SHALL be read from the translation dictionary via a language-picking helper, not from an embedded `{es, en}` literal. The gallery `status` (`active` | `upcoming`) field SHALL NOT exist. The `sort_order` field SHALL NOT exist on `Gallery` — the backend no longer returns it. The `is_primary` boolean SHALL be present and reflect the backend's primary-gallery flag (at most one gallery is primary).

#### Scenario: Types mirror the backend
- **GIVEN** the gallery/curator data loaded from the API
- **THEN** `Gallery` exposes `id`, `slug`, `logo`, `is_primary`, `curator` (a `{id,slug}` ref), `artwork_links`, and language-keyed `translations`
- **AND** `Gallery` does NOT expose `sort_order`
- **AND** `ArtCurator` exposes `id`, `slug`, `name`, `email`, `website`, `photo`, and language-keyed `translations`

#### Scenario: Primary gallery flag is surfaced
- **GIVEN** the API marks exactly one gallery with `is_primary: true`
- **WHEN** the gallery data is loaded
- **THEN** that gallery carries `is_primary: true` and every other gallery carries `is_primary: false`

#### Scenario: No gallery status field
- **GIVEN** a gallery from the backend
- **THEN** it has no `status` field, and no `active`/`upcoming` distinction is represented

#### Scenario: Bilingual content is available
- **GIVEN** a gallery with both `es` and `en` translations present
- **WHEN** the active language is `es` or `en`
- **THEN** the gallery name/description and curator bio render in that language, falling back to the other language when the requested one is absent

## ADDED Requirements

### Requirement: Resolve the primary gallery hero view model
The data layer SHALL expose a hero view model derived from the gallery where `is_primary === true`, so the landing hero renders the real primary Sala instead of hardcoded copy. The view model SHALL include the gallery's localized `title` and `description`, the resolved curator name, and a featured artwork (its primary image `src`/`alt`, `title`, artist name, price, and localized `href`), where the featured artwork is the first gallery artwork in `artwork_links` `sort_order`. When no gallery is marked primary, the system SHALL fall back to the first gallery in the API response array.

#### Scenario: Primary gallery drives the hero
- **GIVEN** `galeria-luz` is returned with `is_primary: true`
- **WHEN** the hero view model is resolved for language `es`
- **THEN** its `title` is the localized name of `galeria-luz`, its `description` is the localized description, its curator is the resolved curator name, and its featured artwork image/title/artist/price come from the first artwork of `galeria-luz`

#### Scenario: Featured artwork uses the primary image
- **GIVEN** the featured artwork has one image flagged `is_primary: true`
- **WHEN** the hero view model resolves the artwork image
- **THEN** the `src`/`alt` are taken from that primary image

#### Scenario: No primary gallery present
- **GIVEN** no gallery carries `is_primary: true`
- **WHEN** the hero view model is resolved
- **THEN** the first gallery in the API response array is used as the fallback source
