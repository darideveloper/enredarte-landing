## Purpose

Defines the `Hero` organism component, serving as the main entry point for the landing page with composed typography and image molecules.

## MODIFIED Requirements

### Requirement: Choreographed GSAP entrance timeline
The `Hero` organism SHALL trigger a synchronized GSAP entrance animation sequence exactly once via the `astro:page-load` event, SHALL respect `prefers-reduced-motion` by skipping movement animations for reduced-motion users, and SHALL animate the artwork banner using only `transform` (never hiding it with `opacity: 0`) so the above-the-fold image remains eligible for LCP measurement.

#### Scenario: Entrance animation sequence execution
- **WHEN** the `Hero` component loads on the client and `astro:page-load` fires
- **THEN** the artwork banner scales down smoothly (`scale: 1.08 → 1.0` without an opacity change), the room badge slides down (`y: -15 → 0`), the title slides up (`y: 30 → 0`), body description fades up (`y: 20 → 0`), the CTA slides up (`y: 20 → 0`), and the meta line fades in (opacity only) using GSAP timeline timing, and the sequence runs once (not doubled).

#### Scenario: Reduced motion preference honored
- **WHEN** the user's operating system sets `prefers-reduced-motion: reduce`
- **THEN** the hero content is revealed without movement (elements jump to their final visible state) and no entrance timeline is played.