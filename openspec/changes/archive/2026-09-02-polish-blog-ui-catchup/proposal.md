## Why

The blog was shipped as functional SSG routes with a minimal text-first UI. It worked but broke the “Gallery Salon” design language (`DESIGN.md`) — sharp geometry, paper/ink/crimson, serif display, tactile hovers — and left editorial reading quality, empty/edge states, i18n consistency, and markdown prose below the bar set by `Home`, `GalleryPage`, and `ArtworkPage`. Users saw uncluttered cards that reflowed on hover, unequal heights, a bare prose dump, duplicated titles from CMS, and a share affordance that switched to English. A catch-up polish is needed to bring `BlogIndex`/`BlogPost` to the same craft floor with no API or routing changes.

## What Changes

- **BlogIndex editorial header:** Adds `Headline` eyebrow `pages.blog.eyebrow` (Revista/Journal), serif display `h1`, `text-description` lede, count meta `pages.blog.pagination.page`, and hairline hairline — matching `DESIGN.md` Eyebrow + Tracking Gradient.
- **Mosaic grid + featured:** `grid gap-4 md:gap-[3px] auto-rows-fr` (gallery mosaic `DESIGN.md` 1.4fr language) and `hasFeatured = posts.length>1` — first `PostSummary` of every page with `>1` items renders `PostCard featured` `lg:col-span-2 aspect-[16/10]` with overlay title/CTA; remainder uniform; single-item pages stay uniform per `>1` guard (user-confirmed).
- **PostCard salon card:** `bg-card-dark` letterbox, `aspect-[4/3]` (regular) / `16/10` (featured), `brightness [0.92→0.72] scale-[1.05]` + `shadow-2xl -translate-y-1`, `from-black/75` gradient, date badge `bg-paper/90`, crimson `2px` accent bar sliding in with `translate-x-3` (transform-only, no reflow), `flex flex-col h-full` + `flex-1` + `line-clamp-2` title `min-h-[48px]` + `meta mt-auto` for equal heights and pinned meta.
- **PaginationNav responsive + i18n:** Bilingual `pages.blog.pagination.prev/next/page` via `getTranslations`; `md` full numbered + Prev (ink ghost) / Next (crimson) with `focus:ring-brand-500`, `<md` collapsed `Prev — page/total — Next` full-width; hidden when `total_pages<=1`.
- **BlogPost salon article:** `bg-card-dark h-[48svh] md:h-[62svh]` hero gradient `from-black/75 via-black/35`, bottom-anchored `Headline` + serif title, description as left `border-crimson` quote, meta `author • date • readingTime` (`wordCount/200`), sticky aside `lg:top-[88px]` with aside `Headline`+`Btn`, `blog-prose` `max-w-[72ch]` `hyphens-auto` with drop-cap, `h2::before 28px crimson`, `figure bg-card-dark` + `figcaption`, `table` header `bg-ink text-paper`, `blockquote cite`, `pre code-block` with lang badge + copy button, `hr` centered crimson, `iframe 16/9`. Renderer `marked 15` token API adds heading ids (demote `h1→h2`), lazy `img`, external `↗`, `figure` wrapping when `alt>12`, `code` lang parsing.
- **Duplicate title strip:** `stripLeadingTitle(content, title)` removes a leading markdown `#{1,6} Title` that exactly matches `title_*` (normalized) before `marked.parse`, so the hero `h1` remains the single source of truth — sample post no longer renders `title` twice in `blog-prose`.
- **Share i18n:** Share buttons and code copy carry `data-share-label/data-copied-label` and `data-copy-label`; script swaps `¡Copiado! ✓` / `Copied! ✓` per `lang` instead of hardcoded English `Copied`.
- **Global surfaces:** `styles/global.css` adds `--color-card-dark`, `::selection bg-crimson/paper`, `caret-color brand-500`, `scrollbar-color`, `focus-visible` `2px brand-500`, `a underline-offset 3px`.
- **i18n keys:** `messages/es.json` / `en.json` `pages.blog.{eyebrow,readMore,backToBlog,share,copied,copy,noPostsHint,readingTime,pagination.*}`.

No routing, pagination math (`page_size=12`, `page 1→base path`), or `fetchAll/list/detail` contracts changed; `Layout.astro` + `getLocalized*Path` + `preloadImage` preserved.

## Capabilities

### New Capabilities
- *(none — all work is polish within existing capabilities)*

### Modified Capabilities
- `blog`: editorial header, mosaic/featured grid, empty-state, prose salon, heading/figure/table/code/hr styling, leading-title dedupe, reading time, sticky aside
- `post-card`: salon `bg-card-dark` letterbox, featured `lg:col-span-2`, transform-only hover, flex-fill equal heights, badge/accent, i18n `readMore`
- `blog-pagination`: i18n prev/next/page, responsive collapse `<md`, token focus states
- `global-colors`: `--color-card-dark`, `::selection`, `caret-color`, `scrollbar-color`, `focus-visible`, `underline-offset`

## Impact

- **Code:** 8 artifacts — `src/components/pages/blog/PostCard.astro`, `BlogIndex.astro`, `BlogPost.astro`, `src/components/molecules/PaginationNav.astro`, `src/styles/global.css`, `src/messages/es.json`, `src/messages/en.json`, `docs/component-dependencies.md`.
- **APIs:** None — `Post`/`PostSummary` flat `*_es/_en` + `banner_image` relative + `published_at` unchanged; `list`/`detail` still via `apiFetch`.
- **Build:** `astro build` still emits `73` pages (`/blog`, `/blog/page/2`, `/blog/:slug` ×2 langs); `validate-i18n` + `validate-imports` unchanged; sitemap unchanged except prose styling.
- **Risks:** Prose custom CSS is `is:global` scoped to `.blog-prose`; no `rounded` or `white` leakage into gallery (`Paper Rule` held).
