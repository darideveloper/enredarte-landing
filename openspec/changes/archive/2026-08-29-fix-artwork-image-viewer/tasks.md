## 1. Single deterministic scrub initialization

- [x] 1.1 In `src/components/molecules/ArtworkImageViewer.astro`, remove the direct `initScrub()` call at the bottom of the `<script>` so initialization happens only via `astro:page-load`.
- [x] 1.2 Keep `astro:after-swap` → `mm?.revert()` and `astro:page-load` → `initScrub` bindings; ensure `initScrub` reverts any prior `mm` before creating a new one.
- [x] 1.3 Verify no other entry point calls `initScrub` (grep the viewer script).

## 2. Correct pin measurement

- [x] 2.1 Inside `initScrub`, after `mm = gsap.matchMedia()` and the `mm.add(...)` branches are registered, call `ScrollTrigger.refresh()` so the freshly created pinned trigger is measured against the final layout.
- [x] 2.2 Confirm the desktop branch (`(min-width: 768px) and (prefers-reduced-motion: no-preference)`) still pins and scrubs; the reduced-motion/mobile stack fallback is preserved unchanged.

## 3. Primary image preload

- [x] 3.1 In `src/components/pages/obra/ArtworkPage.astro`, pass `preloadImage={primaryImage}` into the `<Layout>` component (the value is already computed as `primaryImage`).
- [x] 3.2 Confirm `src/layouts/Layout.astro` emits the `<link rel="preload" as="image" fetchpriority="high">` for that image (no Layout change required).

## 4. Layout-shift / blink safeguard

- [x] 4.1 In `ArtworkImageViewer.astro`, ensure the image container reserves its box: apply `aspect-[4/5]` (already present on the frame) and make the inner `<img>` fill it (`h-full w-full object-cover`) so decode causes no reflow.
- [x] 4.2 Avoid modifying the shared `Image.astro` atom; scope sizing to the viewer only (or pass explicit sizing through the viewer).

## 5. Automated verification (playwright-cli)

- [x] 5.1 Use the `playwright-cli` skill to load a multi-image artwork page (`/obras/<slug>`) on desktop with motion allowed.
- [x] 5.2 Scroll through the pinned range and assert the displayed image and the `1 / N` counter change (scrub progresses).
- [x] 5.3 Assert the primary image is preloaded (no late pop-in) — check `<link rel="preload">` presence / network timing.
- [x] 5.4 Run the same check under `prefers-reduced-motion: reduce` and assert images are stacked (no pin/scrub).
