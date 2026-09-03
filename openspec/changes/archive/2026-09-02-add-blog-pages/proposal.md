# Change: add-blog-pages

## Why

The dashboard blog API (`GET /api/blog/posts/` and `GET /api/blog/posts/:slug/`) is live and typed (`blog-api` capability) but has no UI. Visitors have no way to browse posts. This change delivers a minimal, SSG-only blog that renders every field from the API: a paginated index grid (`/blog`, `/en/blog`) and a per-post page (`/blog/:slug`, `/en/blog/:slug`) with no comments, users, or dynamic features.

## What Changes

- Extend `src/pages/[...path].astro` `getStaticPaths()` (Fork A) to emit static blog index and detail routes in both languages; add `blog` (index) and `post` (detail) entries to `COMPONENT_MAP`. No separate route file.
- Generate paginated index pages: `/blog` + `/blog/page/2` … (es) and `/en/blog` + `/en/blog/page/2` … (en), `page_size=12`, `preserve page on lang switch`. Empty-state when `count=0`.
- Generate per-post detail pages keyed by `slug`: `/blog/:slug` (es) and `/en/blog/:slug` (en), rendering all `Post` fields including Markdown `content_*` via `marked`.
- Add localized helpers in `src/lib/i18n/utils.ts`: `getLocalizedBlogPath(lang)` (`/blog`/`/en/blog`), `getLocalizedBlogPagePath(page, lang)` (page 1 → base path), `getLocalizedPostPath(slug, lang)` (`/blog/:slug`/`/en/blog/:slug`); filtering `published_at!=null` is an inline filter in `getStaticPaths`, not a new helper.
- Add `BlogIndex.astro`, `BlogPost.astro`, `PostCard.astro` under `src/components/pages/blog/` and `PaginationNav.astro` under `src/components/molecules/` (basic UI, hide `banner_image` when `null`, localized `published_at` + `author`).
- Extend `src/lib/nav.ts` `getNavLinks` after Salas with `Blog` and `src/messages/{es,en}.json` entries; pages emit `PageSEO` with post-driven `title/description/keywords/ogImage` and `alternateUrls`.
- Filter grid/direct fetches to `published_at != null` (exclude drafts); build fails loudly on blog `FetchError`/missing env.
- Add `marked` dependency for SSG Markdown rendering.

## Capabilities

### New Capabilities

- `blog`: SSG blog index (paginated grid) and per-post detail pages, routing, markdown rendering, and localized SEO.
- `post-card`: Minimal post card for the blog grid (title, description, author+localized date, optional banner).
- `blog-pagination`: Static pagination nav (numbered + Prev/Next) for the blog index.

### Modified Capabilities

- `header-organism`: nav links gain the Blog entry.
- `lang-btns-molecule`: paginated blog index and post detail preserve slug/page across languages via `localizedPaths`.

## Impact

- Affected code: `src/pages/[...path].astro`, `src/lib/i18n/utils.ts`, `src/lib/nav.ts`, `src/messages/{es,en}.json`, `src/components/pages/blog/*`, `src/components/molecules/PaginationNav.astro` (new), `package.json` (marked), `docs/component-dependencies.md`.
- APIs: consumes existing `src/lib/api/posts.ts` `list`/`detail` and `Paginated<PostSummary>` / `Post` types from `src/lib/api/types.ts` (no new endpoints).
- Dependencies: new runtime dep `marked` (Markdown); no backend change.
- Build: blog fetches run isolated inside `getStaticPaths` (Option A) via `fetchAll`; missing `API_BASE_URL`/`API_TOKEN` or blog fetch failure fails build (same contract as `src/lib/api/client.ts`).
