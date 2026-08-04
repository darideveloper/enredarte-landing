## Purpose

Lets developers render a consistent text overlay (title, subtitle, meta, and curator) as a clickable link over a card's background.

## ADDED Requirements

### Requirement: Render card information as a link
The system SHALL render the card information component as an HTML `<a>` tag pointing to the provided `href`.

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
