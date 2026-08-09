## Why

The "Colección completa" faceted filters let the user combine selections across groups (artist, discipline, technique, theme, format, scale) with cross-group AND semantics, so many combinations produce **zero results** — e.g. `Álvaro Macias` + `Escultura`. Today every chip stays clickable regardless, so users can paint themselves into dead-end states where the grid silently empties. Standard commerce UX (Amazon, Zara) renders options that cannot possibly match as **disabled** (dimmed, non-interactive), guiding users away from empty results.

## What Changes

- **New pure availability predicate** in `src/store/catalog.ts`: given the current selections plus the artwork facet matrix, compute, for each option in each group, whether clicking it can still match **at least one** artwork. Viability of option `o` in group `g` is: *∃ artwork a: `matchesArtwork(a, selections with group g replaced by {o})`* — which keeps within-group OR semantics (sibling options in the same group never disable each other) and applies cross-group AND constraints.
- **`FilterBtn` gains a `disabled` variant**: dimmed, `cursor-not-allowed`, no hover transition, `disabled` + `aria-disabled`. A chip that is currently **active is never disabled** — even when other groups over-constrain to zero — so the user always retains a deselection path.
- **`Filters` derives per-chip disabled state**: a new `facets` prop (array of artwork facet matrices) flows from `Home.astro`; viability is recomputed with `useMemo` on `selections` and passed down to each chip.
- **`Home.astro` passes the facet matrix** to `<Filters client:load>` (server-rendered data, mirroring the existing `groups` prop pattern). No changes to the store's state shape, persistence, or the `Artworks` grid.
- **Architecture intent made explicit (confirmed)**: filtering and availability remain **pure client-side computations over the SSG-embedded catalog snapshot** (the SSR'd grid + slot pattern). The future catalog API only replaces `Home.astro`'s data source — `safeFetch` lives server-side at build/SSG time, not per-toggle. No server facet-counts protocol is introduced.

## Capabilities

### New Capabilities
- `catalog-filter-availability`: Given current multi-select selections and the artwork facet matrix, each filter option exposes an availability state (viable vs. non-viable) that drives a disabled visual state and prevents selection of options that would yield zero results, while never disabling currently-selected options.

### Modified Capabilities
<!-- No requirement-level changes to existing capabilities. The `catalog-filter-store` spec is unchanged: the store still holds state only, and the new predicate is a pure, exported function, not new store state. -->

## Impact

- **New files**: none.
- **Modified files**: `src/store/catalog.ts` (add pure `computeViableOptions` helper), `src/components/atoms/FilterBtn.tsx` (optional `disabled` prop + styles), `src/components/molecules/Filters.tsx` (`facets` prop + `useMemo` availability + pass `disabled`), `src/components/pages/landing/Home.astro` (pass facet matrix to `<Filters>`), `src/pages/design-system.astro` (showcase the disabled variant), `docs/component-dependencies.md`.
- **Reused as-is**: `matchesArtwork` predicate, `Artworks` organism (grid/loader untouched), catalog fixtures, all design tokens.
- **No new dependencies.**
- **i18n**: no new UI copy (disabled state is purely visual/semantic).
- **Performance**: viability over 6 groups × ~41 options × 16 artworks is O(n·m·k) ≈ ~4k operations per selection change — recomputation is trivial, no memoization concerns beyond the existing `useMemo`.
- **Non-goals**: no per-option result counts ("5"), no hiding of non-viable options (they stay visible but dimmed), no grid empty-state message — the residual silent-empty state reachable by cross-group over-constraint is an accepted trade-off, tracked as a follow-up (see design.md risks), no removal of the simulated loader, no server-side facet counts protocol.
