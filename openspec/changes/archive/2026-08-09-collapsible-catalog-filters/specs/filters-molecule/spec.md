# filters-molecule Specification

## ADDED Requirements

### Requirement: Collapsed-by-default filter panel
The `Filters` molecule SHALL render only the first filter group when the store's `isExpanded` is `false`, and SHALL render all filter groups when it is `true`.

#### Scenario: Single group visible when collapsed
- **WHEN** the panel is collapsed
- **THEN** only the first group's label and option chips are rendered

#### Scenario: All groups visible when expanded
- **WHEN** the panel is expanded
- **THEN** every group in the `groups` prop is rendered in order

#### Scenario: Collapse does not alter selections
- **WHEN** a user collapses the panel
- **THEN** existing selections in hidden groups are preserved and still applied

### Requirement: Expand/collapse toggle control
The `Filters` molecule SHALL render a toggle control after the group rows when more than one group is provided. The control SHALL display a localized "show more" label while collapsed and a "show less" label while expanded, SHALL flip the store's `isExpanded` flag on activation, and SHALL expose `aria-expanded` and `aria-controls`.

#### Scenario: Toggle appears with multiple groups
- **WHEN** the `groups` prop contains two or more groups
- **THEN** a toggle control is rendered after the group rows

#### Scenario: Toggle hidden with a single group
- **WHEN** the `groups` prop contains one group
- **THEN** no toggle control is rendered

#### Scenario: Labels reflect state
- **WHEN** the panel is collapsed
- **THEN** the toggle shows the "show more" label
- **WHEN** the panel is expanded
- **THEN** the toggle shows the "show less" label

#### Scenario: Toggle updates expansion preference
- **WHEN** a user activates the toggle control
- **THEN** the store's `isExpanded` flag flips and the panel expands or collapses accordingly

#### Scenario: Accessible toggle
- **WHEN** the toggle control is inspected
- **THEN** it exposes `aria-expanded` matching the store's `isExpanded` and `aria-controls` pointing at the expanded region
