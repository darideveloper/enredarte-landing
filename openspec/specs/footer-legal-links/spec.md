# footer-legal-links Specification

## Purpose
Defines the behavior contract for the footer legal links row and the Spanish-slug legal stub pages: localized labels with i18n parity, same-tab footer-styled links, and gallery-contextualized sample content clearly marked as pending legal review.

## Requirements

### Requirement: Footer Legal Links Row
The `Footer` SHALL render a legal links row with Spanish-slug links to stub legal pages, using localized labels with i18n parity.

#### Scenario: Rendering legal links
- **WHEN** the `Footer` bottom area is rendered
- **THEN** it displays an `Aviso de Privacidad` link pointing to `/aviso-de-privacidad` in Spanish (default locale, root-level path) and `/en/aviso-de-privacidad` in English, a `Términos y Condiciones` link pointing to `/terminos-y-condiciones` in Spanish and `/en/terminos-y-condiciones` in English, and a `Política de Cookies` link pointing to `/politica-de-cookies` in Spanish and `/en/politica-de-cookies` in English
- **THEN** both links use the footer link styling and open in the same tab
- **THEN** labels resolve through new `global.footer.legal.*` translation keys present in both `es.json` and `en.json`

### Requirement: Spanish-Slug Legal Stub Pages
The site SHALL expose stub legal pages at Spanish slugs with gallery-contextualized sample text, clearly marked as sample content pending legal review.

#### Scenario: Visiting aviso-de-privacidad
- **WHEN** the user visits the Aviso de Privacidad page (Spanish slug)
- **THEN** the page renders a title, last-updated line, and sample sections covering: data controller (EnredArte, Mexico City, Mexico), contact (`info@enredarte.com`, `+52 624 176 4802`), data collected for art inquiries / purchases, purposes, ARCO rights note, and a visible sample-content disclaimer

#### Scenario: Visiting terminos-y-condiciones
- **WHEN** the user visits the Términos y Condiciones page (Spanish slug)
- **THEN** the page renders a title, last-updated line, and sample sections covering: artwork originality + signed COA per work, 65% artist share statement, pricing in MXN / price-on-request flow, insured DHL/FedEx shipping note, returns / reservation note, contact channel, and a visible sample-content disclaimer

#### Scenario: Visiting politica-de-cookies
- **WHEN** the user visits the Política de Cookies page (Spanish slug)
- **THEN** the page renders a title, last-updated line, and sample sections covering: cookie types used (necessary / preferences / analytics), purposes tied to gallery browsing and art inquiries, consent / opt-out note, contact channel, and a visible sample-content disclaimer

#### Scenario: Localizing stub pages
- **WHEN** the site is rendered in English
- **THEN** the same Spanish-slug pages resolve via the localized routing (e.g. `/aviso-de-privacidad` ↔ `/en/aviso-de-privacidad`) with translated sample content and the same disclaimer
- **WHEN** `pnpm validate-i18n` runs
- **THEN** all new legal page keys exist in both `es.json` and `en.json`
