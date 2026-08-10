## ADDED Requirements

### Requirement: Interactive hover feedback and transform effects
The `CardSummary` molecule SHALL provide visible interactive feedback on hover, including scaling, vertical translation, shadow depth, and backdrop opacity shifts using smooth transition timing.

#### Scenario: Hovering CardSummary overlay badge
- **WHEN** the user hovers over the `CardSummary` element
- **THEN** it scales (`hover:scale-[1.03]`), elevates vertically (`hover:-translate-y-1`), applies dark backdrop opacity (`hover:bg-black/95`), and casts shadow depth (`hover:shadow-2xl`) using smooth transition timing (`transition-all duration-300 ease-out`)
