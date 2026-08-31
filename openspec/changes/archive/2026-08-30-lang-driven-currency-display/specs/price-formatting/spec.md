## ADDED Requirements

### Requirement: Language determines displayed currency
The pricing system SHALL derive the displayed currency from the current page language: Spanish pages (`lang === "es"`) display prices in **MXN**, and English pages (`lang === "en"`) display prices in **USD**. There is no separate user-facing currency toggle; the URL's language is the only source of truth.

#### Scenario: Spanish page shows MXN
- **WHEN** a page renders for the Spanish language (URL has no `/en` prefix)
- **THEN** every rendered artwork price is displayed in Mexican Pesos (MXN), using `MX$` as the currency symbol and Spanish-locale grouping/decimal rules

#### Scenario: English page shows USD
- **WHEN** a page renders for the English language (URL has the `/en` prefix)
- **THEN** every rendered artwork price is displayed in US Dollars (USD), using `US$` as the currency symbol and English-locale grouping/decimal rules

### Requirement: Single formatPrice helper
The system SHALL provide a `formatPrice(amount, currency, locale?)` helper that produces a localized currency string for a non-negative numeric amount using `Intl.NumberFormat` with `{ style: "currency", currency }`. The default locale is `es-MX` for `MXN` and `en-US` for `USD`. Empty, zero, or `undefined` amounts SHALL return an empty string so callers can omit the price line without leaving empty space.

#### Scenario: Format a non-zero MXN amount
- **WHEN** `formatPrice(250000, "MXN")` is called
- **THEN** the returned string contains the value with the `MX$` symbol, Spanish-locale grouping, and no decimal places (e.g. `MX$250,000`)

#### Scenario: Format a non-zero USD amount
- **WHEN** `formatPrice(12500, "USD")` is called
- **THEN** the returned string contains the value with the `US$` symbol, English-locale grouping, and no decimal places (e.g. `US$12,500`)

#### Scenario: Format a zero or undefined amount
- **WHEN** `formatPrice(0, "USD")` or `formatPrice(undefined, "USD")` is called
- **THEN** the helper returns an empty string

#### Scenario: Custom locale overrides the default
- **WHEN** `formatPrice(12500, "USD", "en-GB")` is called
- **THEN** the returned string uses the `en-GB` locale (e.g. `US$12,500` with British grouping rules if any differ)

### Requirement: View models carry raw numbers, not formatted strings
`ArtworkView`, `ArtworkDetailView`, and `HeroArtworkView` SHALL expose prices as raw numeric fields (`priceMxn?: number`, `priceUsd?: number`) rather than pre-formatted display strings. The single source of formatting lives in the leaf renderer, called per-page from the current `lang`.

#### Scenario: ArtworkView carries numeric price fields
- **WHEN** `toArtworkView(artwork, ...)` is invoked
- **THEN** the returned `ArtworkView` has optional numeric `priceMxn` and `priceUsd` fields, derived from `artwork.price_mxn` and `artwork.price_usd` only when the source value is greater than zero

#### Scenario: ArtworkDetailView carries numeric price fields
- **WHEN** `toArtworkDetailView(artwork, ...)` is invoked
- **THEN** the returned `ArtworkDetailView` has optional numeric `priceMxn` and `priceUsd` fields, derived from the same source values, never as formatted strings

#### Scenario: HeroArtworkView carries numeric price fields
- **WHEN** `toHeroView(...)` produces a featured artwork view
- **THEN** the embedded `HeroArtworkView` exposes optional numeric `priceMxn` and `priceUsd` fields

### Requirement: Leaf components format at render time
The `CardSummary` atom, `CardInfo` atom, `ImageBanner` molecule, `ImageRowCard` molecule, `ArtworkInfoPanel` molecule, and `Hero` organism SHALL each receive the raw price numbers plus the current `lang` and SHALL format the displayed price inline via `formatPrice` + `currencyForLang(lang)`. A page shall never pass a pre-formatted price string down the tree.

#### Scenario: CardSummary formats in the current language
- **WHEN** `CardSummary` is rendered inside a Spanish page with `priceMxn=250000, priceUsd=12500, lang="es"`
- **THEN** it formats via `formatPrice(250000, "MXN")` and renders `MX$250,000`

#### Scenario: CardSummary formats in English
- **WHEN** `CardSummary` is rendered inside an English page with `priceMxn=250000, priceUsd=12500, lang="en"`
- **THEN** it formats via `formatPrice(12500, "USD")` and renders `US$12,500`

#### Scenario: CardSummary omits the price when the chosen currency is missing
- **WHEN** `CardSummary` is rendered on a Spanish page with `priceMxn=0, priceUsd=12500, lang="es"`
- **THEN** the price line is omitted entirely (no `MX$0` placeholder, no empty space)

#### Scenario: ArtworkInfoPanel uses the current language
- **WHEN** `ArtworkInfoPanel` is rendered with `lang="es"` for an artwork with both prices set
- **THEN** the price line is formatted in MXN

#### Scenario: ImageBanner forwards the numbers and lang
- **WHEN** `ImageBanner` is rendered
- **THEN** it forwards `priceMxn`, `priceUsd`, and `lang` to the `CardSummary` it embeds, without intermediate formatting

#### Scenario: ImageRowCard forwards the numbers and lang
- **WHEN** `ImageRowCard` is rendered
- **THEN** it forwards `priceMxn`, `priceUsd`, and `lang` to the `CardSummary` it embeds, in both default and `immersive` layouts

### Requirement: Hero fallback string is i18n-aware
The `Hero` organism SHALL resolve its "consult curator" fallback string from the active language's i18n messages (`pages.home.hero.consultCurator`) rather than from a hardcoded literal, so the Spanish and English hero banners use the correct copy.

#### Scenario: Spanish hero fallback
- **WHEN** the hero renders on a Spanish page with no featured artwork price
- **THEN** the fallback copy is the Spanish translation of `pages.home.hero.consultCurator`

#### Scenario: English hero fallback
- **WHEN** the hero renders on an English page with no featured artwork price
- **THEN** the fallback copy is the English translation of `pages.home.hero.consultCurator`
