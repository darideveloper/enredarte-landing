## Why

To complete the "Colección completa" (Catalog) section, we need an `Artworks` organism component that renders a grid of artwork items using `<ImageCard />`. The grid must handle an arbitrary number of artworks (4, 8, 12, etc.) cleanly across responsive breakpoints.

## What Changes

- Create a new Astro organism component `src/components/organisms/Artworks.astro`.
- Implement a responsive 4-column grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[3px]`).
- Add `Artworks` showcase section to `src/pages/design-system.astro`.

## Capabilities

### New Capabilities
- `artworks-organism`: An organism component that renders a responsive 4-column grid of artwork cards (`ImageCard`).

### Modified Capabilities

## Impact

- `src/components/organisms/Artworks.astro` created.
- `src/pages/design-system.astro` updated to showcase the organism.
