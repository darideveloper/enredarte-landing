## Context

`Post.content_es/en` is raw Markdown rendered at build time by `src/lib/markdown.ts` (`marked` GFM + `breaks:true`, trusted CMS, raw HTML passthrough) into `BlogPost.astro` via `set:html`. The custom renderer handles `heading/image/link/code` only — no video concept. `src/styles/global.css:272-281` already styles `iframe` 100% × 16/9, so raw-`<iframe>` posts play today but depend on editors writing perfect embed HTML. `stripMarkdown` feeds `<meta description>` and currently leaves bare URLs intact. No backend change is possible in this repo (dashboard owns the serializer); the contract stays "markdown verbatim".

## Goals / Non-Goals

**Goals:**
- Bare provider URL on its own paragraph → responsive lazy hardened iframe, for YouTube (watch/short/embed/shorts/live) and Vimeo (numeric/player).
- Accessible `title` always present (author `"title"` → post-title fallback via new `videoTitle` option).
- Privacy default (`youtube-nocookie.com`), `loading="lazy"`, fixed `allow` + `allowfullscreen` + `referrerpolicy`.
- Backward compatible: legacy raw `<iframe>` and all non-video markdown byte-identical.

**Non-Goals:**
- Banner/hero video, `<video>` files, playlists, portrait-shorts styling, per-video posters/captions.
- Backend schema/migration, oEmbed fetching, click-facade (`lite-youtube`) — noted as follow-up.
- Sanitization pipeline — CMS stays trusted; allowlist is the guard.

## Decisions

- **Paragraph-level detection over link-level:** override `renderer.paragraph`, not `renderer.link`. A standalone video link and an inline video link produce the same `link` token; only the paragraph wrapper distinguishes "embed here" from "link here". Alternative (link renderer emitting iframe) would convert inline links into block players and break prose layout — rejected.
- **Detect on rendered inner HTML, normalize from raw href:** paragraph token gives HTML (`<a href="...">...</a>`); extract the single `href` + check no surrounding text. This survives `marked` autolinking of bare URLs without depending on tokenizer internals. Alternative (tokenizer-level) is tighter to `marked` v15 API churn — rejected.
- **Normalize, don't store:** `parseVideoUrl()` maps all accepted forms to canonical embed URLs at build time (`t=1m30s` → `?start=90`, strip `list`/`si`). Editors paste watch URLs; content never stores player host choices, so switching nocookie→facade later is one function.
- **Fixed iframe attribute template:** one template string for `allow`/`referrerpolicy`/`allowfullscreen`/`loading`. No per-post customization — consistency over flexibility for MVP.
- **`videoTitle` option instead of global import:** `MarkdownOptions` gains optional `videoTitle?: string`; `BlogPost.astro` passes localized `title`. Keeps `markdown.ts` pure (no i18n import) and other surfaces (bios, descriptions via `renderInline`) unaffected.
- **CSS reuse plus one reset:** existing `global.css` iframe rule covers sizing/border/bg for standalone embeds. Emit semantic `figure.video-embed > div.video-frame > iframe`, plus a `figure iframe { margin: 0; border: 0; }` reset mirroring the existing `figure img` reset — otherwise the standalone iframe margin/border stacks inside the figure frame as dark bands above/below the player.

## Risks / Trade-offs

- [`marked` paragraph HTML shape change] → Mitigation: detection uses a tolerant regex (single anchor + optional whitespace); fallback is today's link rendering, never a crash.
- [False positive: a post *about* a URL] → Mitigation: only exact-single-URL paragraphs convert; anything with surrounding text stays a link. Documented convention.
- [`t=` parse edge cases (`90s`, `1h2m3s`)] → Mitigation: support `s/m/h` combos + plain seconds; unknown format drops the param, embed still works.
- [Vimeo privacy hash URLs (`/123456/abcdef`)] → Mitigation: accept trailing hash segment and preserve it in embed `src`.
- [Many iframes per post hurt performance] → Mitigation: `loading="lazy"` now; facade is an explicit non-goal with a clear swap point (`video-frame` div).

## Migration Plan

1. Deploy frontend; existing posts render identically (no video paragraphs → no output change).
2. Editors start pasting bare URLs for new videos; legacy raw `<iframe>` posts keep working.
3. Optional: dashboard adds allowlist validator + docs update; no data migration.
4. Rollback: revert `markdown.ts` + `BlogPost.astro` arg — bare URLs render as links again, nothing breaks.

## Open Questions

- Per-video `<figcaption>` now or post-title `title` only? (Skipped for MVP — needs an authoring syntax for captions.)
- Decided: YouTube + Vimeo both in scope; shared renderer embeds bare video URLs on every prose surface (global behavior, accepted); `renderInline` never embeds (stays a link); raw-`<iframe>` lint ships as warn-only in this change.
