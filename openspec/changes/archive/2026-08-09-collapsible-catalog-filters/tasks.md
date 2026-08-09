## 1. Catalog Store

- [x] 1.1 Add `isExpanded: boolean` (default `false`) and `toggleExpanded` action to the `CatalogStore` in `src/store/catalog.ts`
- [x] 1.2 Extend `partialize` to persist `{ selections, isExpanded }` under the same `enredarte-catalog-storage` key
- [x] 1.3 Expose `isExpanded` / `toggleExpanded` through the shared `useCatalog` hook

## 2. FilterToggle Atom

- [x] 2.1 Create `src/components/atoms/FilterToggle.tsx` — store-bound atom reading `isExpanded` + `toggleExpanded`, rendering a `label` prop, with `aria-expanded` and `aria-controls`, styled to match the `FilterBtn` chip language

## 3. Filters Molecule

- [x] 3.1 Update `src/components/molecules/Filters.tsx` to render `groups[0]` always and `groups.slice(1)` only when `isExpanded`
- [x] 3.2 Wrap the group rows in an element with `id="catalog-filters"` (the `aria-controls` target)
- [x] 3.3 Add required `expandLabel` / `collapseLabel` props and render `<FilterToggle>` after the rows only when `groups.length > 1`

## 4. i18n

- [x] 4.1 Add `global.filters.more` / `global.filters.less` to `src/messages/es.json` ("Ver más filtros" / "Ver menos filtros")
- [x] 4.2 Add `global.filters.more` / `global.filters.less` to `src/messages/en.json` ("Show more filters" / "Show fewer filters")

## 5. Call-Site Integration

- [x] 5.1 Update `Home.astro` to pass `expandLabel` / `collapseLabel` from `t(...)` to `<Filters client:load>`
- [x] 5.2 Update `design-system.astro` to pass the two labels to its `<Filters>` showcase

## 6. Documentation Sync

- [x] 6.1 Update `docs/component-dependencies.md` (new `FilterToggle` atom, changed props on `Filters`, store change)

## 7. Verification

- [x] 7.1 Run `pnpm run build` (runs `validate-i18n` + `validate-imports`) and fix any failures
- [x] 7.2 Manually verify in https://enredarte-landing.localhost: only "Por artista" visible by default; expand reveals all six groups; collapse returns to the first; state survives reload; single-group case shows no toggle; selections survive collapse; `es`/`en` toggle labels correct
