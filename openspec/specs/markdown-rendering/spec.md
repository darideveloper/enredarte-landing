# markdown-rendering Specification

## Purpose
Single build-time markdown pipeline (`src/lib/markdown.ts` + `Markdown` atom + shared `markdown-prose` styles) used by every prose surface: API bio/description fields, blog content, banner proofs, and long i18n keys. Trusted CMS, no sanitization, GFM with `breaks: true`.

## Requirements

### Requirement: Shared build-time markdown rendering
The system SHALL provide a single build-time markdown renderer `src/lib/markdown.ts` (`renderMarkdown`, `renderInline`) wrapping `marked` GFM with `breaks: true`, reusing the BlogPost custom renderer (heading `h1→h2` with slug, image lazy figure when `alt>12`, link external `↗` + `target_blank`, code `&lt;&gt;` escaped + lang badge + copy button `data-copy`), trusted CMS with no sanitization (raw HTML passes), and SHALL expose a block-only `Markdown` atom `src/components/atoms/Markdown.astro` that renders `set:html={renderMarkdown(content ?? "")}` inside shared `markdown-prose` styles (aliasing existing `blog-prose`, with `compact`/`on-dark` variants for banner/filter and dark surfaces like `CuratorCard`). Inline contexts SHALL use `renderInline()` directly, not the atom — injected via parent-level `set:html` (only `BannerBar` keeps a `Fragment`, as `BannerText` slot content). The system SHALL strip markdown from SEO descriptions once in `BaseSEO` (`stripMarkdown`) so raw markdown never leaks into `<meta>` tags on any page.

#### Scenario: API long-text rendered as markdown
- **WHEN** `renderMarkdown` is called with bio/description markdown from API (`Artist.bio`, `Gallery.description`, `Artwork.description`, `ArtCurator.bio`) or `src/messages` long value
- **THEN** it returns HTML with GFM tables/lists, `**` → `<strong>`, single `\n` → `<br>`, and custom renderer output, ready for `set:html`

#### Scenario: Empty or plain text input
- **WHEN** content is `""` or plain text without markdown syntax
- **THEN** `renderMarkdown` returns `""` or a safe `<p>` wrapper without injection

#### Scenario: Inline rendering for short keys
- **WHEN** `renderInline` is used for short `t()` values (`nav.*`, `cta`)
- **THEN** it unwraps the single outer `<p>` so the result can be placed inside `<h1>`/`<span>` without block nesting

### Requirement: Shared prose styles
The system SHALL define `markdown-prose` (alias `blog-prose`) in `src/styles/global.css` covering headings, paragraphs, links, blockquote, lists, code, tables, figures, with responsive `first-letter` drop-cap optional flag, so blog prose and bio prose share one style source.

#### Scenario: Consistent styling
- **WHEN** both blog content and artist bio are rendered via `Markdown` atom
- **THEN** they share the same prose typography (crimson headings/links, border, spacing) with optional `compact` variant for banner/filter contexts
