## Purpose
Defines the behavior, inputs, and visual constraints for the Headline atom component, which acts as a fundamental typography block for category labels and highlighted text.

## Requirements

### Requirement: Render standard text content
The `Headline` component MUST render text provided via its default slot as an inline element (such as a `<span>`).

#### Scenario: Basic rendering
- **WHEN** the `Headline` component is rendered with text "Exhibition"
- **THEN** it outputs an inline wrapper containing the text "Exhibition"
- **AND** it applies the base typography styles: uppercase, extra letter-spacing, and small font size.

### Requirement: Support color variations
The `Headline` component MUST support a `color` property that changes the text color based on predefined tokens from the design system.

#### Scenario: Default (crimson) color
- **WHEN** the `color` property is not provided or is set to "red"
- **THEN** it renders the text using the theme's primary crimson color.

#### Scenario: Muted color
- **WHEN** the `color` property is set to "muted"
- **THEN** it renders the text using the theme's muted color token.

#### Scenario: Default (ink) color
- **WHEN** the `color` property is set to "default"
- **THEN** it renders the text using the theme's default dark ink color.
