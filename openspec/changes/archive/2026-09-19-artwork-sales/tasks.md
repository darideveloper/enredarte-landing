## 1. Public sales client + env

- [x] 1.1 Add `src/lib/api/sales.ts` (token-free client on `safeFetch`, `PUBLIC_API_BASE_URL`, typed `{status,message,data}` errors, missing-env guidance)
- [x] 1.2 Add sales types (buy request, `{checkout_url}`, 8-field order summary, 14-field delivery payload) to `src/lib/api/types.ts` or a `sales.ts` types block
- [x] 1.3 Single `PUBLIC_API_BASE_URL` (build fetch + browser sales; `API_BASE_URL` removed from client, `env.d.ts`, Dockerfile, `.env`/`.env.example`, `astro.config.mjs`, docs); confirm `API_TOKEN` appears in no client bundle

## 2. Routes (success + cancel, es/en)

- [x] 2.1 Add `compra-exitosa` + `compra-cancelada` entries to `src/lib/i18n/routes.ts` (es root + `en/` prefix)
- [x] 2.2 Emit both routes in `[...path].astro` `getStaticPaths()` + `COMPONENT_MAP`, thread `localizedPaths` to `LangBtns`, `PageSEO` with `noIndex`
- [x] 2.3 Build static `CancelPage` (message + stashed-artwork back-link with `/obras` fallback) and wire it for both languages
- [x] 2.4 Exclude `/compra-*` pages from the sitemap (`sitemap({ filter })` in `astro.config.mjs`)

## 3. Buy widget (artwork page)

- [x] 3.1 Build `BuyWidget.tsx` island (currency selector defaulting by language `es`→MXN/`en`→USD + email + zod validation, disabled-while-in-flight, artwork-slug stash in `sessionStorage`, full-page redirect on 201/200)
- [x] 3.2 Implement buy error states (400 inline, 404 obra-no-disponible, 409 sale-in-progress, 502/503/429 retry-later; empty/invalid email raises focused ARIA-wired inline error, clears on typing)
- [x] 3.3 Swap mailto CTA for `BuyWidget`/badges in `ArtworkInfoPanel.astro` (keep `gap-8` flow slot); badges for `reserved`/`sold`/`on_loan`/`not_available`/unknown
- [x] 3.4 Extend `ArtworkStatus` in `src/lib/api/types.ts` to the 5-value backend enum and add ES/EN copy for widget, badges, and all buy states in `src/messages/{es,en}.json`

## 4. Success polling + summary

- [x] 4.1 Build `OrderFlow.tsx` island (`?order=` parse + missing-order state, 3s/~60s poll, stop-on-200, timeout + manual retry, 429-pause)
- [x] 4.2 Render summary states (`paid_pending_data` → form entry; `data_complete`/`shipped`/`delivered` → confirmation + shipping line)
- [x] 4.3 Add ES/EN copy for summary, polling, timeout, and throttled states

## 5. Delivery form + confirmation

- [x] 5.1 Build two-step `DeliveryForm` (contact → address, native `required`/`maxLength` mirroring backend max-lengths, input preservation across steps)
- [x] 5.2 Wire single-payload submit + states (200 → confirmation, 409 → confirmation, 400 inline per-step, 404 order-not-found, 429 wait-and-retry)
- [x] 5.3 Build confirmation screen (summary + receipt note, no invented folio) and ES/EN copy

## 6. Docs, validation, backend handoff

- [x] 6.1 Regenerate `docs/component-dependencies.md` (new routes, islands, shared sales client; refresh Notes/orphans)
- [x] 6.2 Run repo validators (`validate-i18n`, `validate-imports`, build) and the backend frontend test checklist (`artwork-sales.md` § Frontend integration: mxn+usd buy, 200 re-click, 409 other-email, summary 200/404, delivery 200/400/409, 429)
- [x] 6.3 **[BACKEND — operator]** Add landing origins to dashboard `CORS_ALLOWED_ORIGINS`: staging must allow the local landing origins (`https://enredarte-landing.localhost` + branch subdomains) and prod (`https://enredarte.mx`, `https://www.enredarte.mx`), since `PUBLIC_API_BASE_URL` points at staging in every env
- [x] 6.4 **[BACKEND — operator]** Fix dashboard `PUBLIC_SITE_URL`: dev points at `enredarte.localhost` but landing serves `enredarte-landing.localhost`; prod has no `PUBLIC_SITE_URL` line — set per env so Stripe redirects land on `/compra-exitosa/`
- [x] 6.5 **[BACKEND — operator]** Verify the catalog serializer exposes all five statuses (spot-check `GET /api/artworks/artworks/` includes `on_loan`/`not_available` rows when present)
