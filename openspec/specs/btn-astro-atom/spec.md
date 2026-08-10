# btn-astro-atom Specification

## Purpose
Defines the requirements for the `Btn.astro` atom component and button refactoring.

## Requirements
### Requirement: Polymorphic Button Atom Rendering
The system SHALL provide a `Btn.astro` atom component that accepts `variant`, `size`, `href`, `type`, and `disabled` props, rendering an `<a>` element when `href` is provided and a `<button>` element when `href` is absent.

#### Scenario: Anchor rendering with href
- **GIVEN** `Btn` is rendered with `href="#salas"`
- **THEN** it renders an `<a>` element with `href="#salas"`.

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
- **GIVEN** `Btn` is rendered with `variant="outline"`
- **THEN** it applies transparent background (`bg-transparent`), muted text (`text-muted`), and border (`border-border-theme`).

### Requirement: Standardized smooth button transitions
The system SHALL apply smooth transition timing (`transition-all duration-300 ease-in-out`) across all button atom variants in `Btn.astro` and `FilterBtn.astro`.

#### Scenario: Standardized transition timing across button atoms
- **WHEN** any button atom variant (`primary`, `ghost`, `outline`, or `FilterBtn`) transitions between states
- **THEN** all visual property transitions (background, border, text color) execute smoothly with `duration-300` and `ease-in-out` timing
