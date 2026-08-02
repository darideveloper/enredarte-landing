## Purpose

Provides a consistently styled hyperlink wrapper for standard HTML `<a>` tags with built-in interactive hover effects.

## ADDED Requirements

### Requirement: Anchor Element Wrapper
The component MUST render an HTML `<a>` element containing the passed children.

#### Scenario: Rendering as a link
- **WHEN** the component is used in a template
- **THEN** it outputs an `<a>` tag wrapping the child content

### Requirement: Property Passthrough
The component MUST accept and pass through standard anchor attributes (like `href`, `target`, `rel`) to the underlying `<a>` element.

#### Scenario: Passing href and target
- **WHEN** the component is rendered with `href="/about"` and `target="_blank"`
- **THEN** the resulting `<a>` tag includes those exact attributes

### Requirement: Interactive Styling
The component MUST apply a distinct hover effect (e.g., text color transition, underline) to indicate interactivity.

#### Scenario: Hovering over the link
- **WHEN** a user hovers over the rendered link
- **THEN** it exhibits a visual change indicating it is clickable
