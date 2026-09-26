# legal-copy Specification

## Purpose
Production-ready ES/EN legal content contract for the three legal pages: Markdown bodies in the `legal` content collection (no counsel review; standard MX posture), with Stripe disclosure, retention/ARCO, explicit storage tables, GA section, and cross-page navigation.

## Requirements

### Requirement: Legal pages render from Markdown content collection

The system SHALL source all three legal page bodies from a `legal` content collection at `src/content/legal/<slug>.<lang>.md` (slugs `aviso-de-privacidad`, `terminos-y-condiciones`, `politica-de-cookies`; langs `es`, `en`), each with `title`, `description`, and `updated` frontmatter. `LegalPage` SHALL render the body through the shared Markdown pipeline (tables included) and take SEO title/description from frontmatter. The superseded `pages.legal.*` keys SHALL be removed from `messages/es.json` and `messages/en.json`. Both language files SHALL exist for every slug — a missing file SHALL fail the build.

#### Scenario: Legal page renders its Markdown file

- **WHEN** the user visits `/politica-de-cookies`
- **THEN** the page renders the body of `src/content/legal/politica-de-cookies.es.md` with frontmatter title, description, and updated line, including its cookie tables

#### Scenario: Missing language file fails the build

- **WHEN** `src/content/legal/aviso-de-privacidad.en.md` is absent
- **THEN** the build fails instead of rendering a fallback or empty page

#### Scenario: Old i18n keys are gone

- **WHEN** `pnpm validate-i18n` runs
- **THEN** no `pages.legal.*` keys remain in either messages file and validation passes

### Requirement: Final privacy-notice copy

The system SHALL render a final (non-sample) privacy notice in ES and EN covering: data controller (EnredArte, Mexico City, Mexico) with contact `info@enredarte.com` / `+52 624 176 4802`; the exact data collected (buy email + currency; delivery name/phone/full address; artwork-visit metadata; contact-channel inquiries); no card/bank data and no biometric data; transactional-only purposes with an explicit no-marketing statement; Stripe named as payment processor with buyer-data sharing disclosed; per-type retention under standard MX practice; email ARCO process with 20-day response plus INAI referral; third-party responsibility limit. The sample-content disclaimer SHALL be gone.

#### Scenario: Visiting aviso-de-privacidad shows final copy

- **WHEN** the user visits `/aviso-de-privacidad` (or `/en/aviso-de-privacidad`)
- **THEN** the page names Stripe as processor, states no marketing use, excludes biometrics, lists retention and the ARCO email process with INAI referral, and shows no sample disclaimer

#### Scenario: English parity

- **WHEN** the site renders in English
- **THEN** every privacy section, retention rule, and ARCO note has a complete English equivalent

### Requirement: Final terms copy

The system SHALL render final terms in ES and EN covering: acceptance and adult age on use/purchase; originality + signed COA; MXN pricing / price-on-request flow; 65% artist share; payment processed via Stripe hosted checkout; insured DHL/FedEx shipping confirmed before purchase; written reservations, mismatch remedy within 7 days, and no change-of-mind returns; artist-retained copyright (physical work + COA only, no reproduction rights unless agreed in writing); MX-law/CDMX-courts clause. The sample-content disclaimer SHALL be gone.

#### Scenario: Visiting terminos-y-condiciones shows final copy

- **WHEN** the user visits `/terminos-y-condiciones` (or `/en/terminos-y-condiciones`)
- **THEN** the page names Stripe checkout, states the 65% artist share and insured shipping, states age acceptance, copyright retention, jurisdiction, and no change-of-mind returns, and shows no sample disclaimer

#### Scenario: English parity

- **WHEN** the site renders in English
- **THEN** every terms section has a complete English equivalent

### Requirement: Final cookie-policy copy with explicit tables

The system SHALL render a final cookie policy in ES and EN with one Markdown table row per real entry: `enredarte-consent` (localStorage, until cleared), `enredarte-catalog-storage` (localStorage, until cleared), `enredarte-form-storage` (localStorage, until cleared), `enredarte-last-artwork` (sessionStorage, session), `hero-entered` (sessionStorage, session), the artwork-visit beacon (first-party analytics ping, consent-gated), `_ga*` cookies (only after analytics consent, up to 24 months per Google's settings), YouTube-nocookie/Vimeo embeds (third-party on play), and outbound social/contact links. It SHALL include a GA4 section (Google LLC, US transfer, retention, opt-out, withdrawal via the footer control), a consent-record note tying the choice to `enredarte-consent`, and a withdrawal→ARCO link, and state management via the banner plus browser settings. The sample-content disclaimer SHALL be gone.

#### Scenario: Visiting politica-de-cookies shows explicit tables

- **WHEN** the user visits `/politica-de-cookies` (or `/en/politica-de-cookies`)
- **THEN** every storage key above appears with true purpose and lifetime, the consent-record and withdrawal→ARCO notes show, the GA4 section names Google LLC and withdrawal, and no sample disclaimer shows

#### Scenario: English parity

- **WHEN** the site renders in English
- **THEN** every cookie-table row and the GA4 section has a complete English equivalent

### Requirement: Related legal navigation

Every legal page SHALL link the other two legal pages through localized paths reusing the existing `global.footer.legal.*` labels (no new i18n keys).

#### Scenario: Related links exclude the current page

- **WHEN** the user visits `/politica-de-cookies` (or any legal page in either language)
- **THEN** a related-docs nav lists exactly the other two legal pages with correct localized URLs
