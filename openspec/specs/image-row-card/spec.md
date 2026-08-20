---
## Purpose
Defines the behavior of the `ImageRowCard` molecule when rendering a single artwork row in the gallery view, including how it surfaces the artwork price through the shared `CardSummary` atom.

## ADDED Requirements

### Requirement: Render artwork title, artist, and price
The `ImageRowCard` molecule SHALL pass the artwork's title, `href`, artist metadata, and price to the `CardSummary` atom so the price is displayed consistently with other artwork cards.

#### Scenario: Artwork has a price
- **WHEN** `ImageRowCard` receives an artwork whose `price` is defined
- **THEN** it passes that price to `CardSummary`, which renders the price line.

#### Scenario: Artwork has no price
- **WHEN** `ImageRowCard` receives an artwork whose `price` is undefined (e.g. `price_usd` is zero)
- **THEN** no price is passed and `CardSummary` omits the price line without leaving empty space.
