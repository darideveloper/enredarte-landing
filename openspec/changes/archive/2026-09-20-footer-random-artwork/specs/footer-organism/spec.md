## ADDED Requirements

### Requirement: Random Artwork Entry
The `Footer` SHALL render the `RandomArtworkBtn` island as the last item of the nav column list, fed by build-time available slugs.

#### Scenario: Rendering the random entry
- **WHEN** the `Footer` is rendered with a non-empty `artworkSlugs` prop
- **THEN** the nav column `<ul>` ends with a list item hosting `<RandomArtworkBtn client:load>` with `slugs={artworkSlugs}`, the page `lang`, the `global.footer.random` label, and the current artwork slug (parsed from `Astro.url`, undefined off artwork pages)
- **WHEN** the draw is empty (no slugs, or only the current artwork)
- **THEN** no trailing item is rendered

#### Scenario: Receiving slugs through Layout
- **WHEN** any page renders through `Layout`
- **THEN** `Layout` forwards its optional `artworkSlugs` prop to `Footer`
- **WHEN** `[...path].astro` renders `Layout`
- **THEN** it passes `availableSlugs` (artworks with `status === "available"`, slugs only)
