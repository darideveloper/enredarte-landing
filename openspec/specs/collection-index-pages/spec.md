# collection-index-pages Specification

## Purpose
Defines the behavior contract for the dedicated collection index pages (`obras`, `salas`, `artistas`, `curadores`) in both languages and their discovery from the homepage.

## Requirements
### Requirement: Collection index routes
The system SHALL expose index pages for `obras`, `salas`, `artistas`, and `curadores` in both languages using Spanish-slug canonical paths with an `en/` prefix for English.

#### Scenario: Resolving index URLs
- **WHEN** a visitor requests `/obras`, `/salas`, `/artistas`, or `/curadores`
- **THEN** the Spanish index page renders
- **WHEN** a visitor requests `/en/obras`, `/en/salas`, `/en/artistas`, or `/en/curadores`
- **THEN** the English index page renders

#### Scenario: Language switching on index pages
- **WHEN** the visitor toggles language on any of the four index pages
- **THEN** `LangBtns` links to the same index in the alternate language (slug-preserving, derived from `routes.ts`)

### Requirement: Index discovery from Home
The homepage collection and gallery sections SHALL link to their corresponding index pages, consistent with the nav targets.

#### Scenario: Ver-todo links
- **WHEN** the homepage collection section (`#artworks-collection`) renders
- **THEN** it exposes links to the `obras` and `artistas` index pages
- **WHEN** the homepage gallery section (`#salas-gallery`) renders
- **THEN** it exposes a link to the `salas` index page

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
