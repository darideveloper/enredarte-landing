# link-atom Specification (delta)

## Purpose
Delta spec for the `link-atom` capability: adds a `footer` variant for light-on-dark footer links.

## ADDED Requirements

### Requirement: Footer Variant
The `Link` component MUST support a `footer` variant designed for light-on-dark footer link lists, mirroring the `nav` variant's uppercase styling and animated underline while using light foreground colors.

#### Scenario: Rendering the footer variant
- **WHEN** the component is rendered with `variant="footer"`
- **THEN** it outputs an anchor tag styled with uppercase text, wider tracking, a muted light foreground color, and a crimson animated underline that expands from left to right on hover
- **THEN** on hover the foreground color transitions to the light paper color
