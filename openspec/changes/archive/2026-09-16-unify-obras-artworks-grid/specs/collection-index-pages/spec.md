## ADDED Requirements

### Requirement: Obras index renders the interactive catalog
The `obras` index page SHALL render the `obras-catalog` (same `Filters` + `Artworks` + `ImageCard` composition as the landing collection section, uncapped, identical default grid) instead of its current static card grid, in both languages. Routes, language-switch behavior, header copy, and the `salas` / `artistas` / `curadores` indexes are unchanged.

#### Scenario: Obras shows filterable grid
- **WHEN** a visitor opens `/obras` or `/en/obras`
- **THEN** the page shows the filter panel and the interactive artworks grid rather than a static grid

#### Scenario: Index URLs and language switch unchanged
- **WHEN** a visitor requests `/obras` or `/en/obras`, or toggles language on either
- **THEN** routing and slug-preserving language switching behave exactly as before

#### Scenario: Homepage discovery links unchanged
- **WHEN** the homepage collection section renders
- **THEN** it still exposes the same links to the `obras` (and `artistas`) index pages
