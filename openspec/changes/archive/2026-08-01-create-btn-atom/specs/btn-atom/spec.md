## Purpose

Defines the behavior contract, markup structure, variant mapping, and interactive states for the `Btn` atom component.

## ADDED Requirements

### Requirement: Anchor Element Wrapper
The `Btn` component SHALL render an `<a>` anchor element to act as a link wrapper.

#### Scenario: Rendering as anchor tag
- **WHEN** the `Btn` component is rendered with an `href` prop
- **THEN** it outputs an HTML `<a>` tag with the provided `href` and children content

### Requirement: Variant Styling
The `Btn` component SHALL support `regular` and `ghost` color/border variants mapped via a style configuration object.

#### Scenario: Regular variant rendering
- **WHEN** `variant="regular"` is specified
- **THEN** the button renders with solid crimson background, paper text, and opacity drop on hover

#### Scenario: Ghost variant rendering
- **WHEN** `variant="ghost"` is specified
- **THEN** the button renders with a transparent background, ink text, ink border, and transitions to crimson background/border with paper text on hover
