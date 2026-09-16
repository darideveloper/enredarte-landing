## 1. Verify backend serves the new prefix (merge gate)

- [x] 1.1 Curl `GET /api/artworks/artists/?page=1&page_size=1` against live `API_BASE_URL` with `Authorization: Token $API_TOKEN` and confirm a `Paginated` response (`{"count":…}`); do not proceed if it 404s.
- [x] 1.2 Spot-check one `detail` path (`GET /api/artworks/artworks/1/`) the same way.
  - Verified 2026-09-16: id `1` does not exist (backend returns API-level 404 JSON `{"status":"error","message":"No Artwork matches the given query."}`, proving the route is served — same behavior as the old `/apis/` prefix for id `1`). Spot-checked `GET /api/artworks/artworks/4/` instead → HTTP 200 with full `Artwork` (`slug: horizonte-beton`).

## 2. Update catalog endpoint modules

- [x] 2.1 In each of the 10 modules under `src/lib/api/` (`art-curators.ts`, `artists.ts`, `artworks.ts`, `disciplines.ts`, `formats.ts`, `galleries.ts`, `locations.ts`, `scales.ts`, `techniques.ts`, `themes.ts`), replace `/apis/artworks/` with `/api/artworks/` in `list` (line 9) and `detail` (line 13) — 20 literals total.
- [x] 2.2 Confirm `src/lib/api/posts.ts` and `src/lib/api/client.ts` are untouched.
- [x] 2.3 Repo-wide grep for `/apis/`; expected remainders are docs prose and `openspec/changes/archive/` history only.

## 3. Sync docs (specs merge at archive)

- [x] 3.1 Update `docs/blog-api.md` D4 note: catalog prefix is now `/api/artworks/` (singular `api`). Do NOT hand-edit `openspec/specs/` — the deltas in `specs/api-client/spec.md` and `specs/gallery-data/spec.md` are merged into the main specs by `openspec archive`.

## 4. Validate

- [x] 4.1 Run `pnpm build` with real `API_BASE_URL`/`API_TOKEN` and confirm the static build succeeds (exercises all 10 `list` paths via `buildSiteData`).
- [x] 4.2 Confirm no new console/network errors and the change contains only the intended files (`git status`/`git diff` review).
