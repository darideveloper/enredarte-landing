## Why

Following our bottom-up approach for the "Colección completa" section, we need a `Filters` molecule component that wraps and lays out a list of `FilterBtn` atoms. It will manage the active filter state for UI rendering, defaulting the first filter ("TODAS LAS OBRAS") to active.

## What Changes

- Create a new Astro molecule component `src/components/molecules/Filters.astro`.
- Render a flex-wrap container of `FilterBtn` items based on an input array of filter options.
- Add `Filters` showcase to `src/pages/design-system.astro`.

## Capabilities

### New Capabilities
- `filters-molecule`: A molecule component that renders a list of `FilterBtn` chips with a active selection.

### Modified Capabilities

## Impact

- `src/components/molecules/Filters.astro` created.
- `src/pages/design-system.astro` updated to showcase the molecule.
