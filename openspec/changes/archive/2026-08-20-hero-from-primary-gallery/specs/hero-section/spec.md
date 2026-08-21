## MODIFIED Requirements

### Requirement: Display composed hero section
The `Hero` organism SHALL assemble the `H1` typography molecule on the left and the `ImageBanner` molecule on the right, and SHALL render its textual and artwork content from props (title, description, badge, curator line, and featured artwork data) supplied by the homepage, instead of hardcoded mockup copy. The homepage SHALL derive those props from the primary gallery's hero view model (see `gallery-data`).

#### Scenario: Normal rendering
- **GIVEN** the homepage passes hero props resolved from the primary gallery
- **WHEN** the `Hero` component is rendered
- **THEN** it displays a two-column responsive layout, where the left column contains the H1, description, and curator info, and the right column contains an `ImageBanner`
- **AND** the title, description, curator line, badge, and artwork banner values are the passed props, not inline placeholder text

#### Scenario: No props provided
- **GIVEN** the `Hero` component is rendered without hero props (e.g. in the design system showcase)
- **THEN** it still renders without error, using safe defaults for the optional content
