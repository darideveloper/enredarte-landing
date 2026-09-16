## MODIFIED Requirements

### Requirement: Source gallery and curator data from the API
The system SHALL source gallery and curator data from the backend DRF API at build time using the `api-client` types, requesting the catalog through the singular-`api` paths (`/api/artworks/…`). Bilingual content SHALL be read from the translation dictionary via a language-picking helper, not from an embedded `{es, en}` literal.

#### Scenario: Bilingual content is available
- **GIVEN** a gallery with both `es` and `en` translations present
- **WHEN** the active language is `es` or `en`
- **THEN** the gallery name/description and curator bio render in that language, falling back to the other language when the requested one is absent

#### Scenario: Catalog is fetched via the singular api prefix
- **GIVEN** the build-time data orchestration fetching galleries and curators
- **WHEN** it requests the catalog resources
- **THEN** the requests target `/api/artworks/galleries/` and `/api/artworks/art-curators/` (singular `api`), not `/apis/artworks/…`
