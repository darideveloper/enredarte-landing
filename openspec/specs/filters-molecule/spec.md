# filters-molecule Specification

## Purpose
Defines the requirement for the `Filters` molecule component.

## Requirements
### Requirement: Faceted Filters Rendering
The system SHALL provide a React `Filters` molecule component that renders one facet row per filter group. Each row SHALL display the group's localized label at the left and its option chips filling the remaining width, with horizontal overflow and a hidden scrollbar. On viewports below `md`, the label SHALL stack above the chips and the chips SHALL span the full row width.

#### Scenario: Multiple facet rows rendered
- **WHEN** `Filters` is rendered with six localized facet group definitions (artist, discipline, technique, theme, format, scale)
- **THEN** it renders one row per group, each with its localized label on the left and its options on the right

#### Scenario: Horizontal overflow with hidden scrollbar
- **WHEN** a group's options exceed the available row width
- **THEN** the options container scrolls horizontally and the scrollbar is visually hidden

#### Scenario: Mouse wheel scrolls overflowing row
- **WHEN** a user scrolls the mouse wheel over an overflowing row
- **THEN** the row scrolls horizontally in the wheel direction, and the page does not scroll while the row has room to scroll

#### Scenario: Trackpad swipe scrolls overflowing row
- **WHEN** a user swipes horizontally over an overflowing row on a trackpad
- **THEN** the row scrolls horizontally using native overflow behavior

#### Scenario: Page scroll preserved at row edges
- **WHEN** an overflowing row is at its scroll boundary and the user keeps scrolling the wheel
- **THEN** the page scrolls vertically instead of trapping the wheel

#### Scenario: Edge fade affordance
- **WHEN** a row can still scroll in a given direction
- **THEN** a paper-gradient fade is rendered on that side to indicate more content

#### Scenario: Mobile label above chips
- **WHEN** `Filters` is rendered on a viewport narrower than `md`
- **THEN** each group's label renders above its chips and the chips span the full row width

#### Scenario: Multi-select per row
- **WHEN** a user clicks an option chip in a row
- **THEN** the chip's selection toggles independently of the other chips in the same row, allowing multiple active options per row

### Requirement: Group definitions sourced from the Astro caller
The component SHALL receive the localized facet group definitions as a prop from the Astro caller and render a self-bound `FilterBtn` per option.

#### Scenario: Localized labels passed from Astro
- **WHEN** `Filters` is rendered on a page for a given locale
- **THEN** it displays the localized group labels and option labels provided by the Astro caller, and does not localize internally

#### Scenario: Groups not sourced from the store
- **WHEN** `Filters` renders its facet rows
- **THEN** the group definitions come from the caller's prop, not from the catalog store

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
