## Purpose
Defines the behavior and presentation constraints for the CardSummary atom, which is used as an overlaid badge on artworks.

## ADDED Requirements

### Requirement: Display artwork metadata and link
The `CardSummary` atom SHALL accept and display a title, an optional artist name, an optional price, and a required `href` link.

#### Scenario: All data provided
- **WHEN** the component receives a title, artist name, price, and href
- **THEN** it renders all three data points in a vertically stacked layout inside an `<a>` tag pointing to the `href`.

#### Scenario: Only title provided
- **WHEN** the component receives only a title (no artist or price)
- **THEN** it renders just the title without any empty space for the missing fields.

### Requirement: Enforce visual overlay style
The `CardSummary` atom SHALL present itself as a semi-transparent dark overlay with a blur effect, adhering to the mockup's `.hero-badge` specifications.

#### Scenario: Visual rendering
- **WHEN** the component is rendered
- **THEN** it applies a dark semi-transparent background (e.g., `bg-black/88`) and a backdrop blur.

### Requirement: Interactive hover feedback and transform effects
The `CardSummary` molecule SHALL provide visible interactive feedback on hover, including scaling, vertical translation, shadow depth, and backdrop opacity shifts using smooth transition timing.

#### Scenario: Hovering CardSummary overlay badge
- **WHEN** the user hovers over the `CardSummary` element
- **THEN** it scales (`hover:scale-[1.03]`), elevates vertically (`hover:-translate-y-1`), applies dark backdrop opacity (`hover:bg-black/95`), and casts shadow depth (`hover:shadow-2xl`) using smooth transition timing (`transition-all duration-300 ease-out`)
