## Why

The primary red CTA button variant currently uses a simple opacity reduction on hover, which lacks visual dynamism. Furthermore, button transition styling lacks smooth easing across states, leading to abrupt hover state changes. Setting the crimson border explicitly on the initial state of the primary button allows it to seamlessly transition into a red ghost button style (transparent background with red text and border) without border box recalculation or layout jitter.

## What Changes

- Modify `primary` variant styling in `Btn.astro` to pre-set `border-crimson` in its idle state and convert to a red ghost button (`hover:bg-transparent hover:text-crimson hover:border-crimson`) on hover.
- Standardize button transition animations to use smooth `transition-all duration-300 ease-in-out` across all variants in `Btn.astro` and `FilterBtn.astro`.

## Capabilities

### Modified Capabilities
- `btn-astro-atom`: Update primary button hover requirement to convert to a red ghost button style and enforce smooth easing transitions across all variants.

## Impact

- **UI Components**: `Btn.astro`, `FilterBtn.astro`, and all pages/organisms rendering buttons (e.g. Hero CTA, Header ghost CTA, Design System showcase).
- **Dependencies**: No external dependency changes.
