## ADDED Requirements

### Requirement: Bare-URL iframe embeds in post content
The system SHALL render a paragraph in `Post.content_es` / `content_en` that consists solely of one YouTube or Vimeo URL as a responsive hardened `<iframe>` player instead of a link. Inline video URLs inside a larger paragraph SHALL remain normal links.

#### Scenario: YouTube watch URL embeds
- **WHEN** `content_es` contains a paragraph with exactly `https://www.youtube.com/watch?v=XXXX`
- **THEN** the rendered HTML contains `<figure class="video-embed"><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/XXXX"` with `loading="lazy"`, non-empty `title`, `allowfullscreen`, and `referrerpolicy="strict-origin-when-cross-origin"`, and no `<a href="...watch?v=XXXX">` remains for that paragraph

#### Scenario: Short and variant YouTube forms normalize
- **WHEN** the paragraph is `https://youtu.be/XXXX`, `https://www.youtube.com/embed/XXXX`, `https://www.youtube.com/shorts/XXXX`, or `https://www.youtube.com/live/XXXX`
- **THEN** all forms produce the same `youtube-nocookie.com/embed/XXXX` iframe `src`

#### Scenario: Watch timestamp converts to start
- **WHEN** the URL is `https://www.youtube.com/watch?v=XXXX&t=1m30s`
- **THEN** the iframe `src` is `https://www.youtube-nocookie.com/embed/XXXX?start=90`

#### Scenario: Vimeo embeds
- **WHEN** the paragraph is `https://vimeo.com/123456789` or `https://player.vimeo.com/video/123456789`
- **THEN** the iframe `src` is `https://player.vimeo.com/video/123456789` with the same hardened attributes

#### Scenario: Inline video URL stays a link
- **WHEN** `content_es` contains `mira esto https://www.youtube.com/watch?v=XXXX para más`
- **THEN** the URL renders as the existing external link (`target="_blank" rel="noopener noreferrer"` + `↗`), not an iframe

#### Scenario: Non-allowlisted URL stays a link
- **WHEN** the paragraph is exactly `https://example.com/video.mp4` or `https://dailymotion.com/video/x123`
- **THEN** it renders as the existing external link, not an iframe

#### Scenario: Author title wins, post title is fallback
- **WHEN** the paragraph is `[Mi charla](https://www.youtube.com/watch?v=XXXX "Título autor")` alone on its line
- **THEN** the iframe `title` is `Título autor`
- **WHEN** the paragraph is a bare URL and `videoTitle: "Arte en Oaxaca"` was passed
- **THEN** the iframe `title` is `Arte en Oaxaca`

#### Scenario: Bare video URL never leaks into SEO
- **WHEN** `stripMarkdown` receives content containing a standalone `https://www.youtube.com/watch?v=XXXX` line
- **THEN** the returned plain text contains neither the URL nor `watch?v=`, while surrounding prose text is preserved

#### Scenario: renderInline never embeds
- **WHEN** `renderInline` receives `https://www.youtube.com/watch?v=XXXX` (e.g. card description context)
- **THEN** the output remains an external link, never an iframe

#### Scenario: Multiple videos per post
- **WHEN** `content_es` contains two standalone video-URL paragraphs separated by prose
- **THEN** each paragraph renders its own `figure.video-embed` iframe in document order

#### Scenario: Embedded player fills its figure without inner bands
- **WHEN** a bare video URL renders inside `figure.video-embed`
- **THEN** the iframe carries no own margin or border (`margin: 0; border: 0` via the `figure iframe` reset in `global.css`), filling the figure at exactly 16/9 with no dark bands, while standalone raw `<iframe>` elements outside figures keep their `2rem` rhythm and border
