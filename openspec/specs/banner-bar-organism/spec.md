## Purpose

Defines the `BannerBar` organism component that renders key gallery value propositions with a GSAP ScrollTrigger staggered cascade entrance animation on scroll.

## ADDED Requirements

### Requirement: ScrollTrigger staggered cascade entrance
The `BannerBar` organism SHALL trigger a GSAP ScrollTrigger staggered cascade entrance sequence when scrolled into view.

#### Scenario: Scroll entrance animation
- **WHEN** the `BannerBar` container enters 85% of the viewport height on scroll
- **THEN** the value proposition text items cascade into view from below (`y: 25 → 0`, `opacity: 0 → 1`, `stagger: 0.15`) with smooth `power2.out` easing, and clear inline transform styles upon completion.
