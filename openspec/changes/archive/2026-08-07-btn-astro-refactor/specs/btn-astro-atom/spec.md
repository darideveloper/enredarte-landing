## Purpose

Defines the requirements for the `Btn.astro` atom component and button refactoring.

## ADDED Requirements

### Requirement: Polymorphic Button Atom Rendering
The system SHALL provide a `Btn.astro` atom component that accepts `variant`, `size`, `href`, `type`, and `disabled` props, rendering an `<a>` element when `href` is provided and a `<button>` element when `href` is absent.

#### Scenario: Anchor rendering with href
- **GIVEN** `Btn` is rendered with `href="#salas"`
- **THEN** it renders an `<a>` element with `href="#salas"`.

#### Scenario: Native button rendering without href
- **GIVEN** `Btn` is rendered without `href`
- **THEN** it renders a `<button>` element with `type="button"` (or specified type).

#### Scenario: Primary variant styling
- **GIVEN** `Btn` is rendered with `variant="primary"`
- **THEN** it applies crimson background (`bg-crimson`), paper text (`text-paper`), and subtle hover opacity.

#### Scenario: Outline variant styling
- **GIVEN** `Btn` is rendered with `variant="outline"`
- **THEN** it applies transparent background (`bg-transparent`), muted text (`text-muted`), and border (`border-border-theme`).
