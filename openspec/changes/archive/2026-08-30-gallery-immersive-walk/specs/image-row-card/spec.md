## ADDED Requirements

### Requirement: Render artwork in immersive mode with a sticky centered info card

When the `ImageRowCard` molecule receives the `immersive` prop, it SHALL render the artwork image at its natural aspect ratio on one half of the row and the info card on the other half, alternating image side via the `reverse` prop. The info card SHALL be vertically centered in the row and SHALL be pinned near the middle of the viewport (`md:sticky md:top-[35svh]`) while the user scrolls through rows taller than the viewport, so it stays visible while a portrait artwork scrolls. On mobile the row SHALL stack with the image above the info card, and the info card SHALL NOT be pinned.

#### Scenario: Portrait artwork keeps the info card visible
- **GIVEN** an `ImageRowCard` with `immersive` rendering a portrait artwork image on a desktop viewport
- **WHEN** the user scrolls through the row
- **THEN** the image is rendered uncropped at its natural aspect ratio
- **AND** the info card remains visible pinned near the middle of the viewport

#### Scenario: Short row centers the info card
- **GIVEN** an `ImageRowCard` with `immersive` rendering a square or landscape artwork that fits within the viewport
- **WHEN** the row is scrolled into the middle of the viewport
- **THEN** the info card is vertically centered relative to the artwork image and no pinning is applied

#### Scenario: Reverse flips the image side
- **GIVEN** an `ImageRowCard` with `immersive` and `reverse` set
- **WHEN** the row renders on a desktop viewport
- **THEN** the image is placed on the right and the info card on the left

#### Scenario: Mobile stacks without pinning
- **GIVEN** an `ImageRowCard` with `immersive` on a narrow (mobile) viewport
- **WHEN** the row renders
- **THEN** the image renders above the info card
- **AND** the info card is not pinned and appears in normal document flow below the image