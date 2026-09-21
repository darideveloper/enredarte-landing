## Why

On `/obras/{slug}` the price above the buy form never updates when the visitor switches MXN ↔ USD. The price is rendered by the `ArtworkPurchase` island from page `lang`, while the currency `<select>` owns private state inside the child `BuyWidget` — a split-brain within a single island. Visitors see one currency selected but the other currency's price, which erodes trust at the conversion point.

## What Changes

- Lift currency state from `BuyWidget` up to `ArtworkPurchase`: the island owns `currency`, renders `price = formatPrice(pickPrice(...))` from it, and passes `currency + onCurrencyChange` down.
- Make `BuyWidget` a controlled form component: no local currency state; `<select>` reflects the prop and notifies the parent on change.
- Normalize the currency type split at one point: display type `Currency` (`MXN`/`USD`) in the island, lowercase `SalesCurrency` (`mxn`/`usd`) only at the `postBuy()` call site.
- Keep everything else untouched: baked-first render, live-status reconcile, validation, error matrix, Stripe redirect, slug stash, island boundary (`client:load` in `ArtworkInfoPanel`).
- Missing-price behavior: the currency option with no listed price (neither live nor baked) is disabled in the selector, so the visitor can never select into an empty price; the initial currency prefers the lang default and falls back to the available one.

## Capabilities

### New Capabilities

(none — this is a bug fix within existing behavior, no new capability)

### Modified Capabilities

- `artwork-purchase`: the currency selector's state ownership moves from `BuyWidget`-local to the `ArtworkPurchase` island; the buy request still sends the selected currency.
- `price-formatting`: the artwork purchase zone is now an explicit exception to the "URL language is the only source of truth" rule — inside the purchase zone on the artwork detail page, the visitor-selected currency drives the displayed price; all other surfaces (cards, banners, hero) keep the lang-driven rule.

## Impact

- Code: `src/components/organisms/ArtworkPurchase.tsx`, `src/components/organisms/BuyWidget.tsx` only. No Astro, routing, i18n, or API contract changes.
- Risk: low — one parent/child prop change inside an already-hydrated island; no new dependencies, no store, no second island.
