## MODIFIED Requirements

### Requirement: Render required and optional text details
The system SHALL display mandatory title (`<h2>`) and optional text properties (subtitle, meta, curator) with a smooth vertical accent line hover effect and high-contrast red subtitle styling.

#### Scenario: Render subtitle with high contrast
- **WHEN** the component receives a `subtitle` prop
- **THEN** it renders the subtitle in bold crimson text (`font-bold text-crimson`) with enhanced letter spacing (`tracking-[0.2em]`) and dark drop-shadow (`drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]`) for high legibility in all background states

#### Scenario: Hover title vertical accent animation
- **WHEN** the user hovers over the parent card container
- **THEN** a vertical crimson line (`w-[3px] bg-crimson`) smoothly animates into view on the left of `<h2>` title with slide, scale, and opacity transition (`transition-all duration-300 ease-out`)
