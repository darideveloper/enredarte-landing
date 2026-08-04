## 1. Molecule Implementation

- [x] 1.1 Create `ImageCard.astro` file in `src/components/molecules/`.
- [x] 1.2 Define `Props` interface including `isLarge` (boolean), image props (`src`, `alt`), and `CardInfo` props (`title`, `href`, `subtitle`, `meta`, `curator`, `class`).
- [x] 1.3 Implement the root container with classes `relative overflow-hidden cursor-pointer bg-[#0D0D0D] group` and conditionally apply `col-span-1 row-span-2` if `isLarge` is true.
- [x] 1.4 Render the `<Image>` component inside a wrapper that applies Tailwind hover effects (`transition-all duration-[6s] ease-out group-hover:scale-105 group-hover:brightness-[0.42] group-hover:saturate-100 brightness-[0.62] saturate-[0.9] absolute inset-0 w-full h-full`).
- [x] 1.5 Render the `<CardInfo>` component over the image, passing down the relevant props (`title`, `subtitle`, `href`, `meta`, `curator`), and dynamically adjusting the `title` size inside `CardInfo` using its `class` prop if `isLarge` is true.
