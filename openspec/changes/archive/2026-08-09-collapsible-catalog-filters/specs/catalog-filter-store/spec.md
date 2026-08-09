# catalog-filter-store Specification

## MODIFIED Requirements

### Requirement: Persisted filter selections
The store SHALL persist filter selections to browser storage via the `persist` middleware. The persisted payload SHALL contain the `selections` object and the `isExpanded` flag; the loading state and any other store data SHALL be excluded. The persisted key SHALL be namespaced distinctly from the form store (`enredarte-catalog-storage`).

#### Scenario: Selections survive reload
- **WHEN** a user selects filter values and reloads the page
- **THEN** the previously selected values are restored

#### Scenario: Loading state is not persisted
- **WHEN** the store state is serialized to storage
- **THEN** `isLoading` is excluded from the persisted payload

#### Scenario: Persisted payload contains selections and expansion flag
- **WHEN** the store state is serialized to storage
- **THEN** the persisted payload contains the `selections` object and the `isExpanded` flag

#### Scenario: Existing persisted data remains valid
- **WHEN** stored data contains only `selections` (written before this change)
- **THEN** the store loads it without error and `isExpanded` defaults to `false`

## ADDED Requirements

### Requirement: Persisted expand/collapse preference
The catalog store SHALL own a boolean `isExpanded` flag that records whether the full set of filter groups is shown, together with an action to toggle it. The flag SHALL default to `false`, SHALL flip each time the toggle action is invoked, and SHALL be persisted to browser storage alongside `selections` via the existing `persist`/`partialize` mechanism under the same `enredarte-catalog-storage` key.

#### Scenario: Expanded state defaults to collapsed
- **WHEN** the catalog store is initialized with no persisted data
- **THEN** `isExpanded` is `false`

#### Scenario: Toggling expands and collapses
- **WHEN** a user activates the filter toggle action
- **THEN** `isExpanded` flips between `false` and `true` on each activation

#### Scenario: Expansion preference survives reload
- **WHEN** a user expands the filter panel and reloads the page
- **THEN** `isExpanded` is restored from storage to the persisted value

#### Scenario: Shared hook exposes the flag
- **WHEN** a component needs the expansion preference
- **THEN** it reads `isExpanded` and toggles it through the shared catalog hook, not by creating its own store instance
