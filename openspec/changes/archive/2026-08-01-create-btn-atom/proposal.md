## Why

The landing page and atomic component architecture require a standardized button component (`Btn`) that renders as an `<a>` tag link wrapper, supports extensible variant styling (`regular`, `ghost`), handles hover states correctly, and supports configurable sizing.

## What Changes

- Create `src/components/atoms/Btn.tsx` using an `<a>` element wrapper and a style mapping object for color variants and sizing.

## Capabilities

### New Capabilities
- `btn-atom`: Standardized anchor-based button atom component supporting `regular` and `ghost` variants.

### Modified Capabilities
- (None)

## Impact

- **New Component**: `src/components/atoms/Btn.tsx`
- **UI Components**: Establishes the foundational link-button atom for headers, hero sections, and CTAs.
