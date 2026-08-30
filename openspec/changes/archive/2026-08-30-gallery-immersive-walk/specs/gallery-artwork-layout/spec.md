## MODIFIED Requirements

### Requirement: Render remaining artworks as alternating image/info-card rows

Every artwork in the gallery SHALL render as an alternating full-bleed row using the `ImageRowCard` molecule in `immersive` mode — one row with the image on the left and an info card on the right, the next mirrored. Each row SHALL display the artwork image at its natural aspect ratio on one half and the info card on the other, with the info card vertically centered in the row and pinned near the middle of the viewport while the user scrolls rows taller than the viewport. The info card SHALL show the artwork title, artist, and its discipline/technique/theme.

#### Scenario: All artworks render as immersive rows
- **GIVEN** a gallery with four artworks ordered by `sort_order`
- **WHEN** the artworks section renders
- **THEN** all four artworks render as alternating full-bleed rows, and no artwork is rendered as a featured banner

#### Scenario: Rows alternate image side
- **GIVEN** a gallery with two artworks
- **WHEN** the rows render
- **THEN** the first row has the image on the left and the second row has the image on the right
- **AND** each row shows the artwork's title, artist, and discipline/technique/theme in its info card

#### Scenario: Info card stays visible while scrolling a tall row
- **GIVEN** an artwork whose image is portrait (taller than the viewport)
- **WHEN** the user scrolls through the row
- **THEN** the image is shown uncropped at its natural aspect ratio
- **AND** the info card remains visible pinned near the middle of the viewport instead of scrolling out of view

#### Scenario: Short row centers the info card
- **GIVEN** an artwork whose image fits within the viewport
- **WHEN** the row renders and the user scrolls it into the middle of the viewport
- **THEN** the info card is vertically centered relative to the artwork image

#### Scenario: Rows stack on mobile
- **GIVEN** a narrow (mobile) viewport
- **WHEN** the artwork rows render
- **THEN** each row stacks vertically (image above info card) instead of side-by-side

### Requirement: Rows remain filterable

Each artwork row SHALL carry the same `data-*` facet attributes (`artist`, `discipline`, `technique`, `theme`, `format`, `scale`) as the homepage `ImageCard`s so the existing `Artworks` island can show/hide rows in response to filter selections.

#### Scenario: Filtering hides non-matching rows
- **GIVEN** the user selects the `artist` filter value matching only some gallery artworks
- **WHEN** the filter is applied
- **THEN** only the matching rows remain visible and the non-matching rows are hidden

## REMOVED Requirements

### Requirement: Render the first artwork as a featured banner

**Reason**: Replaced by the immersive walk — the gallery now presents every artwork through the same alternating full-bleed `ImageRowCard` in `immersive` mode, so the featured `ImageBanner` special-case is no longer rendered on the gallery page.

**Migration**: No replacement behavior is required for the featured position; all artworks (including what used to be the featured one) render as immersive alternating rows. `ImageBanner` remains available and continues to be used by `Hero.astro` and `ArtistPage.astro`.