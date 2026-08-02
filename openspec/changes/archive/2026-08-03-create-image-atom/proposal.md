## Why
We need to build the `Image` atom component. This is the last fundamental primitive required before we can build the `CardSummary` and `ImageBanner` molecules for the right side of the Hero section. It provides a standardized, responsive image container that maintains aspect ratios and handles object fitting according to our design system.

## What Changes
- Create `src/components/atoms/Image.astro`.
- Define properties for `src`, `alt`, and `aspectRatio`.
- Implement responsive CSS classes for correct sizing and scaling.

## Capabilities

### New Capabilities
- `image-atom`: Defines the behavior and constraints for standardizing image rendering and aspect ratios across the application.

### Modified Capabilities
- (None)

## Impact
- Adds a new primitive to the `src/components/atoms/` directory.
- No impact on existing components, but it unlocks the next phase of development (`CardSummary` and `ImageBanner`).
