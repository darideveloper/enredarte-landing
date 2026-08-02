## ADDED Requirements

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
