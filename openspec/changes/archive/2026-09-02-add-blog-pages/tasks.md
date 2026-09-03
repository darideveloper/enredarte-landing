## 1. Dependencies and i18n groundwork

- [x] 1.1 Add `marked` (+ `@types/marked` if needed) to `package.json` and verify `pnpm build` still runs without usage
- [x] 1.2 Add `getLocalizedBlogPath(lang)`, `getLocalizedBlogPagePath(page, lang)`, `getLocalizedPostPath(slug, lang)` to `src/lib/i18n/utils.ts` (page 1 returns base path)
- [x] 1.3 Extend `src/messages/es.json` and `src/messages/en.json` with `global.nav.blog="Blog"` (es/en) and `pages.blog.{title,description,keywords,noPosts}` and re-run `pnpm validate-i18n`
- [x] 1.4 Update `src/lib/nav.ts` `getNavLinks` to inject Blog after Salas (`home → obras → salas → blog → artistas`) using `getLocalizedBlogPath`

## 2. Routing generation (Fork A, Option A)

- [x] 2.1 Extend `src/pages/[...path].astro` `getStaticPaths()` to fetch blog index directly (outside `buildSiteData`): `fetchAll(list)` to collect published posts (`published_at!=null`), derive `total_pages=ceil(filteredCount/12)`, then emit `/blog` + `/blog/page/N` (es) and `/en/blog` + `/en/blog/page/N` (en) with 12-item slices; page 1 is base path
- [x] 2.2 Emit detail pages: loop filtered published posts and `detail`-independent slug emit for `/blog/:slug` (es) and `/en/blog/:slug` (en); drafts excluded, no extra route file
- [x] 2.3 Add `COMPONENT_MAP` entries `blog: BlogIndex` (index, paginated) and `post: BlogPost` (detail) and expand `AllPageKeys = PageKey | "blog" | "post"` plus page-props typing (`blogPage?: number`, `postSlug?: string`)
- [x] 2.4 Thread paginated `localizedPaths` for index: `page==1` ↔ `/blog`/`/en/blog`, `page==N` ↔ `/blog/page/N`/`/en/blog/page/N`
- [x] 2.5 Thread `localizedPaths` for detail: `slug` ↔ `/blog/:slug`/`/en/blog/:slug` (pattern from `GalleryPage`/`ArtworkPage`)
- [x] 2.6 Extend `preloadImage` branch to prefer `Post.banner_image ? API_BASE_URL + banner_image` for post detail

## 3. New UI components (basic, full-data render)

- [x] 3.1 Create `src/components/pages/blog/PostCard.astro` (text-first): localized title/description via `pickPostField`, `author • Intl.DateTimeFormat` date, image above text when `banner_image!=null` (prefixed), hide block when null, entire card links via `href`
- [x] 3.2 Create `src/components/molecules/PaginationNav.astro` static nav (numbered + Prev/Next, page 1 ↔ base path, disabled current and edges, hidden when `total_pages<=1`)
- [x] 3.3 Create `src/components/pages/blog/BlogIndex.astro` paginated grid (`page_size=12`): receives `lang`, `posts: PostSummary[]` slice, `pagination:{page,total_pages,count}`, renders `PostCard` grid + `PaginationNav` + empty-state block when `count==0` + `PageSEO` via `pages.blog.*`
- [x] 3.4 Create `src/components/pages/blog/BlogPost.astro` detail: receives `lang`, `Post`, renders hero (`banner_image` prefixed, hidden if null), localized title/description/keywords, `author • date`, `marked.parse(content_*)` via `set:html`, + post-driven `PageSEO` (`ogImage`, `alternateUrls`)
- [x] 3.5 Ensure build fails loudly: let `apiFetch` `FetchError`/missing env propagate from `getStaticPaths` (no catch silent fallback)

## 4. Docs, sitemap, and verification

- [x] 4.1 Update `docs/component-dependencies.md` `[...path].astro` layer and trees for `BlogIndex/BlogPost` + new helpers
- [x] 4.2 Run `pnpm run build` with valid `API_BASE_URL/TOKEN` against local dashboard (`https://enredarte-dashboard.localhost`, `count:2`); verify outputs `dist/blog/index.html`, `dist/blog/page/*`, `dist/blog/<slug>/` and their `en/` mirrors
- [x] 4.3 Verify sitemap (`@astrojs/sitemap`) includes all emitted blog index/detail URLs and `robots.txt.ts` still emitted; validate with `pnpm validate-imports` and any existing Astro checks
