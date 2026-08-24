## Purpose
Defines the `ImageBanner` component that composes an image and artwork metadata for display in featured sections like the Hero.

## Requirements

### Requirement: Display composed artwork information
The `ImageBanner` molecule SHALL accept artwork metadata (title, artist, price, href) and image properties (src, alt), and compose them visually.

#### Scenario: All data provided
- **WHEN** the component receives all artwork metadata and image props
- **THEN** it renders the `Image` atom as a background and the `CardSummary` molecule positioned over it.

#### Scenario: Partial metadata provided
- **WHEN** the component receives partial metadata (e.g., only title and href) alongside image props
- **THEN** it renders the `Image` atom and passes the partial metadata to the `CardSummary` molecule for correct display without errors.

### Requirement: Configurable overlay darkening prop
The `ImageBanner` component SHALL accept an optional `overlay` prop (`'hover' | 'darker' | 'always' | 'none'`) and a `darkenOnHover` boolean flag to control dark overlay behavior over the background image. When `darkenOnHover` is set, it overrides `overlay`: `true` selects the `hover` mode and `false` selects `none`.

#### Scenario: Darker overlay mode in Hero
- **WHEN** `ImageBanner` is rendered with `overlay="darker"` (e.g. in `Hero.astro`)
- **THEN** it applies a static dark gradient overlay (`bg-gradient-to-t from-black/85 via-black/50 to-black/20`) ensuring high text contrast at all times regardless of hover state

#### Scenario: Hover overlay mode in general banners
- **WHEN** `ImageBanner` is rendered with `overlay="hover"` (or default mode)
- **THEN** it renders a subtle base overlay (`bg-gradient-to-t from-black/65 via-black/25 to-transparent`) and deepens the dark overlay on parent hover (`group-hover:from-black/90 group-hover:via-black/50`) with smooth `duration-300` transition timing
