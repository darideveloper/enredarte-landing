# gallery-organism Specification

## Purpose
Provides a composite layout section representing the "Pabellón de Salas", rendering a header and a grid of exhibition cards.
## Requirements
### Requirement: Render section header
The system SHALL display a header using the `Title` molecule.

#### Scenario: User views the gallery section
- **GIVEN** the gallery section is rendered
- **THEN** it displays an eyebrow ("Explora"), a main title ("Pabellón de Salas"), and an optional "Ver todas las salas →" link.

### Requirement: Render a grid of image cards
The system SHALL display a list of data as `ImageCard` components inside a responsive CSS grid layout.

#### Scenario: Grid item variations
- **GIVEN** a list of exhibition data containing a mix of standard and large cards
- **WHEN** the list is rendered
- **THEN** the first designated card renders as `isLarge` spanning two rows, and the remaining render as standard 1x1 cards.

### Requirement: GSAP scroll reveal for header and grid
The `Gallery` organism SHALL trigger a GSAP ScrollTrigger reveal when the section scrolls into view — the header fades/slides in first, then the gallery cards cascade in with a stagger — SHALL initialize via a direct `init()` call for first paint AND the `astro:page-load` event for client-side navigations, SHALL carry `transition:animate="none"` on its root element, and SHALL respect `prefers-reduced-motion`.

#### Scenario: Scroll reveal animation
- **WHEN** the gallery header intersects 85% of the viewport height on scroll and `prefers-reduced-motion` is `no-preference`
- **THEN** the header fades and slides in (`y: 30 → 0`, `opacity: 0 → 1`), and when the grid enters, the cards cascade in (`y: 40 → 0`, `scale: 0.96 → 1`, `opacity: 0 → 1`, `stagger: 0.12`) with `power2.out` easing, clearing inline transform/opacity styles upon completion, and the sequence runs once (not doubled).

#### Scenario: Reduced motion preference honored
- **WHEN** the user's operating system sets `prefers-reduced-motion: reduce`
- **THEN** the gallery header and cards are shown without any entrance animation or movement.

### Requirement: Revert context on client-side navigation
The `Gallery` organism SHALL revert its `gsap.matchMedia()` context on `astro:after-swap` before re-initializing.

#### Scenario: Re-init after client-side navigation
- **WHEN** `astro:page-load` fires after a client-side navigation to a page containing the Gallery
- **THEN** the previous `gsap.matchMedia()` context is reverted, a new context is created, and the ScrollTrigger reveals are ready to fire when the user scrolls the section into view.