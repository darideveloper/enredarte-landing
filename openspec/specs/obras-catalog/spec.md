# obras-catalog Specification

## Purpose
Defines the behavior contract for the interactive filterable artworks catalog on the `/obras` index page (both languages): the full collection rendered through the same `Filters` + `Artworks` + `ImageCard` composition as the landing collection section, uncapped, with carried-over filter state.

## Requirements
### Requirement: Obras catalog renders full artwork collection
The system SHALL render the `/obras` index (`/en/obras` in English) as an interactive catalog showing every artwork by default, using the same `Filters` + `Artworks` + `ImageCard` composition as the landing collection section but without a result cap.

#### Scenario: All artworks visible by default
- **WHEN** a visitor opens `/obras` with no filter selections
- **THEN** every artwork card is visible

#### Scenario: Identical grid to landing
- **WHEN** the `/obras` catalog renders
- **THEN** it uses the `Artworks` default grid (`grid gap-[3px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), identical to landing

#### Scenario: Other indexes unchanged
- **WHEN** a visitor opens `/salas`, `/artistas`, or `/curadores`
- **THEN** those pages keep their existing static card grids with no filters

### Requirement: Obras catalog filter groups
The `/obras` catalog SHALL expose all six filter groups (artist, discipline, technique, theme, format, scale) with the same localized labels, options, viability disabling, and collapsed-by-default expand/collapse behavior as landing.

#### Scenario: Six groups with same behavior
- **WHEN** the `/obras` catalog renders
- **THEN** `Filters` receives the full localized `filterGroups` and artwork `facets`, matching landing's configuration

#### Scenario: Filtering narrows the catalog
- **WHEN** the visitor selects filter chips on `/obras`
- **THEN** only matching cards stay visible, with the same match semantics (`matchesArtwork`) as landing

### Requirement: Obras catalog cards carry price and facets
Each `/obras` artwork card SHALL be an `ImageCard` stamped with the per-language formatted `price` and all six space-separated `data-*` facet attributes, built from the same `toArtworkView` data as landing.

#### Scenario: Price visible per language
- **WHEN** the `/obras` catalog renders for a locale
- **THEN** each card shows its price formatted via `pickPrice` + `formatPrice` + `currencyForLang` (es → MXN, en → USD), exactly as landing does

#### Scenario: Cards link to artwork detail
- **WHEN** a visitor activates an `/obras` card
- **THEN** it navigates to the artwork detail page (`getLocalizedArtworkPath`), same as landing cards

### Requirement: Obras catalog empty and loading states
The `/obras` catalog SHALL render the same localized loading overlay and empty-state block (message + reset button) as landing, driven by the same catalog store.

#### Scenario: No matches shows empty state
- **WHEN** no artwork matches the current selections on `/obras`
- **THEN** the localized empty message and reset button appear, and reset clears all selections

#### Scenario: Localized labels match landing
- **WHEN** the `/obras` catalog renders for a locale
- **THEN** loading, empty, and reset labels use the same i18n strings as landing (`global.loading`, `global.filters.noResults`, `global.filters.reset`)

### Requirement: Filter selections carry over from landing
The system SHALL NOT reset catalog selections when navigating between landing and `/obras`; the persisted `catalog` store is the single source of filter state for both pages.

#### Scenario: Landing selection applies on obras
- **WHEN** a visitor selects filters on landing and follows "Ver todas las obras" to `/obras`
- **THEN** the same selections are active and the catalog shows the full matching set (uncapped)

#### Scenario: No selection shows everything
- **WHEN** a visitor opens `/obras` with an empty persisted selection
- **THEN** all artworks are visible
