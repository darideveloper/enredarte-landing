## 1. Artworks limit prop

- [x] 1.1 Add optional `limit?: number` to `ArtworksProps` and extend the matching pass to collect matches in DOM order, show `slice(-limit)`, hide the rest; base the empty-state flag on match count (>0), not visible count (`src/components/organisms/Artworks.tsx`)
- [x] 1.2 Verify uncapped behavior unchanged (no `limit`: all matches visible, empty-state only on zero matches) and loading overlay still gates visibility changes

## 2. Landing capped preview

- [x] 2.1 Add `LANDING_LIMIT = 12` constant (3 full rows at `lg:4`) and pass the full artwork catalog with `limit={LANDING_LIMIT}` in `Home.astro` (preserve `siteData.artworks` order — no re-sorting, no child slicing; keep price + all six `data-*` facets)
- [x] 2.2 Verify landing: unfiltered shows last 12 in API order; filtered shows last 12 matches; overflow resolves via the existing "Ver todas" CTA; empty-state + reset unchanged

## 3. Obras interactive catalog

- [x] 3.1 Build `localizedGroups` (all 6 groups) + `facets` from `siteData` in `CollectionIndex.astro` for `pageKey === "obras"` (mirror `Home.astro`, preserve `siteData.artworks` order — no re-sorting — so tail semantics hold)
- [x] 3.2 Render `Filters` + `Artworks` (no `limit`, default grid) with `ImageCard` children carrying per-lang `price` (`pickPrice`/`formatPrice`/`currencyForLang`) and all six `data-*` facets, with localized loading/empty/reset labels
- [x] 3.3 Keep `salas` / `artistas` / `curadores` branches on the existing static grid; verify no prop or import regressions there
- [x] 3.4 Verify `/obras` + `/en/obras`: all visible by default; filters narrow correctly; card hrefs reach artwork detail; selections set on landing carry over (persisted store, no reset)

## 4. Docs and verification

- [x] 4.1 Update `docs/component-dependencies.md` (Home tree: `limit` + full-catalog children; new CollectionIndex-obras tree; Notes on cap semantics and carry-over)
- [x] 4.2 Run typecheck/lint and full `astro build`; smoke-test landing, `/obras`, and `/en/obras` (filters, empty-state reset, language switch)
