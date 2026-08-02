## Why
We need to build the `CardSummary` molecule (referred to as `.hero-badge` in the mockup). This is the dark, semi-transparent box that overlays the main image in the Hero section, providing essential context like the title, artist name, and pricing information.

## What Changes
- Create `src/components/molecules/CardSummary.astro`.
- Define properties for `title`, `artist`, and `price`.
- Apply styling matching the `.hero-badge` from the mockup (e.g. `bg-black/88 backdrop-blur-sm p-4 md:p-5 max-w-[260px]`).

## Capabilities

### New Capabilities
- `card-summary`: Defines the structure and presentation of the artwork summary overlay badge.

### Modified Capabilities
- (None)

## Impact
- Adds a new molecule component to the `src/components/molecules/` directory.
- Prepares the components required to assemble the final `ImageBanner` and `Hero` organism.
