## Why

On the `/obras/<slug>` artwork detail page, the immersive hero `object-cover` image was hard-cropping tall (portrait) artworks, losing significant content, and every extra gallery image lengthened the page and the scroll-scrub timeline unboundedly. The page limited the LCP hero to the primary image and moved the full gallery into a bounded, true-ratio foundation instead — a foundational fix. This change captures the already-implemented and verified rework so the behavior is specified, documented, and reviewable.

## What Changes

- The artwork hero now renders only the primary image (static `ArtworkImageViewer` branch); the LCP preload expression is unchanged, so preload stays byte-correct.
- A new gallery section is introduced below the hero: a dark, content-height **artist card** on the left (sticky at `93px` on desktop) and a bounded **Swiper React slider** of all artwork images on the right, in a single `lg:grid-cols-[380px_1fr]` grid.
- Slider images are served through a new `slider` responsive slot whose `sizes` match the real rendered column width (and a new `slideSet` helper mirrors the `Image` atom's AVIF/WebP + retry + fallback pipeline), so remote images stay optimized per Astro best practices.
- Slides use a single `object-contain` class on a flex-centered slide, so `object-contain` auto-fits each image — portrait fills the slider height, landscape fills its width — always centered and never cropped, with no per-orientation logic.
- The artist card is a new `ArtistCard` molecule modeled on the existing `CuratorCard` and adapted for `Artist` (adds years/location metadata and social links, uses the `global.artist.label` eyebrow).
- Desktop equal-height behavior: the grid cell stretches both columns; the artist card self-aligns and sticks top while the slider fills the column.

## Capabilities

### New Capabilities
- `artwork-slider-gallery`: The responsive Swiper gallery used on the artwork detail page — image set preparation, orientation-aware `object-contain` framing, the `ArtistCard` molecule, sticky/equal-height composition, and single-image handling (slider always shows the assets, chrome-free when N=1).

### Modified Capabilities
- `artwork-detail-page`: The detail layout now shows a single primary image in the sticky hero and a new artist + gallery section below; the layered-scrub gallery no longer lives in the hero.
- `artwork-viewer`: The viewer contract narrows to a single primary image (static branch); the scroll-scrub path no longer applies on this page since the viewer only ever receives one image.
- `ssg-responsive-images`: A new `slider` named slot defines the gallery's `sizes`/`widths`, and `slideSet` is added so React-island images keep byte parity with atom-rendered images.

## Impact

- **Code**: `src/components/pages/obra/ArtworkPage.astro`, new `src/components/organisms/ArtworkSlider.tsx`, new `src/components/molecules/ArtistCard.astro`, `src/lib/images.ts` (`slideSet` + `slider` slot), `src/styles/global.css` (Swiper control branding + slide/slider layout).
- **Dependency**: added `swiper` (v14).
- **Docs**: `docs/component-dependencies.md` artwork page tree updated.
- **No API/route changes**: routing, `getStaticPaths`, and LCP preload in `[...path].astro` are untouched.