## Context

The "Colección completa" section renders six filter groups as full rows via `src/components/molecules/Filters.tsx` (React island, `client:load`), each row a label plus horizontally scrollable `FilterBtn` chips. All interactive state lives in `src/store/catalog.ts` — a Zustand store with `persist` + `partialize` (persisting only `selections`) under key `enredarte-catalog-storage`. The project follows an atomic component hierarchy (store-bound atoms such as `FilterBtn`), cross-island state via a shared store hook, and i18n resolved server-side in `Home.astro` with already-localized props flowing to islands (the `loadingLabel` pattern).

## Goals / Non-Goals

**Goals:**
- Collapsed-by-default filter panel showing only the first group.
- Expand/collapse control whose state is persisted via the existing catalog store.
- Preserve all filtering behavior, selections, and the loader.

**Non-Goals:**
- No changes to `matchesArtwork`, multi-select semantics, or `Artworks`.
- No per-group independent collapse, no animation, no "clear all" control.
- No change to filter labels (they stay in `src/data/catalog.ts`); the only copy added is the toggle label in `messages/*.json`.

## Decisions

### D1. Persisted `isExpanded` in the catalog store
Add `isExpanded: boolean` (default `false`) and `toggleExpanded: () => void` to the `CatalogStore` interface in `src/store/catalog.ts`. Extend `partialize` to `(state) => ({ selections: state.selections, isExpanded: state.isExpanded })`. zustand's persist merge (`{ ...initial, ...persisted }`) guarantees older stored data (selections-only) rehydrates with `isExpanded: false`.
- **Why**: the store already owns "all filter state for the section" and its persistence; one boolean doesn't warrant a second store, and persistence gives the requested "remember user preference" behavior for free.
- **Alternative considered**: a separate `catalog-ui` store — rejected (over-engineering, YAGNI); local React state in `Filters` — rejected (must persist across sessions and be shared with the store-bound toggle atom).

### D2. Conditional rendering in `Filters.tsx`
Render `groups.slice(0, 1)` always; render `groups.slice(1)` only when `isExpanded`; render the toggle when `groups.length > 1`. Hidden rows are unmounted, so their chips are not focusable and no layout/animation machinery is needed.
- **Why**: simplest correct collapse; conditional rendering avoids tab-focusable hidden content and avoids CSS transition complexity.
- **Alternative considered**: CSS max-height + gradient-fade collapse — rejected (rows stay in tab order; no animation is required).

### D3. `atoms/FilterToggle.tsx` store-bound atom
New atom mirroring `FilterBtn`: reads `isExpanded` and `toggleExpanded` from the catalog store, renders a `label` prop, and exposes `aria-expanded={isExpanded}` plus `aria-controls` pointing at the panel region. The `Filters` molecule wraps its rows in an element with that `id` (`catalog-filters`).
- **Why**: matches the established store-bound atom pattern and keeps the design-system page able to showcase it like `FilterBtn`.
- **Alternative considered**: inline button inside `Filters.tsx` — rejected (breaks the atomic pattern and is inconsistent with how `FilterBtn` is showcased).

### D4. Toggle labels via the Astro boundary
Add `global.filters.more` / `global.filters.less` to `src/messages/es.json` ("Ver más filtros" / "Ver menos filtros") and `en.json` ("Show more filters" / "Show fewer filters"). Both `Home.astro` and `design-system.astro` pass the localized strings as required props (`expandLabel` / `collapseLabel`) to `<Filters>`.
- **Why**: mirrors the existing server-localizes pattern (like `loadingLabel`); keeps the island free of i18n bundle imports.
- **Alternative considered**: island importing `messages/*.json` directly — rejected (couples the client to i18n bundles, breaks convention).

## Risks / Trade-offs

- [Persisted expanded state could surprise users on return] → Mitigation: default is collapsed (the requested behavior); persistence is the explicit requirement.
- [Collapsing hides groups with active selections, which may read as results disappearing] → Mitigation: selections are preserved and still applied; this is standard faceted-filter UX.
- [`design-system.astro` renders `Filters` without label props today] → Mitigation: labels become required props; both call sites are updated in the same change.
- [zustand persist merge with older stored data] → Mitigation: documented merge behavior guarantees `isExpanded` falls back to `false`.
- [Persisted `isExpanded` is shared with the design-system page] → Mitigation: `design-system.astro` renders the same `Filters` island bound to the same `enredarte-catalog-storage` store, so toggling expand on the showcase page also flips the persisted preference for the landing page. This is pre-existing for `selections`; accepted for consistency, noted here so it isn't mistaken for a bug.
- [Rehydration flash for persisted-expanded users] → Mitigation: SSR renders collapsed (initial `isExpanded: false`); on the client the store hydrates before the `client:load` island subscribes, so a user who left the panel expanded may see a brief collapsed frame. Same behavior already exists for `selections`; low impact.

## Migration Plan

1. Extend `src/store/catalog.ts` (state, action, `partialize`, hook) — additive.
2. Add `src/components/atoms/FilterToggle.tsx` — additive.
3. Update `src/components/molecules/Filters.tsx` (conditional rows, `aria-controls` region, toggle, required label props).
4. Add message keys; update `Home.astro` and `design-system.astro` to pass labels.
5. Update `docs/component-dependencies.md` (new atom, changed props).
6. Run `pnpm run build` (runs `validate-i18n` + `validate-imports`) and verify visually.

**Rollback**: revert the modified files; the new atom file can be deleted.

## Open Questions

- None blocking.
