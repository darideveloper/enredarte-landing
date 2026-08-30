# header-organism Specification

## Purpose
Defines the behavior contract, layout composition, atomic integrations, and navigation link states for the sticky header organism.

## MODIFIED Requirements

### Requirement: Navigation Links
The `Header` MUST delegate navigation rendering entirely to the `Menu` molecule by passing a `navLinks` array to it as a prop, and MUST localize link labels through the i18n `global.nav` translation keys.

#### Scenario: Rendering the four-item navigation
- **WHEN** the `Header` is rendered
- **THEN** it outputs a `<Menu>` molecule containing exactly four navigation links: **Home**, **Obras**, **Salas**, **Artistas**
- **THEN** the **Home** link points to the localized home page path (same logic as the logo, e.g. `/` for English, `/es` for Spanish)
- **THEN** the **Obras** and **Artistas** links point to the homepage collection section anchor (`#artworks-collection`), and the **Salas** link points to the homepage gallery section anchor (`#salas-gallery`) — real in-page targets, not dead placeholders

#### Scenario: Localizing navigation labels
- **WHEN** the site is rendered in Spanish
- **THEN** labels resolve to `Inicio`, `Obras`, `Salas`, `Artistas`
- **WHEN** the site is rendered in English
- **THEN** labels resolve to `Home`, `Works`, `Rooms`, `Artists`