## Context

See `proposal.md` for motivation and background.

`src/components/organisms/Hero.astro` renders the main landing page header. We will add a GSAP script block using `src/lib/gsap.ts` to choreograph a smooth entrance timeline.

## Goals / Non-Goals

**Goals:**
- Add semantic target classes (`hero-banner`, `hero-badge`, `hero-title`, `hero-desc`, `hero-btn`, `hero-meta`) inside `Hero.astro`.
- Add `<script>` block in `Hero.astro` importing `gsap` from `../../lib/gsap`.
- Create a synchronized `gsap.timeline({ defaults: { ease: "power3.out" } })` animation.

**Non-Goals:**
- Altering the existing HTML markup layout or typography hierarchy.

## Decisions

### Decision 1: GSAP Timeline choreography
- **Approach**:
  - `hero-banner`: `from({ scale: 1.12, opacity: 0, duration: 1.2 })`
  - `hero-badge`: `from({ y: -15, opacity: 0, duration: 0.6 }, "-=1.0")`
  - `hero-title`: `from({ y: 35, opacity: 0, duration: 0.8 }, "-=0.4")`
  - `hero-desc`: `from({ y: 25, opacity: 0, duration: 0.7 }, "-=0.5")`
  - `hero-btn`: `from({ y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.4")`
  - `hero-meta`: `from({ opacity: 0, duration: 0.6 }, "-=0.3")`
- **Rationale**: Staggered offsets (`"-=0.4"`) create a fluid, luxury movement where elements flow naturally into place rather than waiting for previous steps to complete.

## Risks / Trade-offs

- **[Risk]**: Layout shift before JS bundle hydrates.
- **[Mitigation]**: Keep initial state opacity transitions fast and smooth with GPU-accelerated transforms (`y` translation & `scale`).
