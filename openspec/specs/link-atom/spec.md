# link-atom Specification

## Purpose
Provides a consistently styled hyperlink wrapper for standard HTML `<a>` tags with built-in interactive hover effects.
## Requirements
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

### Requirement: Navigation Variant
The `Link` component MUST support a `nav` variant designed specifically for application navigation menus.

#### Scenario: Rendering the nav variant
- **WHEN** the component is rendered with `variant="nav"`
- **THEN** it outputs an anchor tag styled with uppercase text, wider tracking, and an animated underline effect that expands from left to right on hover.

### Requirement: Footer Variant
The `Link` component MUST support a `footer` variant designed for light-on-dark footer link lists, mirroring the `nav` variant's uppercase styling and animated underline while using light foreground colors.

#### Scenario: Rendering the footer variant
- **WHEN** the component is rendered with `variant="footer"`
- **THEN** it outputs an anchor tag styled with uppercase text, wider tracking, a muted light foreground color, and a crimson animated underline that expands from left to right on hover
- **THEN** on hover the foreground color transitions to the light paper color

