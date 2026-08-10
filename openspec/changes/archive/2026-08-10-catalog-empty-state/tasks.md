## 1. Store reset action

- [x] 1.1 Add `reset: () => void` to the `CatalogStore` interface in `src/store/catalog.ts`
- [x] 1.2 Implement `reset` in the store: set `selections` to `EMPTY_SELECTIONS`, set `isLoading: true`, and clear it after the same 400 ms delay used by `toggle`; leave `isExpanded` untouched
- [x] 1.3 Expose `reset` from the shared `useCatalog` hook

## 2. Empty-state UI in Artworks

- [x] 2.1 Add `emptyLabel` and `resetLabel` string props to `ArtworksProps` with sensible defaults
- [x] 2.2 In the `Artworks` visibility effect, track the count of still-visible cards in a state value
- [x] 2.3 Render a localized empty-state block when zero cards are visible and `isLoading` is false: a centered, padded message using `emptyLabel` and an outline-styled restart button using `resetLabel` (reusing the FilterToggle/FilterBtn visual language)
- [x] 2.4 Wire the restart button to the store's `reset` action; ensure it renders even when stale selections aren't represented by any chip

## 3. i18n strings

- [x] 3.1 Add `global.filters.noResults` and `global.filters.reset` to `src/messages/es.json`
- [x] 3.2 Add matching `global.filters.noResults` and `global.filters.reset` keys to `src/messages/en.json`

## 4. Wire into Home.astro

- [x] 4.1 Pass `emptyLabel={t("global.filters.noResults")}` and `resetLabel={t("global.filters.reset")}` to `<Artworks client:load>` in `src/components/pages/landing/Home.astro`

## 5. Docs and verification

- [x] 5.1 Update `docs/component-dependencies.md` Notes section to mention the `reset` store action and the new `Artworks` props
- [x] 5.2 Run `pnpm run build` (runs `validate-i18n` + `validate-imports`) and confirm it passes
- [x] 5.3 Manually verify: force a zero-result selection (e.g. stale persisted selection in `enredarte-catalog-storage`) and confirm the empty state shows and the restart button restores the full grid with the loader flash
