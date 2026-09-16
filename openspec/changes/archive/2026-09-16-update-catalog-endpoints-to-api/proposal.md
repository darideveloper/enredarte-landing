## Why

The catalog client uses the plural prefix `/apis/artworks/…` for all 10 resources while the blog client uses singular `/api/blog/…`. Per request, the catalog modules move to `/api/artworks/…` to unify on singular `/api/` — subject to the verification gate in `tasks.md` confirming the backend actually serves the new prefix before merging.

## What Changes

- Update all 10 catalog endpoint modules under `src/lib/api/` (`art-curators.ts`, `artists.ts`, `artworks.ts`, `disciplines.ts`, `formats.ts`, `galleries.ts`, `locations.ts`, `scales.ts`, `techniques.ts`, `themes.ts`) so `list` requests `GET /api/artworks/<resource>/?page=&page_size=` and `detail` requests `GET /api/artworks/<resource>/{id}/`.
- Leave `src/lib/api/posts.ts` untouched (already `/api/blog/posts/`).
- Leave `src/lib/api/client.ts` behavior unchanged (`${API_BASE_URL}${path}` concatenation, token/Accept headers, env validation, retry).
- Update affected docs (`docs/blog-api.md` D4 note) and active specs to the new prefix.

## Capabilities

### New Capabilities

- None — no new behavior is introduced.

### Modified Capabilities

- `api-client`: endpoint path requirement changes from `GET /apis/artworks/…` to `GET /api/artworks/…` for list/detail scenarios.
- `gallery-data`: source requirement now pins the singular-`api` catalog paths (`/api/artworks/…`) with a prefix scenario for galleries/art-curators (purpose reference updated at archive).

## Impact

- Affected code: 10 files × 2 call sites (20 string literals) under `src/lib/api/`; no change to `client.ts`, `posts.ts`, `pagination.ts`, `types.ts`, or `src/data/api.ts` call sites (they consume `list`/`detail` functions, not paths).
- Specs/docs: deltas in `specs/api-client/spec.md` (2 scenarios) and `specs/gallery-data/spec.md` (source requirement + prefix scenario), merged at archive; `docs/blog-api.md` (D4 note) updated by hand.
- Systems: backend must serve `/api/artworks/…` or the static build (`getStaticPaths` → `buildSiteData` → `fetchAll`) fails; verify against live `API_BASE_URL` before merging. No dependency or env-var changes.
