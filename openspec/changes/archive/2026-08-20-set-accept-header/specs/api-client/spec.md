## MODIFIED Requirements

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