## Purpose

Defines the behavior contract, asset mapping, variant options, and link wrapper requirements for the `Logo` atom component.

## ADDED Requirements

### Requirement: Asset Variant Mapping
The `Logo` component SHALL support `default`, `dark`, `light`, `bg-red`, and `icon` variants mapped to corresponding public image assets.

#### Scenario: Rendering default variant
- **WHEN** `variant="default"` is specified or defaulted
- **THEN** the component renders the `/logo.png` asset

#### Scenario: Rendering dark variant
- **WHEN** `variant="dark"` is specified
- **THEN** the component renders the `/logo-dark.png` asset

#### Scenario: Rendering light variant
- **WHEN** `variant="light"` is specified
- **THEN** the component renders the `/logo-light.png` asset

#### Scenario: Rendering bg-red variant
- **WHEN** `variant="bg-red"` is specified
- **THEN** the component renders the `/logo-bg-red.png` asset

#### Scenario: Rendering icon variant
- **WHEN** `variant="icon"` is specified
- **THEN** the component renders the `/favicon.svg` asset

### Requirement: Anchor Link Navigation
The `Logo` component SHALL render an `<a>` link tag defaulting to the homepage `/`.

#### Scenario: Homepage navigation
- **WHEN** the `Logo` component is clicked
- **THEN** it navigates to the specified `href` route (defaulting to `/`)
