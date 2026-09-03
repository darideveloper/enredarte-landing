## Context

Blog routes (`[...path].astro` Fork A, `page_size=12`, `fetchAll` isolated) and minimal cards shipped and built (`73 pages`). The UI was basic `text-first` cards + numbered `PaginationNav` + markdown `set:html` with sparse `prose-*`. Salon identity lives in `DESIGN.md` (paper/ink/crimson, Georgia serif, `rounded-none`, `gap 3px` mosaic, tactile `scale + -translate-y-1 + shadow-2xl`, `Crimson ≤10%`, `Paper Rule`) and `PRODUCT.md` (warm editorial curator voice, bilingual, SSG, GSAP reduced-motion). `global.css` exposed 8 tokens; `messages/{es,en}.json` had `pages.blog.title/description/keywords/noPosts` only. `marked 15` was unused beyond `parse`. Goal is a **catch-up mirror**: codify HOW the already-built polish was done (no new infra), so proposal/specs/tasks match `src/components/pages/blog/{PostCard,BlogIndex,BlogPost}.astro`, `src/components/molecules/PaginationNav.astro`, `src/styles/global.css`, `src/messages/*`, `docs/component-dependencies.md`.

## Goals / Non-Goals

**Goals:**
- Codify the editorial `BlogIndex` header + mosaic + every-page featured, equal-height `PostCard`, responsive i18n pagination, Salon `BlogPost` hero/prose/figure/table/code/hr/iframe, title deduplication, and translated share/copy without changing routes, pagination math, or API contracts.
- Preserve `Layout→Header→LangBtns localizedPaths` + `preloadImage` and `BaseSEO alternateUrls` bilingual behavior.
- Document browser-surface theming and `marked` renderer choices for gallery reading.

**Non-Goals:**
- New routes, filters, search, comments, CMS changes, or e-commerce (inquiry model preserved).
- New runtime deps beyond `marked` + `tailwindcss v4` + `gsap` already present.
- Backend `Post` shape or `apiFetch` token change — `PostSummary/Post` remain flat `*_es/_en` + nullable `banner_image`.

## Decisions

**Decision:** Mosaic `gap-4 md:gap-[3px] auto-rows-fr` + featured `hasFeatured = posts.length>1` every page with `>1` items (not last-page-only).
- *Why:* Mirrors `Gallery` asymmetric `1.4fr 1fr 1fr` + `Artworks` `3px` mosaic `DESIGN.md` grid; every page with `>1` items deserves a hero for scanability, and last-page-only left `page 1` uniform — user then requested every-page; single-item pages stay uniform per `>1` guard (user-confirmed).
- *Alt:* Uniform 3-col — rejected as less editorial; last-page-only — rejected after UAT; `>=1` always-featured — rejected (single card spanning `lg:col-span-2` in a 3-col grid leaves awkward gutter).

**Decision:** `PostCard` as `bg-card-dark` letterbox with `flex flex-col h-full` + transform-only hover.
- *Why:* `card-dark #0D0D0D` letterbox isolates art, `shadow-2xl -translate-y-1` preserves `Flat-By-Default` + `Overlay Rule`; `pl-3` caused `text-balance` re-wrap and row height jump — `translate-x-3` is layout-free; `line-clamp-2 + min-h-[48px] + mt-auto` pins meta and equalizes `auto-rows-fr`.
- *Alt:* Fixed `min-h` info — rejected (large blank for short copy); `border-left` instead of `translate` — still alters box size.

**Decision:** `PaginationNav` bilingual responsive split (`hidden md:flex` numbered + `flex md:hidden` collapsed `Prev — page/total — Next`).
- *Why:* Mobile numbered row wrapped and truncated `crimson` CTAs; collapsed bar keeps `44px` touch + `brand-500` focus + `opacity-40` disabled per `DESIGN.md` chips; i18n via `getTranslations` keeps `ValidateI18n` passing.
- *Alt:* Single responsive row with `overflow-x-scroll` — rejected (scroll affordance undiscoverable, pagination should not scroll).

**Decision:** `BlogPost` `marked 15` token renderer + `blog-prose is:global` drop-cap/table/figure/hr.
- *Why:* `marked` token API (`token.text/depth/lang`) is the v15 contract; heading ids enable anchor links, `image→figure` when `alt>12` gives Salon `figcaption 10px uppercase`, `code→code-block` adds lang badge + copy button with i18n labels, `link` adds `↗` for externals — all `prose-*` already supports most tokens, `is:global` handles `::first-letter`, `::before`, `table scroll`, `hr centered`, `blockquote cite`.
- *Alt:* `@tailwindcss/typography` plugin — rejected (would add dep and override `paper` palette); client-side `remark` — rejected (SSG build-time `set:html` is correct).

**Decision:** `stripLeadingTitle(md, title)` dedupe before parse.
- *Why:* CMS authors paste `title` as first markdown `# Heading`; hero already owns `h1`, so prose started with duplicate `h2`. Stripping exact normalized match (front-matter aware, only first heading) removes one occurrence without touching legitimate `Introducción`.
- *Alt:* CSS `first-child hidden` — brittle (heading vs paragraph variant); backend strip — rejected (would couple CMS release).

**Decision:** `global.css` browser surfaces `::selection/caret/scrollbar/focus-visible/underline-offset` + `--color-card-dark`.
- *Why:* `craft-floor` cheapest signal of built-not-assembled; `card-dark` already used in `ImageCard` but unexposed as token — now semantic.
- *Alt:* No `is:global` for prose — would rely solely on `prose-*`, leaving drop-cap/figure/hr unstyled.

## Risks / Trade-offs

- **Markdown first-heading false positive** (CMS legitimately repeats title) → Mitigation: normalize `trim+lower+space-collapse`, compare only first heading line, preserve if not exact.
- **`alt>12` heuristic for figure** → Mitigation: long decorative alt may become caption; short caption may stay as `img` — acceptable tradeoff vs always wrapping (would add many `figcaption`).
- **`prose` `line-clamp-2` on title** truncates very long titles → Mitigation: `min-h-[48px]` reserves 2 lines, `title` already in hero/SEO, card is scan context not detail.
- **`marked` token API drift** (v16 may rename `token.text`) → Mitigation: `as any` cast + `?? ""` fallbacks, build fails loudly on `astro build` as per `blog` spec.

## Migration Plan

Already built — catch-up docs only. Deploy is `pnpm build` (`73 pages`) → `dist/` → `nginx` (existing `Dockerfile` `node→nginx`). Rollback is revert 8 artifacts (`PostCard`, `BlogIndex`, `BlogPost`, `PaginationNav`, `global.css`, `messages/es.json`, `messages/en.json`, `docs/component-dependencies.md`). No data migration; `API_BASE_URL+banner_image` prefix unchanged, so existing CDN images remain. `validate-i18n` + `validate-imports` must still pass.

## Open Questions

- None — all decisions applied and verified via `pnpm build` and `grep` count for hero vs prose headings.
