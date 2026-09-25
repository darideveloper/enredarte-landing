## 1. Copy

- [x] 1.1 Add `pages.purchase.shippingNote` = `"+ Gastos de envío"` to `src/messages/es.json`
- [x] 1.2 Add `pages.purchase.shippingNote` = `"+ Shipping costs"` to `src/messages/en.json`

## 2. Purchase zone (Touch A)

- [x] 2.1 Add `shippingNote: string` to `ArtworkPurchaseProps` and render it between price and status, guarded by `price !== "" && status === "available"`, with the muted metadata treatment
- [x] 2.2 Resolve `t("pages.purchase.shippingNote")` in `ArtworkInfoPanel.astro` and pass it to `ArtworkPurchase`

## 3. Success flow (Touch F-light)

- [x] 3.1 Accept the shipping note in `OrderFlow` (extend `OrderFlowCopy` or add a prop) and pass it as `note` to `OrderSummaryCard` in the `ready` branch only
- [x] 3.2 Resolve `t("pages.purchase.shippingNote")` in `SuccessPage.astro` and forward it to `OrderFlow`

## 4. Verification

- [x] 4.1 Run `pnpm astro check` and `pnpm run build` with no missing-key (`MISSING:`) errors
- [x] 4.2 Eyeball ES + EN: detail page (available / sold / no-price) and `compra-exitosa?order=` ready phase, desktop + mobile — note reads as metadata, no layout shift, crimson ratio unchanged
