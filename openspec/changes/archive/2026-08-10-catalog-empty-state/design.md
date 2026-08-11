## Context

The "Colección completa" section (`Home.astro`) is SSG-rendered: `Home.astro` imports fixture data from `src/data/catalog.ts`, renders the full `Artworks` grid as pre-hydration `ImageCard.astro` slot children stamped with `data-*` facet attributes, and hydrates two React islands — `Filters` (`src/components/molecules/Filters.tsx`) and `Artworks` (`src/components/organisms/Artworks.tsx`). All filter state lives in the dedicated persisted Zustand store (`src/store/catalog.ts`) — `selections`, `isLoading`, `isExpanded`, plus `toggle`, `toggleExpanded`, `matchesArtwork`, and `computeViableOptions`. Filtering is purely client-side over the embedded snapshot.

Today, when the filters match zero artworks, `Artworks` hides every card via `card.hidden = !matchesArtwork(...)` and the grid collapses to zero height — the section renders as a silent void. The archived `catalog-filter-availability` change made chip viability prevent zero-result states from any sequence of clicks on enabled chips, but explicitly tracked the empty-state message as a follow-up (its design.md Open Questions). Two real paths still reach zero results:

1. **Stale persisted selections** — `enredarte-catalog-storage` persists selections in localStorage. If catalog data changes (or a real API lands and the snapshot differs), saved selections can reference slugs that exist in no artwork → zero matches on load.
2. **Invisible active chips** — worse, in case 1 the offending slug may not render as a chip at all (chips come from `filterGroups`, not from selections), so the user has **no visible active chip to deselect**. A "restart filters" control is the only escape.

## Goals / Non-Goals

**Goals:**
- Render a localized empty-state block inside `Artworks` whenever zero cards are visible and the loader is idle.
- Provide a "restart filters" button that clears all selections in one action and restores the full grid.
- Add a `reset()` action to the catalog store that mirrors the existing `toggle()` loader semantics (set `isLoading: true`, clear after ~400 ms), scoped to `selections` only.
- Flow localized strings (`empty` message + reset label) into the `Artworks` island as props from `Home.astro`, following the existing `loadingLabel` pattern.
- Keep the change additive: no changes to `matchesArtwork`, `computeViableOptions`, `ImageCard`, fixture data, or the store's state shape/persistence contract.

**Non-Goals:**
- Per-option result counts ("5") — deferred, unchanged from the availability change.
- Changing or re-timing the simulated loader.
- Hiding non-viable chips or altering chip availability semantics.
- Resetting `isExpanded` when filters reset — the panel expansion preference is independent of filter selections.
- Server-side empty-state signaling — the API story remains "fetch full snapshot at build/server time, filter client-side".
- Refactoring the DOM-scan filtering approach inside `Artworks`.

## Decisions

### D1. Empty-state detection lives in `Artworks`, derived from the grid DOM
`Artworks` already scans `[data-artist]` cards in its `useEffect` to toggle visibility. That same effect counts cards that remain visible; when the count reaches zero and `isLoading` is false, the component renders the empty-state block. The block is a real grid-flow element (with vertical padding/min-height), not an `absolute inset-0` overlay — the loader overlay only works because the grid still occupies height while cards are present, whereas an empty grid collapses to zero height.
- **Why**: Colocates detection with the exact rendering that produces the empty state; no new props or store machinery needed for counting; consistent with the existing DOM-based filtering approach.
- **Alternatives considered**: (a) `Artworks` computing matches from a passed-in `facets` prop — rejected: it would duplicate data already on the DOM and diverge from the established card-scan pattern; (b) a derived store selector — rejected: the store holds state only, and the grid is the source of truth for what's visible.

### D2. New `reset()` store action mirroring `toggle()`
`src/store/catalog.ts` gains `reset()`: set `selections` to the existing `EMPTY_SELECTIONS` and `isLoading: true`, then `setTimeout(() => set({ isLoading: false }), 400)` — byte-for-byte the same timing mechanism as `toggle()`. `isExpanded` is untouched. Exposed through the shared `useCatalog` hook.
- **Why**: Identical loading UX to a chip click (no jarring instant repaint); the state-only store already owns `isLoading`; reuses existing machinery with zero new patterns. `EMPTY_SELECTIONS` already exists as the canonical empty shape.
- **Alternatives considered**: (a) reset without loader flash — rejected by decision (loader consistency); (b) also resetting `isExpanded` — rejected (out of scope, non-goal).

### D3. Reset control and message are inline JSX in `Artworks`, styled to match the collection
The empty state is a small centered block — muted uppercase message text and an outline button reusing the `FilterToggle`/`FilterBtn` visual language (`border-border-theme text-muted`, crimson hover). The button calls `useCatalogStore(state => state.reset)`.
- **Why**: A one-off message + button doesn't warrant a new atom in the atomic hierarchy; the inline loading overlay already establishes the "inline UI in `Artworks`" precedent. Reusing the filter-chip styling keeps it visually part of the collection, not a foreign component.
- **Alternatives considered**: a new `atoms/EmptyState.tsx` — rejected (YAGNI; single consumer; the design-system page demos the island by props, and the empty state only manifests under filtering).

### D4. Localized strings flow as props from `Home.astro`
`Home.astro` passes `emptyLabel` and `resetLabel` to `<Artworks client:load>`, sourced from `t("global.filters.noResults")` and `t("global.filters.reset")` added to both `es.json` and `en.json`. This mirrors the existing `loadingLabel` prop pattern and keeps the island i18n-agnostic.
- **Why**: Established pattern (the `loadingLabel` precedent); keeps translations server-side/SSR-resolved; `validate-i18n` at build enforces key parity between languages.
- **Alternatives considered**: reading translations inside the React island — rejected: no island-side i18n machinery exists and the established pattern is server-resolved props.

### D5. Empty state is a defensive escape hatch, not a primary flow
Because chip viability already prevents zero-result states during normal clicking, the empty state will rarely appear in practice. Its primary purpose is the stale-persisted-selections case where the user has no other way out. The reset button therefore must always be reachable — it must render even when the culprit selections aren't represented by any chip.
- **Why**: This is the gap the availability change explicitly deferred; the feature's value is robustness and recoverability, and it will matter more once a real catalog API replaces the fixtures.
- **Alternatives considered**: relying on manual chip deselection — rejected (impossible when the active chip isn't rendered).

## Risks / Trade-offs

- [Persisted selections may reference slugs absent from the catalog → chips for those slugs don't render, so the user can't deselect manually] → Mitigation: the reset button (D2/D3) is the guaranteed escape and is always available from the empty state.
- [SSR pre-hydration flash: with stale persisted selections, the SSG-rendered grid is fully visible until the island hydrates, hides cards, and shows the empty state] → Mitigation: pre-existing island behavior (all client-side filtering works this way), unchanged by this feature; the empty state appears as soon as the hydration effect runs.
- [Counting visible cards in the `useEffect` adds a state write per filter change] → Mitigation: trivial cost (one boolean/state set per effect run, over ≤16 cards); no perf concern at this scale.
- [Empty state flashes during the 400 ms loader window when the previous state was also empty] → Mitigation: gated on `!isLoading`, so the block only appears once the loader overlay clears; matches the loading overlay's own gating.
- [Reset triggers the loader, so a quick reset→reload could briefly show the empty state if persisted stale selections remain] → Mitigation: `reset()` overwrites persisted selections immediately on write; the empty state re-evaluates on the new (empty) selections and disappears synchronously with the loader's overlay.
- [A new `reset` action increases store surface area] → Mitigation: minimal and symmetric with the existing `toggle`/`toggleExpanded` actions; no shape or persistence changes.

## Migration Plan

1. Add `reset` to the `CatalogStore` interface, its implementation, and the `useCatalog` hook in `src/store/catalog.ts` (additive).
2. Add empty-state rendering + zero-card counting to `src/components/organisms/Artworks.tsx` (new props `emptyLabel`, `resetLabel`; `useEffect` gains a visible-count state; conditional block).
3. Add `global.filters.noResults` and `global.filters.reset` to `src/messages/es.json` and `en.json`.
4. Pass `emptyLabel`/`resetLabel` from `Home.astro` to `<Artworks>`.
5. Update `docs/component-dependencies.md` (new store action + island props in the Notes/Interactive collection section).
6. Run `pnpm run build` (runs `validate-i18n` + `validate-imports`) and verify.

**Rollback**: revert the five source/translation edits (`store/catalog.ts`, `Artworks.tsx`, `Home.astro`, `es.json`, `en.json`); the docs change is non-functional and can remain.

## Open Questions

- Whether to also surface a count of matching artworks alongside the empty message or in the normal grid — deferred, non-goal.
- Whether the reset button should also appear in a non-empty state (as a general "clear all filters") — currently out of scope; the empty state is the only required surface.
