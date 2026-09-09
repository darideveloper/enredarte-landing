## MODIFIED Requirements

### Requirement: Render the per-post detail
The blog post detail SHALL render a static page for each `Post` that surfaces every field (`author`, `banner_image`, `published_at`, `title_*`, `description_*`, `keywords_*`, `content_*`), converts `content_*` Markdown to HTML at build time via the shared `markdown-rendering` renderer `renderMarkdown` (GFM, `breaks: true` — BREAKING change from the current `breaks: false` at `BlogPost.astro:68`, so single newlines in existing posts become `<br>`; trusted CMS) with heading ids, lazy `img` + external `↗`, `figure` wrapping when `alt>12`, and `code` lang badge + copy button; hides the banner hero when `banner_image==null`; emits post-driven localized `PageSEO`; deduplicates a leading markdown `#{1,6} Title` that exactly matches `title_*` (normalized) before parsing; and renders a Salon hero (`bg-card-dark h-[48svh] md:h-[62svh]` gradient, bottom-anchored `Headline`+serif title + back link), description as left `border-crimson` quote via markdown prose (single `\n` → `<br>`), meta `author • date • readingTime` (`wordCount/200`), hairline, `markdown-prose` `max-w-[72ch]` `hyphens-auto` with drop-cap, `h2::before 28px crimson`, `figure/figcaption`, `table` header `bg-ink/paper`, `blockquote cite`, `pre code-block` with badge + copy, `hr` centered crimson, `iframe 16/9`, plus a share affordance and sticky aside. All `src/messages` long keys used on blog (`pages.blog.*`) and post `description_*` SHALL also be rendered via `renderMarkdown`/`renderInline` so `**` / links in JSON render, not escaped.

#### Scenario: Hero salon renders
- **WHEN** `banner_image` is present as absolute `https://…/media/blog/banners/banner-2.jpg`
- **THEN** a `bg-card-dark` hero `h-[48svh] md:h-[62svh]` with `from-black/75 via-black/35` and `from-black/40` gradients shows the image via absolute `src` verbatim (no `API_BASE_URL` prefix) and a bottom-anchored `Headline color=red pages.blog.eyebrow — date/author` + serif `h1` `title_*`; `ogImage` is the absolute `banner_image` verbatim passed to `PageSEO`

#### Scenario: Duplicate leading title stripped
- **WHEN** `content_es` starts with `## Enredarte abre nuevas salas de exhibición` and `title_es` equals that text (normalized)
- **THEN** that first heading line is removed before `renderMarkdown`, so `markdown-prose` first `h2` is `Introducción` (for the sample post) and the page title appears only once as the hero `h1` (plus sr-only + aside)

#### Scenario: Prose headings and drop-cap
- **WHEN** `content_*` contains `## Introducción` as first heading and a leading paragraph
- **THEN** the rendered prose has `h2` with `28px crimson` top hairline + anchor `scroll-mt-24` and `p:first-of-type::first-letter` drop-cap `Georgia 3.15em crimson` with `hyphens-auto`; stray `h1` inside markdown is demoted to `h2`

#### Scenario: Prose media and code
- **WHEN** `content_*` contains an `![alt](url)` with long alt (`>12` chars), a ````python` block, and a `[]()` external link
- **THEN** long-alt images render as `figure bg-card-dark` + `figcaption 10px uppercase muted` (short alt remains plain `img` — `alt>12` heuristic tradeoff noted), external links carry `target=_blank rel=noopener` + `↗`, and code renders as `code-block bg-card-dark` with lang badge (`code-lang`) and `Copy` button whose label swaps per `pages.blog.copy` / `pages.blog.copied` (`Copy→Copied!` en / `Copiar→¡Copiado!` es)

#### Scenario: Description renders as markdown
- **WHEN** `description_*` or `pages.blog.noPostsHint` contains markdown (`**`, `\n`)
- **THEN** it is parsed via `renderMarkdown` with `breaks:true` and rendered with `set:html` in prose
