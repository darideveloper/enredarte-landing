## Purpose

Provides a composite layout section representing the "Pabellón de Salas", rendering a header and a grid of exhibition cards with a GSAP ScrollTrigger reveal on scroll.

## ADDED Requirements

### Requirement: GSAP scroll reveal for header and grid
The `Gallery` organism SHALL trigger a GSAP ScrollTrigger reveal when the section scrolls into view — the header fades/slides in first, then the gallery cards cascade in with a stagger — SHALL initialize exactly once via the `astro:page-load` event, and SHALL respect `prefers-reduced-motion`.

#### Scenario: Scroll reveal animation
- **WHEN** the gallery header intersects 85% of the viewport height on scroll
- **THEN** the header fades and slides in (`y: 30 → 0`, `opacity: 0 → 1`), and when the grid enters, the cards cascade in (`y: 40 → 0`, `scale: 0.96 → 1`, `opacity: 0 → 1`, `stagger: 0.12`) with `power2.out` easing, clearing inline transform/opacity styles upon completion, and the sequence runs once (not doubled).

#### Scenario: Reduced motion preference honored
- **WHEN** the user's operating system sets `prefers-reduced-motion: reduce`
- **THEN** the gallery header and cards are shown without any entrance animation or movement.