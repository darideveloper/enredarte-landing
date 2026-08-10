## Why

Text overlaid on background images across hero sections, gallery grids, and artwork banners can suffer from insufficient contrast when rendered over bright or high-contrast artwork images. Adding a configurable `overlay` prop (`'hover' | 'darker' | 'always' | 'none'`) and `darkenOnHover` flag to `ImageBanner.astro` and `ImageCard.astro` allows components to enforce dark image overlays or darken on hover, ensuring high text legibility and rich visual depth across all pages.

## What Changes

- Add configurable `overlay` prop (`'hover' | 'darker' | 'always' | 'none'`) and optional `darkenOnHover` prop to `ImageBanner.astro` and `ImageCard.astro`.
- Render a gradient/solid dark overlay layer between the background image and overlaid text content.
- Configure `Hero.astro` to use `overlay="darker"` (high contrast static dark overlay) so hero text is always clear.
- Configure `ImageCard.astro` and `ImageBanner.astro` default state to `overlay="hover"` (subtle base overlay, deepening dark gradient on hover).

## Capabilities

### Modified Capabilities
- `image-banner`: Add `overlay` prop support to `ImageBanner.astro` for static dark overlay (hero) or hover darkening.
- `image-card-molecule`: Update `ImageCard.astro` to support configurable `overlay` prop for enhanced dark hover overlay and text legibility.

## Impact

- **UI Components**: `ImageBanner.astro`, `ImageCard.astro`, `Hero.astro`, `Gallery.astro`, `Artworks.astro`, and `design-system.astro`.
- **Dependencies**: No external dependency changes.
