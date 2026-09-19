## Why

Collectors can browse artworks but cannot buy them: purchase happens off-site by email today. The dashboard backend already exposes a complete Stripe one-off sales contract (reserve → Checkout → success redirect → delivery form), so the landing must implement its side — buy widget, success/cancel pages, delivery form, confirmation — or the backend sales flow stays unreachable.

## What Changes

- Buy widget on the artwork page (currency selector defaulting by page language `es`→MXN/`en`→USD + email) replacing the mailto CTA, calling `POST artworks/:slug/buy/`, stashing the artwork slug pre-redirect, and redirecting full-page to Stripe `checkout_url`.
- Status badges on artwork pages from catalog `status` (`available` → buy; `reserved` → "sale in progress"; `sold` → "sold"; `on_loan`/`not_available` → "not available"); buy attempt is source of truth for stale build-time status (graceful 409/404).
- Static success shell `/compra-exitosa/` (+ `/en/…`) reading `?order=` (dedicated missing-order state when absent), polling `GET orders/:slug/`, rendering summary + delivery entry point.
- Static cancel page `/compra-cancelada/` (+ `/en/…`) linking back to the stashed artwork.
- Two-step delivery form (contact → address; 9 required + 5 optional fields) posting `POST orders/:slug/delivery/`, then a confirmation screen (summary + receipt note).
- Token-free public sales API client (separate from the build-time token client) reading dashboard origin from `PUBLIC_API_BASE_URL`.
- Single backend URL: `PUBLIC_API_BASE_URL` feeds both build-time fetch (`apiFetch`) and browser sales calls; `API_BASE_URL` removed (client, `env.d.ts`, Dockerfile, `.env`, docs). `API_TOKEN` stays server-only.
- ES/EN copy for every new state, error, and badge; `noIndex` on success/cancel pages + sitemap exclusion for `/compra-*`.
- Buy widget email UX: empty/invalid submit raises an inline error, highlights and focuses the field (ARIA-wired), error clears on typing.
- ES/EN copy for every new state, error, and badge; `noIndex` on success/cancel pages.
- Dashboard-side needs (CORS origins, `PUBLIC_SITE_URL` dev mismatch, missing prod `PUBLIC_SITE_URL`) recorded as operator tasks — **no backend code changes in this change**.

## Capabilities

### New Capabilities

- `artwork-purchase`: buy widget UI + buy request + Stripe redirect + full error matrix (400/404/409/502/503/429) + status badges.
- `order-confirmation`: success shell + order polling + summary states (`paid_pending_data` / `data_complete` / `shipped` / `delivered`, timeout, 429-pause) + static cancel page.
- `delivery-form`: two-step delivery form + validation + delivery submit states (200/409-as-success/400/429) + confirmation screen.

### Modified Capabilities

- `artwork-detail-page`: the info-panel mailto inquiry CTA is replaced by the buy widget flow (spec-level behavior change of the panel's conversion action).
- `api-client`: add a token-free public client for the unauthenticated sales endpoints alongside the existing token-injecting build-time client (spec-level contract change: never send `API_TOKEN` from the browser).

## Impact

- `src/components/molecules/ArtworkInfoPanel.astro` (CTA swap), new React islands (`BuyWidget`, `OrderFlow`, `DeliveryForm`), `src/lib/api/sales.ts` (public client), `src/lib/api/client.ts` (single-URL), `[...path].astro` + `routes.ts` (2 new static routes × 2 langs), `src/messages/{es,en}.json`, `.env`/`.env.example`/Dockerfile/`env.d.ts` (single URL var), `astro.config.mjs` (sitemap filter), `docs/component-dependencies.md` regen.
- Backend: no code changes; operator checklist (CORS, `PUBLIC_SITE_URL` dev+prod) ships inside tasks as explicitly-marked backend notes.
- Stripe Checkout is the payment surface — no card handling in this repo; PCI scope unchanged.
