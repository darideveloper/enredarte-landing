## Why

The `Gallery` organism (`src/components/organisms/Gallery.astro`) represents the "Pabellón de Salas" section featuring a 5-card bento grid with 1 prominent featured room card and 4 adjacent room cards. Adding a GSAP `ScrollTrigger` scroll-scrubbed parallax depth shift creates a multi-layered 3D scroll effect where the large featured card moves at a differential scroll rate (`scrub: 1`, `yPercent`) relative to the surrounding cards, giving the gallery an architectural, immersive feel.

## What Changes

- Add target class identifiers (`gallery-header`, `gallery-card-large`, `gallery-card-item`) to `Gallery.astro`.
- Add a client-side `<script>` in `Gallery.astro` importing `gsap` and `ScrollTrigger` from `src/lib/gsap.ts`.
- Implement a scroll-scrubbed parallax timeline (`scrub: 1.2`) on the featured room card, alongside a subtle entry reveal animation.

## Capabilities

### Modified Capabilities
- `gallery-organism`: Update `Gallery.astro` specification to require a scroll-scrubbed GSAP parallax depth animation on the main featured card during page scrolling.

## Impact

- **UI Components**: `Gallery.astro`.
- **Dependencies**: Uses `src/lib/gsap.ts` (`gsap` & `ScrollTrigger`).
