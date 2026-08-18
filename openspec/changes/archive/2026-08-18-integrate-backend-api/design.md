## Context

The landing is a static Astro site (SSG via `getStaticPaths`) that currently renders galleries, curators, and artworks from hardcoded fixtures (`src/data/catalog.ts`, `src/data/galleries.ts`). The backend is a Django DRF API exposing 10 read-only, paginated resources under `/apis/artworks/` (`artists`, `art-curators`, `locations`, `galleries`, `disciplines`, `techniques`, `themes`, `formats`, `scales`, `artworks`), all requiring `Authorization: Token` and returning language-keyed translation dictionaries and `{id, slug}` relation refs. The existing `src/lib/api/types.ts` does not match this contract (array translations, invented `status`), and `client.ts`/`constants.ts` are orphaned. The site must render real backend data, so the fixtures are replaced with a build-time API fetch.

## Goals / Non-Goals

**Goals:**
- Mirror all 10 backend endpoints with correct, API-faithful types so any part of the site can use them.
- Replace static fixtures with data fetched from the API during `astro build`.
- Keep the token server-only (never inlined into client bundles).
- Preserve existing filter UX (OR-within-group, AND-across-group, viable-option disabling) while moving facet values from single strings to arrays.

**Non-Goals:**
- No runtime (client-side) fetching of these endpoints; no BFF/proxy route.
- No backend changes beyond environment configuration (token, `HOST`).
- No new pages or routes beyond the existing `/salas/<slug>` detail pages.
- No search/sort/pagination UI — build fetches all rows up front.

## Decisions

### 1. Build-time SSG fetch with a server-only token
Fetch during `astro build` (in `getStaticPaths`), reading `process.env.API_BASE_URL` and `process.env.API_TOKEN`. This keeps the token out of client bundles (it is never `PUBLIC_*`), avoids CORS entirely (server-to-server), and keeps the site fully static.

Alternatives considered:
- *Client-side fetch with `PUBLIC_` token*: leaks the token; rejected.
- *BFF/proxy route in Astro*: adds moving parts for no benefit given SSG; rejected.

### 2. API-faithful type model in `src/lib/api/types.ts`
Model the backend exactly: a shared `Base` type, `Ref` (`{id, slug}`), `Translations<T>` = `Partial<Record<"es"|"en", T>>`, `Paginated<T>` (`count/next/previous/page/page_size/total_pages/results`), and `ApiError` (`status/message/data`). Ten resource interfaces mirror the serializers, including `price_mxn`/`price_usd` as `number`, `status` as the artwork status union, and nullable `email`/`website`/`photo`/`logo`/`curator`/`location`.

Rationale: the backend `_build_translation_dict` returns `{language: {...}}` keyed by language (not an array), and `RefSerializer`/`DecimalField(coerce_to_string=False)`/`allow_null` are authoritative — the types must match or the swap silently breaks.

### 3. One endpoint module per resource
`src/lib/api/{artists,art-curators,locations,galleries,disciplines,techniques,themes,formats,scales,artworks}.ts`, each exporting `list(params?)` → `Paginated<T>` and `detail(id)` → `T`. A single shared `apiFetch<T>(path, init?)` (added to `client.ts`) prepends the base URL, injects the `Authorization` header, and delegates to the existing `safeFetch` (timeout/retry/`FetchError`).

### 4. `fetchAll` pagination helper
`src/lib/api/pagination.ts` exposes `fetchAll<T>(list, { page_size = 100 })` that loops pages via `next`/`total_pages` and flattens `results`, so build code never hand-rolls pagination and can handle >100 rows.

### 5. Single build-time data orchestration module
`src/data/api.ts` fetches, in one place: all galleries, all artists, all art-curators, all five taxonomies, and all artworks (via `fetchAll`), then derives localized filter groups, a gallery→artworks map, and slug-keyed artist/curator lookups. Each gallery's `curator` ref (`{id,slug}`) is resolved into a full `ArtCurator` from the art-curators list, and each artwork's `artist` ref is resolved into a display name from the artists list. `getStaticPaths` calls this once, generates `/salas/<slug>` routes from galleries, and passes the derived dataset to `Home`/`GalleryPage` via props. No component fetches at runtime.

### 6. Facets become arrays; matching uses membership
`ArtworkFacets` becomes `Record<GroupKey, string[]>`. An artwork's `artist` is a one-element array; `disciplines`/`techniques`/`themes`/`formats`/`scales` are the slug lists from the `Ref[]` relations. `matchesArtwork` matches a group when `facets[group].some(v => selections[group].includes(v))`; `computeViableOptions` is unchanged in shape (it already delegates to `matchesArtwork`). For the `Artworks` island, which reads DOM `data-*` attributes, multi-valued facets are encoded space-separated (`data-discipline="pintura collage"`) and split into arrays before matching.

### 7. Filter groups derived from the API
Artist options come from the `artists` list (`slug`, translated `name`); taxonomy options come from each taxonomy list (`slug`, `translations[lang].name`). This replaces the hardcoded `filterGroups` and `getFacetLabel`. A `pickTranslation(translations, lang, field)` helper in `lib/i18n/utils.ts` resolves the localized string with es/en fallback.

### 8. Drop the gallery `status` concept
The backend gallery has only `is_active`/`sort_order` (and the viewset already filters to active). The "Sala 0N · Próximamente" eyebrow/subtitle loses the status suffix and derives from `sort_order` alone.

## Risks / Trade-offs

- **[Backend must be up at build]** → Mitigation: document the requirement; a failed build surfaces a `FetchError` clearly. No silent fallback to fixtures (they are deleted).
- **[Data frozen at build]** → Mitigation: rebuild/CI deploy to refresh; acceptable for a gallery site. Flagged as a known trade-off of the chosen strategy.
- **[>100 rows pagination]** → Mitigation: `fetchAll` follows `next` up to `total_pages`.
- **[Media URLs baked from `HOST`]** → The API's `get_media_url` returns `settings.HOST + url`; if the dashboard's `HOST` env is wrong (`http://enredarte.localhost` in `.env.dev`), absolute image URLs baked into pages will be broken. Mitigation: correct `HOST` to the dashboard's public URL before build.
- **[Missing translations]** → `pickTranslation` falls back to the other language, then empty string; taxonomy labels fall back to slug.

## Migration Plan

1. Add `API_BASE_URL` and `API_TOKEN` to the landing `.env` (server-only), and confirm a DRF token exists on the backend.
2. Add the API layer (`types.ts`, `client.ts` `apiFetch`, `pagination.ts`, 10 endpoint modules, `data/api.ts`).
3. Rewire `getStaticPaths` + `Home`/`GalleryPage` to consume API data via props; delete `data/catalog.ts` and `data/galleries.ts`.
4. Update the store (`matchesArtwork`/`ArtworkFacets`/`computeViableOptions`) and components (`Artworks`, `Filters`, `ImageRowCard`, `CuratorCard`, `ImageCard`, `ImageBanner`) to array facets + translation dicts.
5. Verify `pnpm build` succeeds against the running backend and that gallery routes are generated.

## Open Questions

- **Featured artwork selection**: `GalleryPage` currently treats the first artwork as the featured banner. Decide whether to keep "first in `artwork_links` order" or drive it from `images[].is_primary` / `artwork.is_highlighted`. (Default assumed: first in `artwork_links` order.)
