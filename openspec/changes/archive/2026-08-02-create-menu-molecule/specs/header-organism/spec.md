## REMOVED Requirements

### Requirement: Nav Links Hover Animation
Moved to link-atom.

## ADDED Requirements

### Requirement: Navigation Links
The `Header` MUST delegate navigation rendering entirely to the `Menu` molecule by passing the `navLinks` array to it as a prop.

#### Scenario: Rendering navigation
- **WHEN** the `Header` is rendered
- **THEN** it outputs a `<Menu>` molecule containing the navigation links, rather than rendering the `<a>` elements directly itself.
