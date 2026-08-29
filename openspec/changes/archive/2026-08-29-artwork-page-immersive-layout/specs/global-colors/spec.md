## ADDED Requirements

### Requirement: Description color token
The system SHALL expose a `description` color token in the global Tailwind theme (`--color-description`) for long-form descriptive text, usable as `text-description` and other utility variants. Components SHALL reference this token instead of hardcoded hex values for description body copy.

#### Scenario: Using description text token
- **WHEN** a component applies `text-description`
- **THEN** the color evaluates to `#7A7568`

#### Scenario: Description text uses the token
- **WHEN** the artwork info panel, hero section, or gallery page renders descriptive body copy
- **THEN** the description text applies the `text-description` utility rather than a hardcoded hex value

### Requirement: Base page background
The global layout SHALL apply the paper color (`#F2EDE4`) as the base background on the `<body>` element so any viewport seam exposed by pinned elements, page canvas, or overscroll renders in the paper tone rather than the browser-default white.

#### Scenario: Body uses paper background
- **WHEN** any page under the shared layout renders
- **THEN** the `<body>` element carries `bg-paper`, so areas not covered by a section's own background render in paper

#### Scenario: Pinned artwork section shows no white seam
- **WHEN** the artwork detail page's pinned ScrollTrigger section shifts to `position: fixed`
- **THEN** no white seam is visible between the sticky header and the pinned section, because the body base is paper