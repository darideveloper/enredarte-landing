## Purpose

Defines the `BannerBar` organism component that renders key gallery value propositions with a GSAP ScrollTrigger staggered cascade entrance animation on scroll.

## Requirements

### Requirement: ScrollTrigger staggered cascade entrance
The `BannerBar` organism SHALL trigger a GSAP ScrollTrigger staggered cascade entrance sequence when scrolled into view, SHALL initialize via a direct `init()` call for first paint AND the `astro:page-load` event for client-side navigations, SHALL carry `transition:animate="none"` on its root element, SHALL revert its `gsap.matchMedia()` context on `astro:after-swap` before re-initializing, and SHALL respect `prefers-reduced-motion` so reduced-motion users get no movement.

#### Scenario: Scroll entrance animation
- **WHEN** the `BannerBar` container enters 85% of the viewport height on scroll and `prefers-reduced-motion` is `no-preference`
- **THEN** the value proposition text items cascade into view from below (`y: 25 → 0`, `opacity: 0 → 1`, `stagger: 0.15`) with smooth `power2.out` easing, and clear inline transform styles upon completion, and the sequence runs once (not doubled).

#### Scenario: Re-init after client-side navigation
- **WHEN** `astro:page-load` fires after a client-side navigation to a page containing the BannerBar
- **THEN** the previous `gsap.matchMedia()` context is reverted, a new context is created, and the ScrollTrigger cascade entrance is ready to fire when the user scrolls the BannerBar into view.

#### Scenario: Reduced motion preference honored
- **WHEN** the user's operating system sets `prefers-reduced-motion: reduce`
- **THEN** the banner items are shown without any entrance animation or movement.