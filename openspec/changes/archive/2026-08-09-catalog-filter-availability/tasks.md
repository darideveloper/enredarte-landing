## 1. Store helper

- [x] 1.1 Add and export a pure `computeViableOptions(groups, facets, selections)` function in `src/store/catalog.ts` that returns `Map<GroupKey, Set<string>>` of viable option values per group, using `matchesArtwork` with the group's selections replaced by the candidate option
- [x] 1.2 Confirm the helper adds no new store state, no value imports from `@/data/catalog` (reuses the existing `GroupKey` type import), and exports a `GroupKey`-keyed return shape

## 2. FilterBtn disabled variant

- [x] 2.1 Add an optional `disabled?: boolean` prop to `atoms/FilterBtn.tsx`
- [x] 2.2 Render a disabled chip (non-viable AND not active) with dimmed styling (`opacity-40 cursor-not-allowed`), no hover classes, and the native `disabled` + `aria-disabled` attributes
- [x] 2.3 Ensure an active chip is never non-interactive (`disabled = disabled && !active`) and that the existing `toggle` click handler remains unchanged

## 3. Filters wiring

- [x] 3.1 Add a `facets: ArtworkFacets[]` prop to `molecules/Filters.tsx`
- [x] 3.2 Compute `viable = useMemo(() => computeViableOptions(groups, facets, selections), [groups, facets, selections])` reading `selections` from the catalog store
- [x] 3.3 Pass `disabled={!viable.get(group.key)?.has(option.value)}` from `FilterRow` to each `FilterBtn`, leaving scroll/wheel/drag behavior untouched

## 4. Home.astro data flow

- [x] 4.1 Derive a facet matrix (`{ artist, discipline, technique, theme, format, scale }`) from `artworks` and pass it to `<Filters client:load groups={...} facets={...} />` in `src/components/pages/landing/Home.astro`

## 5. Showcases and docs

- [x] 5.1 Add a disabled `FilterBtn` example to the showcase in `src/pages/design-system.astro`
- [x] 5.2 Update `docs/component-dependencies.md` for the new `facets` prop, `disabled` state, and `computeViableOptions` helper

## 6. Verification

- [x] 6.1 Run `pnpm run build` (runs `validate-i18n` + `validate-imports`) and confirm no type or import errors
- [x] 6.2 Visually verify in the browser: empty selections show options with zero artworks as disabled; selecting across groups disables cross-group dead ends; active chips stay clickable; clicking disabled chips never changes the grid
