## MODIFIED Requirements

### Requirement: Endpoint modules per resource
The system SHALL provide one module per backend resource under `src/lib/api/` (`artists.ts`, `art-curators.ts`, `locations.ts`, `galleries.ts`, `disciplines.ts`, `techniques.ts`, `themes.ts`, `formats.ts`, `scales.ts`, `artworks.ts`). Each module SHALL export a `list` function (returning `Paginated<T>`) and a `detail` function (returning `T`) for the resource, accepting optional pagination parameters (`page`, `page_size`) on `list` and a numeric `id` on `detail`.

#### Scenario: List an endpoint
- **GIVEN** a call to `listArtists({ page: 1, page_size: 100 })`
- **THEN** it requests `GET /api/artworks/artists/?page=1&page_size=100` and returns a `Paginated<Artist>`

#### Scenario: Detail an endpoint
- **GIVEN** a call to `detailArtwork(1)`
- **THEN** it requests `GET /api/artworks/artworks/1/` and returns an `Artwork`
