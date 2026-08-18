## 1. API types

- [x] 1.1 Rewrite `src/lib/api/types.ts` with API-faithful types: `Lang`, `Base`, `Ref`, `Translations<T>`, `Paginated<T>`, `ApiError`, and the 10 resource interfaces (`Artist`, `ArtCurator`, `Location`, `Gallery`, `Discipline`, `Technique`, `Theme`, `Format`, `Scale`, `Artwork`), including `price_mxn`/`price_usd` as `number` and nullable `email`/`website`/`photo`/`logo`/`curator`/`location`

## 2. Fetch client + endpoint modules

- [x] 2.1 Add `apiFetch<T>(path, init?)` to `src/lib/api/client.ts` that prepends `process.env.API_BASE_URL`, injects `Authorization: Token <process.env.API_TOKEN>`, and delegates to `safeFetch`
- [x] 2.2 Add `src/lib/api/pagination.ts` with `fetchAll<T>(list, opts)` that follows `next`/`total_pages` and flattens `results`
- [x] 2.3 Create endpoint modules for `artists`, `art-curators`, `locations`, `galleries`, `disciplines`, `techniques`, `themes`, `formats`, `scales`, `artworks`, each exporting `list` and `detail`

## 3. Build-time data orchestration

- [x] 3.1 Create `src/data/api.ts` that fetches all galleries, artists, art-curators, five taxonomies, and all artworks (via `fetchAll`), derives localized filter groups, and builds a gallery→artworks map plus slug-keyed curator/artist lookups (resolving `gallery.curator` refs to full `ArtCurator` objects and `artwork.artist` refs to display names)
- [x] 3.2 Add `pickTranslation(translations, lang, field)` helper to `src/lib/i18n/utils.ts` with es/en fallback

## 4. Environment config

- [x] 4.1 Add server-only `API_BASE_URL` and `API_TOKEN` to `.env` (and document in `.env.example` without real values)

## 5. Rewire pages

- [x] 5.1 Update `src/pages/[...path].astro` `getStaticPaths` to fetch galleries from the API and generate `/salas/<slug>` routes; thread the fetched dataset through props
- [x] 5.2 Update `Home.astro` to consume API data via props: galleries for the salas section, artworks + derived filter groups for the collection, array-valued facets
- [x] 5.3 Update `GalleryPage.astro` to consume API data: gallery hero/curator from translations, artworks resolved from `artwork_links`, eyebrow from `sort_order` only, array-valued facets

## 6. Delete fixtures

- [x] 6.1 Delete `src/data/catalog.ts` and `src/data/galleries.ts`, and remove now-unused `src/lib/api/constants.ts` if nothing references it

## 7. Store + components for array facets and translation dicts

- [x] 7.1 Update `src/store/catalog.ts`: `ArtworkFacets` → `Record<GroupKey, string[]>`; `matchesArtwork` uses array membership (any selected value present)
- [x] 7.2 Update `Artworks.tsx` to parse space-separated `data-*` facet attributes into arrays before matching
- [x] 7.3 Update `ImageRowCard.astro`, `CuratorCard.astro`, `ImageCard.astro`, `ImageBanner.astro` to read translation dicts (via `pickTranslation`) and array facets, and stamp space-separated `data-*` attributes

## 8. Verification + docs

- [x] 8.1 Run `pnpm build` against the running backend; confirm `/salas/<slug>` routes are generated and no fixtures are referenced
- [x] 8.2 Update `docs/component-dependencies.md` to reflect the new `src/lib/api/*` modules and the removal of `data/catalog.ts`/`data/galleries.ts`
- [x] 8.3 Update `openspec/specs/gallery-data/spec.md`-adjacent docs if any cross-references still mention fixture data
