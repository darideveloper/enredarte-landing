## ADDED Requirements

### Requirement: Single LCP image per page is eager with responsive preload
The system SHALL mark exactly one above-the-fold image per page as LCP (`loading="eager"`, `fetchpriority="high"`, `decoding="async"`) and SHALL preload it with `imagesrcset/imagesizes` so the browser fetches the right variant before render without double-download.

#### Scenario: Home hero preloads responsive set
- **WHEN** `/` renders
- **THEN** head contains one `<link rel="preload" as="image" imagesrcset="..." imagesizes="...">` for the hero artwork and the hero `<img>` is eager/high

#### Scenario: No competing LCPs
- **WHEN** any page renders
- **THEN** at most one image carries `fetchpriority="high"` and grid/body images remain `loading="lazy"`

### Requirement: Below-fold images stay lazy
The system SHALL keep all grid, row, curator-block, aside-thumb, and markdown-body images `loading="lazy" decoding="async"` with responsive `sizes` so they defer offscreen cost.

#### Scenario: Grid defers offscreen
- **WHEN** home collection grid renders 12 cards
- **THEN** all 12 carry `loading="lazy"` and only viewport-adjacent ones fetch early
