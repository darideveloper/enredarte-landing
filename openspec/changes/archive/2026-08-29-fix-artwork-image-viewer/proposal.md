## Why

The artwork detail page (`/obras/<slug>`) renders a scroll-driven image gallery on desktop via GSAP ScrollTrigger, but two defects break the intended experience: (1) on desktop the images never change while scrolling, and (2) on page load the images "blink". Investigation traced both to a non-idempotent initialization of the ScrollTrigger timeline (`ArtworkImageViewer.astro`) combined with the primary image never being preloaded. Many live artworks carry 2+ images, so the scrub path is reachable and the failure is in setup/measurement, not data.

## What Changes

- Remove the double-initialization of the scrub timeline. `initScrub()` is currently invoked both directly at module evaluation **and** on `astro:page-load`. Collapse to a single init path driven by `astro:page-load`, with `astro:after-swap` reverting the `gsap.matchMedia()` instance.
- After (re)creating the ScrollTrigger timeline on each page load, explicitly call `ScrollTrigger.refresh()` so the freshly created pinned trigger is measured against the final layout (images/fonts settled), preventing a mis-measured pin range that leaves the scrub effectively stuck.
- Pass `preloadImage` (the artwork's primary image) from `ArtworkPage.astro` into `<Layout>` so the hero image is preloaded via `<link rel="preload">`, eliminating the load-time image pop-in.
- Ensure the viewer image box stays reserved (the frame already uses `aspect-[4/5]`; confirm the inner `<img>` fills it with `h-full w-full object-cover`) to prevent any decode reflow/flash.
- Keep the existing GSAP scrub implementation and the reduced-motion / mobile stacked-image fallback behavior unchanged in spirit — only the initialization and asset loading are corrected.

## Capabilities

### New Capabilities
- `artwork-viewer`: Defines the required behavior of the artwork image viewer — deterministic single initialization of the scroll-scrub gallery, correct pin measurement, primary-image preload, and no load-time blink across desktop (motion allowed), reduced-motion, and mobile.

### Modified Capabilities
<!-- No existing capability requirement changes; this is a new capability. -->

## Impact

- `src/components/molecules/ArtworkImageViewer.astro` — `<script>` init logic (single init path, explicit refresh).
- `src/pages/[...path].astro` — compute `preloadImage` (the artwork's primary image) and pass it into `<Layout>` (the route renders `<Layout>`; `ArtworkPage.astro` does not).
- `src/layouts/Layout.astro` — consumes `preloadImage` (already supported; no change required, but confirmed).
- `src/components/atoms/Image.astro` — **not** modified; image-box sizing is scoped to the viewer only, to avoid affecting other usages.
- No backend/API or dependency changes. GSAP and Astro View Transitions remain as-is.
