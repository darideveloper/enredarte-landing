# filter-btn-atom Specification (Delta)

## MODIFIED Requirements

### Requirement: Filter Button Rendering
The system SHALL provide a React `FilterBtn` component that renders a filter chip button with uppercase text, tracking, and distinct active vs inactive visual states. The component SHALL be a self-bound vanilla atom that reads its active state from the catalog store and toggles its selection on click.

#### Scenario: Active state rendering
- **WHEN** `FilterBtn` is rendered for a value that is currently selected in its group in the catalog store
- **THEN** it displays a crimson border (`border-crimson`), dark text (`text-ink`), and a white background (`bg-white`).

#### Scenario: Inactive state rendering
- **WHEN** `FilterBtn` is rendered for a value that is not selected in its group
- **THEN** it displays a subtle border (`border-border-theme`), muted text (`text-muted`), and transparent background, highlighting on hover.

#### Scenario: Toggling selection on click
- **WHEN** a user clicks the `FilterBtn`
- **THEN** the component toggles its value in the catalog store's selection array for its group

#### Scenario: State derived from store
- **WHEN** the catalog store selection changes for the button's group and value
- **THEN** the button re-renders to reflect the updated active state without requiring an external `active` prop
