# card-info-molecule Specification (delta)

Reclassifies the card-info capability from a molecule to an atom. The component is now located in `src/components/atoms/`; its props, rendering, and public API are unchanged.

## MODIFIED Requirements

### Requirement: Render card information as a link
The system SHALL render the card information atom as an HTML `<a>` tag pointing to the provided `href`.

#### Scenario: Navigate to card target
- **WHEN** the user clicks anywhere on the rendered component
- **THEN** they are navigated to the destination defined by the `href` prop.

### Requirement: Render required and optional text details
The system SHALL display the mandatory title and any provided optional text properties (subtitle, meta, curator) using predefined styling.

#### Scenario: Render minimal information
- **WHEN** only the `title` and `href` props are provided
- **THEN** the component displays only the title text inside an `<h2>` tag.

#### Scenario: Render full detailed information
- **WHEN** `title`, `subtitle`, `meta`, and `curator` props are provided
- **THEN** the component displays the title in an `<h2>` tag, and the subtitle, meta, and curator texts in distinct stylized paragraphs.
