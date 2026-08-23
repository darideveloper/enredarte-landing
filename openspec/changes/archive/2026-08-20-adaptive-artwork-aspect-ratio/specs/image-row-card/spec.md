# image-row-card Specification

## Purpose
Defines the behavior of the `ImageRowCard` molecule when rendering a single artwork row in the gallery view, including how it surfaces the artwork price through the shared `CardSummary` atom and how it preserves each artwork's natural aspect ratio.

## ADDED Requirements

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

### Requirement: Preserve existing row behavior
The `ImageRowCard` molecule SHALL continue to support the `reverse` (image-side) layout, stack vertically on mobile, and pass the artwork title, `href`, artist metadata, and price to `CardSummary`, matching current behavior.

#### Scenario: Alternating image side
- **WHEN** `reverse` is `true`
- **THEN** the image column is ordered to the right and the info card to the left on desktop.

#### Scenario: Mobile stacking
- **WHEN** rendered on a narrow (mobile) viewport
- **THEN** the image renders above the info card, stacked vertically.
