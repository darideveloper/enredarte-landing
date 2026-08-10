## ADDED Requirements

### Requirement: Scroll-scrubbed parallax depth shift for featured card
The `Gallery` organism SHALL execute a GSAP `ScrollTrigger` scrubbed parallax depth translation on the main featured room card as the user scrolls through the section.

#### Scenario: User scrolls through Pabellón de Salas
- **WHEN** the user scrolls down through the `Gallery` section on desktop/tablet viewports
- **THEN** the header reveals with an entrance fade, the standard room cards animate into position, and the large featured card translates vertically (`y: -25` to `y: 25`) with `scrub: 1` relative to page scroll position.
