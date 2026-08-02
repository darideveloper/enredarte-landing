## ADDED Requirements

### Requirement: Responsive Navigation Behavior
The `Menu` molecule MUST handle its own responsive layout inherently, acting as a hidden mobile drawer off-screen by default, and seamlessly snapping into a standard flex row on desktop viewpoints (`md:`).

#### Scenario: Mobile Viewport
- **WHEN** the `Menu` is rendered on a screen smaller than the `md` breakpoint
- **THEN** it MUST be positioned fixed (like a drawer) and hidden off-screen (`translate-x-full`) until toggled.

#### Scenario: Desktop Viewport
- **WHEN** the `Menu` is rendered on a screen at or larger than the `md` breakpoint
- **THEN** it MUST override its fixed/hidden state to position statically (`md:static`) and visibly inline (`md:translate-x-0`).
