## Why

The application currently lacks a standardized logo component, relying on plain text or hardcoded asset paths. Creating a dedicated `Logo.astro` atom component ensures consistent branding across headers, footers, and landing sections, while supporting all brand assets (`logo-dark.png`, `logo-light.png`, `logo-bg-red.png`, `favicon.svg`).

## What Changes

- Create `src/components/atoms/Logo.astro` supporting `dark`, `light`, `bg-red`, and `icon` variants.
- Showcase `Logo.astro` variants on the `/design-system` page.

## Capabilities

### New Capabilities
- `logo-atom`: Standardized reusable Astro logo atom component supporting multiple brand asset variants.

### Modified Capabilities
- (None)

## Impact

- **New Component**: `src/components/atoms/Logo.astro`
- **Design System Page**: `src/pages/design-system.astro` updated to render Logo variants in the Atoms section.
