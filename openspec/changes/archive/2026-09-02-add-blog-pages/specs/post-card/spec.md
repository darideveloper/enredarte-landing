## ADDED Requirements

### Requirement: Minimal post card for the blog grid
The system SHALL provide `PostCard.astro` under `src/components/pages/blog/` as a minimal, text-first card for `PostSummary` entries, distinct from `molecules/ImageCard.astro` (gallery overlay chrome), using the established `paper/ink/crimson/muted` tokens and `global.css` typography.

#### Scenario: Card renders text-first
- **WHEN** `PostCard` renders for a post with `title_es`, `description_es`, `author`, `published_at`
- **THEN** it shows the localized title (`pickPostField`), the description excerpt, and a meta line `author • localized date` (`Intl.DateTimeFormat`, locale per `lang`); `keywords` are not displayed

#### Scenario: No image chrome when present
- **WHEN** `banner_image` is present
- **THEN** the card shows the image above the text block (prefixed with `API_BASE_URL`), without the `ImageCard` gradient overlay or `aspect-[4/5]` forced crop

#### Scenario: No image block when banner is null
- **WHEN** `banner_image == null`
- **THEN** no image element renders and the card remains a text-only block with preserved spacing

#### Scenario: Card is a link to detail
- **WHEN** `PostCard` renders with prop `href=getLocalizedPostPath(slug, lang)`
- **THEN** the entire card links to that href (accessible anchor, keyboard navigable)

#### Scenario: Date hidden if null edge case
- **WHEN** `published_at == null` reaches the card (should be filtered out, but defensive)
- **THEN** the date portion is omitted and only `author` shows
