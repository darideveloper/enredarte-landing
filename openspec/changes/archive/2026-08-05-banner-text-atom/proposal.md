## Why

We need a reusable atom component `BannerText` to display items inside trust bars and announcement banners with dynamic content via `<slot />`.

## What Changes

- Create a new Astro atom component `src/components/atoms/BannerText.astro`.
- Render dynamic slotted content with styled nested bold tags (`<b>` elements rendered in crimson).
- Add `BannerText` showcase to `src/pages/design-system.astro`.

## Capabilities

### New Capabilities
- `banner-text-atom`: An atom component for banner/trust bar text items with slotted content and automatic bold tag highlighting.

### Modified Capabilities

## Impact

- `src/components/atoms/BannerText.astro` created.
- `src/pages/design-system.astro` updated to showcase the atom.
