## MODIFIED Requirements

### Requirement: Render the artist hero
The artist page SHALL render a hero section showing the artist's name as the page's `h1`, a localized eyebrow label, the localized bio, a metadata line of birth/death years and location when present, and contact/social links (email, website, and each social link from `social_links`). The hero SHALL include the artist's photo (or an initials fallback when no photo exists) as a portrait image, reusing existing atoms (`Headline`, `Image`) and the established paper/ink/crimson visual language. The artist localized bio (from `Artist.translations[lang].bio` via `pickTranslation`) SHALL be rendered as markdown via the shared `markdown-rendering` renderer inside the `Markdown` atom (GFM, `breaks: true`, trusted CMS), not as escaped plain `<p>{bio}</p>`.

#### Scenario: Hero shows localized artist content
- **GIVEN** the user opens an artist page in Spanish
- **THEN** the hero shows the artist's name, the Spanish bio (from the artist's translation dictionary), and the artist's photo
- **AND** the eyebrow reads the localized "Artista" label

#### Scenario: Artist bio renders as markdown
- **WHEN** the artist bio contains markdown (`**`, links, lists, paragraphs)
- **THEN** it is parsed via `renderMarkdown` and rendered with `set:html` in prose styling

#### Scenario: Metadata line composes years and location
- **GIVEN** an artist with `birth_year` 1985, no `death_year`, and a location resolved to `Los Cabos`
- **THEN** the metadata line reads `1985 · Los Cabos`
- **GIVEN** an artist with `birth_year` 1950 and `death_year` 2010
- **THEN** the metadata line reads `1950–2010`

#### Scenario: Contact links render with scheme stripped
- **GIVEN** an artist with email, a website `https://www.example.com/`, and one social link
- **WHEN** the hero renders
- **THEN** the email appears as a `mailto:` link, the website's visible text reads `www.example.com` (no scheme, no trailing slash) while its `href` stays the full URL, and the social link renders with its platform label

#### Scenario: Missing photo falls back to initials
- **GIVEN** an artist with no photo
- **THEN** the portrait area displays the artist's initials over the dark image container instead of an image
