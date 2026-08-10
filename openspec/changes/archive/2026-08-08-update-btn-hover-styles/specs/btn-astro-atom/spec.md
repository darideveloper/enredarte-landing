## MODIFIED Requirements

### Requirement: Primary variant styling
The system SHALL style `Btn` with `variant="primary"` such that it features a solid crimson background, paper text, and explicit red border pre-set in its idle state, and transitions into a red ghost button (transparent background, crimson text, and crimson border) on hover with smooth easing animations.

#### Scenario: Primary variant idle and hover styling
- **WHEN** `Btn` is rendered with `variant="primary"`
- **THEN** it renders with solid crimson background (`bg-crimson`), paper text (`text-paper`), and crimson border (`border-crimson`) in idle state
- **THEN** on hover it transitions to transparent background (`hover:bg-transparent`), crimson text (`hover:text-crimson`), and crimson border (`hover:border-crimson`) using smooth transition timing (`transition-all duration-300 ease-in-out`)

## ADDED Requirements

### Requirement: Standardized smooth button transitions
The system SHALL apply smooth transition timing (`transition-all duration-300 ease-in-out`) across all button atom variants in `Btn.astro` and `FilterBtn.astro`.

#### Scenario: Standardized transition timing across button atoms
- **WHEN** any button atom variant (`primary`, `ghost`, `outline`, or `FilterBtn`) transitions between states
- **THEN** all visual property transitions (background, border, text color) execute smoothly with `duration-300` and `ease-in-out` timing
