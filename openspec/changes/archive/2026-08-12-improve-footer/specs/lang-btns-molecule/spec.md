# lang-btns-molecule Specification (delta)

## Purpose
Delta spec for the `lang-btns-molecule` capability: adds an `inverse` variant for light-on-dark contexts (dark footer).

## ADDED Requirements

### Requirement: Inverse Variant
The `LangBtns` component MUST support an `inverse` variant for use on dark backgrounds, swapping its default light-mode colors for light-on-dark equivalents.

#### Scenario: Rendering the inverse variant
- **WHEN** the component is rendered with the `inverse` variant enabled
- **THEN** the active language is styled with the light paper color instead of `text-ink`
- **THEN** inactive language links use a muted light foreground and transition to the light paper color on hover
- **THEN** the separator between language options remains visible against the dark background
