## MODIFIED Requirements

### Requirement: Language determines displayed currency
The pricing system SHALL derive the displayed currency from the current page language: Spanish pages (`lang === "es"`) display prices in **MXN**, and English pages (`lang === "en"`) display prices in **USD** — except inside the artwork purchase zone on artwork detail pages, where the visitor-selected currency (defaulted from the page language) is the source of truth and the displayed price SHALL follow the selector. There is no separate user-facing currency toggle outside the purchase zone; elsewhere the URL's language is the only source of truth.

#### Scenario: Spanish page shows MXN
- **WHEN** a page renders for the Spanish language (URL has no `/en` prefix)
- **THEN** every rendered artwork price is displayed in Mexican Pesos (MXN), using `MX$` as the currency symbol and Spanish-locale grouping/decimal rules

#### Scenario: English page shows USD
- **WHEN** a page renders for the English language (URL has the `/en` prefix)
- **THEN** every rendered artwork price is displayed in US Dollars (USD), using `US$` as the currency symbol and English-locale grouping/decimal rules

#### Scenario: Purchase-zone price follows the selector
- **WHEN** the visitor changes the currency selector in the artwork purchase zone
- **THEN** the purchase-zone price line re-renders in the selected currency (live prices when reconciled, otherwise baked prices), while all other surfaces keep the lang-driven price

#### Scenario: Purchase-zone disables the currency without a price
- **WHEN** the artwork has no positive price in one currency
- **THEN** that selector option is disabled; when neither currency has a price the price line is omitted
