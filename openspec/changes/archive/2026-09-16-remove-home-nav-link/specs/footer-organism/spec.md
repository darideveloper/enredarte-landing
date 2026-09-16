## MODIFIED Requirements

### Requirement: Shared Navigation
The `Footer` MUST source its navigation links from the same shared `getNavLinks(lang)` helper as the `Header`, keeping both in sync.

#### Scenario: Mirroring the header navigation
- **WHEN** the `Footer` is rendered
- **THEN** it outputs exactly five navigation links: **Obras**, **Salas**, **Blog**, **Artistas**, **Curadores** (no Home link; home stays reachable via the logo)
- **THEN** the **Obras** and **Artistas** links point to the homepage collection section anchor (`#artworks-collection`), the **Salas** link points to the homepage gallery section anchor (`#salas-gallery`), and the **Curadores** link points to `#curadores` — the same real in-page targets as the header
- **THEN** the **Blog** link points to `getLocalizedBlogPath(lang)` (`/blog` for Spanish, `/en/blog` for English)
