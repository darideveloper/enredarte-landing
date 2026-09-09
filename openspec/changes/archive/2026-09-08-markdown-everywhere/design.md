## Context

BlogPost is the sole markdown path: `marked 15` + custom renderer (`heading` d1→d2 slug, `image` lazy figure, `link` external ↗, `code` &lt;&gt; escaped + lang badge + copy) at `src/components/pages/blog/BlogPost.astro:68-215` via `set:html`. All other long-text — artist `Artist.translations.bio` (`ArtistPage.astro:37/94` via `pickTranslation`), curator `ArtCurator.translations.bio` (`CuratorCard.astro:15/44` on `GalleryPage` curator block), gallery `Gallery.translations.description` (`GalleryPage.astro:62/83` + `Hero.astro:47` via `toHeroView:411-412`), artwork `Artwork.translations.description` (`ArtworkInfoPanel.astro:45` via `toArtworkDetailView:295-296`), post `Post.content_*` (already markdown) + `Post.description_*`/`PostSummary.description_*` (`BlogPost.astro:22/176` + `PostCard.astro:16/67`) — is plain `{var}` escaped, so `**`/links display literally. Checked `src/lib/api/types.ts`: text areas are exactly `Artist.bio`, `ArtCurator.bio`, `Gallery.description`, `Artwork.description`, `Post.content`, `Post.description`; all other `translations.name`/`title`/`alt_*`/`keywords` are short and stay plain per `block` vs `inline` rule. `BannerBar.astro:17-20` recently added trusted HTML `<b>` via `Fragment set:html` for `global.banner.*`. User wants **all** API and all i18n JSON treated as markdown, `breaks:true`, trusted CMS (no sanitize). Stack is Astro SSG, build-time only.

## Goals / Non-Goals

**Goals:** One shared renderer/utility for all prose (every text area from `src/lib/api/types.ts`); `Markdown` atom with shared `prose` styles; `block` vs `inline` rule (titles/names/`alt` stay plain, `bio`/`description`/`content` becomes markdown); migrate all long-text sites (Artist bio, Gallery description, Hero description, Artwork description, Curator bio, Post content/description) + banner + all `src/messages` long keys; keep SSG, no client JS.

**Non-Goals:** New markdown dialect, sanitizing trusted content (user trusts CMS), converting short keys (`nav.*`, `cta`, `eyebrow`) to **block** markdown (they use `renderInline` unwrapped, not block), changing data model or CMS.

## Decisions

- **Shared `src/lib/markdown.ts` `renderMarkdown(md): string`** — wraps `marked` GFM `breaks:true`, reuses BlogPost renderer verbatim. Rationale: single source of truth, blog and bios render identically. Alternative scattered `marked.parse` per file rejected: drift.
- **Atom `src/components/atoms/Markdown.astro`** — block-only: `<div set:html={renderMarkdown(content ?? "")} class="markdown-prose">` with the shared `prose-*` utilities baked in (mirroring `BlogPost`; sizing/width/color stay with the caller via `class`). The atom bundles its own copy-handler script (`attachCodeCopy` from `src/lib/code-copy.ts`, also imported by `BlogPost`). Inline contexts (`BannerBar`, `PostCard` descriptions, short i18n keys) use the `renderInline()` helper directly with parent-level `set:html`, NOT the atom (only `BannerBar` keeps a `Fragment`, as `BannerText` slot content). Rationale: one style/class gate, easy to swap prose variant. Alternative helper-only rejected: style duplication.
- **Trusted, no `DOMPurify`** — per user "I thrust it" on CMS. Markdown raw HTML passes through. Alternative sanitize would strip intentional HTML and add dep. Revisit if external authors added.
- **`breaks:true`** — single `\n` → `<br>`, per user confirmation. Reuses blog `breaks:false` vs `true` tradeoff: `false` requires blank line for poets; `true` matches Google Docs paste. BREAKING note: `BlogPost.astro:68` currently uses `breaks: false`, so unifying on `breaks: true` changes existing blog line-break rendering (single newlines become `<br>`); accepted per user confirmation, QA must check sample posts.
- **Banner `**` not `<b>`** — `global.banner.*` values become `**COA** firmado…`, `**Envío asegurado**…`, `El **65%** es para el artista`, `**Curaduría personal**` and BannerBar switches from `Fragment set:html={t(...)}` containing HTML to `Fragment set:html={renderInline(t(...))}` inside `BannerText` (inline unwrapped, `breaks: true`, trusted CMS — matching tasks 3.1 and the banner spec; the `Markdown` block atom is NOT used here). Keeps `BannerText` styling both selectors (`[&>b]` and `[&>strong]` → crimson) so old cached HTML still styles.
- **All messages markdown-safe** — short keys pass through markdown safely (`Afinar selección` → `<p>…</p>` stripped or rendered inline via helper that unwraps single `<p>`). Decision: for `inline` contexts, use `renderInline()` that strips wrapping `<p>`.
- **Extend `blog-prose` → `markdown-prose`** — grouped selectors (`.blog-prose, .markdown-prose`) in `src/styles/global.css` share one style source; drop-cap is opt-in via `.markdown-prose--dropcap` (blog keeps it always).

## Risks / Trade-offs

- Trusted HTML could inject script if CMS compromised → Mitigation: document trust boundary, add `DOMPurify` later with allowlist.
- `breaks:true` may add unwanted `<br>` for intentional hard wraps → Mitigation: QA bios with accidental single newlines; docs note to use blank line for paragraphs.
- `inline` titles accidentally parsed as markdown could inject `<p>` inside `<h1>` → Mitigation: strictly keep title/name fields plain, only `bio`/`description`.
- Banner `strong` vs `b` styling: `[&>b]:text-crimson` must become `[&>strong]` too → Mitigation: update `BannerText.astro` to support both.
- `marked` renderer token API changed in v15 (object tokens) — reuse verified token shape.
- Raw markdown leaking into SEO/social meta: `GalleryPage.astro:73`, `BlogPost.astro:122` (plus artist/curator/artwork/blog-index pages and i18n fallbacks) pass raw `description` to `PageSEO` — if descriptions gain `**`/links, `<meta name="description">` shows literal syntax → Mitigation (as built): `stripMarkdown` applied once in `BaseSEO.astro` on the resolved description, so every page is covered; body keeps markdown HTML.
- Code-block copy buttons outside blog have no handler: the shared renderer emits `code-block` + `data-copy` buttons but the copy `script` lives only in `BlogPost.astro:467` → Mitigation (as built): shared `src/lib/code-copy.ts` `attachCodeCopy()` module, imported by both the `Markdown` atom script and the `BlogPost` script; no new client JS beyond what blog already ships.
- Dark-surface prose: `CuratorCard` bio renders on `bg-ink text-paper` (`CuratorCard.astro:24/44`) but shared `markdown-prose` assumes light paper (ink text) → Mitigation: `compact`/`on-dark` variant for the atom (or scoped overrides) + visual QA of curator bio.

## Migration Plan

1. Create `src/lib/markdown.ts` + `src/components/atoms/Markdown.astro` + `global.css` alias.
2. Refactor `BlogPost.astro` to use shared `renderMarkdown`.
3. Migrate `ArtistPage`, `GalleryPage`, `Hero`, `ArtworkInfoPanel`, `CuratorCard` + `CuratorHero` (same `ArtCurator.bio`, curator detail page) to `<Markdown>`.
4. Convert `src/messages/{es,en}.json` banner values to `**` and switch `BannerBar.astro` to markdown path (`renderInline` via `Fragment` slot content; other inline sites use parent-level `set:html`).
5. `pnpm run build` + ES/EN QA (bio paragraphs, banner crimson, code blocks).

## Open Questions

- None blocking; `renderInline()` for short i18n keys is required in this change (not deferred) — short keys pass through the inline helper unwrapped per tasks 3.1–3.2.
