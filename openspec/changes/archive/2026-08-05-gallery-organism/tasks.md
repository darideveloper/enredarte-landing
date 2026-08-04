## 1. Organism Implementation

- [x] 1.1 Create `Gallery.astro` file in `src/components/organisms/`.
- [x] 1.2 Define the interface to accept a `salas` array prop. Each element should match the props needed for `ImageCard`.
- [x] 1.3 Create the outer `<section class="px-14 pb-24">` wrapper.
- [x] 1.4 Render the `Title` molecule at the top with "Explora", "Pabellón de Salas", and a link "Ver todas las salas →".
- [x] 1.5 Create the CSS Grid container using Tailwind arbitrary values `grid grid-cols-[1.4fr_1fr_1fr] grid-rows-[340px_340px] gap-1`.
- [x] 1.6 Iterate over the `salas` array prop and render an `ImageCard` for each one, passing down the data (e.g., `isLarge` will be determined by the data).
