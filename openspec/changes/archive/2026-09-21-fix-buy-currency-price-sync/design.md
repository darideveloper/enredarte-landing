## Context

Route `/obras/{slug}` (`es`) / `/en/obras/{slug}` (`en`) is SSG via `src/pages/[...path].astro` → `ArtworkPage.astro` (static) → `ArtworkInfoPanel.astro` (static) → `<ArtworkPurchase client:load>` — the only React island on the page. `ArtworkPurchase.tsx` renders the price line + status label and conditionally the `BuyWidget` form. `BuyWidget.tsx` renders the currency `<select>`, email input, and submit that `POST`s `artworks/:slug/buy/`.

Current bug: displayed currency is derived from `lang` in the parent (`currencyForLang(lang)`), while the selector mutates private `useState` in the child. The two never meet, so the price label is frozen at the lang default.

Constraints: keep the island boundary (no Astro change), keep baked-first render + fire-and-forget live reconcile (`getArtworkLiveStatus`), keep the buy error matrix and Stripe redirect untouched. Minimal/YAGNI: no store, no context, no second island.

## Goals / Non-Goals

**Goals:**
- Toggling the currency selector re-renders the price line in the same island, using live prices when reconciled, baked prices otherwise.
- `BuyWidget` becomes controlled; `ArtworkPurchase` is the single source of truth for `currency`. The now-unused `lang` prop is removed from `BuyWidget` (parent keeps `lang` for the initial default).
- One casing-normalization point between display (`MXN`/`USD`) and API (`mxn`/`usd`).
- A currency option with no listed price is disabled in the selector; the initial currency prefers the lang default and falls back to the available one.

**Non-Goals:**
- No change to live-status fetching, badge logic, email validation, error mapping, redirect, or `sessionStorage` stash.
- No persistence of the visitor's currency choice across pages/reloads.
- No changes to cards, banners, hero, or any other price surface.

## Decisions

**D1 — Lift `currency` state to `ArtworkPurchase` (over: move price down / shared store).**
Parent owns `useState<Currency>(() => initialCurrency(lang, bakedPriceMxn, bakedPriceUsd))` (lang default with fallback to the priced currency), derives `price` from it, passes `currency + onCurrencyChange` plus reconciled prices to the child, and corrects the selection if live prices invalidate it. Rationale: `ArtworkPurchase` is already documented as the "purchase zone" owner (live-status spec); the price label and the selector are both its concerns. Alternatives: (a) rendering the price inside `BuyWidget` — splits the zone's UI incoherently (status label stays up, price moves down); (b) two islands + nanostore/event — hydration ordering risk and over-engineering for one parent/child pair.

**D2 — `BuyWidget` becomes fully controlled (over: two-way sync via effect).**
Child receives `currency: Currency` + `onCurrencyChange: (c: Currency) => void`, drops its `useState` and its `lang` prop (only ever used for the currency default). Rationale: single source of truth, no sync effects, no stale-closure risk.

**D3 — Normalize casing at the `postBuy` call site.**
Island + `BuyWidget` props use `Currency` (`MXN`/`USD`, matching `price.ts`); `submit()` maps `currency.toLowerCase()` to `SalesCurrency` for the request body. Rationale: display code and price helpers speak uppercase; the API speaks lowercase. One conversion point beats threading both types through props.

**D4 — Currency option with no price is disabled (hide as last-resort fallback).**
`ArtworkPurchase` passes the reconciled `priceMxn`/`priceUsd` down so `BuyWidget` disables the `<option>` lacking a positive price. Initial currency prefers `currencyForLang(lang)` and falls back to whichever currency has a price. Rationale: the visitor can never select into an empty price line, which is exactly the confusion this change fixes. If neither currency has a price, both options disable and the price line hides via the existing `formatPrice` → `""` path; the backend remains authoritative at buy time and its 4xx states are already handled.

## Risks / Trade-offs

- [Risk] `BuyWidget` is only used by `ArtworkPurchase` today (verified by grep), but if a second caller appears it must now supply `currency` → Mitigation: required props make this a compile error, not a silent bug.
- [Risk] Visitor lands on an artwork with no price in either currency → Mitigation: both options disable, price line hides (existing `formatPrice` → `""` path); backend validates at buy time and the widget's existing 400/404/409/429/5xx matrix covers it.
- [Risk] Live reconcile swaps `priceMxn/priceUsd` under a visitor-selected currency → Mitigation: price is derived from `(live ?? baked)` + current `currency`, and a correction effect falls over to the other currency when the selected one loses its price while the other keeps one; if neither has a price the line hides and the backend remains authoritative at buy time.
