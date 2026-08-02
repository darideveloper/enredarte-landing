# header-organism Specification

## Purpose
Defines the behavior contract, layout composition, atomic integrations, and navigation link states for the sticky header organism.
## Requirements
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

### Requirement: Navigation Links
The `Header` MUST delegate navigation rendering entirely to the `Menu` molecule by passing the `navLinks` array to it as a prop.

#### Scenario: Rendering navigation
- **WHEN** the `Header` is rendered
- **THEN** it outputs a `<Menu>` molecule containing the navigation links, rather than rendering the `<a>` elements directly itself.

### Requirement: Mobile Hamburger Toggle
The `Header` MUST include a visual hamburger toggle button visible only on mobile viewports.

#### Scenario: Toggling the menu
- **WHEN** the user clicks the hamburger toggle on mobile
- **THEN** it triggers client-side logic to slide the `Menu` molecule into view and animate the toggle button into a close state (X).

### Requirement: Call-to-Action Responsive Placement
The CTA button MUST be hidden in the main top bar on mobile, and moved/duplicated logically into the `Menu` molecule drawer on mobile.

#### Scenario: Viewing CTA on Mobile
- **WHEN** the user is on a mobile device
- **THEN** the CTA button is hidden in the header right-section and visible only when the mobile drawer is opened.

