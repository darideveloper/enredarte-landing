# api-client Specification

## Purpose
Defines the client-side API layer that mirrors the backend DRF endpoints: TypeScript types, per-resource endpoint modules, a token-injecting fetch client, and a paginated fetch-all helper.

## Requirements

### Requirement: API-faithful TypeScript types
The system SHALL declare TypeScript types in `src/lib/api/types.ts` that mirror the backend DRF response shapes exactly: a shared `Base` (`id`, `slug`, `is_active`, `created_at`, `updated_at`), a `Ref` (`{ id, slug }`) for relations, a `Translations<T>` language-keyed dictionary (`Partial<Record<"es" | "en", T>>`), a `Paginated<T>` envelope, and an `ApiError` envelope (`status`, `message`, `data`).

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

### Requirement: Resource types cover all ten endpoints
Resource types SHALL cover all 10 endpoints: `Artist`, `ArtCurator`, `Location`, `Gallery`, `Discipline`, `Technique`, `Theme`, `Format`, `Scale`, and `Artwork`.

#### Scenario: All ten resource types declared
- **GIVEN** the types module in `src/lib/api/types.ts`
- **THEN** it exports `Artist`, `ArtCurator`, `Location`, `Gallery`, `Discipline`, `Technique`, `Theme`, `Format`, `Scale`, and `Artwork`

### Requirement: Endpoint modules per resource
The system SHALL provide one module per backend resource under `src/lib/api/` (`artists.ts`, `art-curators.ts`, `locations.ts`, `galleries.ts`, `disciplines.ts`, `techniques.ts`, `themes.ts`, `formats.ts`, `scales.ts`, `artworks.ts`). Each module SHALL export a `list` function (returning `Paginated<T>`) and a `detail` function (returning `T`) for the resource, accepting optional pagination parameters (`page`, `page_size`) on `list` and a numeric `id` on `detail`.

#### Scenario: List an endpoint
- **GIVEN** a call to `listArtists({ page: 1, page_size: 100 })`
- **THEN** it requests `GET /api/artworks/artists/?page=1&page_size=100` and returns a `Paginated<Artist>`

#### Scenario: Detail an endpoint
- **GIVEN** a call to `detailArtwork(1)`
- **THEN** it requests `GET /api/artworks/artworks/1/` and returns an `Artwork`

### Requirement: Token-injecting fetch client
The system SHALL provide a fetch client that reads the backend base URL from `import.meta.env.PUBLIC_API_BASE_URL` and the DRF token from `import.meta.env.API_TOKEN` (server-only, never a `PUBLIC_*` variable) and SHALL attach an `Authorization: Token <token>` header **and** an `Accept: application/json` header to every request. The client SHALL reuse the existing `safeFetch` wrapper (timeout, retry, `FetchError`), and SHALL be the only place the token is injected.

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
- **THEN** the token is read from `import.meta.env.API_TOKEN`, never from a `PUBLIC_*` variable, so it is not inlined into client bundles

### Requirement: Missing env vars fail with guidance
When `PUBLIC_API_BASE_URL` and/or `API_TOKEN` is not set, the client SHALL throw a single error naming exactly which variable(s) are missing and instructing that they must be supplied as build-time environment variables (`--build-arg <NAME>=<value>`), rather than a generic error.

#### Scenario: Missing env var names the gap
- **GIVEN** `API_TOKEN` is unset while `PUBLIC_API_BASE_URL` is set
- **WHEN** `apiFetch` runs
- **THEN** it throws an error that names `API_TOKEN` as missing and says to pass it via `--build-arg API_TOKEN=<value>`

#### Scenario: Both env vars missing
- **GIVEN** neither `PUBLIC_API_BASE_URL` nor `API_TOKEN` is set
- **WHEN** `apiFetch` runs
- **THEN** it throws a single error naming both `PUBLIC_API_BASE_URL` and `API_TOKEN` as missing and instructs how to supply them as build-time arguments

### Requirement: Paginated fetch-all helper
The system SHALL provide a `fetchAll` helper that fetches every page of a paginated resource by iterating page numbers until `page` exceeds `total_pages` (defaulting to `page_size=100`) and returns a flattened array of all results.

#### Scenario: Single page
- **GIVEN** a resource whose list returns `total_pages: 1`
- **WHEN** `fetchAll` runs
- **THEN** it returns the `results` of that single page

#### Scenario: Multiple pages
- **GIVEN** a resource with more results than one `page_size` page
- **WHEN** `fetchAll` runs
- **THEN** it requests each page number up to `total_pages` and returns the concatenated results

### Requirement: Token-free public sales client
The system SHALL provide a public sales client (`src/lib/api/sales.ts`) for the unauthenticated endpoints (`POST artworks/:slug/buy/`, `GET orders/:slug/`, `POST orders/:slug/delivery/`) that reads the dashboard origin from `import.meta.env.PUBLIC_API_BASE_URL`, sends no `Authorization` header, and reuses `safeFetch` (timeout, retry, `FetchError`). It SHALL parse the backend `{status, message, data}` error envelope into typed errors carrying HTTP code, message, and field map. The existing token-injecting client SHALL remain the only place `API_TOKEN` is used, and `API_TOKEN` SHALL never be read from a `PUBLIC_*` variable.

#### Scenario: Sales request carries no token
- **WHEN** any sales endpoint function runs
- **THEN** the outgoing request has no `Authorization` header and targets `PUBLIC_API_BASE_URL`

#### Scenario: Field errors are typed
- **WHEN** the backend returns `400` with `{status: "error", message, data}`
- **THEN** the client throws a typed error exposing the HTTP code, the message, and the per-field map from `data`

#### Scenario: Missing public base URL fails with guidance
- **WHEN** `PUBLIC_API_BASE_URL` is unset
- **THEN** the client throws an error naming `PUBLIC_API_BASE_URL` and how to supply it

### Requirement: Single backend URL var
`PUBLIC_API_BASE_URL` SHALL be the only backend URL variable: the token-injecting build-time client and the public sales client SHALL both read it, and `API_BASE_URL` SHALL NOT exist in code, types, Dockerfile, env files, or docs.

#### Scenario: One URL for build and browser
- **WHEN** the build fetches the catalog and the browser calls a sales endpoint
- **THEN** both target `PUBLIC_API_BASE_URL`

### Requirement: Five-value artwork status type
`Artwork.status` SHALL be typed as the full backend enum (`available | reserved | sold | on_loan | not_available`), extending the current three-value `ArtworkStatus`.

#### Scenario: On-loan status accepted
- **WHEN** the catalog returns an artwork with `"status": "on_loan"`
- **THEN** the type accepts it without error
