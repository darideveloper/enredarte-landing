## ADDED Requirements

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
