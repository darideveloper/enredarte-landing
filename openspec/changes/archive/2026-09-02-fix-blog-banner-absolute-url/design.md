## Context

Blog images already flow build-time via `Post.banner_image` from Django `get_banner_image` (now absolute `https://cdn/.../media/blog/banners/...`), but the Astro layer still treated `banner_image` as relative `docs/blog-api.md:88` and prefixed `API_BASE_URL + banner_image` in `PostCard.astro:18`, `BlogPost.astro:24`, and `[...path].astro:170` `preloadImage`/`ogImage`. Sample `dist/blog/.../index.html` showed double `https://…https://…` in `og:image` and `preload`. `API_BASE_URL` remains required for `apiFetch` (`client.ts`) but not for image `src`. No optimization (`astro:assets`) is involved — the contract is now “absolute verbatim”.

## Goals / Non-Goals

**Goals:**
- Use Django-provided absolute `banner_image` verbatim as `src`/`ogImage`/`preloadImage` with no prefix, preserving `null` → placeholder/hidden behavior and bilingual titles.
- Clarify that legacy relative values (if any DB rows remain) render as-is without prefix, and update `docs/blog-api.md` + delta specs to reflect absolute contract.

**Non-Goals:**
- Change API shape beyond `banner_image` absolute guarantee; keep `Post` flat `*_es/_en`, `published_at` nullable, pagination `page_size=12`.
- Add `astro:assets` optimization, `srcset`, or dimension probing — out of scope for this prefix fix.
- Alter `API_BASE_URL`/`API_TOKEN` usage for API fetch.

## Decisions

**Decision:** Drop `API_BASE_URL` prefix entirely; use `banner_image` verbatim when non-null, otherwise `null` guard.
- *Why:* Django now returns `https://…` via `MEDIA_URL`/CDN; double prefix broke SEO. Simplest fix matches API truth and fixes double `https`.
- *Alt:* Detect `banner_image.startsWith("http")` then prefix only when relative (conditional) — rejected per user instruction to use absolute directly without prefix; keeps code minimal (YAGNI). Legacy relative rows, if any, will resolve against site origin (acceptable) and should be migrated in Django to absolute.

**Decision:** Update three UI sites + preload/SEO only: `PostCard.astro` `bannerSrc = post.banner_image ?? null`, `BlogPost.astro` `bannerSrc/ogImage = post.banner_image ?? null`, `[...path].astro` `preloadImage = post?.banner_image ?? fallback` (no `import.meta.env.API_BASE_URL` for images).
- *Why:* Smallest blast radius; `client.ts` still reads `API_BASE_URL` for fetch, so env not removed.
- *Alt:* Introduce helper `resolveBannerSrc(post)` — rejected as over-abstract for 3 sites; direct assignment is clearer.

**Decision:** Treat `banner_image` type as `string | null` absolute in `blog-api` spec, keep `src/lib/api/types.ts` comment update but no runtime validation.
- *Why:* Keeps spec truthful without adding runtime URL parsing; spec scenarios cover absolute verbatim and null.
- *Alt:* Add `URL` parsing validator — rejected (CSS `src` tolerates relative fallback).

## Risks / Trade-offs

- **Legacy relative rows still in DB** → Mitigation: They will render as relative `src` (`/media/...`) against site origin, not CDN — acceptable until Django backfill to absolute; verify published posts are already absolute (checked sample `dist` absolute `https://…`).
- **OG `og:image` already absolute** → Mitigation: `BaseSEO.astro` already handles absolute `ogImage.startsWith("https://")` → no double host.
- **Spec drift if re-adding prefix later** → Mitigation: delta specs explicitly state “no `API_BASE_URL` prefix”.

## Migration Plan

Single deploy: remove `API_BASE_URL` import/prefix from 3 files, rebuild `pnpm build` (`73 pages`), verify `dist/blog/.../index.html` `src`/`og:image`/`preload` each single `https://`, no double. Rollback is revert 3 files + `docs/blog-api.md` + specs. No data migration.

## Open Questions

- None — API absolute confirmed by user.
