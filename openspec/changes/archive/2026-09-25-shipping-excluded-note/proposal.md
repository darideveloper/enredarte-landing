## Why

Sale prices exclude delivery, which is agreed with the buyer after the sale. Buyers currently see a bare price plus an "insured shipping DHL/FedEx" banner, which reads as shipping-included and creates a post-payment trust risk. A quiet, gallery-toned notice is needed at the decision point without hurting conversion.

## What Changes

- Adds a muted microcopy line `"+ Gastos de envío"` (ES) / `"+ Shipping costs"` (EN) under the price in the artwork purchase zone (`ArtworkPurchase`), visible only when a purchasable price renders and status is `available`.
- Surfaces the same short string as the `note` of `OrderSummaryCard` in the `ready` (`paid_pending_data`) phase of `OrderFlow` on `compra-exitosa`.
- Adds one i18n key pair (`pages.purchase.shippingNote`) in `es.json` / `en.json`; copy travels via props (no island-internal i18n).
- No API, sales-contract, pricing-logic, or CTA-behavior changes. Catalog grids, banner, and `complete`-phase confirmation notes are untouched.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `artwork-purchase`: purchase zone gains a conditional shipping-excluded microcopy line tied to price/status reconciliation.
- `order-confirmation`: ready-phase summary card gains the same shipping-excluded note; complete-phase notes unchanged.

## Impact

- Touched: `src/components/organisms/ArtworkPurchase.tsx`, `src/components/molecules/ArtworkInfoPanel.astro`, `src/components/organisms/OrderFlow.tsx`, `src/components/pages/compra/SuccessPage.astro`, `src/messages/es.json`, `src/messages/en.json`.
- Systems: i18n (new key pair), SSG baked props + live-status reconciliation (visibility only), `compra-exitosa` static shell (prop plumbing).
- Docs: `docs/component-dependencies.md` refresh on main post-merge per repo rule (conditional — only if merged diff touches pages/components/imports).
