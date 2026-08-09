# catalog-filter-store Specification

## Purpose
Defines the requirement for the dedicated `catalog` Zustand store that owns filter state for the "Colección completa" section.

## Requirements
### Requirement: Separate Zustand store for filter state
The system SHALL provide a dedicated Zustand store at `src/store/catalog.ts` that owns all filter state for the "Colección completa" section: multi-select selections and a loading flag. This store SHALL be separate from `src/store/form.ts` and SHALL NOT duplicate the form store's state or machinery. The store SHALL hold state only — fixture group definitions and localized labels SHALL NOT live in the store.

#### Scenario: Store exists independently
- **WHEN** the landing page loads with the interactive collection section
- **THEN** a `catalog` store exists at `src/store/catalog.ts` that manages filter state independently of the form store

#### Scenario: No state duplication
- **WHEN** the catalog store and the form store are both present
- **THEN** neither store redefines the other's state, actions, or persisted key

#### Scenario: Store holds no fixture data
- **WHEN** the catalog store is inspected
- **THEN** it contains only filter selections and the loading flag, and no fixture group definitions or localized labels

### Requirement: Multi-select filter selections per group
The store SHALL hold filter selections as a map of facet-group keys to arrays of selected value slugs, supporting multiple simultaneous selections within each group. Group keys SHALL be `artist`, `discipline`, `technique`, `theme`, `format`, and `scale`.

#### Scenario: Toggling a value on
- **WHEN** a user clicks an inactive filter chip for a group
- **THEN** the store adds that value's slug to the group's selection array

#### Scenario: Toggling a value off
- **WHEN** a user clicks an active filter chip for a group
- **THEN** the store removes that value's slug from the group's selection array, leaving other selections in the group intact

#### Scenario: Multiple values in one group
- **WHEN** a user selects two or more values within the same group
- **THEN** the store retains all selected values in that group's selection array simultaneously

### Requirement: Loading state for filter application
The store SHALL expose a boolean loading state that is set to `true` when a selection changes and cleared after a simulated asynchronous delay (~400 ms) that stands in for a future API request.

#### Scenario: Loading begins on selection change
- **WHEN** a user toggles any filter value
- **THEN** the store sets `isLoading` to `true`

#### Scenario: Loading ends after simulated delay
- **WHEN** the simulated delay elapses
- **THEN** the store sets `isLoading` to `false`

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

### Requirement: Shared store hook
The catalog store SHALL expose a single shared hook (mirroring the `useField` pattern) that components use to read selections and trigger toggles, preventing per-component store definitions.

#### Scenario: Components bind via shared hook
- **WHEN** a component needs filter state
- **THEN** it SHALL read/write the catalog store through the shared hook rather than creating its own store instance

### Requirement: Artwork filtering predicate
The store SHALL expose a pure filtering predicate that, given artwork facet metadata and the current selections, determines whether the artwork matches: within a group selections combine with OR, across groups with AND, and an empty group matches everything.

#### Scenario: Match within a group
- **WHEN** an artwork's group value is one of the selected values in that group
- **THEN** the predicate returns a match for that group

#### Scenario: No match within a group
- **WHEN** an artwork's group value is not among the selected values in a non-empty group
- **THEN** the predicate returns no match

#### Scenario: Empty group matches all
- **WHEN** a group has no selections
- **THEN** the predicate treats the group as satisfied for every artwork

#### Scenario: Match across all groups
- **WHEN** an artwork satisfies every non-empty group
- **THEN** the predicate returns a match

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
