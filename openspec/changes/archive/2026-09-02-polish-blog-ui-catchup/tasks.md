## 1. i18n & global tokens

- [x] 1.1 Add `messages/{es,en}.json` keys `pages.blog.{eyebrow,readMore,backToBlog,share,copied,copy,noPostsHint,readingTime,pagination.prev/next/page}` with correct `Revista/Journal` etc. and ensure `validate-i18n` passes
- [x] 1.2 Extend `src/styles/global.css` `@theme inline` with `--color-card-dark #0D0D0D` and add `::selection bg-crimson/paper`, `caret-color brand-500`, `scrollbar-color`, `focus-visible 2px brand-500`, `a underline-offset 3px` (craft-floor)

## 2. PostCard salon

- [x] 2.1 Rewrite `src/components/pages/blog/PostCard.astro` to `bg-card-dark` letterbox: `group flex flex-col h-full` outer, `shrink-0 aspect-[4/3] / featured 16/10` image with `brightness [0.92→0.72] scale-[1.05] 700ms` + `from-black/75` gradient + `bg-paper/90` date badge
- [x] 2.2 Add info `bg-paper p-5 flex flex-col flex-1`, accent `2px crimson rounded-full` sliding `translate-x-0 scale-y-100`, text block `translate-x-3` (transform-only) with `h3 line-clamp-2 min-h-[48px] text-balance` + `p line-clamp-2` + `meta mt-auto pt-3` + `focus:ring-brand-500`
- [x] 2.3 Implement `featured` prop `lg:col-span-2` overlay variant (`author 10px uppercase` + `h3 28/32px serif paper` + `description 13px paper/80` + `readMore` bordered `paper/30→paper` + `→` translate) and `banner_image==null` gradient placeholder

## 3. PaginationNav bilingual responsive

- [x] 3.1 Update `src/components/molecules/PaginationNav.astro` to use `getTranslations(lang)` for `prev/next/page`, keep `getLocalizedBlogPagePath` for page 1↔base, add `hidden md:flex` full numbered row (`Prev` ink ghost / `Next` crimson, `gap-2`, `focus:ring-brand-500`) and `flex md:hidden` collapsed `Prev — page/total — Next` (`flex-1`, `opacity-40` disabled), early return when `total_pages<=1`

## 4. BlogIndex editorial & mosaic

- [x] 4.1 Restore `src/components/pages/blog/BlogIndex.astro` header to `Headline` eyebrow + `h1 42/56px -0.02em` + `description 15px/1.8 pretty` + `count` + `pages.blog.pagination.page` meta + `h-px` hairline
- [x] 4.2 Apply mosaic `grid gap-4 md:gap-[3px] auto-rows-fr` and `hasFeatured = posts.length>1` every page (`featuredPost=posts[0]`, `gridPosts=slice(1)`) rendering `PostCard featured` + remainder
- [x] 4.3 Replace empty-state with editorial block (`Headline muted`, `h2 pages.blog.noPosts`, `pages.blog.noPostsHint`, ghost `Btn` to `getLocalizedBlogPath`)

## 5. BlogPost salon article

- [x] 5.1 Convert `src/components/pages/blog/BlogPost.astro` hero to `bg-card-dark h-[48svh] md:h-[62svh]` with `from-black/75 via-black/35` + `from-black/40` gradients, bottom-anchored `Headline color=red` + serif `h1` + back link
- [x] 5.2 Add description left `border-crimson pl-5 18px`, meta `author • date • readingTime` (`wordCount/200`, `t("pages.blog.readingTime")`, `Headline` + `w-6 h-px bg-crimson`), hairline, and sticky aside `hidden lg:block top-[88px]` with title/meta/description + `Btn` + banner thumb
- [x] 5.3 Configure `marked` token renderer (`heading` demote `h1→h2` + id slug + anchor, `image→figure` when `alt>12`, `link` external `↗` + `target_blank`, `code→code-block` with lang badge + `data-copy-label/copied-label` from `t("pages.blog.copy/copied")`) and `setOptions gfm`
- [x] 5.4 Add helper `stripLeadingTitle(md, title)` (normalize `trim+lower+space-collapse`, front-matter aware, match `^#{1,6}\s+<text>\n+`) and apply as `dedupedContent` before `marked.parse`; ensure `h2` first is `Introducción` for sample post
- [x] 5.5 Expand `blog-prose` to full Salon set (`hyphens-auto`, `headings serif`, `h2 26/30px mt-14` + `h4 12px uppercase muted`, `ul disc crimson`, `ol decimal muted`, `blockquote cite`, `figure/figcaption`, `table th bg-ink/paper`, `hr` crimson, `iframe 16/9`, `a code crimson`) and append `is:global` CSS for drop-cap `>p:first-of-type::first-letter Georgia 3.15em crimson`, `h2::before 28px crimson`, `figure 0D0D0D`, `hr centered 48px`, `table scroll`, `blockquote cite —`, `code-block` badge + `Copy` button, responsive `figure -mx` on `sm`
- [x] 5.6 Translate share/code copy: buttons carry `data-share-label/copied-label` + inner `span[data-label]`, script swaps `¡Copiado! ✓` / `Copied! ✓` per `lang` (and `Copy→Copied` for code), dedupe `_bound` guard, `astro:page-load` + `DOMContentLoaded`

## 6. Docs & verification

- [x] 6.1 Refresh `docs/component-dependencies.md` BlogIndex/BlogPost trees (Headline+Btn, PostCard featured, PaginationNav i18n+collapse, prose salon + share script) and `Notes — Blog pages (polished Salon)` paragraph
- [x] 6.2 Run `pnpm validate-i18n && pnpm validate-imports && pnpm build` → `73 pages` (sample `dist/blog/enredarte-abre-nuevas-salas/index.html` `h2 id=introducci-n`, hero `h1` once, `lg:col-span-2` on both `/blog` and `/blog/page/2`)
