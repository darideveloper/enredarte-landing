# catalog-filter-scroll Specification

## Purpose
Defines how the "Colección completa" filter rows translate wheel and horizontal trackpad input into smoothed horizontal scrolling while preserving the existing visual treatment, drag gesture, and reduced-motion fallback.

## Requirements
### Requirement: Smoothed wheel-driven scrolling
The system SHALL translate wheel and horizontal trackpad input over an overflowing filter chip row into smoothed horizontal scrolling instead of applying the wheel delta directly to the row. Input SHALL accumulate into a target offset, and the row's `scrollLeft` SHALL be eased toward that target each frame until it settles. The smoothing loop SHALL stop running once the row reaches the target.

#### Scenario: Wheel scroll eases instead of snapping
- **WHEN** a user scrolls the mouse wheel over an overflowing row
- **THEN** the row glides toward the wheel direction with a easing curve rather than jumping in discrete steps

#### Scenario: Continuous input retargets smoothly
- **WHEN** a user keeps wheel-scrolling while a previous glide is still in progress
- **THEN** the target updates and the row continues easing without restarting abruptly

#### Scenario: Cosmetic edge fades still track the row
- **WHEN** the smiled row scrolls toward either boundary
- **THEN** the existing paper-gradient edge fades appear and disappear as the row approaches and reaches the boundary

### Requirement: Immediate drag-to-scroll preserved
The system SHALL keep the existing mouse drag-to-scroll gesture on the chip row as direct manipulation: dragging SHALL move `scrollLeft` directly in step with the pointer, without smoothing or momentum.

#### Scenario: Drag moves the row directly
- **WHEN** a user drags the chip row with the mouse
- **THEN** the row follows the pointer position immediately with no easing delay

### Requirement: Reduced-motion fallback
The system SHALL disable the smoothing when the user prefers reduced motion: wheel input SHALL then move the row directly, and no frame loop SHALL run.

#### Scenario: Reduced motion scrolls directly
- **WHEN** `prefers-reduced-motion: reduce` is active and a user wheel-scrolls an overflowing row
- **THEN** the row scrolls its full wheel delta immediately with no smoothing

#### Scenario: No frame loop under reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** no smoothing frame loop is started for the row

### Requirement: Smoothing lifecycle safety
The system SHALL clean up the smoothing state when the row unmounts: the wheel listener SHALL be removed and any running frame loop SHALL be stopped, so no event listener or ticker callback leaks after the component is destroyed.

#### Scenario: Cleanup on unmount
- **WHEN** the component owning a filter row unmounts while a smoothing loop is active
- **THEN** the loop stops and the wheel listener is removed

### Requirement: Non-scrollable rows unaffected
The system SHALL NOT alter scrolling behavior when a row does not overflow: rows whose chip content fits within the container SHALL keep native non-scroll behavior and SHALL NOT claim wheel or trackpad input.

#### Scenario: Fitting row passes wheel through
- **WHEN** a row's chips fit within the container width and a user wheel-scrolls over it
- **THEN** the page scrolls vertically and the row does not intercept or smooth anything
