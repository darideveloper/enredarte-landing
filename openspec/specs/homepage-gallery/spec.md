# homepage-gallery Specification

## Purpose
Integrates the recently built `Gallery` organism into the main landing page.
## Requirements
### Requirement: Render the gallery section
The system SHALL display the `Gallery` organism below the `Hero` section on the landing page.

#### Scenario: User visits the homepage
- **GIVEN** the user navigates to the root `/` page
- **THEN** they see the `Hero` component
- **AND** below it, they see the `Gallery` component populated with exhibition data.

### Requirement: Sala cards navigate to gallery detail pages
The homepage `Gallery` section SHALL render one card per gallery fetched from the API at build time, and each card SHALL link to its gallery detail page (`/salas/<slug>` in English, `/es/salas/<slug>` in Spanish) instead of a dead `#` link.

#### Scenario: Homepage card opens the gallery page
- **GIVEN** the homepage gallery section with a card for the `tierra-mundo-y-memoria` gallery
- **WHEN** the user clicks that card
- **THEN** they are taken to `/salas/tierra-mundo-y-memoria`

#### Scenario: Card data comes from the API
- **GIVEN** the homepage gallery section
- **WHEN** it is rendered
- **THEN** each card's image, title, subtitle, meta, and curator line are derived from the galleries fetched from the API (not an inline `salasData` array)
- **AND** each card's subtitle (e.g. "Sala 01", "Sala 04") is derived from the gallery's `sort_order` only

