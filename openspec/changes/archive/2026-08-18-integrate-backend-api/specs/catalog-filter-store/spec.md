## MODIFIED Requirements

### Requirement: Artwork filtering predicate
The store SHALL expose a pure filtering predicate that, given artwork facet metadata and the current selections, determines whether the artwork matches: within a group an artwork matches when its facet array contains at least one selected value, across groups with AND, and an empty group matches everything. Facet metadata SHALL be represented as arrays of slugs per group, where single-valued facets such as `artist` are one-element arrays (an artwork belongs to multiple disciplines/techniques/themes/formats/scales).

#### Scenario: Match within a group via array membership
- **WHEN** an artwork's group array contains at least one of the selected values in that group
- **THEN** the predicate returns a match for that group

#### Scenario: No match within a group
- **WHEN** an artwork's group array shares no value with the selected values in a non-empty group
- **THEN** the predicate returns no match

#### Scenario: Multi-valued facet matches any selected value
- **WHEN** an artwork belongs to several disciplines and the user selects one of them
- **THEN** the predicate treats that artwork as matching the discipline group

#### Scenario: Empty group matches all
- **WHEN** a group has no selections
- **THEN** the predicate treats the group as satisfied for every artwork

#### Scenario: Match across all groups
- **WHEN** an artwork satisfies every non-empty group
- **THEN** the predicate returns a match
