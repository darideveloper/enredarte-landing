## Why

The `Artworks` collection section in `Home.astro` displays the 8-item artwork catalog with filter navigation tabs (`Filters.astro`). Adding a GSAP `ScrollTrigger` staggered cascade entrance animation (`y: 35 → 0`, `scale: 0.96 → 1`, `stagger: 0.08`) and interactive filter tab switching animation (`scale: 0.95 → 1`, `opacity: 0 → 1`) gives the catalog a responsive, luxury gallery behavior.

## What Changes

- Add section container target `id="artworks-collection"`, header class `artworks-header`, filter container target `id="artworks-filters"`, and card class `artwork-card-item`.
- Add a client-side `<script>` in `Artworks.astro` (or `Home.astro`) importing `gsap` and `ScrollTrigger` from `src/lib/gsap.ts`.
- Implement scroll entrance cascade for the section header, filter pills, and 8 artwork cards.
- Implement interactive tab switching animation when filter buttons are clicked.

## Capabilities

### Modified Capabilities
- `artworks-organism`: Update `Artworks.astro` specification to require a GSAP ScrollTrigger staggered cascade entrance and interactive filter switching animation.

## Impact

- **UI Components**: `Artworks.astro`, `Filters.astro`, `Home.astro`.
- **Dependencies**: Uses `src/lib/gsap.ts` (`gsap` & `ScrollTrigger`).
