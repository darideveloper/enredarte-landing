# global-colors Specification

## Purpose
Establishes global design system color tokens in Tailwind CSS to eliminate hardcoded hex values and ensure color consistency across all components.
## Requirements
### Requirement: Theme Color Tokens
The system SHALL expose standardized color tokens in the global Tailwind CSS theme.

#### Scenario: Using paper background token
- **WHEN** a component applies `bg-paper`
- **THEN** the background color evaluates to `#F2EDE4`

#### Scenario: Using crimson brand token
- **WHEN** a component applies `bg-crimson` or `text-crimson`
- **THEN** the color evaluates to `#C41E3A`

#### Scenario: Using ink text token
- **WHEN** a component applies `text-ink` or `border-ink`
- **THEN** the color evaluates to `#1A1A1A`

### Requirement: Component Refactoring to Color Tokens
All core components and design system pages SHALL use semantic color token utility classes instead of arbitrary hex values.

#### Scenario: Btn atom rendering
- **WHEN** the `Btn` atom is rendered
- **THEN** its background, text, border, and hover state classes reference theme tokens (`bg-crimson`, `text-paper`, etc.) without inline hex values

