## MODIFIED Requirements

### Requirement: Display composed hero section
The `Hero` organism SHALL assemble the `H1` typography molecule on the left and the `ImageBanner` molecule on the right, and SHALL render its textual and artwork content from props (title, description, badge, curator line, and featured artwork data) supplied by the homepage, instead of hardcoded mockup copy. The homepage SHALL derive those props from the primary gallery's hero view model (see `gallery-data`). When hero data is available, badge SHALL be sourced from i18n with interpolation (`pages.home.hero.badgeWithNumber` with `{number}` → `Sala {number} — Capítulo del mes` / `Room {number} — Chapter of the month`). When no hero data is available, fallback badge/title/description SHALL be sourced from i18n (`pages.home.hero.badge`, `pages.home.hero.title`, `pages.home.hero.description`) with elevated formal copy (`Sala I — Capítulo del mes`, `Tierra, mundo y memoria — seis miradas`), and CTA labels and curator prefix SHALL be sourced from i18n (`pages.home.hero.ctaPrimary` → `Descubrir la Sala` / `Discover the Room`, `pages.home.hero.ctaSecondary` → `Leer la curaduría` / `Read the curation`, `pages.home.hero.curationBy` → `Curaduría por` remains but via i18n, price fallback → `Precio a consultar — le acompañamos` / `Price on request — we accompany you`).

#### Scenario: Normal rendering
- **GIVEN** the homepage passes hero props resolved from the primary gallery
- **WHEN** the `Hero` component is rendered
- **THEN** it displays a two-column responsive layout, where the left column contains the H1, description, and curator info, and the right column contains an `ImageBanner`
- **AND** the title, description, curator line, badge, and artwork banner values are the passed props, not inline placeholder text

#### Scenario: No props provided
- **GIVEN** the `Hero` component is rendered without hero props (e.g. in the design system showcase)
- **THEN** it still renders without error, using i18n fallback strings in formal register for badge, title, and description, and CTA labels from i18n
