## 1. Site-config final data

- [x] 1.1 Update `PHONES.main` to display `+52 624 176 4802` with `href tel:+526241764802`
- [x] 1.2 Update `EMAIL` to `info@enredarte.com` with `href mailto:info@enredarte.com`
- [x] 1.3 Add `WHATSAPP` const (display `+52 1 624 176 4802`, `href https://wa.me/5216241764802`) and wire into `BUSINESS_DATA`
- [x] 1.4 Update `BUSINESS_DATA.url` to `https://enredarte.mx`; simplify location to `Mexico City, Mexico` and park `GOOGLE_MAPS`/full `ADDRESS` as commented code for later use

## 2. Footer contact + legal row

- [x] 2.1 Render phone (`tel:`), WhatsApp (`wa.me`, new tab + `rel="noopener"`), email (`mailto:`) via `Link variant="footer"`, plus plain-text `Mexico City, Mexico` with no Maps link
- [x] 2.2 Add legal links row (`/aviso-de-privacidad`, `/terminos-y-condiciones`, `/politica-de-cookies` localized) with footer styling; keep FB/IG URLs unchanged
- [x] 2.3 Add `global.footer.legal.*` (+ WhatsApp label if used) keys to `es.json` and `en.json` with parity

## 3. Legal stub pages (Spanish slugs)

- [x] 3.1 Extend `routes.ts` with `aviso-de-privacidad` + `terminos-y-condiciones` + `politica-de-cookies`, add generic `LegalPage` to `COMPONENT_MAP` in `[...path].astro` (no `localizedPaths` change — `LangBtns` falls back to `getLocalizedPath(pageKey)`, same as `home`)
- [x] 3.2 Build Aviso stub (controller, contact `info@enredarte.com` / `+52 624 176 4802`, data-use, ARCO note) + sample-content disclaimer, ES+EN via `pages.legal.*`
- [x] 3.3 Build Términos stub (COA, 65% artist share, MXN/price-on-request, insured DHL/FedEx, reservation/returns, contact) + disclaimer, ES+EN
- [x] 3.4 Build Cookies stub (necessary / preferences / analytics, consent note, contact) + disclaimer, ES+EN

## 4. Verify + docs

- [x] 4.1 Run `pnpm validate-i18n` and `pnpm build`; confirm legal routes emit (`/aviso-de-privacidad`, `/terminos-y-condiciones`, `/politica-de-cookies`, `/en/…` equivalents) and `tel:`/`wa.me`/`mailto:` hrefs render
- [x] 4.2 Update `docs/component-dependencies.md` for footer + new legal pages; flag stubs for legal-counsel review
