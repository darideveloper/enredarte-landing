## Context

The landing site is fully static (Astro SSG, no adapter; `[...path].astro` + `getStaticPaths`). The dashboard backend owns the sales state machine (`artwork-sales.md` + `Sales/*.bru`): public buy/summary/delivery endpoints, Stripe Checkout as payment surface, webhook-driven transitions with a server-side race backstop on `GET orders/`. This design implements the landing side with **approach A**: browser islands call the public endpoints directly; static shells for the new routes; no SSR adapter, no proxy, no backend code changes.

Current state: `ArtworkInfoPanel` ends in a mailto inquiry CTA; `src/lib/api/client.ts` is a token-injecting build-time-only client; env has `API_BASE_URL`/`API_TOKEN` (server-only); catalog `status` is baked at build time; `ArtworkStatus` is `available | reserved | sold`.

## Goals / Non-Goals

**Goals:**
- End-to-end purchase in the browser: email-only buy → Stripe → success poll → two-step delivery → confirmation.
- Zero secret leakage: `API_TOKEN` never enters a client bundle.
- Every backend error code gets a designed UI state (no dead ends except operator-misconfig 503).
- ES/EN parity for all new copy; `component-dependencies.md` stays in sync.

**Non-Goals:**
- No SSR adapter / Astro API routes / proxy layer.
- No live catalog status (build-time badge + graceful 409; public status endpoint is a deferred backend option).
- No tracking events, no SEO indexing of transactional pages, no design-system showcase entries for sales islands.
- No backend code changes; dashboard env fixes are operator tasks.

## Decisions

**D1 — Static shells + React islands (`client:load`).** New routes are emitted by `[...path].astro` as static shells; all sales logic lives in islands (`BuyWidget`, `OrderFlow` incl. `DeliveryForm`). *Alternative (SSR/hybrid + proxy):* rejected — adds adapter, secrets handling, and server surface for endpoints that are public by design.

**D2 — Separate public client `src/lib/api/sales.ts`.** Built on `safeFetch` (timeout/retry/`FetchError`), reads `import.meta.env.PUBLIC_API_BASE_URL`, sends no `Authorization` header, parses the `{status,message,data}` error envelope into typed errors. *Alternative (reuse `apiFetch`):* rejected — would inline `API_TOKEN` into the browser bundle.

**D2b — Single backend URL.** `PUBLIC_API_BASE_URL` is the only backend URL var: `apiFetch` (build-time) and `sales.ts` (browser) share it, so the baked catalog and live purchases can never target different backends. `API_BASE_URL` removed from code, `env.d.ts`, Dockerfile, `.env`, and docs. `API_TOKEN` stays server-only.

**D3 — Buy widget replaces the mailto CTA** in `ArtworkInfoPanel` (per locked decision), positioned in the same normal-flow slot the CTA occupied (keeps the `gap-8` rhythm + short-viewport behavior from `artwork-detail-page`). Currency defaults by page language (`es`→MXN, `en`→USD), user-overridable. Empty/invalid email submit raises an inline error, highlights (`border-crimson`) and focuses the field (`aria-invalid` + `role="alert"`); the error clears on typing and the same focus path applies to server 400s. Badges: `available` → widget; `reserved` → "sale in progress"; `sold` → "sold"; `on_loan`/`not_available`/unknown → "not available" (fail-closed rendering). `ArtworkStatus` type extended to the 5-value backend enum (verified in `artworks/models.py:257`).

**D4 — Cancel page links back to the stashed artwork.** Before redirecting to Stripe, the buy widget stashes the artwork slug in `sessionStorage`; the cancel page reads it and links back to that artwork (localized path). If no slug is stashed (direct visit), it falls back to `/obras`.

**D5 — Two-step delivery, single payload.** Step 1 contact (`receiver_name`, `receiver_phone`), step 2 address (7 remaining required + 5 optional); one `POST` on step-2 submit. Client mirrors backend max-lengths via native `required`/`maxLength` attributes (browser-localized bubbles); server `400.data` field errors render inline on the originating step (all errors recorded, navigates to the first error's step). `409` on submit = treat as success (idempotent re-submit).

**D6 — Polling: 3s interval, ~60s cap, 429-pause.** `404` while `pending_payment` → keep polling; any repeated non-404 error or 429 → pause with wait-and-retry (shared `artwork_orders` 60/h budget covers summary+delivery). Timeout → "payment confirming — check email / retry shortly" with manual retry (resumes polling). `data_complete`/`shipped`/`delivered` on first 200 → skip the form, show confirmation (+ shipping line when present).

**D7 — i18n: Spanish slugs both languages** (`/compra-exitosa/`, `/compra-cancelada/`, `/en/`-prefixed). New `routes.ts` entries, `getLocalizedPath`-compatible, `localizedPaths` threaded to `LangBtns` like artwork pages; copy in `src/messages/{es,en}.json`; `PageSEO` with `noIndex` on both shells + sitemap `filter` excluding `/compra-*`.

## Risks / Trade-offs

- [Stale build-time badge shows buy on a just-sold piece] → Mitigation: buy attempt is source of truth; 409 renders "another buyer is checking out", 404 renders "Obra no disponible". No silent failure.
- [Double-click buy creates confusion] → Mitigation: disable submit while in flight (backend reuses the session anyway; 200 same URL).
- [`PUBLIC_API_BASE_URL` misconfigured] → Mitigation: fail-fast missing-env error naming the var (mirrors `api-client` guidance behavior); documented per-env values in `.env.example`.
- [Polling burns the 60/h budget across tabs] → Mitigation: 429-pause + stop-on-200; single tab assumed, documented.
- [30-min Stripe expiry mid-form] → Mitigation: only affects pre-payment; post-payment states are terminal-safe (poll resumes, delivery is idempotent).
- [Catalog enum verified 5 values] → Mitigation: none needed; `ArtworkStatus` extended in scope (tasks 3.4), fail-closed badge for unknown values retained.

## Migration Plan

1. Land behind no flags (new routes/islands are additive; only the CTA swap changes an existing surface).
2. Set `PUBLIC_API_BASE_URL` per env; operator applies dashboard CORS + `PUBLIC_SITE_URL` notes, then runs the backend test checklist (`artwork-sales.md` § Frontend integration) against staging.
3. Rollback: revert re-exposes the mailto CTA; in-flight Stripe sessions/orders are backend-owned and unaffected.

## Open Questions

All gaps resolved during proposal review:
- Currency default → by page language (`es`→MXN, `en`→USD).
- Delivery validation → backend max-lengths only.
- Status enum → verified 5 values in backend (`available|reserved|sold|on_loan|not_available`).
- Poll cadence → 3s/60s per backend docs.
- Confirmation → summary + receipt note, no folio.
- Tracking → zero client-side events in v1 (confirmed); funnel derived from `ArtworkOrder.status` + Stripe Dashboard. Backend has no behavioral tracking affordances (no IP/UA/referrer/UTM fields; `views_count` dormant); mid-funnel analytics deferred as new scope.
- Env → single `PUBLIC_API_BASE_URL` (consolidated post-review; `API_BASE_URL` removed everywhere).
- Sitemap → `/compra-*` excluded via sitemap `filter` (noIndex alone sends mixed signals).
- Email UX → inline error + highlight + focus + ARIA, clears on typing (explicit user requirement).
