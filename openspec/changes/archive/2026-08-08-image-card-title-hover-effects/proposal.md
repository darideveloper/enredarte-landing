## Why

`CardInfo` (`src/components/molecules/CardInfo.astro`) renders the text overlay for `ImageCard` grid items. Currently, hovering over `ImageCard` lacks dedicated text-level interactive feedback, and the red subtitle text above the `<h2>` title can have medium contrast against complex dark images. Adding a vertical crimson accent line that smoothly animates into view on hover, along with enhanced typography and dark drop-shadow for the red subtitle, ensures optimal legibility in all states (idle, hover, no-hover) and provides responsive visual feedback.

## What Changes

- Update `CardInfo.astro` to add a vertical crimson line accent (`w-[3px] bg-crimson`) that smoothly slides and scales into view next to `<h2>{title}</h2>` when the parent card is hovered (`group-hover:opacity-100 group-hover:translate-x-0`).
- Update `CardInfo.astro` subtitle styling to use bold typography (`font-bold`), increased letter spacing (`tracking-[0.2em]`), and a text shadow (`drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]`) to guarantee high legibility across all background states.

## Capabilities

### Modified Capabilities
- `card-info-molecule`: Update `CardInfo.astro` specification to require a vertical accent line hover effect next to the title and high-contrast red subtitle rendering.

## Impact

- **UI Components**: `CardInfo.astro`, `ImageCard.astro`, `Gallery.astro`, `Artworks.astro`, and `/design-system`.
- **Dependencies**: No external dependency changes.
