## Why

The gallery detail page presented artworks as a flat, container-bound list — a featured banner followed by alternating rows. Portrait artworks rendered too tall, pushing the info card out of the viewport, and the contained layout made the imagery feel small. The gallery page is now an immersive, full-bleed walk that mirrors the artwork detail viewer: each artwork spans the viewport, the image keeps its natural aspect ratio, and its info card stays pinned mid-viewport while scrolling.

## What Changes

- The gallery hero image is now **full-bleed** (edge-to-edge, `h-[55svh] md:h-[75svh]`) instead of a boxed `16/9`/`21/9` image inside the content container.
- The artworks section becomes **full-bleed**; the "Explora / Obras de la sala" header and the filters stay container-bound.
- The **featured `ImageBanner` is removed** from the gallery page — every gallery artwork now renders as an alternating image/info-card row.
- `ImageRowCard` gains an **`immersive` mode**: the image renders at its natural aspect ratio on one half, and the info card is vertically centered in the row and pinned near the middle of the viewport (`md:sticky md:top-[35svh]`) while scrolling tall rows. Rows stack on mobile.
- `ArtistPage` retains the original (non-immersive) `ImageRowCard` layout, unchanged.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `gallery-artwork-layout`: The first artwork is no longer rendered as a featured `ImageBanner`; all artworks render as alternating full-bleed rows using `ImageRowCard` in `immersive` mode, and the rows remain filterable through the existing `Artworks` island.
- `image-row-card`: Adds the `immersive` mode — natural-aspect image on one side and a sticky, vertically-centered info card on the other, with mobile stacking — while preserving the existing default mode for `ArtistPage`.

## Impact

- `src/components/pages/sala/GalleryPage.astro` — hero and artworks section full-bleed; drops `ImageBanner` import and the featured/rest split; passes `immersive` to every `ImageRowCard`.
- `src/components/molecules/ImageRowCard.astro` — new `immersive` prop and layout branch; default branch untouched.
- `docs/component-dependencies.md` — GalleryPage tree and Notes updated to match.
- The `ImageBanner` molecule is no longer used by the gallery page but remains in use by `Hero.astro` and `ArtistPage.astro`; it is unchanged.
- No API, data model, i18n, dependency, or build changes.