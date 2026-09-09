## MODIFIED Requirements

### Requirement: Business Contact Data
The `Footer` SHALL render final phone, WhatsApp, email, and simplified location contact details sourced from `BUSINESS_DATA` / site-config constants, with phone as a `tel:` link, WhatsApp as an external `wa.me` link, email as a `mailto:` link, and the location as plain text. Map integration stays parked in code and unrendered.

#### Scenario: Rendering final contact details
- **WHEN** the `Footer` contact column is rendered
- **THEN** it displays `+52 624 176 4802` as a `tel:+526241764802` link via the `Link` footer variant
- **THEN** it displays `+52 1 624 176 4802` as a `https://wa.me/5216241764802` link opening in a new tab with `rel="noopener"`, via the `Link` footer variant
- **THEN** it displays `info@enredarte.com` as a `mailto:info@enredarte.com` link via the `Link` footer variant
- **THEN** it displays the plain-text location `Mexico City, Mexico` (no street, no zone, no postal code, no country code)
- **THEN** it renders no Google Maps link; `GOOGLE_MAPS` coordinates remain in the codebase commented / unreferenced by the footer for later use

#### Scenario: Sourcing values from site-config
- **WHEN** site-config is read
- **THEN** `PHONES.main` holds display `+52 624 176 4802` with `href tel:+526241764802`
- **THEN** a WhatsApp constant holds display `+52 1 624 176 4802` with `href https://wa.me/5216241764802`
- **THEN** `EMAIL` holds `info@enredarte.com` with `href mailto:info@enredarte.com`
- **THEN** `BUSINESS_DATA.url` is `https://enredarte.mx`
- **THEN** `BUSINESS_DATA.social` keeps Facebook `https://www.facebook.com/enredarte` and Instagram `https://www.instagram.com/enredarte/` unchanged

### Requirement: i18n Parity
The `Footer` SHALL only reference translation keys that exist in both `en.json` and `es.json`.

#### Scenario: Keeping translations in sync
- **WHEN** `pnpm validate-i18n` runs
- **THEN** all `global.footer` translation keys referenced by the footer (including any new WhatsApp / legal labels) exist in both language files
