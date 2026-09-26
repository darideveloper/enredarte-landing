## 1. Consent foundation

- [x] 1.1 Add `PUBLIC_GA_MEASUREMENT_ID` to `.env.example` and read it in the analytics module
- [x] 1.2 Create vanilla `src/lib/analytics.ts` (consent read/persist, Consent Mode v2 default + update, one-time `gtag.js` injection, `trackPageview`/`trackBeginCheckout`/`trackPurchase` with no-PII guards and missing-ID silent no-op)
- [x] 1.3 Add consent-default inline script to `Layout` head (all four keys denied, `wait_for_update`)

## 2. Consent banner + footer

- [x] 2.1 Add ES/EN banner + footer-control i18n keys (`messages/es.json`, `messages/en.json`)
- [x] 2.2 Build vanilla consent banner component mounted in `Layout` (first-visit show, accept/reject, dismiss, re-open with current choice)
- [x] 2.3 Add footer cookie-settings control wiring it to re-open the banner

## 3. Gate tracking

- [x] 3.1 Gate `ArtworkPage` visit beacon on `hasAnalyticsConsent()` (keep fire-and-forget semantics)
- [x] 3.2 Emit `page_view` on `astro:page-load` except `noIndex` compra pages
- [x] 3.3 Emit `begin_checkout` on `BuyWidget` checkout-creation success
- [x] 3.4 Emit `purchase` (value + currency, no PII) on `OrderFlow` completion

## 4. Final legal copy (Markdown collection)

- [x] 4.1 Create `legal` content collection (`src/content.config.ts` + zod schema: `title`/`description`/`updated` required) resolving both language files per slug at build time (throw on missing file)
- [x] 4.2 Write `aviso-de-privacidad.{es,en}.md` (Stripe, transactional-only, retention, email ARCO 20-day, no marketing)
- [x] 4.3 Write `terminos-y-condiciones.{es,en}.md` (Stripe hosted checkout, COA, MXN, 65% artist, insured shipping)
- [x] 4.4 Write `politica-de-cookies.{es,en}.md` (explicit per-key tables, GA4 section, banner + browser management)
- [x] 4.5 Rework `LegalPage` to render the collection Markdown (frontmatter SEO + shared `Markdown` atom), drop the disclaimer, and delete `pages.legal.*` from `messages/es.json` + `en.json`

## 5. Verify

- [x] 5.1 Run `pnpm validate-i18n` (banner/footer key parity) and prove fail-build parity (temporarily remove one `.en.md`, build must fail, restore)
- [x] 5.2 Run `pnpm build` green (validators + SSG)
- [x] 5.3 Manual pass: first-visit banner blocks beacon/GA; accept loads GA; reject stays silent; footer re-opens; return visit honors stored choice; private-mode storage failures degrade silently
- [x] 5.4 Sync `docs/component-dependencies.md` (new banner/analytics nodes, legal page updates)

## 6. Post-verify follow-ups

- [x] 6.1 Reuse `Btn` atoms in the banner (accept = `primary`, reject = new `inverse-outline` variant) + showcase the variant in `design-system.astro`
- [x] 6.2 Retro-fire the granting view's beacon on accept (idempotent on re-accept), verified live (one POST on fresh accept, none on re-accept)
- [x] 6.3 Extend legal copy: biometrics exclusion + INAI referral + third-party limit (privacy); consent-record note + withdrawal→ARCO link + true storage lifetimes (cookies); age/acceptance + artist copyright + jurisdiction + no change-of-mind returns (terms); related-docs nav in `LegalPage` (existing labels, no new keys)
