## MODIFIED Requirements

### Requirement: Render the curator block
The gallery page SHALL render the curator data — photo, name, localized bio, and social links only (email and website SHALL NOT be rendered visibly) — using a `CuratorCard` molecule composed from the existing `Image` atom and the card styling already used by `CardSummary`. The curator localized bio (from `ArtCurator.translations[lang].bio` via `pickTranslation`) SHALL be rendered as markdown via the shared `markdown-rendering` renderer inside the `Markdown` atom (GFM, `breaks: true`, trusted CMS), not as escaped plain `<p>{bio}</p>`. Each social link SHALL render as an external link whose visible text is the localized platform label (`global.footer.social.<platform>` when present, else raw platform).

#### Scenario: Curator information is displayed
- **GIVEN** a gallery whose curator has a photo, bio, and social links
- **WHEN** the gallery page renders
- **THEN** the curator's photo, name, bio, and social links are visible
- **AND** no email or website is visible
- **AND** the bio is shown in the active language and rendered as markdown via `renderMarkdown` (e.g. `**` → `<strong>`, `\n` → `<br>`) in prose styling

#### Scenario: Curator without social links shows no contact row
- **GIVEN** a curator with empty `social_links`
- **WHEN** the curator card renders
- **THEN** no contact row is displayed and no broken or empty links appear

## REMOVED Requirements

### Requirement: Website link hides the URL scheme
**Reason**: Curator website is no longer rendered visibly (socials-only); scheme-stripping has no target.
**Migration**: None — remove `stripUrlScheme` usage from `CuratorCard.astro`. The `stripUrlScheme` helper itself stays for other consumers (none currently, keep as shared util).

### Requirement: Email is unaffected
**Reason**: Curator email is no longer rendered visibly (socials-only, kept only in SEO JSON-LD).
**Migration**: None — remove `mailto:` block from `CuratorCard.astro`. SEO `personSchema({email})` call site in `CuratorPage.astro` is unchanged.
