## Why

We need a flexible molecule component to render the text overlay and link wrapper for cards within the "Pabellón de Salas" gallery and potentially other grid-based sections. This component (`CardInfo`) should handle various content combinations (title, subtitle, metadata, curator) while maintaining a consistent visual hierarchy and acting as a full-card clickable area.

## What Changes

- Create a new `CardInfo.astro` molecule component.
- The component will render as an `<a>` tag to make the entire card clickable.
- It will accept a required `title` prop and an `href` prop.
- It will accept optional props for `subtitle` (eyebrow), `meta` (details under title), and `curator` (additional credit line) to support both compact and detailed card layouts.

## Capabilities

### New Capabilities
- `card-info-molecule`: A reusable molecule for rendering a card's text overlay and link.

### Modified Capabilities

## Impact

- `src/components/molecules/CardInfo.astro` (New file)
- Used as the primary overlay component inside the upcoming `ImageCard` molecule.
