# image-atom Specification

## Purpose
Defines the behavior and constraints for the Image atom component, which acts as a standard, responsive image container for the design system.

## MODIFIED Requirements

### Requirement: Render image with standard properties
The `Image` component SHALL render an HTML `<img>` tag and enforce accessibility and layout best practices.

#### Scenario: Image properties are mapped correctly
- **WHEN** the `Image` component is passed `src` and `alt` properties
- **THEN** it renders an `<img>` tag with the corresponding `src` and `alt` attributes
- **AND** by default it applies the `object-cover` and `w-full h-full` classes to ensure the image fills its container without distortion.

#### Scenario: Height mode is `auto`
- **WHEN** the `Image` component is passed `height="auto"`
- **THEN** it applies `w-full h-auto` instead of `w-full h-full`, so the rendered image keeps its natural aspect ratio and is not cropped to fill a fixed container.

## ADDED Requirements

### Requirement: Support configurable height mode
The `Image` component SHALL support an optional `height` property with values `full` (default) or `auto`, controlling whether the image fills its container (`h-full`) or preserves its natural aspect ratio (`h-auto`).

#### Scenario: Default height mode
- **WHEN** the `height` property is omitted
- **THEN** the image uses `h-full` (fill mode), matching the current behavior.

#### Scenario: Explicit auto height mode
- **WHEN** the `height` property is set to `auto`
- **THEN** the image uses `h-auto`, preserving its natural aspect ratio.

> Note: `aspectRatio` behavior is unchanged and remains defined by the existing "Support aspect ratio constraints" requirement in the main `image-atom` spec.
