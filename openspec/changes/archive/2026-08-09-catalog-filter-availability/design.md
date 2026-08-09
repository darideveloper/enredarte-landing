## Context

The "Colección completa" section (landing `Home.astro`) is SSG-rendered: `Home.astro` imports fixture data from `src/data/catalog.ts`, renders the full `Artworks` grid as pre-hydration Astro `ImageCard` slot children (stamped with `data-*` facet attributes), and hydrates two React islands — `Filters` (`src/components/molecules/Filters.tsx`) and `Artworks` (`src/components/organisms/Artworks.tsx`). All filter state lives in a dedicated Zustand store (`src/store/catalog.ts`, persisted, state-only), and matching runs client-side via the pure `matchesArtwork(facets, selections)` predicate: within a group OR, across groups AND, empty group matches all. There is no real API; `src/lib/api/client.ts` (`safeFetch`) is orphaned. The archived `interactive-collection-filters` change (D5) established that when an API lands, only `Home.astro`'s data source changes — islands and store shape stay identical.

Today every chip is always clickable, so cross-group combinations routinely produce zero-result states (e.g. `alvaro-macias` + `escultura`), silently emptying the grid. This change adds **faceted availability**: options that cannot match are dimmed and non-interactive.

## Goals / Non-Goals

**Goals:**
- Compute, for every option in every group, whether it can still match ≥1 artwork under the current selections.
- Render non-viable options as disabled (dimmed, non-interactive, `aria-disabled`), while **never disabling currently-active chips** (deselection path preserved).
- Keep the computation pure, client-side, and derived — no new store state, no API calls.
- Pass artwork facet data to the `Filters` island from `Home.astro`, mirroring the existing `groups` prop pattern.
- Maintain within-group OR semantics: sibling options in the same group never disable each other.
- No changes to `Artworks`, the store's state shape, persistence, the simulated loader, or `ImageCard`.

**Non-Goals:**
- Per-option result counts ("5") — same computation, deliberately deferred.
- Hiding non-viable options — they stay visible but dimmed.
- Grid empty-state message — a pre-existing gap tracked separately.
- Removing or re-timing the simulated 400ms loader.
- Server-side facet counts protocol — the API story stays "fetch the full snapshot at build/server time, filter client-side".
- Changes to the `catalog-filter-store` capability requirements.

## Decisions

### D1. Availability is a pure client-side computation over the SSG snapshot (Model 1 confirmed)
Viability is derived exclusively from (a) the current selections and (b) the artwork facet matrix embedded in the page — no network involved. This locks in the static-snapshot model: the future catalog API replaces `Home.astro`'s data source (build/SSG time, via `safeFetch`), never per-toggle. No server facet-counts payload is designed. This model was raised in the proposal review (the "is this right for SSG/API?" question) and is the confirmed architecture commitment — per-toggle server faceting is explicitly out of scope.
- **Why**: The section already SSRs the full collection and filters via the store + DOM; viability is the same shape of data, so it belongs beside `matchesArtwork`. A per-toggle fetch model would break the slot pattern and require a server facet-counts protocol — unjustified for a ~16-item landing collection.
- **Alternative considered**: Availability computed from the grid DOM (`Artworks` scrapes `[data-artist]` cards → store) — rejected: cross-island timing coupling and couples `Filters` to `Artworks`' internals.

### D2. Facet matrix flows in as a prop from `Home.astro`
`Home.astro` passes a compact facet matrix to `<Filters client:load facets={...} />`: an array of `ArtworkFacets` (`{ artist, discipline, technique, theme, format, scale }` slugs) derived from `artworks` — no `src`/`alt`/`title`/`href`/`meta`/`curator` serialization. `Filters` uses it for viability only.
- **Why**: Mirrors D5's established boundary (islands receive data as props from Astro); deterministic at hydration time (no ordering races); keeps `ArtworkFacets` (already exported by the store) as the shared shape. When the API lands, the same array flows from the fetched snapshot with zero island changes.
- **Alternatives considered**: (a) DOM scraping via the `Artworks` island — rejected (see D1); (b) hydrating the matrix into the store (`hydrateArtworks`) — rejected, violates the store-holds-state-only rule and adds a hydration action for data that is naturally a prop.

### D3. New pure helper `computeViableOptions` in `src/store/catalog.ts`
Exported pure function alongside `matchesArtwork`:

```
computeViableOptions(
  groups: { key: GroupKey; options: { value: string }[] }[],
  facets: ArtworkFacets[],
  selections: Record<GroupKey, string[]>,
): Map<GroupKey, Set<string>>
```

viable(`o` ∈ `g`) ⇔ `∃ a ∈ facets: matchesArtwork(a, { ...selections, [g]: [o] })`. The result maps each group to the set of viable option values.
- **Why**: Colocates pure filtering logic with the existing predicate (same module, same `GroupKey` import); keeps the store **state-only** (a pure function is not state); trivially unit-testable.
- **Alternatives considered**: new `src/lib/catalog.ts` — rejected (YAGNI; the store module already hosts `matchesArtwork`); helper in `src/data/catalog.ts` — rejected (splits predicate logic from `matchesArtwork`).

### D4. Viability semantics: replace the group's selections, don't union
Viability of option `o` in group `g` evaluates `selections` with `g` **replaced by `{o}`** — ignoring `g`'s own current selections. This is what makes within-group OR safe: adding a sibling option only ever expands results, so no option in `g` disables another. Cross-group AND constraints (the only source of disables) fall out of `matchesArtwork` unchanged. Over-constrained states (zero matches from other groups) disable all non-active options — the escape hatch is the active chips, which stay enabled (D5).
- **Why**: The naive "would clicking `o` produce ≥1 result" rule breaks under OR: it would disable all-but-one sibling, and it would disable everything (including active chips) once the current state over-constrains to zero. Replacing the group's own selections keeps siblings viable and isolates the disabled set to genuinely cross-group dead ends.
- **Alternative considered**: union semantics (`selections[g] ∪ {o}`) — rejected (would over-disable siblings and produce all-disabled states).

### D5. Chip semantics: `disabled` prop + never disable active chips
`FilterBtn` gains `disabled?: boolean`. When `disabled && !active`, the chip renders `opacity-40 cursor-not-allowed`, drops hover transitions, and sets the native `disabled` attribute plus `aria-disabled`. An **active** chip is never non-interactive (`disabled = disabled && !active`), so users can always deselect. Disabled chips do not call `toggle` (native `disabled` on a `<button>` already prevents activation; the existing click handler is left untouched).
- **Why**: Preserves the escape path out of dead-end states and matches commerce conventions; minimal change to the existing self-bound atom (active styling, `toggle` wiring, and drag-suppression logic are untouched).
- **Alternative considered**: hiding disabled chips entirely — rejected (non-goal; dimmed is gentler and matches the "label + chips" row layout).

### D6. Recompute via `useMemo` on `selections`
`Filters` computes `const viable = useMemo(() => computeViableOptions(groups, facets, selections), [groups, facets, selections])` and each `FilterRow`/`FilterBtn` receives `disabled={!viable.get(group.key)?.has(option.value)}`. O(6 groups × 41 options × 16 artworks) per change — recomputation cost is negligible; no incremental/indexing needed.
- **Why**: Simplest correct approach at this dataset size; `selections` from the store is already reactive, so chips update synchronously with the store (the simulated loader only affects the grid overlay, not the chips).
- **Alternative considered**: precomputed lookup + diffing, or a derived store selector — rejected (complexity for ~4k ops).

## Risks / Trade-offs

- [Viability data (facets) must be passed from Astro; if `Home.astro` stops passing it, chips lose disabled state] → Mitigation: `facets` is a required prop of `Filters`; TypeScript enforces it; the fixture source is the same `artworks` array already mapped in `Home.astro`.
- [Persisted selections may reference slugs absent from the current catalog → group non-empty yet no matching option renders] → Mitigation: pre-existing behavior, unchanged; viability simply has nothing to disable for absent slugs.
- [All-disabled state when other groups over-constrain to zero] → Mitigation: active chips are never disabled (D5), so the user always has a deselection path. The grid then shows an empty section — this residual silent-empty state is an **accepted trade-off**, explicitly out of scope; a localized empty-state message is a tracked follow-up (see Open Questions).
- [Current 16-artwork fixtures leave many options (e.g. `ilustracion`, `street-art`, `lapiz`, `carboncillo`, several themes, `series`, `objetos`) with zero artworks → those chips render disabled from the first, empty-selection load] → Mitigation: behaviorally correct and expected; verification task 6.2 checks the initial state explicitly; visual outcome depends on fixture coverage and will change when real catalog data lands.
- [Recomputing on every `selections` change could feel like work at larger catalog sizes] → Mitigation: ~4k ops now; if the catalog grows by orders of magnitude, switch to a derived per-group index — out of scope until then.
- [Disabled chips may confuse users ("why can't I click?") without a count or explanation] → Trade-off accepted: counts are a non-goal; dimmed+`cursor-not-allowed` is the universal affordance.

## Migration Plan

1. Add `computeViableOptions` to `src/store/catalog.ts` (additive, pure, exported).
2. Add `disabled` handling to `atoms/FilterBtn.tsx` (additive prop; existing behavior unchanged when prop is absent).
3. Extend `molecules/Filters.tsx` with the `facets` prop, the `useMemo`, and `disabled` wiring through `FilterRow` → `FilterBtn`.
4. Pass the facet matrix from `Home.astro` to `<Filters client:load facets={...} />`.
5. Update `design-system.astro` (show a disabled chip variant) and `docs/component-dependencies.md` (new prop/helper).
6. Run `pnpm run build` (runs `validate-i18n` + `validate-imports`) and visually verify.

**Rollback**: revert the five source-file edits (`src/store/catalog.ts`, `FilterBtn.tsx`, `Filters.tsx`, `Home.astro`, `design-system.astro`); the helper is additive, and the docs change is non-functional — both can remain.

## Open Questions

- Whether to surface per-option counts ("5") as a follow-up — deferred by non-goal.
- Whether to add a localized grid empty-state message for the accepted cross-group over-constraint trade-off (the grid would otherwise show an empty section) — tracked as a follow-up, not in this change.
