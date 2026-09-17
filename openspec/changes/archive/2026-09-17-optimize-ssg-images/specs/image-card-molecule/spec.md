## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Responsive card sizes per grid slot
The system SHALL render `ImageCard` images with slot-matched `sizes`: standard `"(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"` for 4-col grids (`Home`), `"... 33vw"` for 3-col grids (`CollectionIndex`, `CuratorSalas`), and a large/featured variant (`~60-66vw` on md/lg) when `isLarge` or featured, using `widths [400,800,1200]` and `loading="lazy"`.

#### Scenario: Phone card picks small variant
- **WHEN** a 390px phone renders a standard grid card
- **THEN** the browser selects the ~400w variant

#### Scenario: Large card picks larger variant
- **WHEN** `isLarge` renders on md viewport
- **THEN** the large `sizes` string applies and a larger variant is selected without changing crop or overlay
