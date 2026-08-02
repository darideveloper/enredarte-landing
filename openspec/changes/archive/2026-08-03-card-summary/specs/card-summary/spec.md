## Purpose
Defines the behavior and presentation constraints for the CardSummary molecule, which is used as an overlaid badge on artworks.

## ADDED Requirements

### Requirement: Display artwork metadata and link
The `CardSummary` molecule SHALL accept and display a title, an optional artist name, an optional price, and a required `href` link.

#### Scenario: All data provided
- **WHEN** the component receives a title, artist name, price, and href
- **THEN** it renders all three data points in a vertically stacked layout inside an `<a>` tag pointing to the `href`.

#### Scenario: Only title provided
- **WHEN** the component receives only a title (no artist or price)
- **THEN** it renders just the title without any empty space for the missing fields.

### Requirement: Enforce visual overlay style
The `CardSummary` molecule SHALL present itself as a semi-transparent dark overlay with a blur effect, adhering to the mockup's `.hero-badge` specifications.

#### Scenario: Visual rendering
- **WHEN** the component is rendered
- **THEN** it applies a dark semi-transparent background (e.g., `bg-black/88`) and a backdrop blur.
