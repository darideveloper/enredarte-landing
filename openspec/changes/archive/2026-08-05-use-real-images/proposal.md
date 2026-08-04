## Why

The `Gallery` organism on the homepage currently references placeholder image paths (like `/images/hero-1.png`) that do not exist, resulting in broken image links. We need to replace these with actual image assets from our `public/images` folder so the UI accurately reflects a polished, finished product.

## What Changes

- Update `salasData` in `src/components/pages/landing/Home.astro`.
- Replace the 5 dummy `src` paths with 5 real images from `public/images/`.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
None. (Set `skip_specs: true` in `.openspec.yaml` because this is purely an asset update and does not change any behavioral requirements).

## Impact

- The `src/components/pages/landing/Home.astro` mock data will be modified.
- Better visual fidelity for the landing page.
