## MODIFIED Requirements

### Requirement: Shared build-time markdown rendering
The system SHALL provide a single build-time markdown renderer `src/lib/markdown.ts` (`renderMarkdown`, `renderInline`) wrapping `marked` GFM with `breaks: true`, reusing the BlogPost custom renderer (heading `h1→h2` with slug, image lazy figure when `alt>12`, link external `↗` + `target_blank`, code `&lt;&gt;` escaped + lang badge + copy button `data-copy`, video-paragraph detection for YouTube/Vimeo bare URLs → hardened lazy iframe `figure.video-embed` with `videoTitle` fallback), trusted CMS with no sanitization (raw HTML passes, legacy raw `<iframe>` unchanged), and SHALL expose a block-only `Markdown` atom `src/components/atoms/Markdown.astro` that renders `set:html={renderMarkdown(content ?? "")}` inside shared `markdown-prose` styles (aliasing existing `blog-prose`, with `compact`/`on-dark` variants for banner/filter and dark surfaces like `CuratorCard`). Inline contexts SHALL use `renderInline()` directly, not the atom — injected via parent-level `set:html` (only `BannerBar` keeps a `Fragment`, as `BannerText` slot content). The system SHALL strip markdown from SEO descriptions once in `BaseSEO` (`stripMarkdown`, including standalone video URLs) so raw markdown never leaks into `<meta>` tags on any page.

#### Scenario: API long-text rendered as markdown
- **WHEN** `renderMarkdown` is called with bio/description markdown from API (`Artist.bio`, `Gallery.description`, `Artwork.description`, `ArtCurator.bio`) or `src/messages` long value
- **THEN** it returns HTML with GFM tables/lists, `**` → `<strong>`, single `\n` → `<br>`, and custom renderer output, ready for `set:html`

#### Scenario: Empty or plain text input
- **WHEN** content is `""` or plain text without markdown syntax
- **THEN** `renderMarkdown` returns `""` or a safe `<p>` wrapper without injection

#### Scenario: Inline rendering for short keys
- **WHEN** `renderInline` is used for short `t()` values (`nav.*`, `cta`)
- **THEN** it unwraps the single outer `<p>` so the result can be placed inside `<h1>`/`<span>` without block nesting

#### Scenario: Standalone video URL becomes a player
- **WHEN** `renderMarkdown("https://www.youtube.com/watch?v=XXXX", { videoTitle: "Post" })` is called
- **THEN** the output contains `youtube-nocookie.com/embed/XXXX` in an iframe with `loading="lazy"` and `title="Post"`, not an `<a>` link

#### Scenario: SEO text drops video URLs
- **WHEN** `stripMarkdown` receives `"Intro\n\nhttps://youtu.be/XXXX\n\nOutro"`
- **THEN** the result is `"Intro Outro"` with no URL remnant

#### Scenario: renderInline never embeds video
- **WHEN** `renderInline` is called with a standalone video URL
- **THEN** it returns the existing external link output, never an iframe (only block `renderMarkdown` embeds; the shared paragraph rule applies to every block prose surface, not just blog posts)
