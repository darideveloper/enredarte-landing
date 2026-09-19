## ADDED Requirements

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
