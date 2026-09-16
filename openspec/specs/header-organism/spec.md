# header-organism Specification

## Purpose
Defines the behavior contract, layout composition, atomic integrations, and navigation link states for the sticky header organism.
## Requirements
### Requirement: Sticky Header Bar
The `Header` component SHALL render as a sticky top navigation bar with a paper background and bottom border.

#### Scenario: Rendering top bar
- **WHEN** the `Header` component is rendered
- **THEN** it sticks to the top of the viewport (`sticky top-0 z-40`) with `bg-paper` and `border-b border-border-theme`

### Requirement: Atomic Integrations
The `Header` component SHALL compose the default `Logo` atom on the left, the localized navigation via the `Menu` molecule in the center, and the language switcher alongside the hamburger toggle in the right section.

#### Scenario: Rendering logo and navigation
- **WHEN** the `Header` is rendered
- **THEN** it renders `<Logo variant="default" />` on the left
- **THEN** it renders the `Menu` molecule containing the navigation links
- **THEN** it renders the language switcher in the right section

### Requirement: Navigation Links
The `Header` MUST delegate navigation rendering entirely to the `Menu` molecule by passing a `navLinks` array to it as a prop, and MUST localize link labels through the i18n `global.nav` translation keys.

#### Scenario: Rendering the five-item navigation
- **WHEN** the `Header` is rendered
- **THEN** it outputs a `<Menu>` molecule containing exactly five navigation links: **Obras**, **Salas**, **Blog**, **Artistas**, **Curadores** (no Home link; home stays reachable via the logo)
- **THEN** the **Obras**, **Salas**, **Artistas**, and **Curadores** links point to their dedicated index pages via `getLocalizedPath` (`/obras`, `/salas`, `/artistas`, `/curadores` for Spanish; `/en/`-prefixed for English) — no anchor links, working from any page
- **THEN** the **Blog** link points to `getLocalizedBlogPath(lang)` (`/blog` for Spanish, `/en/blog` for English), positioned after **Salas** (`obras → salas → blog → artistas → curadores`)

#### Scenario: Localizing navigation labels
- **WHEN** the site is rendered in Spanish
- **THEN** labels resolve to `Obras`, `Salas`, `Blog`, `Artistas`, `Curadores`
- **WHEN** the site is rendered in English
- **THEN** labels resolve to `Works`, `Rooms`, `Blog`, `Artists`, `Curators`

### Requirement: Mobile Hamburger Toggle
The `Header` MUST include a visual hamburger toggle button visible only on mobile viewports.

#### Scenario: Toggling the menu
- **WHEN** the user clicks the hamburger toggle on mobile
- **THEN** it triggers client-side logic to slide the `Menu` molecule into view and animate the toggle button into a close state (X).

