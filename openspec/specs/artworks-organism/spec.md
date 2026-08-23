# artworks-organism Specification

## Purpose
Defines the requirement for the `Artworks` organism component.

## Requirements
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
### Requirement: ScrollTrigger staggered cascade entrance
The `Artworks` collection section SHALL execute a GSAP `ScrollTrigger` staggered cascade entrance animation when scrolled into view.

#### Scenario: Scroll entrance animation
- **WHEN** the `Artworks` collection section reaches 80% of the viewport height on scroll
- **THEN** the section header slides up (`y: 30 → 0`), filter pills slide in (`x: -15 → 0`), and the 8 artwork cards cascade in a smooth wave (`y: 35 → 0`, `scale: 0.96 → 1`, `stagger: 0.08`), clearing inline transforms upon completion.

### Requirement: Interactive filter tab switching animation
The `Artworks` collection section SHALL animate artwork grid items when a filter pill tab is selected.

#### Scenario: Filter selection
- **WHEN** a user clicks a filter pill tab
- **THEN** the active tab updates its visual state and the artwork cards trigger a quick GSAP scale/fade transition (`scale: 0.96 → 1`, `opacity: 0 → 1`, `stagger: 0.04`).
