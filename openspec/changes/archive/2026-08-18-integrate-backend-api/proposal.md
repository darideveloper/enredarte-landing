## Why

The landing site currently renders every gallery, curator, and artwork from hardcoded fixtures in `src/data/catalog.ts` and `src/data/galleries.ts`, while the backend already exposes a read-only DRF API (`/apis/artworks/…`) with the authoritative data. The fixtures drift from reality and the existing `src/lib/api/types.ts` does not match the backend contract (translations are modeled as arrays instead of language-keyed dictionaries, and gallery `status` is invented). This change wires the site to the backend so pages render real data.

## What Changes

- **BREAKING** Replace the static gallery/curator fixtures (`src/data/galleries.ts`) and artwork/filter fixtures (`src/data/catalog.ts`) with data fetched from the DRF API at build time.
- Add a typed API integration layer in `src/lib/api/` that mirrors all 10 backend resources (`artists`, `art-curators`, `locations`, `galleries`, `disciplines`, `techniques`, `themes`, `formats`, `scales`, `artworks`), each with `list` and `detail` functions, plus the paginated-list envelope and error envelope types.
- Fetch data during `astro build` (SSG) using a server-only DRF token (`process.env.API_TOKEN`, never `PUBLIC_*`); `getStaticPaths` reads galleries from the API to generate `/salas/<slug>` routes.
- Update `Home.astro`, `GalleryPage.astro`, and the filter store to consume API shapes: translation dictionaries (`{ es, en }`), `{ id, slug }` relations, and array-valued facets (an artwork has multiple disciplines/techniques/etc.).
- **BREAKING** Remove the gallery `status` (`active` | `upcoming`) concept; the backend returns only active galleries, so the "Próximamente" state is dropped.

## Capabilities

### New Capabilities
- `api-client`: The typed API integration layer — API-faithful TypeScript types for all 10 DRF resources plus the pagination and error envelopes, a token-injecting fetch client, one endpoint module per resource (`list` + `detail`), and a `fetchAll` helper that follows pagination.

### Modified Capabilities
- `gallery-data`: Data source changes from static fixtures to build-time API fetch; `Gallery`/`ArtCurator` types become API-faithful (translation dictionaries, `{id,slug}` refs, no `status`).
- `catalog-filter-store`: The artwork-filtering predicate changes from single-string facet values to arrays, so an artwork with multiple disciplines/techniques matches any selected value.
- `artworks-organism`: `data-*` facet attributes on cards change from single values to multiple values per facet.
- `gallery-detail-page`: Data comes from the API; the eyebrow derives from `sortOrder` only (no `status`).
- `homepage-gallery`: Card subtitle derives from `sortOrder` only (no `status`).

## Impact

- **Data layer**: delete `src/data/catalog.ts` and `src/data/galleries.ts`; add `src/lib/api/<resource>.ts` endpoint modules, `src/lib/api/types.ts` (rewritten), `src/lib/api/client.ts` (`apiFetch`), `src/lib/api/pagination.ts`, and `src/data/api.ts` (build-time orchestration).
- **Pages**: `src/pages/[...path].astro` (`getStaticPaths` fetches galleries), `src/components/pages/landing/Home.astro`, `src/components/pages/sala/GalleryPage.astro`.
- **Components**: `Artworks.tsx`, `Filters.tsx` (facets as arrays), `ImageRowCard.astro`, `CuratorCard.astro`, `ImageCard.astro`, `ImageBanner.astro` (translation dicts + refs).
- **Store**: `src/store/catalog.ts` (`matchesArtwork`, `computeViableOptions`, `ArtworkFacets`).
- **i18n**: `src/lib/i18n/utils.ts` gains a translation-picking helper.
- **Env**: new server-only `API_BASE_URL` and `API_TOKEN` in `.env`.
- **Backend dependency**: the DRF API must be reachable during `astro build`; `HOST` in the dashboard env must resolve media URLs correctly.
