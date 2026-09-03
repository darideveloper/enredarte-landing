## Context

The blog API is fully typed and documented (`blog-api` capability, `docs/blog-api.md`, `openspec/specs/blog-api/spec.md`, `src/lib/api/posts.ts` `list`/`detail`+`pickPostField`). Live local dashboard shows 2 posts (`count:2` at `https://enredarte-dashboard.localhost/api/blog/posts/`), each with flat bilingual fields plus Markdown `content_*` on detail. The project renders entirely via a single catch-all `src/pages/[...path].astro` `getStaticPaths()` that calls `buildSiteData()` (`src/data/api.ts`) for 10 catalog resources and threads `siteData/lang/localizedPaths` to `Layout` → `Header/LangBtns`. There is no blog route, no Markdown renderer (`package.json` has no `marked`/`markdown-it`), and `src/lib/nav.ts`/`messages` have no Blog entry.

## Goals / Non-Goals

**Goals:**
- SSG blog with paginated index (`page_size=12`) and per-post pages, both languages, using Fork A (extend `[...path].astro`) + static `page/N` pagination.
- Render every API field: `pickPostField` for flat bilingual, prefixed `banner_image`, localized `published_at`, `content` Markdown via `marked`, and post-driven SEO.
- Isolated fetch (Option A) — blog pages call `posts` directly inside `getStaticPaths`, not via `buildSiteData`.

**Non-Goals:**
- No comments, users, search, tags/categories, or client filtering.
- No `buildSiteData` merge or `fetchAll` sharing with catalog (defer Hybrid/home teaser).
- No `@tailwindcss/typography` or custom `prose` redesign; basic typography on Markdown.
- No `/es/blog` prefix — `es` is bare (`/blog`), `en` is `/en/blog`.

## Decisions

**D1 — Fork A over separate route files.**
Extend `[...path].astro` and `COMPONENT_MAP` (`blog`, `post`). Rationale: single i18n-aware generation site preserves `localizedPaths` through `Layout:29`, `preloadImage`, `ClientRouter`, and sitemap collection. Separate `src/pages/blog/[slug].astro` would duplicate the `en/` prefix logic and `es` bare-path handling. Alternative rejected: multiple route files would need shared `getLangFromUrl`/`localizedPaths` plumbing and risk `/es/blog` vs `/blog` divergence.

**D2 — Static `/blog/page/N` pagination (Strategy A).**
`getStaticPaths` calls `list({page:1, page_size:12})` for `count/total_pages`, then loops pages to emit `/blog` and `/blog/page/2` … per language. `page==1` is the base path (no `/page/1`). Pagination is pure links, no island. Alternative (single page + client hide/show) rejected — JS-only pagination is not SEO-indexable and ships all posts in one HTML bundle.

**D3 — Isolated fetch (Option A) over `buildSiteData` merge.**
Blog fetch runs only at `[...path].astro` `getStaticPaths` time: `fetchAll(list)` to collect all `PostSummary`, filter `published_at!=null` in memory, then slice `12` per page for emission — not inside `data/api.ts`. Keeps catalog and blog failure isolation and avoids bloating every non-blog page's `props.siteData`. Alternative (merge) considered for nav counts but deferred — adds blog failure to catalog builds and is unnecessary for minimal slice.

**D4 — `marked` for Markdown.**
Install `marked` and call `marked.parse(content_*)` in Astro frontmatter, emitting via `set:html`. Content is trusted CMS raw Markdown (no user HTML). Minimal dep, sync build-time parse. Alternative `markdown-it` richer but larger; deferred unless GFM/flavored plugins are needed.

**D5 — Flat bilingual helpers.**
Add `getLocalizedBlogPath(lang)`, `getLocalizedBlogPagePath(page, lang)`, `getLocalizedPostPath(slug, lang)` to `src/lib/i18n/utils.ts` alongside `getLocalizedSalaPath:16`. Keep `pickPostField` for `Post` flat fields, unlike `pickTranslation` dict. Prevents mixing catalog `Translations<T>` with flat `*_es/_en`.

**D6 — Text-first `PostCard` + static `PaginationNav`.**
New `PostCard.astro` (not reuse of `molecules/ImageCard.astro`) because blog grid is text-first (title/description/author+date) and hides image chrome when `banner_image==null`. `PaginationNav.astro` is static (no React), numbered + Prev/Next, page 1 links to base path.

**D7 — Filter drafts early, fail loudly.**
`published_at==null` excluded from index and detail emission (draft guard). Blog `FetchError` or missing `API_BASE_URL`/`API_TOKEN` propagates and fails `astro build` (per `client.ts:45` contract) — no silent empty fallback. Trade-off: prod `count:0` will ship an empty-state page but still succeeds; transient blog outage fails whole build (acceptable for SSG correctness).

## Risks / Trade-offs

- **[Relative banner/decay]** → Mitigation: when `banner_image==null`, render no image block; when present, render `API_BASE_URL + banner_image`; `preloadImage` same prefix.
- **[Static pagination blow-up with many posts]** → 100 posts at 12/page → 9 pages per lang; linear build cost, not exponential. Acceptable for minimal slice.
- **[Markdown XSS without sanitize]** → CMS is trusted; revisit `sanitize-html` only if external content appears.
- **[Prod `count:0` ships empty blog]** → Empty-state (`pages.blog.noPosts`) still SEO-valid; operator must seed dashboard before meaningful deploy.
- **[`marked` vs prose style]** → No typography plugin; output may look unstyled. Mitigation: reuse existing `paper/ink/muted` + minimal `.prose` max-width in `BlogPost.astro`.

## Migration Plan

1. `pnpm add marked` + `@types/marked` (if needed).
2. Add `utils.ts` blog path helpers and `messages` Blog entries (`validate-i18n` must still pass).
3. Extend `[...path].astro` `getStaticPaths` with `list/detail` blog fetches, `COMPONENT_MAP` entries, `localizedPaths` branches (page + post), and `preloadImage` for banner.
4. Add `PostCard`, `PaginationNav`, `BlogIndex`, `BlogPost` components; update `nav.ts` Blog position (`home→obras→salas→blog→artistas`).
5. `pnpm run build` with valid `API_BASE_URL`/`API_TOKEN`; verify `dist/blog/index.html`, `dist/blog/page/2/`, `dist/blog/<slug>/` and their `en/` counterparts + sitemap entries. Rollback: revert change branch — catalog pages unaffected.

## Open Questions

- None remaining — 14 gaps closed. Future optional: `@tailwindcss/typography` prose plugin if markdown styling needs polish; Hybrid `buildSiteData` teaser if `Home` later wants latest posts.
