# image-card-molecule Specification

## Purpose
Combines a background image and a text overlay into a cohesive, interactive card with hover effects.
## Requirements
### Requirement: Render a composite interactive card
The system SHALL render a card combining a background image and an overlay link.

#### Scenario: Navigate to card target
- **WHEN** the user interacts with the card
- **THEN** they are navigated to the URL defined by the `href` prop.

### Requirement: Support visual size variants
The system SHALL support a "large" variant for grid layouts.

#### Scenario: Large variant rendered
- **WHEN** the `isLarge` prop is true
- **THEN** the card takes up proportionally more vertical space and adjusts text sizes according to the design.

### Requirement: Display dynamic hover states
The system SHALL support configurable hover overlay darkening via an `overlay` prop (`'hover' | 'darker' | 'always' | 'none'`) and `darkenOnHover` prop on `ImageCard.astro`.

#### Scenario: User hovers over the card
- **WHEN** the user hovers over the `ImageCard` container with `overlay="hover"` (default)
- **THEN** the background image scales smoothly (`group-hover:scale-105`) over a 500ms transition and the dark overlay deepens on hover (`group-hover:from-black/90 group-hover:via-black/50`) to optimize text contrast
