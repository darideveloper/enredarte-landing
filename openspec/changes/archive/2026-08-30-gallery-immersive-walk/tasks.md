# Tasks — Gallery Immersive Walk

## 1. Immersive `ImageRowCard` mode

- [x] 1.1 Add an `immersive?: boolean` prop to `ImageRowCard.astro` while leaving the default branch markup-identical to the previous layout so `ArtistPage` keeps the current behavior.
- [x] 1.2 In the `immersive` branch, render the artwork image at its natural aspect ratio (`Image` with `height="auto"` and `w-full`) inside a full-width `grid grid-cols-1 md:grid-cols-2` row, alternating the image side via `reverse` (`md:order-*`).
- [x] 1.3 Render the info column as `flex flex-col justify-center` (stretches to the row height and vertically centers its content) with a paper background and container padding.
- [x] 1.4 Wrap the tags + `CardSummary` in a `md:sticky md:top-[35svh]` element so, on desktop, the card pins near the middle of the viewport while a row taller than the viewport scrolls, and releases at the row's end.
- [x] 1.5 Verify mobile stacking: on a narrow viewport the layout is a single column with the image above the (non-sticky) info card.

## 2. Gallery page restructure

- [x] 2.1 Drop the `ImageBanner` import from `GalleryPage.astro` and remove the `featured`/`rest` split, keeping `const [featured] = artworks` only for the hero/SEO image resolution.
- [x] 2.2 Make the hero image full-bleed: move it out of the `max-w-6xl` container into a full-width `h-[55svh] md:h-[75svh] overflow-hidden bg-[#0D0D0D]` layer with an `object-cover` `Image`; keep the eyebrow/name/description inside the container.
- [x] 2.3 Make the artworks section full-bleed: remove horizontal padding from `#sala-artworks`, keep the `Title` and `Filters` within `max-w-6xl px-6 md:px-14` wrappers, and set `gridClassName="grid-cols-1"`.
- [x] 2.4 Remove `overflow-hidden` from the `#sala-artworks` section so `position: sticky` pins against the viewport instead of the section (an `overflow: hidden` ancestor disables sticky).
- [x] 2.5 Render every artwork (not just the "rest") through `ImageRowCard` with `immersive` and the existing `data-*` facet attributes, preserving filter behavior.

## 3. Docs and validation

- [x] 3.1 Update `docs/component-dependencies.md` GalleryPage tree and Notes to reflect the removed `ImageBanner` and the immersive `ImageRowCard` usage.
- [x] 3.2 Verify the gallery page on desktop and mobile with the browser: natural-aspect uncropped images, sticky card pinned while scrolling the portrait artwork, centered card on square works, mobile stacking, and no horizontal overflow.
- [x] 3.3 Verify filtering still shows/hides rows and that `ArtistPage` renders unchanged.
- [x] 3.4 Run `pnpm validate-imports` and `pnpm validate-i18n`; confirm no console errors.