# catalog-filter-availability Specification

## Purpose
Defines how the "Colección completa" filters expose availability (viable vs. non-viable) per option so that options which cannot match any artwork are disabled, while preserving a deselection path for active chips. Availability is computed client-side from the embedded catalog snapshot.

## Requirements
### Requirement: Viable option determination
The system SHALL expose a pure function `computeViableOptions(groups, facets, selections)` that returns, per filter group, the set of option values that can still match at least one artwork given the current selections. An option `o` in group `g` SHALL be considered viable if and only if there exists an artwork whose facets match the current selections with group `g` replaced by the single value `o`. This preserves within-group OR semantics (an option in a group is evaluated independently of the group's own selections) while applying cross-group AND constraints via the existing `matchesArtwork` predicate.

#### Scenario: Option matches under current selections
- **WHEN** selections are empty
- **THEN** every option that has at least one artwork with that facet value is viable

#### Scenario: Option with no artwork is never viable
- **WHEN** an option value does not appear in any artwork's facets
- **THEN** that option is non-viable regardless of selections

#### Scenario: Cross-group constraint makes an option non-viable
- **WHEN** the current selections constrain other groups such that no artwork combines them with the candidate option
- **THEN** the candidate option is non-viable

#### Scenario: Sibling options in the same group stay viable
- **WHEN** a group has one or more selections
- **THEN** every other option in that same group remains viable as long as it has at least one artwork, because the group's own selections are ignored when evaluating its options

### Requirement: Disabled rendering of non-viable options
The system SHALL render a non-viable, non-active filter option as disabled: visually dimmed, with a non-interactive cursor, without hover effects, and with both the native `disabled` attribute and `aria-disabled` set. Clicking or keyboard-activating a disabled option SHALL NOT modify the store selections.

#### Scenario: Non-viable option appears disabled
- **WHEN** a filter option is non-viable and not currently selected
- **THEN** the chip is rendered dimmed, sets `disabled` and `aria-disabled`, and cannot be activated

#### Scenario: Clicking a disabled option changes nothing
- **WHEN** a user clicks or activates a disabled filter option
- **THEN** the store selections are unchanged

### Requirement: Active chips remain interactive
The system SHALL keep a currently-selected (active) filter chip interactive and visually active even when it would otherwise be non-viable, so the user can always deselect it. A chip SHALL be considered disabled only when it is both non-viable and not active.

#### Scenario: Active chip is never disabled
- **WHEN** a chip is selected and the remaining selections over-constrain its viability
- **THEN** the chip stays active, clickable, and its activation toggles its selection off

### Requirement: Availability derived client-side from the embedded catalog
The system SHALL compute filter availability entirely client-side from the artwork facet data embedded in the page; availability SHALL NOT require any additional API calls, and SHALL NOT store the facet matrix in the catalog store. The facet matrix SHALL reach the `Filters` island as a prop from `Home.astro` alongside the localized group definitions, so a future catalog API only replaces `Home.astro`'s data source.

#### Scenario: Facet data provided via prop
- **WHEN** the `Filters` island mounts
- **THEN** it receives the artwork facet matrix as a prop and derives availability from it plus the current selections

#### Scenario: Availability updates with selections
- **WHEN** a selection changes
- **THEN** each chip's disabled state is recomputed from the new selections without any network request

#### Scenario: Store holds no facet data
- **WHEN** the catalog store is inspected
- **THEN** it holds no facet matrix or artwork data, consistent with the store-holds-state-only rule
