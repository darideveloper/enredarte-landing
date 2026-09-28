## ADDED Requirements

### Requirement: Prose styling resolves without typography plugin
The system SHALL deliver all markdown element styling (headings, body, links, lists, blockquote, code, tables) via plain CSS rules under `.markdown-prose` / `.blog-prose` selectors, with zero dependence on `@tailwindcss/typography` (which the project does not install). No `prose-*` utility class SHALL be the sole carrier of any visible style.

#### Scenario: Computed heading styles resolve
- **WHEN** a legal page renders `.js-legal-list h2` and `p` in a real browser
- **THEN** computed `font-size` of `h2` is ~32px in Georgia serif ink while `p` is 15px body, i.e. the ladder is observable in computed styles, not just class attributes

#### Scenario: Links and lists have affordances
- **WHEN** prose contains links and unordered lists
- **THEN** computed link color is crimson with an underline, and `ul` resolves to disc markers with left padding

### Requirement: Prose heading hierarchy is scannable
The system SHALL render markdown headings with a clear ladder above 15px body text: `h2` at ~32–34px serif with a visible crimson anchor marker (40–48×2px bar), `h3` at ~22–24px serif with clear separation from body, `h4` in ink (not muted) with a non-eyebrow signal (e.g. left border) so it is never confused with `Headline` eyebrows, and body text with leading ~1.75 in a slightly softer reading ink using existing tokens only (no new colors) while headings stay pure ink.

#### Scenario: Legal sections scan
- **WHEN** a legal page renders 7–9 consecutive `##` sections
- **THEN** each `h2` is visually distinct from body paragraphs by size, marker, and spacing, and `h4` never matches eyebrow styling

#### Scenario: h3 separation from body
- **WHEN** prose contains `###` above 15px paragraphs
- **THEN** the `h3` step is perceptible (size + spacing), not a 5px bump

### Requirement: Tables render as framed data tables with scroll-in-frame mobile
The system SHALL render GFM tables with intact table layout (no `display:block` on `<table>`): a framed, keyboard-scrollable wrapper containing the table, ink/paper header row, zebra body rows with hover, mono + nowrap first column, `min-w` for wide tables with sticky `th`, and sharp corners per the geometry system. On ≤640px viewports the table scrolls inside its frame (no stacked-card transform).

#### Scenario: Cookie storage table
- **WHEN** `politica-de-cookies` renders its 4-column storage table (ES and EN)
- **THEN** code keys do not wrap mid-token, header spans the full width, rows zebra-stripe, and the table scrolls inside a bordered frame on 390px viewports

#### Scenario: Table layout intact
- **WHEN** any prose table renders
- **THEN** `border-collapse` and full-width behavior hold (header background stretches, borders do not double)

### Requirement: Single shared prose style source
The system SHALL style blog body prose from the same shared source as the `Markdown` atom (no inline duplicated `prose-*` string in `BlogPost.astro`), keeping the `.blog-prose` alias, article layout, meta, and reveal hooks unchanged.

#### Scenario: Blog and legal share hierarchy
- **WHEN** heading/table styles change in the shared source
- **THEN** blog posts and legal pages update together with no per-template drift

### Requirement: Spanish heading slugs produce working anchors
The system SHALL generate heading anchor slugs that normalize Spanish diacritics to stable ASCII (e.g. `Política` → `politica`) with uniqueness handling, so anchor links work for ES headings.

#### Scenario: Accented heading anchor
- **WHEN** prose contains `## Política de Cookies`
- **THEN** the heading emits a stable non-empty `id` and its anchor link navigates to it

### Requirement: Prose variants cover tables and headings
The system SHALL style tables, links, `hr`, and code readably under the `on-dark` variant (no ink-on-dark headers), and SHALL tighten heading margins under the `compact` variant alongside `p/ul/ol`.

#### Scenario: Table on dark card
- **WHEN** a bio containing a table renders with `variant="on-dark"`
- **THEN** header, cells, borders, and links remain legible on the dark surface

### Requirement: Tables expose an accessible wrapper contract
The system SHALL emit tables inside a keyboard-scrollable wrapper (`tabindex="0"` with visible focus, sticky header offset accounted) and mark header cells with `scope="col"` (caption optional).

#### Scenario: Keyboard table scroll
- **WHEN** keyboard focus reaches an overflowing table wrapper
- **THEN** arrow keys scroll the table and header associations are exposed via `scope`
