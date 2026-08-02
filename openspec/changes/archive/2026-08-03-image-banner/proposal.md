## Why

The `Hero` section requires an image component that displays artwork alongside metadata (artist, title, price). We need an `ImageBanner` molecule that composes the existing `Image` atom and `CardSummary` molecule. This ensures a clean separation of concerns and a modular architecture before building the final `Hero` organism.

## What Changes

- Create a new `ImageBanner` molecule (`src/components/molecules/ImageBanner.astro`).
- The component will accept props for image source, alt/title text, artwork title, artist name, price, and link `href`.
- The component will wrap the `Image` atom and absolutely position the `CardSummary` molecule over it.
- Update `src/pages/design-system.astro` to showcase the new `ImageBanner` molecule.

## Capabilities

### New Capabilities
- `image-banner`: Defines the requirements for the ImageBanner molecule, which composes an image and a metadata card.

### Modified Capabilities
<!-- No existing capabilities are modified -->

## Impact

- Adds a new molecule component (`ImageBanner`).
- Updates the design system page to document the new component.
- Prepares the groundwork for the upcoming `Hero` organism implementation.
