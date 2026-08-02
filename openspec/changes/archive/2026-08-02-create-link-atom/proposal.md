## Why

The application frequently uses hyperlinks (HTML `<a>` tags) that require a consistent set of styles, including specific text colors and hover effects (e.g., underlining or color transitions). Creating a centralized `Link` atom ensures that all text links share a consistent aesthetic and behavior across the application, preventing duplicated utility classes and keeping the code DRY.

## What Changes

- Create a new atom component `Link.tsx` or `Link.astro` (since we are creating an Astro component or React component wrapper for an anchor tag). We'll build this as `Link.astro` or `Link.tsx` (using React to align with the existing `Btn.tsx` approach for UI primitives) that renders an `<a>` element.
- The wrapper will accept standard anchor attributes (`href`, `target`, `rel`, etc.).
- The wrapper will apply base styling for a text link (e.g., interactive text color, hover effects).
- Add the new `Link` atom to the Design System page to document and showcase its usage.

## Capabilities

### New Capabilities
- `link-atom`: Provides a consistently styled hyperlink wrapper with hover effects for inline or standalone text links.

### Modified Capabilities

## Impact

- `src/components/atoms/Link.tsx` (New)
- `src/pages/design-system.astro` (Modified to showcase the new component)
