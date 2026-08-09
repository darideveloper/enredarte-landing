# artworks-organism Specification (Delta)

## MODIFIED Requirements

### Requirement: Artworks Grid Rendering
The system SHALL provide a React `Artworks` organism component that renders a responsive 4-column grid container, receives Astro `ImageCard` slot children stamped with `data-*` facet attributes, and toggles each card's visibility based on the catalog store's selections and loading state.

#### Scenario: Rendering arbitrary number of items
- **WHEN** `Artworks` receives an array of artwork items as slot children
- **THEN** it renders all items in a 4-column grid (2 rows of 4 items on desktop, responsive on smaller viewports).

#### Scenario: Hiding non-matching artworks after loading
- **WHEN** the catalog store selections change and the loading state has cleared
- **THEN** `Artworks` hides cards whose `data-*` facet attributes do not match the current selections

#### Scenario: Showing matching artworks after loading
- **WHEN** the catalog store selections change and the loading state has cleared
- **THEN** `Artworks` shows cards whose `data-*` facet attributes match the current selections

#### Scenario: Cards unchanged while loading
- **WHEN** the catalog store's loading state is `true`
- **THEN** `Artworks` does not change card visibility until loading completes

#### Scenario: Empty selections show all artworks
- **WHEN** no filters are selected and the loading state is cleared
- **THEN** `Artworks` shows all cards

### Requirement: Inline loader overlay
The system SHALL render an inline loader overlay over the artworks grid while the catalog store's loading state is `true`.

#### Scenario: Loader visible while loading
- **WHEN** the catalog store's `isLoading` is `true`
- **THEN** `Artworks` displays an inline loader overlay over the grid area

#### Scenario: Loader hidden after load
- **WHEN** the catalog store's `isLoading` becomes `false`
- **THEN** `Artworks` removes the loader overlay and displays the matching artworks

### Requirement: Astro slot children with facet attributes
The system SHALL render `Artworks`'s artwork cards as Astro `ImageCard` slot children, each stamped with `data-*` attributes (e.g. `data-artist`, `data-technique`) for facet matching. `Artworks` SHALL NOT render a React card component.

#### Scenario: Cards passed via slot
- **WHEN** `Home.astro` renders `Artworks`
- **THEN** it passes `ImageCard` components as slot children, and `Artworks` renders them within its grid container

#### Scenario: Facet attributes on cards
- **WHEN** an `ImageCard` is rendered as a slot child
- **THEN** it carries `data-*` facet attributes that `Artworks` uses to match against catalog store selections

#### Scenario: Localized loader message prop
- **WHEN** `Artworks` is rendered on a page for a given locale
- **THEN** it displays the localized loader message provided by the Astro caller as a prop
