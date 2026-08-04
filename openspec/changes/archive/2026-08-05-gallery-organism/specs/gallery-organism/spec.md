## Purpose

Provides a composite layout section representing the "Pabellón de Salas", rendering a header and a grid of exhibition cards.

## ADDED Requirements

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
