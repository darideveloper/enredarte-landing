## MODIFIED Requirements

### Requirement: Render the gallery section
The system SHALL display the `Gallery` organism below the `Hero` section on the landing page, and the artworks collection header SHALL be sourced from i18n (`pages.home.collection.eyebrow` / `pages.home.collection.title`, e.g. `Selección` / `Selection`, `Obras disponibles` / `Available works`) instead of hardcoded `Explora` / `Colección completa`, and filters/empty-state labels SHALL use formal i18n strings (`Afinar selección` / `Refine selection`, `Ninguna obra corresponde a su búsqueda. Le invitamos a afinar su selección.`).

#### Scenario: User visits the homepage
- **GIVEN** the user navigates to the root `/` page
- **THEN** they see the `Hero` component
- **AND** below it, they see the `Gallery` component populated with exhibition data
- **AND** the artworks collection header displays the i18n formal strings

#### Scenario: Formal empty and filter states
- **WHEN** no artworks match the selected filters
- **THEN** the empty message and reset label appear in formal `usted` register from i18n
