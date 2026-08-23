## MODIFIED Requirements

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
