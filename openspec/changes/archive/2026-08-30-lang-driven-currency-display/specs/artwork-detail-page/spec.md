## MODIFIED Requirements

### Requirement: Render the editorial info panel
The right info panel SHALL show the artwork's localized title, the artist name, the year, the dimensions, a localized description, the price (in the currency matching the active language), the availability status, and a spec list of its localized discipline, technique, theme, format, and scale labels.

#### Scenario: Panel shows full artwork data
- **GIVEN** an artwork with title, artist, year, dimensions, description, prices in both currencies, status, and taxonomy refs
- **WHEN** the info panel renders
- **THEN** all of those fields are visible with the taxonomy labels localized to the active language
- **AND** the dimensions are shown alongside the year
- **AND** the price is shown in MXN when `lang === "es"` and in USD when `lang === "en"`

#### Scenario: Spanish page falls back to USD when MXN is missing
- **GIVEN** an artwork with `price_mxn = 0` and `price_usd > 0`
- **WHEN** the info panel renders on a Spanish page
- **THEN** the price line is omitted (the chosen currency is missing); the artwork does not silently show USD on a Spanish page

#### Scenario: English page falls back gracefully when USD is missing
- **GIVEN** an artwork with `price_usd = 0` and `price_mxn > 0`
- **WHEN** the info panel renders on an English page
- **THEN** the price line is omitted (the chosen currency is missing); the artwork does not silently show MXN on an English page

#### Scenario: Missing optional fields are omitted
- **GIVEN** an artwork with no price in the active language and no description
- **THEN** the price and description rows are omitted without error
