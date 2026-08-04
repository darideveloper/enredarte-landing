## Why

Now that we have the `Title` and `ImageCard` molecules built, we can compose them into the final `Gallery` organism. This completes the "Pabellón de Salas" section of the site, translating the design into a cohesive layout block that handles the grid layout of the exhibition rooms.

## What Changes

- Create a new `Gallery.astro` organism component.
- The component will combine the `Title` molecule (for the section header) and a grid layout containing multiple `ImageCard` molecules.
- It will accept an array of card data to render the grid dynamically.
- The grid will follow the CSS styling defined in `.salas-grid`, specifically `grid-template-columns: 1.4fr 1fr 1fr; grid-template-rows: 340px 340px; gap: 4px;` from the mockup.

## Capabilities

### New Capabilities
- `gallery-organism`: A complex section that renders a section header and a customized CSS Grid of image cards.

### Modified Capabilities

## Impact

- `src/components/organisms/Gallery.astro` (New file)
- Depends on `src/components/molecules/Title.astro` and `src/components/molecules/ImageCard.astro`.
- Once built, this component can be placed on the main landing page to render the "Pabellón de Salas" section.
