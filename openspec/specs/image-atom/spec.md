## Purpose
Defines the behavior and constraints for the Image atom component, which acts as a standard, responsive image container for the design system.

## Requirements

### Requirement: Render image with standard properties
The `Image` component SHALL render an HTML `<img>` tag and enforce accessibility and layout best practices.

#### Scenario: Image properties are mapped correctly
- **WHEN** the `Image` component is passed `src` and `alt` properties
- **THEN** it renders an `<img>` tag with the corresponding `src` and `alt` attributes
- **AND** by default it applies the `object-cover` and `w-full h-full` classes to ensure the image fills its container without distortion.

#### Scenario: Height mode is `auto`
- **WHEN** the `Image` component is passed `height="auto"`
- **THEN** it applies `w-full h-auto` instead of `w-full h-full`, so the rendered image keeps its natural aspect ratio and is not cropped to fill a fixed container.

### Requirement: Support configurable height mode
The `Image` component SHALL support an optional `height` property with values `full` (default) or `auto`, controlling whether the image fills its container (`h-full`) or preserves its natural aspect ratio (`h-auto`).

#### Scenario: Default height mode
- **WHEN** the `height` property is omitted
- **THEN** the image uses `h-full` (fill mode), matching the current behavior.

#### Scenario: Explicit auto height mode
- **WHEN** the `height` property is set to `auto`
- **THEN** the image uses `h-auto`, preserving its natural aspect ratio.

### Requirement: Support aspect ratio constraints
The `Image` component SHALL support an optional `aspectRatio` property that wraps the image in a container enforcing the specified ratio (e.g., `4/5`, `video`, or `square`).

#### Scenario: Aspect ratio is provided
- **WHEN** the `aspectRatio` property is defined as `video`
- **THEN** the image is contained within a wrapper that enforces the `aspect-video` class.

#### Scenario: No aspect ratio is provided
- **WHEN** the `aspectRatio` property is omitted
- **THEN** the image applies the `aspect-auto` class, allowing it to conform to its parent's dimensions.
