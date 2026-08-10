## Why

When the "Colección completa" filters produce zero matching artworks, the section silently collapses to an empty grid with no feedback. Filter viability already prevents zero-result states from any sequence of clicks on enabled chips, but stale persisted selections (`enredarte-catalog-storage`) can reference slugs that no longer exist in the catalog — and in that case the offending chip may not even render, leaving the user with no visible way to deselect. The user is stuck with an empty section and no escape.

## What Changes

- Add a `reset()` action to the catalog store (`src/store/catalog.ts`) that clears all filter selections back to empty. It mirrors the existing `toggle()` loader pattern: sets `isLoading` to `true`, then clears it after the same simulated ~400 ms delay. It clears selections only — the `isExpanded` flag is untouched. The action is exposed through the shared `useCatalog` hook.
- Detect a zero-result grid inside the `Artworks` organism (`src/components/organisms/Artworks.tsx`): when no card remains visible and the loader is idle, render a centered empty-state block in place of the collapsed grid.
- The empty state shows a localized message ("no artworks match your filters") and a "restart filters" button that invokes the store's `reset()`, restoring the full grid.
- Add localized strings (`noResults` message + `reset` label) to `es.json` / `en.json` under `global.filters.*`, flowing into the `Artworks` island as props via the existing `loadingLabel`-style pattern from `Home.astro`.
- Update `docs/component-dependencies.md` to reflect the new store action and island props.

## Capabilities

### New Capabilities
- `catalog-empty-state`: Defines the zero-result UI for the "Colección completa" grid — a localized message plus a reset-filters control rendered inside the `Artworks` organism when no artwork matches, and the conditions under which it appears (no visible cards, loader idle). The reset control restores the full collection.

### Modified Capabilities
- `catalog-filter-store`: Adds the `reset()` action requirement to the existing store spec — the store must support clearing all selections in one action, toggling the simulated loading state like `toggle()`, leaving `isExpanded` unchanged, and exposing the action through the shared hook.

## Impact

- `src/store/catalog.ts` — new `reset()` action + `useCatalog` exposure; state shape unchanged.
- `src/components/organisms/Artworks.tsx` — zero-result detection + inline empty-state block.
- `src/components/pages/landing/Home.astro` — passes two new localized props to `<Artworks>`.
- `src/messages/es.json`, `src/messages/en.json` — new `global.filters.*` strings (validated by `validate-i18n` at build).
- `docs/component-dependencies.md` — dependency map update.
- No new dependencies; no API changes; `src/data/catalog.ts` fixtures untouched.
