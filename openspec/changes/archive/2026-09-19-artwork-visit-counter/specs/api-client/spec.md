## ADDED Requirements

### Requirement: Token-free, no-retry public visit client

The system SHALL provide a public visit client (`src/lib/api/artwork-visits.ts`) exporting a `recordArtworkVisit(slug)` function for the unauthenticated `POST /api/artworks/artworks/:slug/visit/` endpoint that reads the dashboard origin from `import.meta.env.PUBLIC_API_BASE_URL` only, sends no `Authorization` header, issues a single attempt with a short timeout (~5s) and `keepalive: true`, and never retries. The client SHALL trim a trailing `/` from the base URL and URL-encode the slug. When `PUBLIC_API_BASE_URL` is unset the client SHALL throw an error naming `PUBLIC_API_BASE_URL` and how to supply it. The existing token-injecting client SHALL remain the only place `API_TOKEN` is used, and `API_TOKEN` SHALL never be read from a `PUBLIC_*` variable. The visit client SHALL NOT reuse `safeFetch`'s retry loop.

#### Scenario: Visit request carries no token

- **WHEN** `recordArtworkVisit("ciudad-reflejada")` runs
- **THEN** the outgoing request is `POST {PUBLIC_API_BASE_URL}/api/artworks/artworks/ciudad-reflejada/visit/` with no `Authorization` header and an empty body

#### Scenario: Slug is URL-encoded and base slash-safe

- **WHEN** the slug contains characters requiring encoding or the base URL ends with `/`
- **THEN** the request URL is correctly formed with a single `/` separator and an encoded slug

#### Scenario: Missing public base URL fails with guidance

- **WHEN** `PUBLIC_API_BASE_URL` is unset
- **THEN** the client throws an error naming `PUBLIC_API_BASE_URL` and how to supply it

#### Scenario: No retry on failure

- **WHEN** the visit request fails for any reason (network, timeout, `404`, `429`)
- **THEN** the client performs no additional attempts
