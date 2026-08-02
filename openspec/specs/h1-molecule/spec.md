## Purpose
Defines the behavior and layout constraints for the H1 molecule, the main editorial heading block in the Hero section.

## ADDED Requirements

### Requirement: Display main heading structure
The H1 molecule SHALL display a composite heading structure consisting of a small uppercase eyebrow (Headline atom) and a large serif title.

#### Scenario: Normal rendering
- **WHEN** the component is rendered with a main title and an eyebrow text
- **THEN** it displays the eyebrow text using the Headline atom styled with the `muted` color variant
- **AND** it displays the main title below the eyebrow using the large serif styling (`font-serif text-5xl md:text-7xl font-normal text-ink`).

### Requirement: Support responsive layout
The H1 molecule SHALL apply appropriate responsive spacing and sizing to its internal elements.

#### Scenario: Mobile and Desktop spacing
- **WHEN** rendered on any screen size
- **THEN** it maintains a vertical gap (`gap-4`) between the eyebrow text and the main title, ensuring visual consistency across devices.
