# tasks.md — artwork-slider-gallery

## 1. Dependency

- [x] 1.1 Add the `swiper` dependency and confirm the React surface resolves (`swiper/react`, `swiper/modules`, `swiper/css`).

## 2. Image pipeline

- [x] 2.1 Add `IMAGE_SLOTS.slider` to `src/lib/images.ts` with `widths [640,1080,1600]` and `sizes "(max-width:768px) calc(100vw - 48px), (max-width:1024px) calc(100vw - 112px), calc(100vw - 556px)"`.
- [x] 2.2 Add `slideSet(src, slot)` to `src/lib/images.ts` returning `SlideSet { avifSrcSet, webpSrcSet, fallbackSrc, width, height, sizes }`, mirroring the `Image` atom's AVIF+WebP pair, retry, and verbatim-URL fallback.

## 3. Slider island

- [x] 3.1 Create `src/components/organisms/ArtworkSlider.tsx` (`client:visible`): `Swiper`/`SwiperSlide` with `Navigation`, `Pagination`, `A11y` modules; `slidesPerView={1}`, no autoplay, no `autoHeight`.
- [x] 3.2 Render each slide with flex-centered framing: slide class `artwork-slide`, image `class="object-contain lg:h-full lg:w-full"` (both optimized `<picture>` and verbatim-fallback branches).
- [x] 3.3 Suppress navigation/pagination/chrome and the counter when the artwork has a single image.
- [x] 3.4 Add the `n / N` counter overlay that tracks the active slide when more than one image exists.

## 4. Artist card molecule

- [x] 4.1 Create `src/components/molecules/ArtistCard.astro` (structural clone of `CuratorCard` typed for `Artist`): `global.artist.label` eyebrow, linked name, years · location metadata, on-dark bio, email/website/social links, portrait `IMAGE_SLOTS.portrait`, initials fallback.

## 5. Page composition

- [x] 5.1 In `ArtworkPage.astro`, feed the hero only the primary image: `{ ...detail, images: [is_primary ?? first] }`.
- [x] 5.2 Precompute slides in the frontmatter via `slideSet(image.src, IMAGE_SLOTS.slider)` for all `detail.images`.
- [x] 5.3 Add the gallery grid section `lg:grid-cols-[380px_1fr] items-stretch` (gated on `{ artist || slides.length > 0 }`), `ArtistCard` left with `lg:self-start lg:sticky lg:top-[93px]`, slider right.
- [x] 5.4 Ensure the gallery section does not set `overflow:hidden` (sticky-safe).

## 6. Styling

- [x] 6.1 Brand Swiper controls in `src/styles/global.css` on `.artwork-slider` via `--swiper-*` vars (ink arrows, crimson active bullet, translucent ink inactive).
- [x] 6.2 Add `.artwork-slide { display:flex; align-items:center; justify-content:center; width:100% }`.
- [x] 6.3 Add the `lg` media block forcing `height:100%; min-width:0` on `.artwork-slider`, `.swiper`, `.swiper-wrapper` for equal-height/column-safe desktop layout.

## 7. Documentation & verification

- [x] 7.1 Sync `docs/component-dependencies.md` artwork page tree (new `ArtistCard` + `ArtworkSlider` island, `slider` slot).
- [x] 7.2 Run `validate-imports`, `validate-i18n`, and `astro check` (baseline: only the 5 pre-existing errors).
- [x] 7.3 Verify via `pnpm run dev` / headless DOM at `/obras/<slug>`: hero shows single primary image; gallery shows all images centered, uncropped (`object-contain`), no autoplay/height animation, single-image chrome-free, equal heights on desktop, sticky card, `slider` slot `sizes` in served DOM.