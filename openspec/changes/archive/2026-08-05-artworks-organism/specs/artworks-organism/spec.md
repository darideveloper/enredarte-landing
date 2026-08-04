## Purpose

Defines the requirement for the `Artworks` organism component.

## ADDED Requirements

### Requirement: Artworks Grid Rendering
The system SHALL provide an `Artworks` organism component that accepts an array of artwork items and renders them inside a 4-column responsive grid using `ImageCard`.

#### Scenario: Rendering arbitrary number of items
- **GIVEN** `Artworks` receives an array of 8 artwork items
- **THEN** it renders all 8 items in a 4-column grid (2 rows of 4 items on desktop, responsive on smaller viewports).
