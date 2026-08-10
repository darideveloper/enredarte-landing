## Purpose
Defines the `Hero` organism component, serving as the main entry point for the landing page with composed typography and image molecules.

## ADDED Requirements

### Requirement: Display composed hero section
The `Hero` organism SHALL assemble the `H1` typography molecule on the left and the `ImageBanner` molecule on the right.

#### Scenario: Normal rendering
- **WHEN** the `Hero` component is rendered
- **THEN** it displays a two-column responsive layout, where the left column contains the H1, text, and curator info, and the right column contains an `ImageBanner`.

### Requirement: Accept dynamic H1 content via slot
The `Hero` component SHALL pass dynamic content to its internal `H1` molecule via slots.

#### Scenario: Slotted H1
- **WHEN** the user provides slotted content for the H1
- **THEN** it renders the slotted content correctly within the left column's `H1` molecule.

### Requirement: Choreographed GSAP entrance timeline
The `Hero` organism SHALL trigger a synchronized GSAP entrance animation sequence on client mount / page load.

#### Scenario: Entrance animation sequence execution
- **WHEN** the `Hero` component loads on the client
- **THEN** the artwork banner scales down smoothly (`scale: 1.12 → 1.0`), the room badge slides down (`y: -15 → 0`), the title slides up (`y: 35 → 0`), body description fades up (`y: 25 → 0`), and CTA buttons stagger in (`stagger: 0.1`) using GSAP timeline timing.
