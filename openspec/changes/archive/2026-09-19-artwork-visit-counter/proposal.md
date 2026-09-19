## Why

The backend now exposes `POST /api/artworks/artworks/:slug/visit/` — a public, throttled (20/hour) endpoint that atomically increments `views_count` and feeds the artist-profile "Más visitados" ordering. The landing is fully static (SSG), so visit counting must happen in the browser, once per artwork detail-page mount, fire-and-forget.

## What Changes

- Add a token-free public visit client (`src/lib/api/artwork-visits.ts`) that `POST`s to `/api/artworks/artworks/:slug/visit/` with no body and no `Authorization` header, using `PUBLIC_API_BASE_URL`.
- Trigger one visit `POST` per artwork detail mount (`/obras/:slug`, `/en/obras/:slug`) via an inline `<script>` in `ArtworkPage.astro` hooked to `astro:page-load` (covers initial load + ClientRouter SPA swaps).
- Fire-and-forget semantics: never block render, never retry on any failure (including `429`/`404`), swallow errors for the user with a `console.warn` in dev only.
- Ignore the `200` response body (`{ views_count }`); nothing renders the count.
- `fetch` with `keepalive: true` as the transport; short timeout (~5s).
- Fires in all environments with no `PROD`-only gate (dev hits the dev backend via `PUBLIC_API_BASE_URL`).

## Capabilities

### New Capabilities

- `artwork-visit-counter`: browser-side fire-and-forget recording of artwork views against the public visit endpoint (trigger timing, transport, failure silence, no display).

### Modified Capabilities

- `artwork-detail-page`: artwork detail page gains a visit-recording side effect on every mount (both languages, all statuses).
- `api-client`: public client family gains a no-auth, no-retry visit client reusing the single `PUBLIC_API_BASE_URL` var; `API_TOKEN` stays server-only and untouched.

## Impact

- Frontend only: new `src/lib/api/artwork-visits.ts`, small `<script>` addition in `src/components/pages/obra/ArtworkPage.astro`. No new dependencies, no React island, no route changes.
- Backend contract (Bruno `Artworks/POST visit.bru`) is consumed as-is; no backend change.
- `docs/component-dependencies.md` may need a refresh if the ArtworkPage import graph changes (conditional post-change check per AGENTS.md).
