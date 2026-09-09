## 1. Shared markdown renderer

- [x] 1.1 Create `src/lib/markdown.ts` with `renderMarkdown`/`renderInline` wrapping `marked` GFM `breaks: true` and BlogPost custom renderer (heading d1→d2, image→figure, link ↗, code badge), trusted no sanitize, and unit sanity check
- [x] 1.2 Create `src/components/atoms/Markdown.astro` block-only atom rendering `set:html={renderMarkdown(content ?? "")}` with `markdown-prose` class, and alias `blog-prose` to `markdown-prose` in `src/styles/global.css` (support `compact`/`on-dark` variants for banner/filter and `CuratorCard` dark surface, update `BannerText.astro` to style both `b` and `strong`)
- [x] 1.3 Add plain-text excerpt helper for SEO (`stripMarkdown` applied once in `src/components/seo/base/BaseSEO.astro`, covering every page's meta/og description), and extract the `BlogPost` code-copy handler to shared `src/lib/code-copy.ts` (imported by both the `Markdown` atom script and `BlogPost`) so `<Markdown>` code blocks copy works on non-blog pages

## 2. Migrate long-text pages to Markdown

- [x] 2.1 `src/components/pages/artista/ArtistPage.astro` — bio `pickTranslation(...)` → `<Markdown content={bio} />` in prose
- [x] 2.2 `src/components/pages/sala/GalleryPage.astro` — `galleryDescription` → `<Markdown content={galleryDescription} />` and `src/components/organisms/Hero.astro` description → `<Markdown>` (keep title plain inside `<H1>`)
- [x] 2.3 `src/components/molecules/ArtworkInfoPanel.astro` — `artwork.description` → `<Markdown>`
- [x] 2.4 `src/components/molecules/CuratorCard.astro` — `bio` → `<Markdown>` (variant `on-dark`), plus `src/components/organisms/CuratorHero.astro` — same `ArtCurator.bio` → `<Markdown>` on the curator detail page
- [x] 2.5 `src/components/pages/blog/BlogPost.astro` — refactor `marked.parse` to use `renderMarkdown`, description quote → `<Markdown>`, unify `PostCard` description via `renderInline`
- [x] 2.6 Inline `renderInline` output uses parent-level `set:html` (`PostCard`, `BlogIndex`, `BlogPost` aside); only `BannerBar` keeps `Fragment` (required as `BannerText` slot content)

## 3. i18n markdown

- [x] 3.1 Convert `src/messages/{es,en}.json` `global.banner.*` from `<b>` HTML to `**` markdown (`**COA**`, `**Envío asegurado**`, `El **65%** es para el artista`, `**Curaduría personal**`) and switch `src/components/organisms/BannerBar.astro` to `renderInline(t(...))` with `Fragment set:html`
- [x] 3.2 Ensure all long `src/messages` prose keys pass through `renderMarkdown`/`renderInline` where rendered (rule: `bio`/`description`/`content`/`hint` prose keys such as `pages.home.hero.description`, `pages.blog.noPostsHint`; short keys like `nav.*`/`cta`/`eyebrow` stay plain or inline-safe), short keys remain safe inline

## 4. Verification

- [x] 4.1 `pnpm run build` passes, no missing `marked` types, `BlogPost` prose still matches snapshot
- [x] 4.2 Visual QA ES/EN: artist bio with `**bold**` + list, gallery description paragraphs, hero description `\n` → `<br>`, banner crimson `strong`, blog code copy still works, curator bio readable on dark surface, sample blog posts checked for `breaks: true` change, page `<meta name="description">` contains no raw `**` (automated going forward by `scripts/validate-markdown.ts`, warn-only so CMS typos never block deploys)
