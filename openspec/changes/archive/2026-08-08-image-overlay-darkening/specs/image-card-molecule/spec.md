## MODIFIED Requirements

### Requirement: Display dynamic hover states
The system SHALL support configurable hover overlay darkening via an `overlay` prop (`'hover' | 'darker' | 'always' | 'none'`) and `darkenOnHover` prop on `ImageCard.astro`.

#### Scenario: User hovers over the card
- **WHEN** the user hovers over the `ImageCard` container with `overlay="hover"` (default)
- **THEN** the background image scales smoothly (`group-hover:scale-105`) over a 500ms transition and the dark overlay deepens on hover (`group-hover:from-black/90 group-hover:via-black/50`) to optimize text contrast
