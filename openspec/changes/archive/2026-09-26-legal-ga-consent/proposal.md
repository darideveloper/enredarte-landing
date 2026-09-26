## Why

The three legal pages are sample copy flagged "pending legal review", and the cookie policy already claims analytics cookies that don't exist yet. With a GA4 integration required next, the site needs production-ready legal text and a consent gate first — otherwise GA would fire without a lawful basis and the visit beacon already does.

## What Changes

- Rewrite all three legal pages (ES + EN) as production-ready copy rendered from a new `legal` content collection (`src/content/legal/<slug>.<lang>.md` with `title`/`description`/`updated` frontmatter): Stripe named as payment processor, transactional-email-only purposes (no marketing claim), MX retention rules, email ARCO process with 20-day response plus INAI referral, biometrics exclusion, third-party responsibility limit, explicit per-key cookie/storage tables (localStorage rows read "until cleared" — no TTL in code), new GA4 section, consent-record note and withdrawal→ARCO link, age/acceptance, artist-retained copyright, MX-law/CDMX-courts clause, no change-of-mind returns. A missing language file SHALL fail the build.
- Remove the "sample text pending legal review" disclaimer from all legal pages, delete the superseded `pages.legal.*` keys from `messages/es.json` + `en.json`, and add a related-docs nav in `LegalPage` linking the other two pages (existing footer labels, no new keys).
- Add an opt-in consent banner (ES/EN, `Btn`-atom accept/reject buttons, re-openable from the footer) implementing Consent Mode v2 with everything denied by default.
- Load GA4 (`PUBLIC_GA_MEASUREMENT_ID`) only after analytics consent; emit `page_view` plus ecommerce events (`begin_checkout`, `purchase`) with no PII.
- Gate the existing artwork-visit beacon behind the same analytics consent (currently fires unconditionally on every obra page-load); granting consent on an artwork page additionally fires that view's beacon once (idempotent on re-accept).
- Exclude `noIndex` compra pages from tracking.

## Capabilities

### New Capabilities

- `consent-management`: consent banner (`Btn`-atom buttons), consent persistence, Consent Mode v2 defaults, gated GA4 loading and event emission, footer re-consent control, granting-view beacon retro-fire.
- `legal-copy`: `legal` content-collection contract for aviso-de-privacidad, terminos-y-condiciones, and politica-de-cookies (Markdown body + frontmatter, Stripe disclosure, retention/ARCO + INAI, biometrics exclusion, explicit cookie tables with true lifetimes, GA section, withdrawal→ARCO link, age/acceptance, artist copyright, jurisdiction, no marketing claim, disclaimer removed, related-docs nav, both-language files required).

### Modified Capabilities

- `artwork-visit-counter`: the visit beacon SHALL fire only when analytics consent is granted (currently unconditional), plus a one-time retro-fire for the view on which consent is granted.
- `footer-legal-links`: the footer SHALL expose a cookie-settings re-consent entry, and the legal pages move from sample stubs to final copy (disclaimer removed).

## Impact

- New: consent banner island + `lib/analytics` module; `PUBLIC_GA_MEASUREMENT_ID` env (build + `.env.example`); `inverse-outline` variant on the `Btn` atom (+ design-system showcase).
- Touched: `Layout` (banner mount), `Footer` (re-consent entry), `ArtworkPage` (beacon gating), `BuyWidget`/`OrderFlow` (GA events only, no UI change), new `src/content/legal/*.md` (page bodies) + collection config, `LegalPage` (renders Markdown instead of i18n sections + related-docs nav), `messages/es.json` + `messages/en.json` (banner/footer keys added, `pages.legal.*` removed), `docs/component-dependencies.md` sync.
- Validators: `pnpm validate-i18n` parity for nav/banner keys; build fails on a missing legal language file; `pnpm build` green.
