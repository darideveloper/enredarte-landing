## Purpose

Defines the behavior contract, layout composition, atomic integrations, and navigation link states for the sticky header organism.

## ADDED Requirements

### Requirement: Sticky Header Bar
The `Header` component SHALL render as a sticky top navigation bar with a paper background and bottom border.

#### Scenario: Rendering top bar
- **WHEN** the `Header` component is rendered
- **THEN** it sticks to the top of the viewport (`sticky top-0 z-40`) with `bg-paper` and `border-b border-border-theme`

### Requirement: Atomic Integrations
The `Header` component SHALL compose the default `Logo` atom on the left and the `Btn` ghost atom on the right.

#### Scenario: Rendering logo and CTA button
- **WHEN** the `Header` is rendered
- **THEN** it renders `<Logo variant="default" />` on the left
- **THEN** it renders `<Btn variant="ghost" size="sm">Solicitar Acceso</Btn>` on the right

### Requirement: Nav Links Hover Animation
The `Header` component SHALL render navigation links with uppercase typography and a expanding crimson underline effect on hover.

#### Scenario: Nav link hover state
- **WHEN** user hovers over a navigation item
- **THEN** the text color transitions to `text-ink` and an animated crimson line expands underneath
