## MODIFIED Requirements

### Requirement: Navigation Links
The `Header` MUST delegate navigation rendering entirely to the `Menu` molecule by passing a `navLinks` array to it as a prop, and MUST localize link labels through the i18n `global.nav` translation keys.

#### Scenario: Rendering the five-item navigation
- **WHEN** the `Header` is rendered
- **THEN** it outputs a `<Menu>` molecule containing exactly five navigation links: **Obras**, **Salas**, **Blog**, **Artistas**, **Curadores** (no Home link; home stays reachable via the logo)
- **THEN** the **Obras** and **Artistas** links point to the homepage collection section anchor (`#artworks-collection`), the **Salas** link points to the homepage gallery section anchor (`#salas-gallery`), and the **Curadores** link points to `#curadores` — real in-page targets, not dead placeholders
- **THEN** the **Blog** link points to `getLocalizedBlogPath(lang)` (`/blog` for Spanish, `/en/blog` for English), positioned after **Salas** (`obras → salas → blog → artistas → curadores`)

#### Scenario: Localizing navigation labels
- **WHEN** the site is rendered in Spanish
- **THEN** labels resolve to `Obras`, `Salas`, `Blog`, `Artistas`, `Curadores`
- **WHEN** the site is rendered in English
- **THEN** labels resolve to `Works`, `Rooms`, `Blog`, `Artists`, `Curators`
