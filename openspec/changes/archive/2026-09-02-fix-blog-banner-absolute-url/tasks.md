## 1. Drop API_BASE_URL prefix for banner images

- [x] 1.1 Update `src/components/pages/blog/PostCard.astro:18` to `const bannerSrc = post.banner_image ?? null` (no `API_BASE_URL` import/prefix), preserving nullable placeholder `aspect-[4/3]` gradient
- [x] 1.2 Update `src/components/pages/blog/BlogPost.astro:24` to `const bannerSrc = post.banner_image ?? null` and `ogImage = bannerSrc`, removing `API_BASE_URL` usage for images
- [x] 1.3 Update `src/pages/[...path].astro:170` `preloadImage` to use `post?.banner_image` verbatim (no `API_BASE_URL + banner_image` prefix), keeping artwork/artist fallback logic

## 2. Docs & specs

- [x] 2.1 Update `docs/blog-api.md` banner_image contract from “relative — prefix API_BASE_URL” to “absolute `https://…/media/blog/banners/…` or `null` — use verbatim, no prefix (legacy relative rendered as-is)”
- [x] 2.2 Verify `src/lib/api/types.ts` `PostSummary.banner_image` comment matches absolute spec (no code change if already generic)

## 3. Verification

- [x] 3.1 Run `pnpm validate-i18n && pnpm validate-imports && pnpm build` → `73 pages`, verify `dist/blog/enredarte-abre-nuevas-salas/index.html` `src`/`og:image`/`preload` each single `https://…` (no double `https://…https://…`), card images on `/blog` use absolute verbatim
