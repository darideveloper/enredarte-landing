## MODIFIED Requirements

### Requirement: Render the blog index grid
The blog index SHALL render a static paginated editorial grid of `PostCard`s that preserves the Gallery Salon language — `Headline` eyebrow `pages.blog.eyebrow` (Revista/Journal), serif display `h1`, `text-description` lede, count meta `pages.blog.pagination.page`, hairline, and mosaic `gap-4 md:gap-[3px] auto-rows-fr` — with `hasFeatured = posts.length>1` (first `PostSummary` of every page as `PostCard featured` `lg:col-span-2 aspect-[16/10]`), localized `PageSEO`, `localizedPaths` preserving page number, and an upgraded empty-state editorial block. The pre-existing static emission (`getStaticPaths` Fork A), `page_size=12`, prefix `API_BASE_URL+banner_image`, and hiding `banner_image==null` contracts remain unchanged.

#### Scenario: Editorial header renders
- **WHEN** `/blog` renders in `es`
- **THEN** a `Headline color=red` with `t("pages.blog.eyebrow")` (=`Revista`) appears above the serif `h1` `pages.blog.title`, followed by `pages.blog.description` as a `text-pretty` lede and `count` + `Page X de Y` meta, with a `h-px bg-border-theme` hairline before the grid

#### Scenario: Mosaic + featured each page
- **WHEN** `count=20` (`total_pages=2`) and page `1` renders with `posts.length>1`
- **THEN** the grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[3px] auto-rows-fr`; `posts[0]` renders `PostCard featured` spanning `lg:col-span-2`, remaining `posts.slice(1)` render regular cards; page `2` repeats the same featured pattern (not last-page-only); when `posts.length==1` the single card renders uniform (no featured span) — `hasFeatured = posts.length>1` preserved per user decision

#### Scenario: Mosaic uniform when single item
- **WHEN** `count=13` (`total_pages=2`, page `2` has `posts.length==1`)
- **THEN** that page renders a single uniform card (no `lg:col-span-2`), not a featured span — single-item pages stay uniform per `>1` guard

#### Scenario: Empty editorial block
- **WHEN** `count==0`
- **THEN** the index emits a centered block with `Headline` eyebrow, `h2` `pages.blog.noPosts`, `p` `pages.blog.noPostsHint`, and a ghost `Btn` to `getLocalizedBlogPath(lang)`; no grid and no `PaginationNav`

#### Scenario: Grid still shows post fields
- **WHEN** the index renders in Spanish
- **THEN** each card still shows `title_es` via `pickPostField`, `description_es`, `author • localized date` via `Intl.DateTimeFormat`, prefixed `API_BASE_URL+banner_image` when present and hidden when null, with href `getLocalizedPostPath(slug, lang)` preserved

### Requirement: Render the per-post detail
The blog post detail SHALL render a static page for each `Post` that surfaces every field (`author`, `banner_image`, `published_at`, `title_*`, `description_*`, `keywords_*`, `content_*`), converts `content_*` Markdown to HTML at build time via `marked` (token API) with heading ids, lazy `img` + external `↗`, `figure` wrapping when `alt>12`, and `code` lang badge + copy button; hides the banner hero when `banner_image==null`; emits post-driven localized `PageSEO`; deduplicates a leading markdown `#{1,6} Title` that exactly matches `title_*` (normalized) before parsing; and renders a Salon hero (`bg-card-dark h-[48svh] md:h-[62svh]` gradient, bottom-anchored `Headline`+serif title + back link), description as left `border-crimson` quote, meta `author • date • readingTime` (`wordCount/200`), hairline, `blog-prose` `max-w-[72ch]` `hyphens-auto` with drop-cap, `h2::before 28px crimson`, `figure/figcaption`, `table` header `bg-ink/paper`, `blockquote cite`, `pre code-block` with badge + copy, `hr` centered crimson, `iframe 16/9`, plus a share affordance and sticky aside.

#### Scenario: Hero salon renders
- **WHEN** `banner_image` is present
- **THEN** a `bg-card-dark` hero `h-[48svh] md:h-[62svh]` with `from-black/75 via-black/35` and `from-black/40` gradients shows the image and a bottom-anchored `Headline color=red pages.blog.eyebrow — date/author` + serif `h1` `title_*`; `ogImage=API_BASE_URL+banner_image` is passed to `PageSEO`

#### Scenario: Duplicate leading title stripped
- **WHEN** `content_es` starts with `## Enredarte abre nuevas salas de exhibición` and `title_es` equals that text (normalized)
- **THEN** that first heading line is removed before `marked.parse`, so `blog-prose` first `h2` is `Introducción` (for the sample post) and the page title appears only once as the hero `h1` (plus sr-only + aside)

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

## ADDED Requirements

### Requirement: Editorial empty-state and reading affordances
The system SHALL provide the blog-specific i18n keys and affordances used by the polished index/detail: `pages.blog.{eyebrow,readMore,backToBlog,share,copied,copy,noPostsHint,readingTime,pagination.prev/next/page}` with correct `es`/`en` strings, `readingTime` computed as `max(1, ceil(wordCount/200))`, and sticky aside `lg:top-[88px]` with title/meta/description + `Btn` ghost + banner thumb.

#### Scenario: Keys exist in both locales
- **WHEN** `getTranslations("es")` and `getTranslations("en")` are called
- **THEN** `t("pages.blog.eyebrow")` returns `Revista` / `Journal`, `t("pages.blog.copied")` returns `¡Copiado!` / `Copied!`, and pagination keys map to the strings rendered in `PaginationNav`
