## ADDED Requirements

### Requirement: Choreographed GSAP entrance timeline
The `Hero` organism SHALL trigger a synchronized GSAP entrance animation sequence on client mount / page load.

#### Scenario: Entrance animation sequence execution
- **WHEN** the `Hero` component loads on the client
- **THEN** the artwork banner scales down smoothly (`scale: 1.12 → 1.0`), the room badge slides down (`y: -15 → 0`), the title slides up (`y: 35 → 0`), body description fades up (`y: 25 → 0`), and CTA buttons stagger in (`stagger: 0.1`) using GSAP timeline timing.
