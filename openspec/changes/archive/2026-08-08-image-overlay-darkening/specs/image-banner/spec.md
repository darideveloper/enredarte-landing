## ADDED Requirements

### Requirement: Configurable overlay darkening prop
The `ImageBanner` component SHALL accept an optional `overlay` prop (`'hover' | 'darker' | 'always' | 'none'`) and `darkenOnHover` boolean flag to control dark overlay behavior over the background image.

#### Scenario: Darker overlay mode in Hero
- **WHEN** `ImageBanner` is rendered with `overlay="darker"` (e.g. in `Hero.astro`)
- **THEN** it applies a static dark gradient overlay (`bg-gradient-to-t from-black/80 via-black/40 to-transparent`) ensuring high text contrast at all times regardless of hover state

#### Scenario: Hover overlay mode in general banners
- **WHEN** `ImageBanner` is rendered with `overlay="hover"` (or default mode)
- **THEN** it renders a subtle base overlay and deepens the dark overlay on parent hover (`group-hover:from-black/90 group-hover:via-black/50`) with smooth `duration-300` transition timing
