## ADDED Requirements

### Requirement: Generate static blog index and detail routes
The system SHALL extend the single catch-all `src/pages/[...path].astro` `getStaticPaths()` to emit static blog routes in both languages (Fork A), isolated from `buildSiteData` (Option A), using the existing `src/lib/api/posts.ts` `list`/`detail` and `fetchAll`/`Paginated<PostSummary>` contracts. No separate route file SHALL be introduced.

#### Scenario: Blog index page exists in both languages
- **WHEN** the site builds
- **THEN** `/blog` (es) and `/en/blog` (en) are emitted as static pages rendering the blog index

#### Scenario: Paginated blog index pages exist
- **WHEN** `count` posts require more than one `page_size=12` page
- **THEN** `/blog/page/2` … up to `total_pages` (es) and `/en/blog/page/2` … (en) are emitted, each rendering that slice
- **AND** when `count <= 12`, only `/blog` and `/en/blog` are emitted

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
The blog index SHALL render a static paginated grid of `PostCard`s (basic UI), each card surfacing every `PostSummary` field needed for the grid, with localized date and author, and hiding the banner image when `banner_image == null`. The page SHALL emit localized `PageSEO` and pass `localizedPaths` preserving the page number for the language switch.

#### Scenario: Grid shows post fields
- **WHEN** the index renders in Spanish
- **THEN** each card shows `title_es` (via `pickPostField`), `description_es`, `author`, and a localized date from `published_at` via `Intl.DateTimeFormat` (`es: 20 ago 2026`, `en: Aug 20, 2026`); `keywords` are not shown on cards

#### Scenario: Banner image hidden when null
- **WHEN** `banner_image == null`
- **THEN** the card renders without an image block (no placeholder), consistent with detail hero behavior

#### Scenario: Banner image prefixed when present
- **WHEN** `banner_image == "/media/blog/banners/banner-1.jpg"`
- **THEN** the rendered `src` is `API_BASE_URL + banner_image` (e.g. `https://enredarte-dashboard.localhost/media/blog/banners/banner-1.jpg`)

#### Scenario: Language switch preserves page
- **WHEN** the user is on `/blog/page/2` (es)
- **THEN** the `LangBtns` switch links to `/en/blog/page/2` (en) via `localizedPaths` (and vice versa)

#### Scenario: Card links to detail
- **WHEN** a post card for slug `enredarte-abre-nuevas-salas` renders
- **THEN** its href is `getLocalizedPostPath(slug, lang)` for the active language

### Requirement: Render the per-post detail
The blog post detail SHALL render a static page for each `Post` that surfaces every field (`author`, `banner_image`, `published_at`, `title_*`, `description_*`, `keywords_*`, `content_*`), converts `content_*` Markdown to HTML at build time via `marked`, hides the banner hero when `banner_image == null`, and emits post-driven localized `PageSEO`.

#### Scenario: Detail renders all fields
- **WHEN** `/blog/enredarte-abre-nuevas-salas` renders in Spanish
- **THEN** it shows `title_es`, `description_es` as subtitle, `author` + localized `published_at`, `content_es` rendered as HTML, `keywords_es` as `meta keywords`, and `banner_image` as a top hero image when present

#### Scenario: Markdown rendered with marked at build
- **WHEN** `content_es` is `# Title\n\n- item`
- **THEN** the HTML is produced by `marked.parse` at build time and injected via `set:html` (trusted CMS content)

#### Scenario: Hero hidden when banner null
- **WHEN** `banner_image == null`
- **THEN** no hero image block renders

#### Scenario: Detail language switch preserves slug
- **WHEN** the user is on `/blog/enredarte-abre-nuevas-salas` (es)
- **THEN** the `LangBtns` switch links to `/en/blog/enredarte-abre-nuevas-salas` (en)

#### Scenario: SEO metadata per post
- **WHEN** a post detail renders
- **THEN** `PageSEO` receives `title=title_*`, `description=description_*`, `keywords` from `keywords_*`, `ogImage=API_BASE_URL+banner_image` when not null, and `alternateUrls` for the es/en post paths; index pages use `pages.blog.title/description/keywords` from `messages/{es,en}.json`
