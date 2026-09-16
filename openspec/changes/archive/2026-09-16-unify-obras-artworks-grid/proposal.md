## Why

The landing page and the `/obras` index show the same artworks through two different grids: landing uses the filterable `Artworks` + `Filters` islands (`lg:4`), while `/obras` renders a static `div` grid (`lg:3`) with no filters, no prices, and no facet data. Visitors who filter on landing and click "Ver todas las obras" land on a page that ignores their context, and any grid improvement must be built twice.

## What Changes

- `Artworks` organism gains an optional `limit?: number` prop implementing **filter-then-cap-tail**: match against store selections first, then show only the last `limit` matches in DOM (API) order; omitted `limit` shows all matches (current behavior).
- Landing (`Home.astro`) passes the full artwork catalog into `Artworks` with `limit={12}` (new `LANDING_LIMIT` constant, 3 full rows at `lg:4`), so filters search everything but the section stays a curated preview; the existing "Ver todas las obras" CTA absorbs the overflow (no count hint, no show-more button).
- `/obras` (`CollectionIndex.astro`, `pageKey === "obras"` only) renders the same `Filters` (all 6 groups) + `Artworks` (no limit, identical default `lg:4 / gap-[3px]` grid) + `ImageCard` cards with per-lang `price` and all six `data-*` facets — replacing its static grid.
- Filter selections (and panel expansion) carry over landing → `/obras` via the existing persisted `catalog` store (no reset); "all visible by default" is the no-selection state, not a forced reset.
- `salas` / `artistas` / `curadores` branches of `CollectionIndex` are untouched.

## Capabilities

### New Capabilities
- `obras-catalog`: Interactive filterable artworks catalog on the `/obras` index — full catalog, all 6 filter groups, prices, facet-stamped cards, empty/loading states, selection carry-over from landing.

### Modified Capabilities
- `artworks-organism`: Adds the optional `limit` prop with filter-then-cap-tail semantics and its use on landing (`limit=12`); uncapped behavior unchanged.
- `collection-index-pages`: The `obras` index renders the interactive catalog instead of a static card grid; routes, discovery links, and the other three indexes are unchanged.

## Impact

- Touched: `src/components/organisms/Artworks.tsx`, `src/components/pages/landing/Home.astro`, `src/components/pages/index/CollectionIndex.astro`, `docs/component-dependencies.md`.
- Untouched: `store/catalog.ts` (persist already gives carry-over), `Filters.tsx`, `ImageCard.astro`, `GalleryPage.astro`, `ArtistPage.astro`, all API/data layers (facets and prices already flow through `toArtworkView`).
- No new dependencies, no API changes, no URL changes. Follow-up parked: URL-synced filters (`/obras?artist=…`) for shareable/deep-linkable selections.
