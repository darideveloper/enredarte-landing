## MODIFIED Requirements

### Requirement: Render the per-post detail
The blog post detail SHALL render a static page for each `Post` that surfaces every field (`author`, `banner_image`, `published_at`, `title_*`, `description_*`, `keywords_*`, `content_*`), converts `content_*` Markdown to HTML at build time via the shared `markdown-rendering` renderer `renderMarkdown` (GFM, `breaks: true` — BREAKING change from the current `breaks: false` at `BlogPost.astro:68`, so single newlines in existing posts become `<br>`; trusted CMS) with heading ids, lazy `img` + external `↗`, `figure` wrapping when `alt>12`, video-paragraph detection (standalone YouTube/Vimeo URL → hardened lazy iframe with post title fallback) and `code` lang badge + copy button; hides the banner hero when `banner_image==null`; emits post-driven localized `PageSEO`; deduplicates a leading markdown `#{1,6} Title` that exactly matches `title_*` (normalized) before parsing; and renders a Salon hero (`bg-card-dark h-[48svh] md:h-[62svh]` gradient, bottom-anchored `Headline`+serif title + back link), description as left `border-crimson` quote via markdown prose (single `\n` → `<br>`), meta `author • date • readingTime` (`wordCount/200`), hairline, `markdown-prose` `max-w-[72ch]` `hyphens-auto` with drop-cap, `h2::before 28px crimson`, `figure/figcaption`, `table` header `bg-ink/paper`, `blockquote cite`, `pre code-block` with badge + copy, `hr` centered crimson, `iframe 16/9`, plus a share affordance and sticky aside. All `src/messages` long keys used on blog (`pages.blog.*`) and post `description_*` SHALL also be rendered via `renderMarkdown`/`renderInline` so `**` / links in JSON render, not escaped. `BlogPost.astro` SHALL pass the localized post `title` as `videoTitle` to `renderMarkdown` so bare-URL embeds always carry an accessible `title`.

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

#### Scenario: Prose tables, quotes, and hr
- **WHEN** `content_*` contains a `table` of materials, `> “El arte…” — Paul Klee` with cite, and `---`
- **THEN** the table has `th bg-ink text-paper 11px uppercase tracking 0.08em` + `td border-border-theme` inside `display:block overflow-x-auto`, `blockquote` is `border-l-2 crimson italic text-description` with `cite 11px uppercase muted —` (`::before — `), and `hr` is a centered `48px crimson` line (`hr::after`) `my-10`

#### Scenario: Reading time and share i18n
- **WHEN** `content_*` has ~400 words and `lang=es`
- **THEN** meta shows `2 min de lectura` via `t("pages.blog.readingTime")` and share buttons carry `data-share-label/pages.blog.share` and `data-copied-label/pages.blog.copied`; after copy the label shows `¡Copiado! ✓` (es) or `Copied! ✓` (en), not hardcoded English

#### Scenario: Language switch still preserves slug
- **WHEN** on `/blog/enredarte-abre-nuevas-salas` (es)
- **THEN** `LangBtns` links to `/en/blog/enredarte-abre-nuevas-salas` (en) via `alternateUrls` from `getLocalizedPostPath`

#### Scenario: Hero hidden when banner null
- **WHEN** `banner_image == null`
- **THEN** no hero image block renders (and no `ogImage`/`preloadImage` is emitted)

#### Scenario: SEO metadata per post
- **WHEN** a post detail renders with absolute `banner_image`
- **THEN** `PageSEO` receives `title=title_*`, `description=description_*`, `keywords` from `keywords_*`, `ogImage` as the absolute `banner_image` verbatim when not null, and `alternateUrls` for the es/en post paths; index pages use `pages.blog.title/description/keywords` from `messages/{es,en}.json`

#### Scenario: Description renders as markdown
- **WHEN** `description_*` or `pages.blog.noPostsHint` contains markdown (`**`, `\n`)
- **THEN** it is parsed via `renderMarkdown` with `breaks:true` and rendered with `set:html` in prose

#### Scenario: Standalone video URL renders a titled player
- **WHEN** `content_es` contains a paragraph with exactly `https://www.youtube.com/watch?v=XXXX`
- **THEN** the detail body shows a 16/9 lazy iframe to `youtube-nocookie.com/embed/XXXX` titled with the post title, not a link
