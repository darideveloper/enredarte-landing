## Why

The Hero section (`src/components/organisms/Hero.astro`) is the first visual element users see when landing on the site. Adding a choreographed GSAP entrance timeline animation on page load creates a luxury, state-of-the-art editorial impression. Elements (artwork banner, room badge, main title, description, CTAs, and curator meta) reveal in a synchronized, staggered timeline using GSAP.

## What Changes

- Add target animation class identifiers (`hero-banner`, `hero-badge`, `hero-title`, `hero-desc`, `hero-btn`, `hero-meta`) to elements inside `Hero.astro`.
- Add a client-side `<script>` in `Hero.astro` that imports `gsap` from `src/lib/gsap.ts` and builds an entrance sequence timeline (`scale`, `y` translation, and `opacity` stagger).

## Capabilities

### Modified Capabilities
- `hero-section`: Update `Hero.astro` specification to require a choreographed GSAP entrance timeline on component mount / page load.

## Impact

- **UI Components**: `Hero.astro`.
- **Dependencies**: Uses `src/lib/gsap.ts` (GSAP).
