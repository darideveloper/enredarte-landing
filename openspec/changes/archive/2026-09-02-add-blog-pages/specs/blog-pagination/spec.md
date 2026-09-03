## ADDED Requirements

### Requirement: Static numbered pagination nav
The system SHALL provide `PaginationNav.astro` (or `src/components/molecules/PaginationNav.astro`) as a static, server-rendered pagination bar for the blog index, showing numbered page links plus Prev/Next.

#### Scenario: First page omits link to page 1
- **WHEN** `page == 1` and `total_pages == 3` on `/blog`
- **THEN** numbers `1 2 3` render, `1` is marked current (no link), `2` links to `/blog/page/2`, `3` to `/blog/page/3`, `Prev` is disabled, `Next` links to `/blog/page/2`

#### Scenario: Middle page links correctly
- **WHEN** `page == 2` on `/blog`
- **THEN** `Prev` links to `/blog` (page 1 is the base path, not `/blog/page/1`), `1` links to `/blog`, `2` is current, `3` links to `/blog/page/3`, `Next` links to `/blog/page/3`

#### Scenario: Reuses page for lang switch already passed via localizedPaths
- **WHEN** on `/en/blog/page/2`
- **THEN** `PaginationNav` page `1` links to `/en/blog`, `2` current, `3` to `/en/blog/page/3`; the header language switch (not this component) already preserves `page` via `localizedPaths`

#### Scenario: No pagination when single page or empty
- **WHEN** `total_pages <= 1` (including `count == 0` empty-state)
- **THEN** `PaginationNav` renders nothing (no nav element) and the index shows either the single grid or the empty-state block
