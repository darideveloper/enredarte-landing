# title-molecule Specification (delta)

Reclassifies the title capability from a molecule to an atom. The component is now located in `src/components/atoms/`; its props, rendering, and public API are unchanged.

## MODIFIED Requirements

### Requirement: Render section header with slotted content
The system SHALL render an `<h2>` wrapper that displays slotted content inside.

#### Scenario: Render header
- **WHEN** the `Title` component is rendered with children
- **THEN** it displays the children within an `<h2>` HTML tag with standard typographic styling.

### Requirement: Render optional navigation link
The system SHALL optionally render a call-to-action link alongside the header text if `linkText` and `linkHref` are provided.

#### Scenario: Link provided
- **WHEN** both `linkText` and `linkHref` are provided
- **THEN** an `<a>` tag with the text and href is displayed in a flex container aligned with the header.

#### Scenario: Link omitted
- **WHEN** `linkText` and `linkHref` are not provided
- **THEN** no additional `<a>` tag is rendered.
