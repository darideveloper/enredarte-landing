## MODIFIED Requirements

### Requirement: Footer Legal Links Row

The `Footer` SHALL render a legal links row with Spanish-slug links to legal pages, using localized labels with i18n parity, plus a cookie-settings control that re-opens the consent banner.

#### Scenario: Rendering legal links

- **WHEN** the `Footer` bottom area is rendered
- **THEN** it displays an `Aviso de Privacidad` link pointing to `/aviso-de-privacidad` in Spanish (default locale, root-level path) and `/en/aviso-de-privacidad` in English, a `Términos y Condiciones` link pointing to `/terminos-y-condiciones` in Spanish and `/en/terminos-y-condiciones` in English, and a `Política de Cookies` link pointing to `/politica-de-cookies` in Spanish and `/en/politica-de-cookies` in English
- **THEN** both links use the footer link styling and open in the same tab
- **THEN** labels resolve through new `global.footer.legal.*` translation keys present in both `es.json` and `en.json`

#### Scenario: Re-opening consent from the footer

- **WHEN** the visitor activates the cookie-settings control in the `Footer`
- **THEN** the consent banner re-opens with the current stored choice reflected, in the page language

### Requirement: Spanish-Slug Legal Stub Pages

The site SHALL expose final (non-sample) legal pages at Spanish slugs with gallery-contextualized content and no sample-content disclaimer. Exact section content is governed by the `legal-copy` capability; this requirement covers routing, structure, and i18n parity.

#### Scenario: Visiting aviso-de-privacidad

- **WHEN** the user visits the Aviso de Privacidad page (Spanish slug)
- **THEN** the page renders a title, last-updated line, and final sections covering: data controller (EnredArte, Mexico City, Mexico), contact (`info@enredarte.com`, `+52 624 176 4802`), data collected for art inquiries / purchases (including Stripe processing), transactional-only purposes, retention, ARCO rights process, and no sample-content disclaimer

#### Scenario: Visiting terminos-y-condiciones

- **WHEN** the user visits the Términos y Condiciones page (Spanish slug)
- **THEN** the page renders a title, last-updated line, and final sections covering: artwork originality + signed COA per work, 65% artist share statement, pricing in MXN / price-on-request flow, Stripe hosted-checkout payment note, insured DHL/FedEx shipping note, returns / reservation note, contact channel, and no sample-content disclaimer

#### Scenario: Visiting politica-de-cookies

- **WHEN** the user visits the Política de Cookies page (Spanish slug)
- **THEN** the page renders a title, last-updated line, and final sections covering: an explicit per-key table (necessary / preferences / analytics entries), purposes tied to gallery browsing and art inquiries, the GA4 section, consent / withdrawal note pointing at the footer control, contact channel, and no sample-content disclaimer

#### Scenario: Localizing stub pages

- **WHEN** the site is rendered in English
- **THEN** the same Spanish-slug pages resolve via the localized routing (e.g. `/aviso-de-privacidad` ↔ `/en/aviso-de-privacidad`) with translated final content from the matching `.en.md` collection file and no disclaimer
- **WHEN** `pnpm validate-i18n` runs
- **THEN** all footer/banner keys exist in both `es.json` and `en.json`, while page-body copy parity is enforced by the collection (both language files required — see `legal-copy`)
