# gallery-artwork-layout Specification

## Purpose
Presents the gallery's artworks on the detail page with an improved layout — the first artwork as a featured banner and the rest as alternating image/info-card rows — while remaining filterable through the existing `Artworks` island.

## Requirements

### Requirement: Render the first artwork as a featured banner
The artworks section SHALL render the gallery's first artwork (by `sort_order`) as a large featured banner using the existing `ImageBanner` molecule (image + `CardSummary` overlay).

#### Scenario: Featured artwork is shown first
- **GIVEN** a gallery with three artworks ordered by `sort_order`
- **WHEN** the artworks section renders
- **THEN** the first artwork renders as a full-width featured banner with its image, title, artist, and the consult/status line
- **AND** the remaining artworks render below it in order

### Requirement: Render remaining artworks as alternating image/info-card rows
The remaining artworks SHALL render as alternating rows — one row with the image on the left and an info card on the right, the next mirrored — using a new `ImageRowCard` molecule that composes the existing `Image` atom and a `CardSummary`-style info card. The info card SHALL show the artwork title, artist, and its discipline/technique/theme.

#### Scenario: Rows alternate image side
- **GIVEN** a gallery with two remaining artworks after the featured one
- **WHEN** the rows render
- **THEN** the first row has the image on the left and the second row has the image on the right
- **AND** each row shows the artwork's title, artist, and discipline/technique/theme in its info card

#### Scenario: Rows stack on mobile
- **GIVEN** a narrow (mobile) viewport
- **WHEN** the artwork rows render
- **THEN** each row stacks vertically (image above info card) instead of side-by-side

### Requirement: Rows remain filterable
Each artwork row SHALL carry the same `data-*` facet attributes (`artist`, `discipline`, `technique`, `theme`, `format`, `scale`) as the homepage `ImageCard`s so the existing `Artworks` island can show/hide rows in response to filter selections.

#### Scenario: Filtering hides non-matching rows
- **GIVEN** the user selects the `artist` filter value matching only some gallery artworks
- **WHEN** the filter is applied
- **THEN** only the matching rows remain visible and the featured banner reflects the filter state consistently
