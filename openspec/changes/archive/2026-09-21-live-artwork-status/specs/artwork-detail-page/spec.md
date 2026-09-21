## MODIFIED Requirements

### Requirement: Inquiry CTA follows the spec data
The conversion slot of the info panel SHALL render in normal document flow directly after the artwork's spec list, spaced by the info panel's standard `gap-8` rhythm, and SHALL NOT be anchored to the bottom of the panel container. For artworks with reconciled `status == "available"` (live status when the status check succeeds, otherwise the baked catalog snapshot) the slot SHALL host the buy widget (currency + email + submit) instead of the mailto inquiry CTA; for any other status it SHALL host the corresponding status badge. The full buy-widget behavior (request, redirect, error states, badges) is specified in `artwork-purchase`.

#### Scenario: CTA renders after the spec data
- **GIVEN** an artwork detail page with spec rows in the info panel
- **WHEN** the page renders
- **THEN** the conversion slot appears directly after the spec list in normal document flow, spaced by the panel's standard vertical gap

#### Scenario: CTA does not overflow short viewports
- **GIVEN** a desktop viewport whose height is short enough that the info panel's content exceeds the viewport
- **WHEN** the page renders
- **THEN** the page keeps a single scrollbar and the conversion slot is reached via normal page scroll — it never hides inside a nested scrollable panel

#### Scenario: Available artwork hosts the buy widget
- **GIVEN** an artwork with reconciled `status == "available"`
- **WHEN** the page renders
- **THEN** the conversion slot contains the buy widget and no mailto inquiry CTA

### Requirement: Render the editorial info panel
The right info panel SHALL show the artwork's localized title, the artist name, the year, the dimensions, a localized description, the price (in the currency matching the active language), the availability status, and a spec list of its localized discipline, technique, theme, format, and scale labels. The price and availability status SHALL reflect the reconciled values (live status-check prices/status when the check succeeds, otherwise the baked catalog snapshot). The artwork localized description (from `Artwork.translations[lang].description` via `pickTranslation` and `toArtworkDetailView`) SHALL be rendered as markdown via the shared `markdown-rendering` renderer inside the `Markdown` atom (GFM, `breaks: true`, trusted CMS), not as escaped plain `<p>{artwork.description}</p>`.

#### Scenario: Panel shows full artwork data
- **GIVEN** an artwork with title, artist, year, dimensions, description, prices in both currencies, status, and taxonomy refs
- **WHEN** the info panel renders
- **THEN** all of those fields are visible with the taxonomy labels localized to the active language
- **AND** the dimensions are shown alongside the year
- **AND** the price is shown in MXN when `lang === "es"` and in USD when `lang === "en"`

#### Scenario: Spanish page falls back to USD when MXN is missing
- **GIVEN** an artwork with `price_mxn = 0` and `price_usd > 0`
- **WHEN** the info panel renders on a Spanish page
- **THEN** the price line is omitted (the chosen currency is missing); the artwork does not silently show USD on a Spanish page

#### Scenario: English page falls back gracefully when USD is missing
- **GIVEN** an artwork with `price_usd = 0` and `price_mxn > 0`
- **WHEN** the info panel renders on an English page
- **THEN** the price line is omitted (the chosen currency is missing); the artwork does not silently show MXN on an English page

#### Scenario: Missing optional fields are omitted
- **GIVEN** an artwork with no price in the active language and no description
- **THEN** the price and description rows are omitted without error
#### Scenario: Artwork description renders as markdown
- **WHEN** the artwork description contains markdown (`**`, links, lists, paragraphs)
- **THEN** it is parsed via `renderMarkdown` and rendered with `set:html` in prose styling, with single `\n` → `<br>`

#### Scenario: Live sale updates price and status labels
- **GIVEN** a page baked with one status/prices whose live status check returns different values
- **WHEN** the reconciliation completes
- **THEN** the price and status labels show the live values in the active language with no layout shift
