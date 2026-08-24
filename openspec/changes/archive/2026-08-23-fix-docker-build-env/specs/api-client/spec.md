## MODIFIED Requirements

### Requirement: Token-injecting fetch client
The system SHALL provide a fetch client that reads the backend base URL from `import.meta.env.API_BASE_URL` and the DRF token from `import.meta.env.API_TOKEN` (server-only, never a `PUBLIC_*` variable) and SHALL attach an `Authorization: Token <token>` header **and** an `Accept: application/json` header to every request. The client SHALL reuse the existing `safeFetch` wrapper (timeout, retry, `FetchError`), and SHALL be the only place the token is injected. When `API_BASE_URL` and/or `API_TOKEN` is not set, the client SHALL throw a single error naming exactly which variable(s) are missing and instructing that they must be supplied as build-time environment variables (`--build-arg <NAME>=<value>`), rather than a generic error.

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

#### Scenario: Missing env var names the gap
- **GIVEN** `API_TOKEN` is unset while `API_BASE_URL` is set
- **WHEN** `apiFetch` runs
- **THEN** it throws an error that names `API_TOKEN` as missing and says to pass it via `--build-arg API_TOKEN=<value>`

#### Scenario: Both env vars missing
- **GIVEN** neither `API_BASE_URL` nor `API_TOKEN` is set
- **WHEN** `apiFetch` runs
- **THEN** it throws a single error naming both `API_BASE_URL` and `API_TOKEN` as missing and instructs how to supply them as build-time arguments