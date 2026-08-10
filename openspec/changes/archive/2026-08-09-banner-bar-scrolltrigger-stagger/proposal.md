## Why

`BannerBar` (`src/components/organisms/BannerBar.astro`) displays key gallery value propositions ("COA firmado", "Envío asegurado", "65% al Artista", "Curaduría personal"). Adding a GSAP `ScrollTrigger` stagger reveal sequence causes the 4 items to cascade gracefully into view from below (`y: 25 → 0`, `opacity: 0 → 1`, `stagger: 0.15`) as the user scrolls past the Hero section, creating an elegant, editorial gallery entrance.

## What Changes

- Add target class identifier (`banner-item`) to individual `BannerText` components in `BannerBar.astro`.
- Add a client-side `<script>` in `BannerBar.astro` importing `gsap` and `ScrollTrigger` from `src/lib/gsap.ts` that triggers a staggered cascade animation on scroll entry.

## Capabilities

### New Capabilities
- `banner-bar-organism`: Define `BannerBar.astro` capability requiring a GSAP ScrollTrigger staggered cascade entrance animation.

## Impact

- **UI Components**: `BannerBar.astro`.
- **Dependencies**: Uses `src/lib/gsap.ts` (`gsap` & `ScrollTrigger`).
