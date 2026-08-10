## ADDED Requirements

### Requirement: ScrollTrigger staggered cascade entrance
The `Artworks` collection section SHALL execute a GSAP `ScrollTrigger` staggered cascade entrance animation when scrolled into view.

#### Scenario: Scroll entrance animation
- **WHEN** the `Artworks` collection section reaches 80% of the viewport height on scroll
- **THEN** the section header slides up (`y: 30 → 0`), filter pills slide in (`x: -15 → 0`), and the 8 artwork cards cascade in a smooth wave (`y: 35 → 0`, `scale: 0.96 → 1`, `stagger: 0.08`), clearing inline transforms upon completion.

### Requirement: Interactive filter tab switching animation
The `Artworks` collection section SHALL animate artwork grid items when a filter pill tab is selected.

#### Scenario: Filter selection
- **WHEN** a user clicks a filter pill tab
- **THEN** the active tab updates its visual state and the artwork cards trigger a quick GSAP scale/fade transition (`scale: 0.96 → 1`, `opacity: 0 → 1`, `stagger: 0.04`).
