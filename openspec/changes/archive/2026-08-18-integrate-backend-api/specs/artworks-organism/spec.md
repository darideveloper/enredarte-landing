## MODIFIED Requirements

### Requirement: Astro slot children with facet attributes
The system SHALL render `Artworks`'s artwork cards as Astro `ImageCard` slot children, each stamped with `data-*` attributes (e.g. `data-artist`, `data-discipline`, `data-technique`) for facet matching. Multi-valued facets SHALL encode all of an artwork's slugs in a single attribute as a space-separated list, and `Artworks` SHALL parse each attribute into an array before matching against the catalog store selections. `Artworks` SHALL NOT render a React card component.

#### Scenario: Cards passed via slot
- **WHEN** `Home.astro` renders `Artworks`
- **THEN** it passes `ImageCard` components as slot children, and `Artworks` renders them within its grid container

#### Scenario: Facet attributes on cards
- **WHEN** an `ImageCard` is rendered as a slot child
- **THEN** it carries `data-*` facet attributes that `Artworks` uses to match against catalog store selections

#### Scenario: Multi-valued facet encoded in one attribute
- **WHEN** an artwork belongs to the disciplines `pintura` and `collage`
- **THEN** its card carries a single `data-discipline` attribute whose value is a space-separated list (e.g. `"pintura collage"`) that `Artworks` parses into an array

#### Scenario: Localized loader message prop
- **WHEN** `Artworks` is rendered on a page for a given locale
- **THEN** it displays the localized loader message provided by the Astro caller as a prop
