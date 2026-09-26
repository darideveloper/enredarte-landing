## Context

Three legal pages are sample stubs with a "pending review" disclaimer while the cookie policy already promises analytics cookies that don't exist. The artwork-visit beacon fires unconditionally; there is no consent UI, no GA, and no new dependency budget for a consent-management platform. Decisions below assume no legal counsel (standard MX LFPDPPP posture) and the locked answers: Stripe processor, transactional-email-only, strict opt-in consent, explicit cookie tables. See `proposal.md` and `specs/*/spec.md`.

## Goals / Non-Goals

**Goals:**

- Production-ready ES/EN legal copy with Stripe, retention/ARCO, explicit cookie tables, GA section.
- Strict opt-in Consent Mode v2 banner gating GA4 (pageview + `begin_checkout`/`purchase`, no PII) and the first-party visit beacon.
- Zero new runtime dependencies; `validate-i18n` + `build` green.

**Non-Goals:**

- Server-side GA (Measurement Protocol), GTM, Do Not Track special-casing beyond consent, checkout UX changes, newsletter/marketing, backend changes.

## Decisions

- **Vanilla banner island, no CMP library.** A small Astro component + inline vanilla script in `Layout` (same pattern as existing `js-*` reveal scripts). Its two buttons reuse the `Btn` atom (accept = existing `primary`; reject = new `inverse-outline` variant for dark surfaces, showcased in `design-system.astro`) instead of hand-rolled classes. Alternatives considered: cookie-consent npm package (rejected: dependency + oversized UI), React island (rejected: heavier hydration for a footer-fixed banner). One `localStorage` key `enredarte-consent` (`{ analytics, ts }`) — no zustand, no new dep.
- **Consent defaults inline in `<head>`.** Tiny inline script sets `gtag('consent','default',{…denied…,wait_for_update:500})` before any tag load so nothing can race consent. Alternative (set defaults only when the analytics module loads) rejected: a cached `gtag.js` could fire first.
- **Vanilla `lib/analytics.ts` module.** Owns `hasAnalyticsConsent()`, one-time `gtag.js` injection from `PUBLIC_GA_MEASUREMENT_ID`, `trackPageview` / `trackBeginCheckout` / `trackPurchase`, and consent `update` pushes. Imported by the banner script, `ArtworkPage` beacon gate, `BuyWidget` (success path), and `OrderFlow` (complete path). Missing ID → silent no-op. Alternative (GTM container) rejected: direct `gtag.js` is smaller and sufficient for three events.
- **`page_view` skips `noIndex` compra pages** but the transactional `purchase` event still fires on `compra-exitosa` — page tracking exclusion and funnel measurement stay independent.
- **Legal bodies live in a `legal` content collection** (`src/content/legal/<slug>.<lang>.md`, zod schema requiring `title`/`description`/`updated`), rendered by `LegalPage` through the shared `Markdown` atom (table styles already exist). The glob loader pins explicit `<slug>.<lang>` ids via `generateId` — default ids are github-slugs (dots stripped, so `aviso-de-privacidad.en` would become `aviso-de-privacidaden`). Per your directive this replaces the `pages.legal.*` i18n-section approach. Alternatives considered: keep copy in `messages/*.json` (rejected: you required Markdown files; tables and long-form copy don't belong in JSON), `src/data/legal/*.md` + `import.meta.glob` (rejected: no frontmatter schema validation, parity would need a bespoke script). Missing-language parity is enforced by resolving both files at build time and throwing — no silent fallback.
- **Beacon gating reuses the consent read** (`hasAnalyticsConsent()` before `recordArtworkVisit`) — no change to endpoint, retry, or silence semantics. Additionally, granting consent on an artwork page fires that view's beacon once from the banner accept handler (the granting view would otherwise never count); an idempotency guard (previous choice already granted) keeps re-accepts silent.
- **`LegalPage` related-docs nav.** Each legal page links the other two via `getLocalizedPath` reusing the existing `global.footer.legal.*` labels — no new i18n keys, no per-file link maintenance.

## Risks / Trade-offs

- [Risk] Ad/tracker blockers neuter GA → Mitigation: accepted; first-party beacon still yields visit counts from consenting users.
- [Risk] Double `page_view` on ClientRouter navigations → Mitigation: emit only on `astro:page-load`, slug/path read live from DOM.
- [Risk] i18n key drift across banner/footer copy → Mitigation: `pnpm validate-i18n` in build; one key namespace per capability. Legal-body parity is enforced separately by the collection (both language files required, build throws otherwise).
- [Risk] Overclaiming Stripe/merchant roles without counsel → Mitigation: copy states only "payment processed via Stripe hosted checkout"; flagged in Open Questions.

## Migration Plan

Single change, additive + copy edits, no backend or URL changes (slugs unchanged). Deploy: set `PUBLIC_GA_MEASUREMENT_ID` at build; without it the site behaves as today minus the beacon firing pre-consent. Rollback: revert the change (banner, module, copy restore as one unit).

## Open Questions

- GA4 measurement ID value (needed at implementation time; `.env.example` documents the key).
- Confirm EnredArte (not Stripe) is merchant of record for the terms wording.
