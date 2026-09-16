## Why

Unknown URLs (mistyped slugs, removed artworks, stale external links) currently fall through to the web server's default 404 response — an unbranded dead end with no path back into the gallery. A branded 404 keeps lost visitors inside the salon experience and routes them back to the collection.

## What Changes

- Add `src/pages/404.astro`, which Astro builds to `dist/404.html` — the file `nginx.conf` already serves via `error_page 404 /404.html`. No server or routing config changes.
- Render the 404 inside the shared `Layout` (Header + Footer) as a vertically and horizontally centered editorial block: `Headline` eyebrow, serif `404` display, bilingual salon-voice copy, crimson hairline, and two recovery CTAs (`Btn` primary → `/`, `Btn` ghost → `/obras`).
- Add `pages.notFound.*` i18n keys to `src/messages/es.json` and `src/messages/en.json`; render ES-primary with an EN secondary line (single static file, no JS language swap).
- Mark the page `noindex` so error responses never enter search indexes.
- Update `docs/component-dependencies.md` with the new page entry (living-diagram rule).

## Capabilities

### New Capabilities

- `not-found-page`: branded 404 page — centered layout, bilingual copy, recovery navigation, noindex SEO, and build output contract (`dist/404.html` served by the existing nginx `error_page`).

### Modified Capabilities

- None. `Layout`, `Header`, `Footer`, `Btn`, and `Headline` are reused unchanged; no existing spec-level behavior changes.

## Impact

- New file: `src/pages/404.astro`. New i18n keys under `pages.notFound.*` (es/en). Docs touch: `docs/component-dependencies.md`.
- No changes to `[...path].astro` routing, `astro.config.mjs`, `nginx.conf`, or any component.
- Build impact: one additional static page (`dist/404.html`); no backend fetch, no API dependency, builds offline-safe.
