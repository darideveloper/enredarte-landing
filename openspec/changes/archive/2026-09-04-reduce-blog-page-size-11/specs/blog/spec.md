## MODIFIED Requirements

### Requirement: Generate static blog index and detail routes
The system SHALL extend the single catch-all `src/pages/[...path].astro` `getStaticPaths()` to emit static blog routes in both languages (Fork A), isolated from `buildSiteData` (Option A), using the existing `src/lib/api/posts.ts` `list`/`detail` and `fetchAll`/`Paginated<PostSummary>` contracts. No separate route file SHALL be introduced.

#### Scenario: Blog index page exists in both languages
- **WHEN** the site builds
- **THEN** `/blog` (es) and `/en/blog` (en) are emitted as static pages rendering the blog index

#### Scenario: Paginated blog index pages exist
- **WHEN** `count` posts require more than one `page_size=11` page
- **THEN** `/blog/page/2` … up to `total_pages` (es) and `/en/blog/page/2` … (en) are emitted, each rendering that slice
- **AND** when `count <= 11`, only `/blog` and `/en/blog` are emitted

#### Scenario: Per-post detail routes by slug
- **WHEN** the API contains a post with slug `enredarte-abre-nuevas-salas` and `published_at != null`
- **THEN** `/blog/enredarte-abre-nuevas-salas` (es) and `/en/blog/enredarte-abre-nuevas-salas` (en) are emitted
- **AND** drafts (`published_at == null`) are excluded from both index and detail emission

#### Scenario: Localized path helpers exist
- **WHEN** `getLocalizedBlogPath(lang)`, `getLocalizedBlogPagePath(page, lang)`, and `getLocalizedPostPath(slug, lang)` are called
- **THEN** they return `/blog` / `/en/blog`, `/blog/page/2` / `/en/blog/page/2` (page 1 returns the base path), and `/blog/:slug` / `/en/blog/:slug` respectively

#### Scenario: Drafts excluded
- **WHEN** a post has `published_at == null`
- **THEN** it does not appear in the index grid and no detail page is emitted for that slug

#### Scenario: Empty blog renders empty-state
- **WHEN** `count == 0` (verified prod `apps.darideveloper.com` empty vs local `count:2`)
- **THEN** `/blog` and `/en/blog` still emit with a localized empty-state (`pages.blog.noPosts`) and no pagination nav

#### Scenario: Build fails loudly on blog fetch
- **WHEN** `list`/`detail` throws `FetchError` or `API_BASE_URL`/`API_TOKEN` is missing (per `src/lib/api/client.ts`)
- **THEN** `getStaticPaths` lets the error propagate and `astro build` fails (no silent fallback)

### Requirement: Render the blog index grid
The blog index SHALL render a static paginated editorial grid of `PostCard`s that preserves the Gallery Salon language — `Headline` eyebrow `pages.blog.eyebrow` (Revista/Journal), serif display `h1`, `text-description` lede, count meta `pages.blog.pagination.page`, hairline, and mosaic `gap-4 md:gap-[3px] auto-rows-fr` — with `hasFeatured = posts.length>1` (first `PostSummary` of every page as `PostCard featured` `lg:col-span-2 aspect-[16/10]`), localized `PageSEO`, `localizedPaths` preserving page number, and an upgraded empty-state editorial block. The pre-existing static emission (`getStaticPaths` Fork A), `page_size=11`, banner `banner_image` used as absolute URL verbatim (no `API_BASE_URL` prefix, nullable), and hiding `banner_image==null` contracts remain unchanged.

#### Scenario: Editorial header renders
- **WHEN** `/blog` renders in `es`
- **THEN** a `Headline color=red` with `t("pages.blog.eyebrow")` (=`Revista`) appears above the serif `h1` `pages.blog.title`, followed by `pages.blog.description` as a `text-pretty` lede and `count` + `Page X de Y` meta, with a `h-px bg-border-theme` hairline before the grid

#### Scenario: Mosaic + featured each page
- **WHEN** `count=22` (`total_pages=2` at `page_size=11` — chosen to illustrate two full 11-item pages) and page `1` renders with `posts.length>1`
- **THEN** the grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[3px] auto-rows-fr`; `posts[0]` renders `PostCard featured` spanning `lg:col-span-2`, remaining `posts.slice(1)` render regular cards; page `2` repeats the same featured pattern (not last-page-only); when `posts.length==1` the single card renders uniform (no featured span) — `hasFeatured = posts.length>1` preserved per user decision

#### Scenario: Mosaic uniform when single item
- **WHEN** `count=12` (`total_pages=2` at `page_size=11`, page `2` has `posts.length==1` — `12 = 11+1` illustrates single-item tail after the change)
- **THEN** that page renders a single uniform card (no `lg:col-span-2`), not a featured span — single-item pages stay uniform per `>1` guard

#### Scenario: Empty editorial block
- **WHEN** `count==0`
- **THEN** the index emits a centered block with `Headline` eyebrow, `h2` `pages.blog.noPosts`, `p` `pages.blog.noPostsHint`, and a ghost `Btn` to `getLocalizedBlogPath(lang)`; no grid and no `PaginationNav`

#### Scenario: Grid still shows post fields
- **WHEN** the index renders in Spanish
- **THEN** each card still shows `title_es` via `pickPostField`, `description_es`, `author • localized date` via `Intl.DateTimeFormat`, absolute `banner_image` URL used verbatim as `src` when present and hidden when `null` (no `API_BASE_URL` prefix), with href `getLocalizedPostPath(slug, lang)` preserved
