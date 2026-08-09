## Why

The "Colección completa" section stacks all six filter groups (artist, discipline, technique, theme, format, scale) as full rows, consuming a large block of vertical space above the artwork grid and pushing the collection below the fold. We want a collapsible filter panel that shows only the first group by default, reveals the rest on demand via an expand/collapse control, and remembers the user's preference across visits through the existing persisted catalog store.

## What Changes

- **Catalog store gains a persisted expanded flag**: `src/store/catalog.ts` adds `isExpanded: boolean` (default `false`) and a `toggleExpanded` action. `partialize` now persists both `selections` and `isExpanded` under the existing `enredarte-catalog-storage` key. Backward-compatible with already-stored data (missing key merges to `false`).
- **`Filters` collapses by default**: renders `groups[0]` always; renders `groups.slice(1)` only when expanded. A toggle control appears after the rows only when `groups.length > 1`.
- **New atom `atoms/FilterToggle.tsx`**: a store-bound toggle button (mirrors `FilterBtn`) reading `isExpanded` + `toggleExpanded`, with `aria-expanded` + `aria-controls`. Receives localized labels as props.
- **i18n**: new bilingual keys `global.filters.more` / `global.filters.less` in `messages/es.json` ("Ver más filtros" / "Ver menos filtros") and `messages/en.json` ("Show more filters" / "Show fewer filters"). `Home.astro` passes them to `<Filters>` as props (existing server-localizes pattern, like `loadingLabel`).
- **Call sites updated**: `Home.astro` and `design-system.astro` pass the two label props; `docs/component-dependencies.md` updated.
- **No filtering-logic changes**: `matchesArtwork`, multi-select, OR-within/AND-across behavior, and the loader are untouched.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `catalog-filter-store`: store now also owns a persisted `isExpanded` flag and a `toggleExpanded` action; `partialize` includes `isExpanded` alongside `selections`.
- `filters-molecule`: `Filters` renders only the first group by default and exposes an expand/collapse toggle control bound to the store.

## Impact

- **New files**: `src/components/atoms/FilterToggle.tsx`
- **Modified files**: `src/store/catalog.ts`, `src/components/molecules/Filters.tsx`, `src/components/pages/landing/Home.astro`, `src/pages/design-system.astro`, `src/messages/es.json`, `src/messages/en.json`, `docs/component-dependencies.md`
- **Reused as-is**: `FilterBtn`, `Artworks`, `ImageCard`, `cn` util, design tokens, zustand/persist (already installed).
- **No new dependencies. No removed files.**
