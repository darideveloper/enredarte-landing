## Purpose
Defines the `ImageBanner` component that composes an image and artwork metadata for display in featured sections like the Hero.

## ADDED Requirements

### Requirement: Display composed artwork information
The `ImageBanner` molecule SHALL accept artwork metadata (title, artist, price, href) and image properties (src, alt), and compose them visually.

#### Scenario: All data provided
- **WHEN** the component receives all artwork metadata and image props
- **THEN** it renders the `Image` atom as a background and the `CardSummary` molecule positioned over it.

#### Scenario: Partial metadata provided
- **WHEN** the component receives partial metadata (e.g., only title and href) alongside image props
- **THEN** it renders the `Image` atom and passes the partial metadata to the `CardSummary` molecule for correct display without errors.
