## ADDED Requirements

### Requirement: Sala cards navigate to gallery detail pages
The homepage `Gallery` section SHALL render one card per gallery in the shared galleries module, and each card SHALL link to its gallery detail page (`/salas/<slug>` in English, `/es/salas/<slug>` in Spanish) instead of a dead `#` link.

#### Scenario: Homepage card opens the gallery page
- **GIVEN** the homepage gallery section with a card for the `tierra-mundo-y-memoria` gallery
- **WHEN** the user clicks that card
- **THEN** they are taken to `/salas/tierra-mundo-y-memoria`

#### Scenario: Card data comes from the shared module
- **GIVEN** the homepage gallery section
- **WHEN** it is rendered
- **THEN** each card's image, title, subtitle, meta, and curator line are derived from the shared galleries module (not an inline `salasData` array)
- **AND** each card's subtitle (e.g. "Sala 01 · Activa", "Sala 04 · Próximamente") is derived from the gallery's `sortOrder` and `status`
