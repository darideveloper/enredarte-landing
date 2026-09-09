## Why

The footer currently renders entirely dummy contact data (US `+1` phone, `hello@enredarte.com`, `123 Main St / XX`, `lat 0.0/lng 0.0`) and has no legal links. The user has now defined the final real-world info (MX phone + WhatsApp, `info@enredarte.com`, `Mexico City, Mexico`, `enredarte.mx` domain, keep FB/IG, map parked for later, standard Spanish legal links with sample text). This change replaces placeholders with final data so the footer is shippable.

## What Changes

- Replace footer contact dummies with final values:
  - Phone display `+52 624 176 4802`, `href tel:+526241764802`
  - Email `info@enredarte.com`, `href mailto:info@enredarte.com`
  - Location plain text `Mexico City, Mexico` (drop street / zone / ZIP / `XX` code)
  - Keep Facebook `https://www.facebook.com/enredarte` and Instagram `https://www.instagram.com/enredarte/` unchanged
- Add WhatsApp contact line: display `+52 1 624 176 4802`, `href https://wa.me/5216241764802` (new tab, `rel="noopener"`)
- Update business domain `BUSINESS_DATA.url` from `https://enredarte.com` to `https://enredarte.mx`
- Park map integration: keep `GOOGLE_MAPS` coordinates in codebase but commented / unrendered; footer address stays plain text with no Maps link
- Add standard legal links row (Spanish slugs) with sample-text stub pages contextualized to the gallery (art sales, 65% artist share, insured DHL/FedEx shipping, COA):
  - `/aviso-de-privacidad` (Aviso de Privacidad)
  - `/terminos-y-condiciones` (Términos y Condiciones)
  - `/politica-de-cookies` (Política de Cookies)
- Localize all new strings (`contact.whatsapp` label if needed, `legal.*` labels) in `es.json` + `en.json` with i18n parity (`pnpm validate-i18n` passes)

## Capabilities

### New Capabilities

- `footer-legal-links`: legal links row in footer + Spanish-slug stub pages with gallery-contextualized sample text, localized labels, i18n parity.

### Modified Capabilities

- `footer-organism`: contact-data requirements change — final MX phone/email/location values, added WhatsApp line, parked (commented) map, updated business domain. Social (FB/IG) behavior unchanged.

## Impact

- Affected code: `src/data/site-config.ts`, `src/components/organisms/Footer.astro`, `src/messages/es.json`, `src/messages/en.json`, new legal stub pages + routing, `docs/component-dependencies.md` (if footer/page graph changes)
- No API, dependency, or backend changes; no breaking route changes (new `/aviso-de-privacidad` + `/terminos-y-condiciones` + `/politica-de-cookies` routes, plus `/en/…` equivalents, are additive)
- SEO/canonical base stays driven by `SITE_URL` env; `BUSINESS_DATA.url` update affects rendered metadata referencing the business URL
