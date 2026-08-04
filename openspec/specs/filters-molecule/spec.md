# filters-molecule Specification

## Purpose
Defines the requirement for the `Filters` molecule component.
## Requirements
### Requirement: Filters List Rendering
The system SHALL provide a `Filters` molecule component that receives an array of filter items `{ text, value }` and renders a flex-wrap list of `FilterBtn` components.

#### Scenario: Default active item
- **GIVEN** `Filters` is rendered without an explicit `activeValue`
- **THEN** the first filter item is set to `active={true}` by default.

#### Scenario: Explicit active item
- **GIVEN** `Filters` is rendered with `activeValue="artist"`
- **THEN** the filter item matching `value="artist"` receives `active={true}` while others receive `active={false}`.

