# filter-btn-atom Specification

## Purpose
Defines the requirement for the `FilterBtn` atom component.
## Requirements
### Requirement: Filter Button Rendering
The system SHALL provide a `FilterBtn` component that renders a filter chip button with uppercase text, tracking, and distinct active vs inactive visual states.

#### Scenario: Active state rendering
- **GIVEN** `FilterBtn` is rendered with `active={true}`
- **THEN** it displays a crimson border (`border-crimson`), dark text (`text-ink`), and a white background (`bg-white`).

#### Scenario: Inactive state rendering
- **GIVEN** `FilterBtn` is rendered with `active={false}` or omitted
- **THEN** it displays a subtle border (`border-[#D8D2C6]`), muted text (`text-[#8A8478]`), and transparent background, highlighting on hover.

