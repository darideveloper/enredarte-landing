# filters-molecule Specification (Delta)

## MODIFIED Requirements

### Requirement: Faceted Filters Rendering
The system SHALL provide a React `Filters` molecule component that renders one facet row per filter group. Each row SHALL display the group's localized label at the left and its option chips filling the remaining width, with horizontal overflow and a hidden scrollbar. On viewports below `md`, the label SHALL stack above the chips and the chips SHALL span the full row width. The component SHALL receive the localized facet group definitions as a prop from the Astro caller and render a self-bound `FilterBtn` per option.

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

#### Scenario: Localized labels passed from Astro
- **WHEN** `Filters` is rendered on a page for a given locale
- **THEN** it displays the localized group labels and option labels provided by the Astro caller, and does not localize internally

#### Scenario: Groups not sourced from the store
- **WHEN** `Filters` renders its facet rows
- **THEN** the group definitions come from the caller's prop, not from the catalog store
