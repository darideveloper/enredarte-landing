## ADDED Requirements

### Requirement: Artists index renders a 4-column grid on desktop
The `artistas` index page SHALL render its static `ImageCard` grid at `grid-cols-1 / sm:2 / md:3 / lg:4` in both languages, while the `salas` and `curadores` index pages keep the shared `grid-cols-1 / sm:2 / lg:3` static grid.

#### Scenario: Artists grid shows 4 columns on desktop
- **WHEN** a visitor opens `/artistas` or `/en/artistas` at `lg` viewport width or above
- **THEN** artist cards render 4 per row

#### Scenario: Artists grid steps through 2 and 3 columns on smaller viewports
- **WHEN** a visitor opens `/artistas` or `/en/artistas` at `sm` viewport width
- **THEN** artist cards render 2 per row
- **WHEN** a visitor opens `/artistas` or `/en/artistas` at `md` viewport width
- **THEN** artist cards render 3 per row

#### Scenario: Salas and curadores grids unchanged
- **WHEN** a visitor opens `/salas`, `/en/salas`, `/curadores`, or `/en/curadores` at any viewport width
- **THEN** cards render with the existing `grid-cols-1 / sm:2 / lg:3` layout, identical to before

#### Scenario: Artists card content unchanged
- **WHEN** a visitor opens `/artistas` or `/en/artistas`
- **THEN** each card shows the same image (`photo` falling back to primary artwork image), name, localized `href`, works-count meta, `aspect-[4/5]` ratio, and `gap-1` spacing as before — only the column count changes
