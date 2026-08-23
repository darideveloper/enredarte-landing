## MODIFIED Requirements

### Requirement: Generate a gallery detail route per gallery
The system SHALL generate a gallery detail page for every gallery fetched from the API at build time, in both languages — `/salas/<slug>` for English and `/es/salas/<slug>` for Spanish — by extending the existing `[...path].astro` catch-all `getStaticPaths()` and adding a `gallery` entry to its `COMPONENT_MAP`. No separate route file SHALL be introduced.

#### Scenario: English gallery page exists
- **GIVEN** a gallery with slug `tierra-mundo-y-memoria` returned by the API
- **WHEN** `/salas/tierra-mundo-y-memoria` is requested
- **THEN** the gallery detail page renders with the English gallery content

#### Scenario: Spanish gallery page exists
- **GIVEN** a gallery with slug `tierra-mundo-y-memoria` returned by the API
- **WHEN** `/es/salas/tierra-mundo-y-memoria` is requested
- **THEN** the gallery detail page renders with the Spanish gallery content

#### Scenario: Unknown slug yields no page
- **GIVEN** a slug with no matching gallery
- **WHEN** it is requested
- **THEN** no gallery page is emitted for that slug

### Requirement: Render the gallery hero
The gallery page SHALL render a hero section showing the gallery's localized name, a localized eyebrow/headline derived from the gallery's `sort_order` (e.g. "Sala 01"), its localized description, and a large representative image (the gallery logo/hero image). It SHALL reuse existing atoms (`Image`, `Title`, `Headline`).

#### Scenario: Hero shows localized gallery content
- **GIVEN** the user opens a gallery page in Spanish
- **THEN** the hero shows the Spanish gallery name and description (from the gallery's translation dictionary) and the gallery image
- **AND** the eyebrow derives from the gallery's `sort_order` only (e.g. "Sala 01", with no status suffix)
