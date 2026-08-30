# footer-organism Specification

## Purpose
Defines the behavior contract for the footer organism: dark editorial palette, atomic composition from existing atoms, shared navigation consumption, business-data-driven contact and social content, and a localized bottom bar.

## MODIFIED Requirements

### Requirement: Shared Navigation
The `Footer` MUST source its navigation links from the same shared `getNavLinks(lang)` helper as the `Header`, keeping both in sync.

#### Scenario: Mirroring the header navigation
- **WHEN** the `Footer` is rendered
- **THEN** it outputs exactly four navigation links: **Home**, **Obras**, **Salas**, **Artistas**
- **THEN** the **Home** link points to the localized home page path (e.g. `/` for English, `/es` for Spanish)
- **THEN** the **Obras** and **Artistas** links point to the homepage collection section anchor (`#artworks-collection`), and the **Salas** link points to the homepage gallery section anchor (`#salas-gallery`) — the same real in-page targets as the header