## MODIFIED Requirements

### Requirement: GSAP scroll reveal for header and grid
The `Gallery` organism SHALL trigger a GSAP ScrollTrigger reveal when the section scrolls into view — the header fades/slides in first, then the gallery cards cascade in with a stagger — SHALL initialize via a direct `init()` call for first paint AND the `astro:page-load` event for client-side navigations, SHALL carry `transition:animate="none"` on its root element, SHALL revert its `gsap.matchMedia()` context on `astro:after-swap` before re-initializing, and SHALL respect `prefers-reduced-motion`.

#### Scenario: Scroll reveal animation
- **WHEN** the gallery header intersects 85% of the viewport height on scroll and `prefers-reduced-motion` is `no-preference`
- **THEN** the header fades and slides in (`y: 30 → 0`, `opacity: 0 → 1`), and when the grid enters, the cards cascade in (`y: 40 → 0`, `scale: 0.96 → 1`, `opacity: 0 → 1`, `stagger: 0.12`) with `power2.out` easing, clearing inline transform/opacity styles upon completion, and the sequence runs once (not doubled).

#### Scenario: Re-init after client-side navigation
- **WHEN** `astro:page-load` fires after a client-side navigation to a page containing the Gallery
- **THEN** the previous `gsap.matchMedia()` context is reverted, a new context is created, and the ScrollTrigger reveals are ready to fire when the user scrolls the section into view.

#### Scenario: Reduced motion preference honored
- **WHEN** the user's operating system sets `prefers-reduced-motion: reduce`
- **THEN** the gallery header and cards are shown without any entrance animation or movement.
