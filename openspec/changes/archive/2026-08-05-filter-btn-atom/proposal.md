## Why

As part of building the "Colección completa" section using a bottom-up approach, we need a reusable button chip component (`FilterBtn`) to represent category/filter options. This component will handle visual state styling (active vs inactive) and serve as a foundation for interactive filtering.

## What Changes

- Create a new Astro atom component `src/components/atoms/FilterBtn.astro`.
- Implement active and inactive styles for filter chips matching the design mockup.
- Add examples of `FilterBtn` (active and inactive states) to `src/pages/design-system.astro`.

## Capabilities

### New Capabilities
- `filter-btn-atom`: An atom component representing a filter chip/button with active/inactive visual states.

### Modified Capabilities

## Impact

- `src/components/atoms/FilterBtn.astro` created.
- `src/pages/design-system.astro` updated to showcase the atom.
