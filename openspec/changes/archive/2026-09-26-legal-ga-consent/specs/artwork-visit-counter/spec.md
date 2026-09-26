## MODIFIED Requirements

### Requirement: Record one artwork view per detail-page mount

The system SHALL issue exactly one `POST` to `/api/artworks/artworks/:slug/visit/` per artwork detail-page mount (initial load and every ClientRouter SPA navigation to an artwork page), for both languages (`/obras/:slug`, `/en/obras/:slug`) and for every artwork status, but ONLY when stored analytics consent grants it (`enredarte-consent` with `analytics: true`). The request SHALL use `fetch` with `method: "POST"`, `keepalive: true`, no request body, no `Authorization` header, and no `Content-Type` header, targeting `PUBLIC_API_BASE_URL` with the slug URL-encoded. The call SHALL be fire-and-forget: it SHALL never block render or navigation, SHALL never be retried on any outcome (including network error, timeout, `404`, or `429`), and SHALL swallow all failures without user-visible effects. In dev builds (`import.meta.env.DEV`) failures SHALL emit a single `console.warn`; in production builds failures SHALL be fully silent. No environment gating SHALL be applied: dev builds fire against the dev backend via `PUBLIC_API_BASE_URL` exactly like production. The `200` response body (`{ views_count }`) SHALL be ignored and SHALL NOT be rendered anywhere.

#### Scenario: Initial load fires one visit POST

- **WHEN** a consenting visitor loads `/obras/ciudad-reflejada` directly
- **THEN** the browser issues exactly one `POST` to `{PUBLIC_API_BASE_URL}/api/artworks/artworks/ciudad-reflejada/visit/` with no body and no `Authorization` header

#### Scenario: SPA navigation between artworks fires per page

- **WHEN** a consenting visitor navigates client-side from `/obras/obra-a` to `/obras/obra-b` via ClientRouter
- **THEN** exactly one visit `POST` fires for `obra-b` (and no second `POST` for `obra-a`)

#### Scenario: Throttled response is swallowed without retry

- **WHEN** the backend responds `429 Too Many Requests`
- **THEN** no retry is issued, no UI changes, and (in dev only) a single `console.warn` is emitted

#### Scenario: Unknown slug failure is swallowed

- **WHEN** the backend responds `404` (unknown or inactive slug/artist)
- **THEN** no retry is issued and no UI changes occur

#### Scenario: Network failure never blocks render

- **WHEN** the visit `POST` times out or the network fails
- **THEN** the artwork page renders and navigates normally with no user-visible effect

#### Scenario: No count is displayed

- **WHEN** the visit `POST` returns `200` with `{ "views_count": 42 }`
- **THEN** the artwork page shows no view count derived from the response

#### Scenario: Denied or undecided consent suppresses the beacon

- **WHEN** a visitor with stored `{ analytics: false }` or with no stored consent choice loads an artwork page
- **THEN** no visit `POST` is issued at all

#### Scenario: Granting consent on an artwork page counts that view once

- **WHEN** a visitor without a prior grant accepts analytics while viewing an artwork page
- **THEN** exactly one visit `POST` fires for that artwork; accepting again with an existing grant fires none
