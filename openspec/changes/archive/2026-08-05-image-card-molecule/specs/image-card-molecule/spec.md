## Purpose

Combines a background image and a text overlay into a cohesive, interactive card with hover effects.

## ADDED Requirements

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
The system SHALL change the background image's visual properties upon user interaction (hover).

#### Scenario: User hovers over the card
- **WHEN** the user hovers the card container
- **THEN** the background image's brightness/saturation filter changes and the image smoothly scales up.
