### Requirement: API-faithful TypeScript types
The system SHALL declare TypeScript types in `src/lib/api/types.ts` that mirror the backend DRF response shapes exactly. Types SHALL include: a shared base type (`id`, `slug`, `is_active`, `sort_order`, `created_at`, `updated_at`); a `Ref` type (`{ id, slug }`) for relations; a `Translations<T>` type that models the backend's language-keyed dictionary (`Partial<Record<"es" | "en", T>>`); a `Paginated<T>` envelope (`count`, `next`, `previous`, `page`, `page_size`, `total_pages`, `results`); and an `ApiError` envelope (`status`, `message`, `data`). Resource types SHALL cover all 10 endpoints: `Artist`, `ArtCurator`, `Location`, `Gallery`, `Discipline`, `Technique`, `Theme`, `Format`, `Scale`, and `Artwork`.

#### Scenario: Translations are a language-keyed dictionary
- **GIVEN** a gallery response with `"translations": { "es": { "name": "X", "description": "Y" }, "en": { "name": "Z", "description": "W" } }`
- **THEN** the `Gallery.translations` type accepts that shape and exposes `es`/`en` keys with `name` and `description`

#### Scenario: Relations are id/slug refs
- **GIVEN** an artwork response whose `artist` is `{ "id": 1, "slug": "frida-kahlo" }` and whose `disciplines` is an array of `{ "id", "slug" }` objects
- **THEN** `Artwork.artist` is typed as `Ref` and `Artwork.disciplines` as `Ref[]`

#### Scenario: Prices are numbers
- **GIVEN** an artwork response with `"price_mxn": 15000.00` (a JSON number, not a string)
- **THEN** `Artwork.price_mxn` and `Artwork.price_usd` are typed `number`

#### Scenario: Paginated list envelope
- **GIVEN** any list response
- **THEN** it is typed as `Paginated<T>` with numeric `count`/`page`/`page_size`/`total_pages`, nullable `next`/`previous`, and a `results: T[]`

### Requirement: Endpoint modules per resource
The system SHALL provide one module per backend resource under `src/lib/api/` (`artists.ts`, `art-curators.ts`, `locations.ts`, `galleries.ts`, `disciplines.ts`, `techniques.ts`, `themes.ts`, `formats.ts`, `scales.ts`, `artworks.ts`). Each module SHALL export a `list` function (returning `Paginated<T>`) and a `detail` function (returning `T`) for the resource, accepting optional pagination parameters (`page`, `page_size`) on `list` and a numeric `id` on `detail`.

#### Scenario: List an endpoint
- **GIVEN** a call to `listArtists({ page: 1, page_size: 100 })`
- **THEN** it requests `GET /apis/artworks/artists/?page=1&page_size=100` and returns a `Paginated<Artist>`

#### Scenario: Detail an endpoint
- **GIVEN** a call to `detailArtwork(1)`
- **THEN** it requests `GET /apis/artworks/artworks/1/` and returns an `Artwork`

### Requirement: Token-injecting fetch client
The system SHALL provide a fetch client that reads the backend base URL from `process.env.API_BASE_URL` and the DRF token from `process.env.API_TOKEN` (server-only, never a `PUBLIC_*` variable) and SHALL attach an `Authorization: Token <token>` header **and** an `Accept: application/json` header to every request. The client SHALL reuse the existing `safeFetch` wrapper (timeout, retry, `FetchError`), and SHALL be the only place the token is injected.

#### Scenario: Authorization header injected
- **GIVEN** `API_TOKEN` is set to `abc123`
- **WHEN** any endpoint function runs
- **THEN** the outgoing request carries `Authorization: Token abc123`

#### Scenario: Accept header injected
- **GIVEN** the API client
- **WHEN** any endpoint function runs
- **THEN** the outgoing request carries `Accept: application/json`

#### Scenario: Token is server-only
- **WHEN** the client is bundled
- **THEN** the token is read from `process.env`, not from `import.meta.env.PUBLIC_*`, so it is not inlined into client bundles

### Requirement: Paginated fetch-all helper
The system SHALL provide a `fetchAll` helper that fetches every page of a paginated resource (following `next` and `total_pages`, defaulting to `page_size=100`) and returns a flattened array of all results.

#### Scenario: Single page
- **GIVEN** a resource whose list returns `total_pages: 1`
- **WHEN** `fetchAll` runs
- **THEN** it returns the `results` of that single page

#### Scenario: Multiple pages
- **GIVEN** a resource with more results than one `page_size` page
- **WHEN** `fetchAll` runs
- **THEN** it follows `next` until all pages are consumed and returns the concatenated results
