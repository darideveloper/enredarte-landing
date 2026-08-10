# catalog-filter-store Specification Delta

## ADDED Requirements

### Requirement: Reset all filter selections
The store SHALL expose a `reset` action that clears every filter group's selections to empty arrays in a single invocation. The action SHALL set the loading state to `true` and clear it after the same simulated ~400 ms delay used by `toggle`, and SHALL NOT modify the `isExpanded` flag. The action SHALL be exposed through the shared `useCatalog` hook alongside `toggle` and `toggleExpanded`, and SHALL NOT introduce new persisted state or change the existing persistence contract.

#### Scenario: Reset clears every group
- **WHEN** a user invokes the reset action while one or more groups have selections
- **THEN** all groups' selection arrays become empty

#### Scenario: Reset triggers the simulated loader
- **WHEN** a user invokes the reset action
- **THEN** `isLoading` is set to `true` and cleared to `false` after the simulated delay

#### Scenario: Reset leaves the expansion flag untouched
- **WHEN** a user invokes the reset action while `isExpanded` is either state
- **THEN** `isExpanded` retains its prior value

#### Scenario: Reset is available through the shared hook
- **WHEN** a component needs to clear filters
- **THEN** it invokes the reset action through the shared catalog hook rather than mutating store state directly

#### Scenario: Reset preserves the persistence contract
- **WHEN** the reset action is invoked and the store is persisted
- **THEN** the persisted payload still contains `selections` and `isExpanded` only, with `selections` now empty
