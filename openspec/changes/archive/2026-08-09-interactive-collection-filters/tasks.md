## 1. Fixture Data Module

- [x] 1.1 Create `src/data/catalog.ts` exporting types (`FilterGroup`, `FilterOption`, `Artwork`) and the six fixture groups (artist 5, discipline 6, technique 7, theme 15, format 6, scale 2) as `{ slug, es, en }` entries, matching the slugs in the Fixture Data Reference (design.md)
- [x] 1.2 Extend/replace the artwork dataset with ~12–16 artworks (using existing `public/images/`) each tagged with facet slugs (`artist`, `discipline`, `technique`, `theme`, `format`, `scale`), keeping `src/alt/title/href/meta/curator` shape

## 2. Catalog Store

- [x] 2.1 Create `src/store/catalog.ts` with `GroupKey` type, `selections: Record<GroupKey, string[]>`, `isLoading`, and a `toggle(group, value)` action (OR within group, sets `isLoading`, ~400 ms simulated delay, clears `isLoading`). Store holds state only — no fixture groups or labels
- [x] 2.2 Wire `persist` middleware (`name: "enredarte-catalog-storage"`, `partialize` returning only `selections`) mirroring `form.ts`
- [x] 2.3 Export a shared hook (e.g. `useCatalog`) used by atoms/molecules to read selections and toggle
- [x] 2.4 Implement the pure matching predicate `matchesArtwork(artworkFacets, selections)` (OR within group, AND across groups, empty group matches all) and export it

## 3. React FilterBtn Atom

- [x] 3.1 Create `src/components/atoms/FilterBtn.tsx` — self-bound React atom reading active state from the catalog store and calling `toggle(group, value)` on click
- [x] 3.2 Apply the existing chip styling (active: `border-crimson text-ink bg-white`; inactive: `border-border-theme text-muted` hover states) using `cn` and `@/` aliases
- [x] 3.3 Delete `src/components/atoms/FilterBtn.astro`

## 4. React Filters Molecule

- [x] 4.1 Create `src/components/molecules/Filters.tsx` accepting a `groups` prop of localized facet definitions
- [x] 4.2 Render one facet row per group: fixed-width label (`shrink-0`) on the left, options in a `flex-1 flex gap-2 overflow-x-auto` container
- [x] 4.3 Hide the scrollbar via Tailwind arbitrary properties (`[scrollbar-width:none]` and `[&::-webkit-scrollbar]:hidden`)
- [x] 4.4 Render a `FilterBtn` per option
- [x] 4.5 Delete `src/components/molecules/Filters.astro`

## 5. React Artworks Organism

- [x] 5.1 Create `src/components/organisms/Artworks.tsx` — React island with `relative` grid wrapper (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[3px]`), `ref` on the grid div, rendering `{children}` (slot `ImageCard`s)
- [x] 5.2 Add `useEffect` (deps: `selections`, `isLoading`) that queries `[data-artist]` cards and toggles `hidden` based on `matchesArtwork` against card `dataset`, guarded by `if (isLoading) return`
- [x] 5.3 Add inline loader overlay (`absolute inset-0 bg-paper/80 z-10` + crimson spinner + localized `loadingLabel` prop) rendered when `isLoading`
- [x] 5.4 Delete `src/components/organisms/Artworks.astro`

## 6. Home.astro Integration

- [x] 6.1 Import fixtures from `src/data/catalog.ts`; build localized `groups` for the current `lang` (server-side, per `getTranslations`/`lang` prop)
- [x] 6.2 Replace the static `<Filters items={...} />` with `<Filters client:load groups={localizedGroups} />`
- [x] 6.3 Replace the static `<Artworks artworks={...} />` with `<Artworks client:load>` passing `ImageCard` slot children stamped with `data-artist`/`data-discipline`/`data-technique`/`data-theme`/`data-format`/`data-scale` facet attributes
- [x] 6.4 Remove the old `filterOptions` and `artworksData` arrays from `Home.astro` frontmatter
- [x] 6.5 Add a loader message key to `messages/es.json` and `messages/en.json` and pass the localized string to `<Artworks client:load loadingLabel={...} />`

## 7. Design-System Page Updates

- [x] 7.1 Update `src/pages/design-system.astro` showcases to import and render the React `FilterBtn`, `Filters`, and `Artworks` components (adding `client:*` directives where interactivity is exercised)
- [x] 7.2 Remove references to the deleted `.astro` versions

## 8. Documentation Sync

- [x] 8.1 Update `docs/component-dependencies.md` dependency tree and Notes (new `src/store/catalog.ts`, `src/data/catalog.ts`, React conversions, removed Astro components, orphaned-list changes)

## 9. Verification

- [x] 9.1 Run `pnpm run build` (runs `validate-i18n` and `validate-imports`) and fix any failures
- [x] 9.2 Manually verify in `https://enredarte-landing.localhost`: multi-select per group, horizontal scroll with hidden scrollbar, loader on toggle, grid updates, persisted selections across reload, and `es`/`en` label correctness
- [x] 9.3 Confirm `ImageCard` remains used by Gallery and the design-system page (unchanged behavior)
- [x] 9.4 Diff every artwork facet slug against the group option slugs in `src/data/catalog.ts` (per the Fixture Data Reference in design.md) and fix any mismatches

## 10. Scroll UX & Responsive Layout

- [x] 10.1 Add `min-w-0` to the row wrapper in `Filters.tsx` so the inner `overflow-x-auto` container shrinks and scrolls instead of overflowing the page
- [x] 10.2 Add a native non-passive `wheel` listener in `Filters.tsx` translating the wheel delta to horizontal `scrollLeft`, clamped to `[0, scrollWidth - clientWidth]`, and only calling `preventDefault` when the row can actually scroll (so page scroll passes through otherwise)
- [x] 10.3 Add paper-gradient edge fades (`bg-linear-to-l/r from-paper to-transparent`) on scrollable sides, driven by `scroll`/`resize` listeners
- [x] 10.4 Stack the label above the chips on mobile (`flex flex-col gap-2 md:flex-row md:items-center md:gap-4`, label `md:w-32`) so chips span the full row width below `md`
- [x] 10.5 Implement mouse drag-to-scroll on overflowing rows (`pointerType === "mouse"`, `pointermove` scrolls after ~5px threshold + `setPointerCapture`, capture-phase `click` suppresses the chip toggle after a drag)
- [x] 10.6 Verify drag-to-scroll: drag scrolls the row without toggling a chip; plain click still toggles; touch keeps native scroll; wheel + swipe + fades unaffected
