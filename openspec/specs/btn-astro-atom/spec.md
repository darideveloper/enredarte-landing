# btn-astro-atom Specification

## Purpose
Defines the requirements for the `Btn.astro` atom component and button refactoring.

## Requirements
### Requirement: Polymorphic Button Atom Rendering
The system SHALL provide a `Btn.astro` atom component that accepts `variant`, `size`, `href`, `type`, and `disabled` props, rendering an `<a>` element when `href` is provided and not `disabled`, and a `<button>` element otherwise.

#### Scenario: Anchor rendering with href
- **GIVEN** `Btn` is rendered with `href="#salas"`
- **THEN** it renders an `<a>` element with `href="#salas"`.

#### Scenario: Disabled state falls back to button
- **GIVEN** `Btn` is rendered with `href="#salas"` and `disabled`
- **THEN** it renders a `<button>` element instead of an `<a>`, keeping the link inert.

#### Scenario: Native button rendering without href
- **GIVEN** `Btn` is rendered without `href`
- **THEN** it renders a `<button>` element with `type="button"` (or specified type).

### Requirement: Primary variant styling
The system SHALL style `Btn` with `variant="primary"` such that it features a solid crimson background, paper text, and explicit red border pre-set in its idle state, and transitions into a red ghost button (transparent background, crimson text, and crimson border) on hover with smooth easing animations.

#### Scenario: Primary variant idle and hover styling
- **WHEN** `Btn` is rendered with `variant="primary"`
- **THEN** it renders with solid crimson background (`bg-crimson`), paper text (`text-paper`), and crimson border (`border-crimson`) in idle state
- **THEN** on hover it transitions to transparent background (`hover:bg-transparent`), crimson text (`hover:text-crimson`), and crimson border (`hover:border-crimson`) using smooth transition timing (`transition-all duration-300 ease-in-out`)

### Requirement: Outline variant styling
The system SHALL style `Btn` with `variant="outline"` such that it features a transparent background, muted text, and a themed border in its idle state, and transitions to an ink border with ink text on hover.

#### Scenario: Outline variant idle and hover styling
- **GIVEN** `Btn` is rendered with `variant="outline"`
- **THEN** it applies transparent background (`bg-transparent`), muted text (`text-muted`), and border (`border-border-theme`) in idle state
- **AND** on hover it transitions to ink border (`hover:border-ink`) and ink text (`hover:text-ink`).

### Requirement: Standardized smooth button transitions
The system SHALL apply consistent transition timing to all button atom variants: `transition-all duration-300 ease-in-out` for `Btn.astro` variants and `transition-all duration-200` for `FilterBtn.astro`.

#### Scenario: Transition timing across button atoms
- **WHEN** any button atom variant (`primary`, `ghost`, or `outline`) in `Btn.astro` transitions between states
- **THEN** all visual property transitions (background, border, text color) execute smoothly with `duration-300` and `ease-in-out` timing
- **AND** `FilterBtn` transitions use `duration-200` timing
