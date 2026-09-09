## MODIFIED Requirements

### Requirement: Render the gallery hero
The gallery page SHALL render a hero section showing the gallery's localized name, a localized eyebrow/headline derived from the gallery's `sort_order` (e.g. "Sala 01"), its localized description, and a large representative image (the gallery logo/hero image). It SHALL reuse existing atoms (`Image`, `Title`, `Headline`). The gallery localized description (from `Gallery.translations[lang].description` via `pickTranslation`) SHALL be rendered as markdown via the shared `markdown-rendering` renderer inside the `Markdown` atom (GFM, `breaks: true`, trusted CMS), not as escaped plain `<p>{galleryDescription}</p>`.

#### Scenario: Hero shows localized gallery content
- **GIVEN** the user opens a gallery page in Spanish
- **THEN** the hero shows the Spanish gallery name and description (from the gallery's translation dictionary) and the gallery image
- **AND** the eyebrow derives from the gallery's `sort_order` only (e.g. "Sala 01", with no status suffix)

#### Scenario: Gallery description renders as markdown
- **WHEN** the gallery description contains markdown
- **THEN** it is parsed via `renderMarkdown` and rendered with `set:html` in prose styling

### Requirement: Render the curator block
The gallery page SHALL render the full curator data — photo, name, localized bio, email, and website — using a `CuratorCard` molecule composed from the existing `Image` atom and the card styling already used by `CardSummary`. The curator localized bio (from `ArtCurator.translations[lang].bio` via `pickTranslation`) SHALL be rendered as markdown via the shared `markdown-rendering` renderer inside the `Markdown` atom (GFM, `breaks: true`, trusted CMS), not as escaped plain `<p>{bio}</p>`. The website SHALL be displayed as a link whose visible text is the website URL without its scheme (leading `http://` or `https://` removed), while the link target remains the full original URL.

#### Scenario: Curator information is displayed
- **GIVEN** a gallery whose curator has a photo, bio, email, and website
- **WHEN** the gallery page renders
- **THEN** the curator's photo, name, bio, email, and website are visible
- **AND** the bio is shown in the active language and rendered as markdown via `renderMarkdown` (e.g. `**` → `<strong>`, `\n` → `<br>`) in prose styling

#### Scenario: Website link hides the URL scheme
- **GIVEN** a curator whose website is `https://www.example.com/`
- **WHEN** the curator card renders the website link
- **THEN** the visible text reads `www.example.com` (no `https://` prefix and no trailing slash)
- **AND** the link's `href` is the full `https://www.example.com/`

#### Scenario: Email is unaffected
- **GIVEN** a curator with an email address
- **WHEN** the curator card renders
- **THEN** the email is displayed unchanged as a `mailto:` link
