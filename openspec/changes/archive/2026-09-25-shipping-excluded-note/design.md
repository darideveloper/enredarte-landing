## Context

The artwork detail page (`ArtworkPage` → `ArtworkInfoPanel` → `ArtworkPurchase` island, `client:load`) renders the baked price snapshot first, then reconciles once against the live status endpoint. The purchase zone owns price + status + `BuyWidget` (currency/email/CTA). Post-payment, the static `compra-exitosa` shell hosts `OrderFlow`, which polls `GET orders/:slug/` and branches on `paid_pending_data` (`ready`: card + `DeliveryForm`) vs terminal (`complete`: header + one card). `OrderSummaryCard` already accepts an optional `note`. i18n flows via `getTranslations(lang)` in Astro and travels into islands as props. DESIGN.md constrains the treatment: crimson ≤10% of screen, muted uppercase metadata layer, sharp geometry, flat-by-default.

## Goals / Non-Goals

**Goals:**
- One quiet notice at the price decision point plus one reuse next to the charged amount pre-delivery-details.
- Zero conversion-cost styling: muted metadata tone, no layout shift, no new interaction.

**Non-Goals:**
- Catalog grids (`CardSummary`/`CardInfo`), banner copy, Terms, Stripe Checkout page, CTA behavior, pricing logic, sales API contract.

## Decisions

**D1 — Prop-drilled static string (over island-internal `t()` or new store).**
`ArtworkInfoPanel` resolves `t("pages.purchase.shippingNote")` and passes it down; `SuccessPage` → `OrderFlow` → `OrderSummaryCard note` likewise. Rationale: matches the island contract (all copy via props, byte-identical baked first paint, no hydration mismatch); the string never varies with currency or live state. Alternative (island imports translations) breaks the established pattern and risks baked/live markup divergence.

**D2 — Visibility derived from existing reconciled state (over new state).**
`shippingNote` renders iff `price !== "" && status === "available"`. Rationale: no new `useState`/`useEffect`; live-reconcile, currency fallback, and empty-price paths all flow through unchanged. Alternatives (separate flag, showing on sold/consult states) add branches for surfaces with no purchase action.

**D3 — Same muted treatment as the status label (over accent/box/icon/tooltip).**
`text-[11px] uppercase tracking-[0.14em] font-sans text-muted`, plain `<p>`, no crimson, no border, no ⓘ. Rationale: reads as gallery metadata, preserves the Crimson Rule and Persuade-mode calm; tooltip fails on mobile/a11y, banner/box shouts "extra cost" at the anchor moment. Literal string keeps its `+` prefix; `uppercase` normalizes casing to the metadata layer.

**D4 — Reuse `OrderSummaryCard note` in `ready` only (over new slot or concatenating in `complete`).**
Rationale: the slot exists and is empty in `ready`; `complete` already owns its note semantics (receipt/shipped/delivered — shipping resolved by then). Concatenation would mix pre- and post-delivery meanings in one line.

## Risks / Trade-offs

- [Risk] Grid prices stay bare (scope decision) → a buyer may first see a bare price in discovery. Mitigation: accepted; detail page is the transaction surface, and grids gain noise fast. Revisit if complaints trace to grid→detail.
- [Risk] Banner "Envío asegurado DHL/FedEx" still implies inclusion → Mitigation: out of scope by choice (changing it is llamativo); the two quiet touches bracket decision + charge.
- [Risk] `uppercase` renders the ES string as `+ GASTOS DE ENVÍO`, slightly louder than verbatim → Mitigation: keep for system consistency; alternatively drop `uppercase` for `text-xs` verbatim — one-line swap at implementation.
- [Risk] External Stripe page can't carry the note → Mitigation: pre-redirect touch (A) is the last owned surface; post-payment touch (F-light) confirms.

## Migration Plan

No migration. Additive i18n keys + conditional render; rollback = revert the change. No backend, env, or route changes.

## Open Questions

None blocking. Casing (`uppercase` vs verbatim) is the only stylistic loose end, decidable at implementation.
