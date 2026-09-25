## 1. Markdown renderer video support

- [x] 1.1 Add `videoTitle?: string` to `MarkdownOptions` in `src/lib/markdown.ts`
- [x] 1.2 Add `parseVideoUrl()` + timestamp parser (YouTube watch/short/embed/shorts/live, Vimeo numeric/player+hash) with nocookie normalization
- [x] 1.3 Override `renderer.paragraph` for standalone video-URL detection → `figure.video-embed > div.video-frame > iframe` with hardened attributes
- [x] 1.4 Extend `stripMarkdown` to remove standalone video-URL lines
- [x] 1.5 Verify non-video markdown output is byte-identical (existing heading/image/link/code paths untouched) and `renderInline` with a video URL still returns a link

## 2. Blog wiring

- [x] 2.1 Pass `videoTitle: title` in `BlogPost.astro` `renderMarkdown` call
- [x] 2.2 Verify ES/EN detail pages render 16/9 lazy titled players for bare URLs, links elsewhere unchanged

## 3. Validation and docs

- [x] 3.1 Add warn-only raw-`<iframe>` hint in `scripts/validate-markdown.ts`
- [x] 3.2 Document bare-URL convention in `docs/blog-api.md` and `docs/astro-markdown.md`
- [x] 3.3 Run `astro build` + `validate-markdown` and manual ES/EN embed checks (all URL forms, inline negative, unknown-host negative)

## 4. Figure iframe reset (letterbox-bands fix)

- [x] 4.1 Add `figure iframe { margin: 0; border: 0; }` reset in `src/styles/global.css` mirroring the `figure img` reset
- [x] 4.2 Verify embedded player fills its figure at 16/9 with no inner bands; standalone raw `<iframe>` keeps its rhythm
