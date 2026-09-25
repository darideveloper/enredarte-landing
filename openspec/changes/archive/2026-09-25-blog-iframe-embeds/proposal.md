## Why

Blog posts cannot embed iframe videos (YouTube/Vimeo) without editors hand-writing raw `<iframe>` HTML in `content_es/en`. That is fragile (wrong `/embed/` URL, missing `title`/`loading`/`allowfullscreen`), inconsistent, and bakes tracking hosts into content. A bare-URL convention fixes authoring while keeping the API unchanged.

## What Changes

- Define a bare-URL embed convention: a paragraph in `content_es/en` that is exactly one YouTube/Vimeo URL renders as a responsive, lazy, hardened `<iframe>` player.
- Normalize all accepted URL forms (watch, `youtu.be`, `/embed/`, `/shorts/`, `/live/`, Vimeo numeric/player) to privacy-preserving embed URLs (YouTube → `youtube-nocookie.com`).
- Enforce `title` (author `"title"` attr → post-title fallback), `loading="lazy"`, `allowfullscreen`, fixed `allow` set, `referrerpolicy`.
- Keep legacy raw `<iframe>` HTML passing through untouched (backward compatible); add warn-only lint suggesting the bare-URL form.
- Strip bare video URLs from SEO text so they never leak into `<meta description>`.
- No backend schema change; no banner/hero video; no `<video>` file support; no oEmbed fetching; no facade player in this change.

## Capabilities

### New Capabilities

- `blog-iframe-video`: iframe-only video embeds inside blog post content via bare-URL paragraphs (detection, normalization, hardened iframe output, SEO stripping).

### Modified Capabilities

- `markdown-rendering`: REQUIREMENTS change — `renderMarkdown` gains video-paragraph detection and `videoTitle` fallback option; `stripMarkdown` removes standalone video URLs.
- `blog`: REQUIREMENTS change — detail body renders video paragraphs as players (BlogPost passes post title as `videoTitle`).

## Impact

- Affected: `src/lib/markdown.ts` (renderer + options + strip), `src/components/pages/blog/BlogPost.astro` (one arg), `scripts/validate-markdown.ts` (warn-only), `docs/blog-api.md` + `docs/astro-markdown.md` (convention docs).
- No API, route, i18n-key, or dependency changes. `marked` stays the engine. Existing posts without video URLs render byte-identical.
