## Purpose
Defines the behavior and layout constraints for the H1 molecule, the main editorial heading block in the Hero section.

## Requirements

### Requirement: Display main heading structure
The H1 molecule SHALL render a vertically stacked container that wraps slotted content in a large serif heading, allowing consumers (e.g. the Hero section) to compose an uppercase eyebrow via the `Headline` atom alongside the main title.

#### Scenario: Normal rendering
- **WHEN** the component is rendered with a `Headline` eyebrow and a main title passed through its slot
- **THEN** it applies a vertical gap (`gap-4`) between the eyebrow and the main title
- **AND** the main title uses the large serif styling (`font-serif text-5xl md:text-7xl font-normal text-ink`).

### Requirement: Support responsive layout
The H1 molecule SHALL apply appropriate responsive spacing and sizing to its internal elements.

#### Scenario: Mobile and Desktop spacing
- **WHEN** rendered on any screen size
- **THEN** it maintains a vertical gap (`gap-4`) between the eyebrow text and the main title, ensuring visual consistency across devices.
