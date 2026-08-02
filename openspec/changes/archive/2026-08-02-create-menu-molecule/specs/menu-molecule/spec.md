## Purpose

Provides a dynamic navigation menu that receives a list of links via props and renders them as a cohesive group, utilizing the `Link` atom's `nav` variant for standardized styling and interactive states.

## ADDED Requirements

### Requirement: Dynamic Links Rendering
The component MUST accept an array of link objects (each containing a `label` and `href`) and render them as navigation links.

#### Scenario: Rendering links
- **WHEN** the component receives `links=[{ label: "Home", href: "/" }]`
- **THEN** it renders a `<Link variant="nav" href="/">Home</Link>`

### Requirement: Layout Direction
The component MUST support flexible layout directions (e.g., horizontal for headers, vertical for mobile drawers/footers).

#### Scenario: Default layout
- **WHEN** rendered without a specific layout direction
- **THEN** it defaults to a horizontal layout with appropriate spacing between items (e.g., `flex gap-8`)
