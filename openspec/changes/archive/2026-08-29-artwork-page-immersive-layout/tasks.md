## 1. Artwork Page Immersive Layout

- [x] 1.1 Replace the `max-w-6xl` equal-column grid in `src/components/pages/obra/ArtworkPage.astro` with an asymmetric full-bleed grid (`lg:grid-cols-[1fr_380px]`, `xl:grid-cols-[1fr_420px]`) and remove the section's horizontal container padding
- [x] 1.2 Remove `min-h-screen` from the grid wrapper so the ScrollTrigger pin-spacer matches the real layout height
- [x] 1.3 Verify the layout renders full-bleed images left / fixed-width info right at `lg+` and stacked below `lg`

## 2. Immersive Image Viewer

- [x] 2.1 Remove the fixed `aspect-[4/5]` box in `ArtworkImageViewer.astro`; set `.artwork-viewer` to `min-height: 60vh`, `min-height: 100vh` at `≥1024px`, and make images fill via `h-full object-cover`
- [x] 2.2 Move the scroll-scrub `matchMedia` condition from `(min-width: 768px)` to `(min-width: 1024px)` and the stacked fallback to `(max-width: 1023px)`
- [x] 2.3 Set the ScrollTrigger pin `start` to `top 80px` so the scrub engages immediately below the sticky header
- [x] 2.4 Confirm stacked fallback images display at `4/5` aspect ratio and the `1 / N` counter reads the total count in reduced-motion / mobile

## 3. Sticky Info Panel

- [x] 3.1 Update `ArtworkInfoPanel.astro` to `sticky top-0` with `overflow-y-auto` and a height of `calc(100vh - 80px)` at `lg+`, with a `border-l` separator and `px-8 lg:px-12 xl:px-14 py-12 lg:py-16` padding
- [x] 3.2 Render the inquiry CTA after the spec data in normal document flow, spaced by the panel's `gap-8` rhythm
- [x] 3.3 Keep the below-`lg` style using a `border-t` separator and standard padding

## 4. Global Token and Base Background

- [x] 4.1 Add `--color-description: #7A7568` to the Tailwind theme in `src/styles/global.css`
- [x] 4.2 Migrate hardcoded `text-[#7A7568]` description text in `ArtworkInfoPanel.astro`, `Hero.astro`, and `GalleryPage.astro` to `text-description`
- [x] 4.3 Add `bg-paper` to the `<body>` class in `src/layouts/Layout.astro` so pinned-element seams render in paper instead of browser-default white

## 5. Verification

- [x] 5.1 Run `pnpm build` and confirm all pages build (19 pages) with no errors
- [x] 5.2 Verify on desktop that the pin-and-scrub begins immediately below the sticky header with no dead-zone and no white seam/gap when the pin engages
- [x] 5.3 Verify stacked fallback and info-panel stacking below 1024px, and confirm reduced-motion shows no scrub
- [x] 5.4 Verify on desktop that the inquiry CTA renders after the spec data with standard spacing and does not overflow the panel or viewport at short window heights