# catalog-empty-state Specification

## Purpose
Defines the zero-result UI for the "Colección completa" grid: when no artwork matches the current filters, the `Artworks` organism renders a localized message and a control that clears all filter selections and restores the full collection.

## ADDED Requirements

### Requirement: Zero-result empty state
The system SHALL render a visible empty-state block inside the `Artworks` organism whenever the active filter selections match zero artworks and the loading state is idle. The empty state SHALL replace the visual void left by a fully hidden grid and SHALL NOT appear while the simulated loader is active.

#### Scenario: Grid has no matches and loader is idle
- **WHEN** the current filter selections leave zero artwork cards visible and `isLoading` is `false`
- **THEN** an empty-state block is rendered in place of the collapsed grid

#### Scenario: Empty state suppressed during loading
- **WHEN** the grid has zero visible cards but `isLoading` is `true`
- **THEN** the empty state is not rendered until the loading state clears

#### Scenario: Grid with matches shows no empty state
- **WHEN** at least one artwork card remains visible
- **THEN** no empty-state block is rendered

#### Scenario: Empty selections never show the empty state
- **WHEN** all filter groups have no selections
- **THEN** every artwork is visible and the empty state is not rendered

### Requirement: Localized empty-state content
The empty state SHALL present a localized message informing the user that no artworks match the selected filters, plus a control to restart the filters. Both strings SHALL flow into the `Artworks` island as props from `Home.astro`, resolved server-side from the translation dictionaries, so the island holds no i18n machinery of its own.

#### Scenario: Message text is localized
- **WHEN** the empty state is rendered
- **THEN** it displays the localized "no results" message passed via the `emptyLabel` prop

#### Scenario: Control label is localized
- **WHEN** the empty state is rendered
- **THEN** the restart control displays the localized label passed via the `resetLabel` prop

#### Scenario: Translations exist in both languages
- **WHEN** the translation dictionaries are validated at build time
- **THEN** both `es.json` and `en.json` define the empty-state message and reset label under `global.filters`

### Requirement: Restart filters control
The empty state's restart control SHALL, on activation, clear all filter selections across every group via the catalog store's `reset` action, restoring the full collection. The control SHALL remain available regardless of whether the currently persisted selections are represented by any visible filter chip.

#### Scenario: Restart clears all selections
- **WHEN** a user activates the restart control from the empty state
- **THEN** all filter groups revert to empty selections and every artwork becomes visible

#### Scenario: Restart works with unrendered stale selections
- **WHEN** persisted selections reference slugs that no longer render as filter chips
- **THEN** the restart control still clears them and restores the full grid

#### Scenario: Restart triggers the loading state
- **WHEN** a user activates the restart control
- **THEN** the store enters its loading state and clears it after the simulated delay, matching the chip-toggle behavior
