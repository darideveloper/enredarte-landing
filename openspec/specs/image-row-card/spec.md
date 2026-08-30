## Purpose
Defines the behavior of the `ImageRowCard` molecule when rendering a single artwork row in the gallery view, including how it surfaces the artwork price through the shared `CardSummary` atom and how it preserves each artwork's natural aspect ratio.

## Requirements

### Requirement: Render artwork title, artist, and price
The `ImageRowCard` molecule SHALL pass the artwork's title, `href`, artist metadata, and price to the `CardSummary` atom so the price is displayed consistently with other artwork cards.

#### Scenario: Artwork has a price
- **WHEN** `ImageRowCard` receives an artwork whose `price` is defined
- **THEN** it passes that price to `CardSummary`, which renders the price line.

#### Scenario: Artwork has no price
- **WHEN** `ImageRowCard` receives an artwork whose `price` is undefined (e.g. `price_usd` is zero)
- **THEN** no price is passed and `CardSummary` omits the price line without leaving empty space.

### Requirement: Render artwork at natural aspect ratio without cropping
The `ImageRowCard` molecule SHALL render the artwork image at its natural aspect ratio instead of cropping it into a fixed-height, `object-cover` container, so that the full artwork is visible regardless of whether it is landscape, portrait, or square.

#### Scenario: Landscape artwork
- **WHEN** `ImageRowCard` receives an artwork whose image is wider than tall
- **THEN** the image is rendered at its natural width-to-height ratio within the row and is not cropped top or bottom.

#### Scenario: Portrait artwork
- **WHEN** `ImageRowCard` receives an artwork whose image is taller than wide
- **THEN** the image is rendered at its natural width-to-height ratio within the row and is not cropped on the sides.

#### Scenario: Square artwork
- **WHEN** `ImageRowCard` receives an artwork whose image is square
- **THEN** the image is rendered at a 1:1 ratio and is not cropped.

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

### Requirement: Preserve existing row behavior
The `ImageRowCard` molecule SHALL continue to support the `reverse` (image-side) layout, stack vertically on mobile, and pass the artwork title, `href`, artist metadata, and price to `CardSummary`, matching current behavior.

#### Scenario: Alternating image side
- **WHEN** `reverse` is `true`
- **THEN** the image column is ordered to the right and the info card to the left on desktop.

#### Scenario: Mobile stacking
- **WHEN** rendered on a narrow (mobile) viewport
- **THEN** the image renders above the info card, stacked vertically.
