## MODIFIED Requirements

### Requirement: Render artwork title, artist, and price
The `ImageRowCard` molecule SHALL pass the artwork's title, `href`, artist metadata, and price information to the `CardSummary` atom so the price is displayed consistently with other artwork cards. The molecule SHALL forward the raw `priceMxn` and `priceUsd` numbers plus the current `lang` and SHALL NOT pre-format a price string.

#### Scenario: Artwork has prices in the active language
- **WHEN** `ImageRowCard` receives an artwork whose price for the current language is defined
- **THEN** it passes `priceMxn`, `priceUsd`, and `lang` to `CardSummary`, which formats and renders the price line in the current language's currency

#### Scenario: Artwork has no price in the active language
- **WHEN** `ImageRowCard` receives an artwork whose price for the current language is undefined or zero (e.g. the active currency's source value is zero)
- **THEN** no price is rendered and `CardSummary` omits the price line without leaving empty space

### Requirement: Preserve existing row behavior
The `ImageRowCard` molecule SHALL continue to support the `reverse` (image-side) layout, stack vertically on mobile, and pass the artwork title, `href`, artist metadata, and price to `CardSummary`, matching current behavior.

#### Scenario: Alternating image side
- **WHEN** `reverse` is `true`
- **THEN** the image column is ordered to the right and the info card to the left on desktop.

#### Scenario: Mobile stacking
- **WHEN** rendered on a narrow (mobile) viewport
- **THEN** the image renders above the info card, stacked vertically.
