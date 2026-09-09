## Why

All long-text rendered as escaped plain `{var}` — artist `Artist.translations.bio`, curator `ArtCurator.translations.bio`, gallery `Gallery.translations.description`, artwork `Artwork.translations.description`, hero editorial (gallery-sourced `Gallery.description` via `toHeroView`), post `Post.content_*` (already rich) + `Post.description_*`, and most `src/messages/{es,en}.json` long keys — per `src/lib/api/types.ts` text areas. If CMS or i18n is authored as markdown (`**bold**`, links, lists, paragraphs), it displays literally. Blog content is the only rich path (`marked` + `set:html` at `BlogPost.astro:68-215`). Users confirmed CMS is trusted, want **every** API text area + all i18n JSON treated as markdown with `breaks: true`, so future edits render correctly without code changes.

## What Changes

- Central build-time markdown renderer (`marked` GFM, `breaks: true`) reusing BlogPost custom renderer (heading demote `h1→h2`, image → figure, link → external `↗`, code → badge + copy), trusted CMS — no sanitize. BREAKING note: blog currently uses `breaks: false` (`BlogPost.astro:68`), so blog single-newline rendering changes too (accepted per user confirmation).
- New `Markdown` atom (`src/components/atoms/Markdown.astro`, block-only) wrapping `renderMarkdown(content)` + shared `prose` styles extending existing `blog-prose`; inline contexts (banner, `PostCard` descriptions, short i18n keys) use `renderInline(content)` directly, not the atom — injected via parent-level `set:html` (only `BannerBar` keeps a `Fragment`, as `BannerText` slot content).
- `block` vs `inline` rule: titles/headlines/names inside `<h1>`/`<h2>`/`Title` stay plain `{t()}`/`{title}`/`{name}`; only prose `bio`/`description`/`content` becomes `<Markdown>` (verified against `src/lib/api/types.ts`: `Artist.bio`, `ArtCurator.bio`, `Gallery.description`, `Artwork.description`, `Post.content_*`, `Post.description_*`).
- Migrate all text areas: `ArtistPage bio` (`Artist.translations.bio`), `GalleryPage galleryDescription` (`Gallery.translations.description`), `Hero description` (gallery-sourced `Gallery.description` or i18n fallback `pages.home.hero.description`), `ArtworkInfoPanel description` (`Artwork.translations.description`), `CuratorCard bio` (`ArtCurator.translations.bio` — used on `GalleryPage` curator block) + `CuratorHero bio` (same `ArtCurator.bio` on the curator detail page), `BlogPost` `content_*` (refactored to shared renderer) + `description_*` quote and `PostCard`/`BlogIndex` descriptions unified, plus **all** `src/messages` long keys (`pages.home.*`, `pages.blog.*`, `global.*` prose) via same path (short keys like `nav.*`/`cta`/`eyebrow` pass through `renderInline` safely unwrapped).
- **BREAKING**: `global.banner.*` HTML `<b>` (rendered via `Fragment set:html` at `BannerBar.astro:17-20`) switches to markdown `**` / `**COA**` etc., allowing plain markdown in i18n; `BannerText` styling covers both `b` and `strong` (`[&>b]`, `[&>strong]`, `[&_strong]` → crimson).

## Capabilities

### New Capabilities
- `markdown-rendering`: Shared build-time markdown rendering, renderer config, `Markdown` atom, prose styles.

### Modified Capabilities
- `hero-section`: REQUIREMENTS change — hero description (API `Gallery.description` or i18n `pages.home.hero.description`) rendered as markdown via shared renderer, not plain escaped; title/badge stay plain.
- `gallery-detail-page`: REQUIREMENTS change — gallery description (`Gallery.translations.description`) and curator bio (`ArtCurator.translations.bio` via `CuratorCard`) rendered as markdown.
- `artist-detail-page`: REQUIREMENTS change — artist bio (`Artist.translations.bio`) rendered as markdown.
- `artwork-detail-page`: REQUIREMENTS change — artwork description (`Artwork.translations.description`) rendered as markdown.
- `blog`: REQUIREMENTS change — unify blog `Post.content_*` and `Post.description_*` rendering through shared `markdown-rendering` (replaces isolated `marked` in `BlogPost`); `PostCard`/`BlogIndex` descriptions use `renderInline`.
- `banner-bar-organism`: REQUIREMENTS change — four proofs sourced as markdown (`**` → `<strong>`) instead of HTML `<b>` via `set:html`.
- `copy-voice`: REQUIREMENTS change — voice long copy may be authored as markdown; rendering respects markdown.

## Impact

- Affected code: `src/lib/markdown.ts` (new: `renderMarkdown`/`renderInline`/`stripMarkdown`), `src/lib/code-copy.ts` (new: shared `attachCodeCopy`), `scripts/validate-markdown.ts` (new: warn-only post-build scan for leftover literal `**`), `src/components/atoms/Markdown.astro` (new), `src/styles/global.css` (shared `prose`/`markdown-prose` + `BannerText` `strong`), `src/components/pages/artista/ArtistPage.astro` (`Artist.bio`), `src/components/pages/sala/GalleryPage.astro` (`Gallery.description`) + `src/components/organisms/Hero.astro` (hero `Gallery.description`), `src/components/molecules/ArtworkInfoPanel.astro` (`Artwork.description`), `src/components/molecules/CuratorCard.astro` + `src/components/organisms/CuratorHero.astro` (`ArtCurator.bio`), `src/components/pages/blog/{BlogPost,PostCard,BlogIndex}.astro` (`Post.content_*`, `Post.description_*`), `src/components/seo/base/BaseSEO.astro` (strips markdown from all meta/og descriptions), `src/messages/{es,en}.json` (banner `**` + all long keys), `src/components/organisms/BannerBar.astro` (markdown `strong`).
- No new dependency (`marked` already at `^15.0.0`, trusted no `DOMPurify`). Static SSG only; requires `pnpm run build` + ES/EN QA (verify every text area from `src/lib/api/types.ts` no longer shows literal `**`).
