## MODIFIED Requirements

### Requirement: Scroll-scrub reveals sequential images on desktop
For viewports at or above 1024px with `prefers-reduced-motion: no-preference`, the viewer SHALL pin the artwork section and progressively reveal each additional image as the user scrolls, updating the `1 / N` counter in sync with scroll progress. The pin SHALL engage when the section's top reaches the bottom of the sticky header (`start: "top 93px"`).

#### Scenario: Scrolling advances the gallery
- **WHEN** a multi-image artwork (2+ images) is viewed on a desktop viewport (≥1024px) with motion allowed and the user scrolls through the pinned range
- **THEN** each subsequent image becomes visible in sequence and the counter reflects the active image index

#### Scenario: Scrub engages immediately below the header
- **WHEN** the user scrolls on a multi-image artwork at desktop width
- **THEN** the pin-and-scrub begins as soon as the section top reaches the header's bottom edge, with no dead-zone where the user scrolls without animation

#### Scenario: Single-image artwork shows a static image
- **WHEN** an artwork has exactly one image
- **THEN** the viewer renders a single static image with no ScrollTrigger and no counter
