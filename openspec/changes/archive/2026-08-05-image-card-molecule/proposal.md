## Why

The "Pabellón de Salas" grid and other grid-based sections require a cohesive card component that marries an underlying image with a textual overlay, while providing complex hover interactions. We need an `ImageCard` molecule to encapsulate this structure, composing the existing `Image` atom and `CardInfo` molecule to ensure consistency across the site.

## What Changes

- Create a new `ImageCard.astro` molecule component.
- The component will act as the outer layout wrapper (`relative`, `overflow-hidden`, with a base background).
- It will render the background image with specific brightness filters and a scale transformation on hover.
- It will accept `CardInfo`'s props (like title, href, subtitle) and pass them down to the inner `CardInfo` instance.
- It will accept an `isLarge` prop to support the grid's larger card variant (`.sala-card.big`).

## Capabilities

### New Capabilities
- `image-card-molecule`: A reusable molecule that combines a background image with a `CardInfo` text overlay, implementing hover effects and size variants.

### Modified Capabilities

## Impact

- `src/components/molecules/ImageCard.astro` (New file)
- Depends on `src/components/atoms/Image.astro` and `src/components/molecules/CardInfo.astro`.
- Will be used by the upcoming `Gallery` organism.
