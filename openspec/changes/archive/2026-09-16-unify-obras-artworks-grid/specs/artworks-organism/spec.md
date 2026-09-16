## MODIFIED Requirements

### Requirement: Artworks Grid Rendering
The system SHALL provide a React `Artworks` organism component that renders a responsive 4-column grid container, receives Astro `ImageCard` slot children stamped with `data-*` facet attributes, and toggles each card's visibility based on the catalog store's selections, loading state, and optional `limit` prop.

#### Scenario: Rendering arbitrary number of items
- **WHEN** `Artworks` receives an array of artwork items as slot children and no `limit` is set
- **THEN** it renders all items in a 4-column grid (2 rows of 4 items on desktop, responsive on smaller viewports).

#### Scenario: Hiding non-matching artworks after loading
- **WHEN** the catalog store selections change and the loading state has cleared
- **THEN** `Artworks` hides cards whose `data-*` facet attributes do not match the current selections

#### Scenario: Showing matching artworks after loading
- **WHEN** the catalog store selections change and the loading state has cleared
- **THEN** `Artworks` shows cards whose `data-*` facet attributes match the current selections, subject to the `limit` cap when set

#### Scenario: Cards unchanged while loading
- **WHEN** the catalog store's loading state is `true`
- **THEN** `Artworks` does not change card visibility until loading completes

#### Scenario: Empty selections show all artworks
- **WHEN** no filters are selected, the loading state is cleared, and no `limit` is set
- **THEN** `Artworks` shows all cards

#### Scenario: Empty selections with limit show the tail
- **WHEN** no filters are selected, the loading state is cleared, and `limit` is set
- **THEN** `Artworks` shows only the last `limit` cards in DOM (API) order

## ADDED Requirements

### Requirement: Result cap via limit prop
The `Artworks` component SHALL accept an optional `limit?: number` prop implementing filter-then-cap-tail semantics: it SHALL first compute the full matching set against the catalog store selections, then show only the last `limit` matches in DOM order and hide the earlier matches. An omitted `limit` SHALL preserve current uncapped behavior. The cap SHALL be silent (no count hint, no show-more control); overflow is served by the caller's link to the full index.

#### Scenario: Filter then cap prefers the tail
- **WHEN** `limit` is set and N artworks match with N greater than `limit`
- **THEN** the last `limit` matches in DOM order stay visible and the earlier matches are hidden

#### Scenario: Cap is a no-op under the limit
- **WHEN** `limit` is set and the matching set has `limit` or fewer artworks
- **THEN** all matching cards are visible

#### Scenario: Landing passes the full catalog with limit 12
- **WHEN** `Home.astro` renders its collection section
- **THEN** it passes every artwork as a slot child and sets `limit` to the `LANDING_LIMIT` constant (12), so filters search the whole catalog while the section stays a preview

#### Scenario: Cap re-applies after every selection change
- **WHEN** selections change (and loading clears) with `limit` set
- **THEN** the matching set is recomputed from all children and the tail cap is re-applied

#### Scenario: Empty state reflects matches, not the cap
- **WHEN** `limit` is set and at least one artwork matches
- **THEN** the empty-state block stays hidden (the cap never produces an empty state); it appears only when zero artworks match
