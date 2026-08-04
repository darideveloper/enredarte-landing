## Why

Now that the `Gallery` organism has been completely built (including its atoms and molecules like `Title`, `ImageCard`, etc.), we need to integrate it into the actual landing page. The landing page currently only displays the `Hero` section. Integrating the `Gallery` will allow users to explore the "Pabellón de Salas" on the homepage directly, populating it with real or mockup content.

## What Changes

- Update `src/components/pages/landing/Home.astro` to include the `<Gallery />` component immediately following the `<Hero />`.
- Supply the `Gallery` with the standard set of 5 mockup exhibition cards (`salasData`).

## Capabilities

### New Capabilities
- `homepage-gallery`: Displays the Gallery organism on the main landing page.

### Modified Capabilities

## Impact

- `src/components/pages/landing/Home.astro` will be modified.
- No new external dependencies. The `Gallery` component is self-contained.
