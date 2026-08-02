## Purpose
Defines the behavior and constraints for the Image atom component, which acts as a standard, responsive image container for the design system.

## ADDED Requirements

### Requirement: Render image with standard properties
The `Image` component SHALL render an HTML `<img>` tag and enforce accessibility and layout best practices.

#### Scenario: Image properties are mapped correctly
- **WHEN** the `Image` component is passed `src` and `alt` properties
- **THEN** it renders an `<img>` tag with the corresponding `src` and `alt` attributes
- **AND** it applies the `object-cover` and `w-full h-full` classes to ensure the image fills its container without distortion.

### Requirement: Support aspect ratio constraints
The `Image` component SHALL support an optional `aspectRatio` property that wraps the image in a container enforcing the specified ratio (e.g., `4/5`, `16/9`, or `video`).

#### Scenario: Aspect ratio is provided
- **WHEN** the `aspectRatio` property is defined as `video`
- **THEN** the image is contained within a wrapper that enforces the `aspect-video` class.

#### Scenario: No aspect ratio is provided
- **WHEN** the `aspectRatio` property is omitted
- **THEN** the image is rendered without an explicit aspect ratio wrapper, allowing it to conform to its parent's dimensions.
