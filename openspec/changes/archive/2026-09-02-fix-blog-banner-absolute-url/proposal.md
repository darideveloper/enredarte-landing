## Why

Django `PostSerializer.get_banner_image` already returns an absolute URL (`https://…/media/blog/banners/…` via CDN/`MEDIA_URL`), but the Astro frontend prefixes `API_BASE_URL + banner_image` again. The double prefix broke `og:image`, `preload`, and `PostCard`/`BlogPost` `src` (seen as `https://enredarte-dashboard.apps…https://…/media…`). The frontend should use the API value verbatim, handling both absolute and legacy relative forms without a prefix.

## What Changes

- **BREAKING (contract):** Treat `Post.banner_image` as absolute when it starts with `http://` or `https://`; otherwise treat as relative fallback. No `API_BASE_URL` prefix is applied in the UI.
- Update `src/components/pages/blog/PostCard.astro`, `BlogPost.astro`, `BlogIndex.astro` (via PostCard), `src/pages/[...path].astro` (`preloadImage`), and any SEO `ogImage` path to use the absolute value directly, with a null guard when `banner_image==null`.
- Keep nullable behavior (`null` → no image/gradient placeholder) and `alt`/`title` handling unchanged.
- Remove misleading `API_BASE_URL` import/usage for banner images where it was only used to prefix; keep `API_BASE_URL` for API fetch (`client.ts`) unchanged.
- Clarify that new posts with absolute URLs work without rebuild-time prefix logic, while old relative URLs (if any remain in DB) still render via direct relative `src` (no prefix), matching the API’s absolute guarantee.
- Update `docs/blog-api.md` and delta specs to document absolute contract.

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `blog`: `banner_image` absolute handling for index/detail hero, SEO `ogImage`, and `preloadImage`; nullable guard unchanged
- `post-card`: `banner_image` absolute handling for card image `src` (regular + featured + placeholder path unchanged)
- `blog-api`: Clarify `Post.banner_image` is absolute URL (nullable), not relative requiring `API_BASE_URL` prefix

## Impact

- **Code:** `src/components/pages/blog/PostCard.astro:18`, `BlogPost.astro:24`, `src/pages/[...path].astro:170` (`preloadImage`), `src/components/pages/blog/BlogIndex.astro` (indirect via PostCard), potentially `docs/blog-api.md`, `openspec/specs/{blog,post-card,blog-api}/spec.md`.
- **APIs:** Django now authoritative for absolute URL; frontend no longer prefixes. Backward-compatible: if `banner_image` is relative, frontend renders it as-is (no prefix) — relative will resolve against site origin; ideally no such rows remain.
- **Build:** No env change; `API_BASE_URL` still required for `apiFetch` but not for image `src`. No new deps.
- **Risks:** Existing DB rows with relative `banner_image` would lose `API_BASE_URL` prefix and 404 if not absolute; mitigate by verifying API now returns absolute for all published posts (checked in `dist` sample) or adding a relative-fallback that preserves prefix only when needed (design decision to drop).
