# catalog-filter-store Specification

## ADDED Requirements

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
The store SHALL persist filter selections to browser storage via the `persist` middleware. The persisted payload SHALL contain only the `selections` object; the loading state and any other store data SHALL be excluded. The persisted key SHALL be namespaced distinctly from the form store (`enredarte-catalog-storage`).

#### Scenario: Selections survive reload
- **WHEN** a user selects filter values and reloads the page
- **THEN** the previously selected values are restored

#### Scenario: Loading state is not persisted
- **WHEN** the store state is serialized to storage
- **THEN** `isLoading` is excluded from the persisted payload

#### Scenario: No fixture data is persisted
- **WHEN** the store state is serialized to storage
- **THEN** the persisted payload contains only the `selections` object

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
