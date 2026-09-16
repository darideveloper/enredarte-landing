## MODIFIED Requirements

### Requirement: Shared Navigation
The `Footer` MUST source its navigation links from the same shared `getNavLinks(lang)` helper as the `Header`, keeping both in sync.

#### Scenario: Mirroring the header navigation
- **WHEN** the `Footer` is rendered
- **THEN** it outputs exactly five navigation links: **Obras**, **Salas**, **Blog**, **Artistas**, **Curadores** (no Home link; home stays reachable via the logo)
- **THEN** the **Obras**, **Salas**, **Artistas**, and **Curadores** links point to their dedicated index pages (`/obras`, `/salas`, `/artistas`, `/curadores` for Spanish; `/en/`-prefixed for English) — the same targets as the header
- **THEN** the **Blog** link points to `getLocalizedBlogPath(lang)` (`/blog` for Spanish, `/en/blog` for English)
