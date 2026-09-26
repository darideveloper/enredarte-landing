## MODIFIED Requirements

### Requirement: Render the artist's artworks
The artist page SHALL render an artworks section showing only the artworks belonging to that artist, as a static editorial list (no filter UI): the featured artwork as an `ImageBanner` followed by the remaining artworks as alternating `ImageRowCard`s in `immersive` mode, each tagged with its localized discipline, technique, and theme labels. It SHALL reuse `ImageBanner`, `ImageRowCard`, and the artwork view built by `toArtworkView`. The featured artwork SHALL be the artist's first highlighted artwork when any exist, otherwise the first artwork. The artworks section SHALL NOT set `overflow:hidden` on any ancestor of the sticky rows, so the immersive `md:sticky md:top-[35svh]` info card keeps sala parity.

#### Scenario: Only the artist's artworks appear
- **GIVEN** an artist whose artworks are a subset of the full catalog
- **WHEN** the artworks section renders
- **THEN** only that artist's artworks are displayed, and no artwork by another artist appears

#### Scenario: Featured artwork leads the list
- **GIVEN** an artist with artworks, one of which is `is_highlighted`
- **WHEN** the artworks section renders
- **THEN** the highlighted artwork renders as the featured `ImageBanner` and the rest render as `ImageRowCard`s

#### Scenario: Row cards alternate
- **GIVEN** an artist with three artworks after the featured one
- **WHEN** the artworks section renders at desktop width
- **THEN** the second artwork's row reverses its image/info order relative to the first

#### Scenario: Tall row keeps info card pinned like sala
- **GIVEN** an immersive row rendering a portrait artwork on a desktop viewport
- **WHEN** the user scrolls through the row
- **THEN** the info card remains visible pinned near the middle of the viewport while the image scrolls
