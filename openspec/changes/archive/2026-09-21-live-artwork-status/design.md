## Context

Artwork detail pages are pure SSG: `[...path].astro:getStaticPaths()` bakes every artwork's `status` and prices into HTML at build time (`buildSiteData()` + `API_TOKEN`). `ArtworkInfoPanel.astro:84-90` branches on the baked status — buy form iff `available`, badge otherwise. A sale in the dashboard is invisible to the landing until the next image rebuild, and the stale buy form then fails with a misleading `409` ("another buyer is checking out") instead of `Vendida`.

The backend now ships a public, side-effect-free `GET /api/artworks/artworks/:slug/status/` (no auth, `Cache-Control: no-store`, throttled `artwork_status` 120/hour per client, `429` when exceeded; `404` for unknown/inactive slugs). Response: `{ slug, status, status_display, price_mxn, price_usd, updated_at }` with prices as decimal strings and `status_display` Spanish-only.

Project constraints: islands are small single units (`client:load` for visible interactivity); zustand is for cross-island shared state (`Filters`/`Artworks`); self-contained widgets use local `useState` + direct `lib/api` calls (`OrderFlow` polls `getOrderSummary` in `useEffect` — the closest precedent). Copy always flows as props from Astro `t()`; React never hardcodes strings. Public browser calls use the `PUBLIC_API_BASE_URL` pattern (`artwork-visits.ts`), never token-based `apiFetch`.

## Goals / Non-Goals

**Goals:**
- A stale-baked artwork page self-corrects its purchase zone (price, status label, form/badge) within ~1 fetch round-trip of mount.
- The sold-then-visited path can never reach the buy form's `409` dead-end.
- The page never breaks when the backend is unreachable — baked HTML is the safe default.

**Non-Goals:**
- Catalog grids (`CollectionIndex`, `Home`) stay baked until rebuild — no per-card status checks.
- No webhook/auto-rebuild pipeline in this change (follow-up).
- No SSR/hydration-model change; hosting stays static + nginx.
- No fix to backend `buy/` returning `409` for sold pieces (dashboard-owned; tracked as an open question).

## Decisions

**1. New `ArtworkPurchase` island composing `BuyWidget` (over extending `BuyWidget` in place).**
The stale surface is three nodes (price `<p>`, status `<p>`, form/badge slot), but only the form lives in React today. Extending `BuyWidget` to also own its sibling labels would push static-markup concerns into the form component. A thin zone island that renders price + status + (BuyWidget | badge) keeps `BuyWidget` untouched and reviewable, mirrors the `OrderFlow` ⊃ `DeliveryForm` composition precedent, and stays one focused interactive unit. Alternative (vanilla `<script>` DOM surgery like `recordArtworkVisit`) rejected: badge/i18n rendering in string templates is untestable and breaks the island pattern.

**2. Local `useState`, no zustand.**
Status is single-island, single-page, must-be-fresh-per-mount state. Zustand's value props are cross-island sharing and `persist` survival across navigations — persisting live status would reintroduce staleness via localStorage. `OrderFlow`'s `useEffect` + `started`-ref + phase state is the template.

**3. New `src/lib/api/artwork-status.ts` public module (over reusing `salesFetch`/`apiFetch`).**
`apiFetch` requires `API_TOKEN` and throws in the browser; `salesFetch` throws `SalesError` on non-OK, but the contract demands silent-null on any failure. A dedicated module following `artwork-visits.ts` (public base URL, `Accept: application/json`, timeout, `null` on any error) is the smallest correct shape. Prices normalized (decimal string → number) at this boundary so the island reuses `pickPrice`/`formatPrice`/`currencyForLang` unchanged.

**4. Baked props as hydration seed + first paint.**
The island renders byte-identical markup to today's static output from baked props, then `useEffect` fires one `GET status/` per mount. Identical render = no flash when status matches; instant replace (no skeleton) when it differs — a skeleton would draw attention to the stale paint.

**5. Copy threaded as props, `status_display` ignored.**
`buyCopy` (existing `BuyCopy`), `badgeCopy` (3 `pages.purchase.badges.*` strings), and the 5 `pages.artwork.status.*` labels come from Astro `t()` in both languages. Backend `status_display` is Spanish-only and would break `en` pages.

**6. Literal error policy: any non-200 → keep baked.**
`404` (deactivated post-build), `429`, timeout, offline: no state change. The `buy/` POST still 404s safely server-side, so keeping the form on error is fail-safe, not fail-open.

## Risks / Trade-offs

- [Flash of stale form] A sold page shows the buy form for ~1 round-trip before the badge swap → Mitigation: instant replace, no skeleton; the window is bounded by one fast GET. (Full elimination requires SSR — explicitly deferred.)
- [Throttle `429` under rapid navigation] → Mitigation: once-per-mount guard (`started` ref, cf. `OrderFlow`), no retry, no polling; 120/hour is unreachable in normal browsing.
- [SEO sees baked status] Crawlers index the build-time snapshot → Mitigation: accepted; webhook rebuild is the follow-up layer. User-facing correctness (this change) comes first.
- [`baseUrl()` now triple-duplicated] (`sales.ts`, `artwork-visits.ts`, new module) → Mitigation: accept the duplication to match existing convention; extracting a shared `publicBaseUrl()` is a one-line follow-up, not this change's job.
- [View-transition remount double-fire] → Mitigation: `client:load` island remounts per navigation by framework contract; `started` ref + `astro:page-load` semantics already proven by the visit counter.

## Migration Plan

Purely additive, no migration: static HTML output is unchanged (same markup from baked props), the island only adds a runtime correction layer. Rollback = revert to previous image; pages degrade to today's behavior. Deploy order is irrelevant (backend endpoint already live). After deploy, verify `cien-miradas` (known sold) flips to `Vendida` within ~1s of mount in both languages.

## Open Questions

- Should backend `POST buy/` return `404` (not `409`) when `status == "sold"`, and are holds cleared on paid orders? (Dashboard-owned; determines whether the stale-form error copy ever matters again.)
- Webhook sale → landing rebuild: Coolify deploy-hook shape and who owns the trigger? (Follow-up change.)
