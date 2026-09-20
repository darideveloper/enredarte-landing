## Context

`/compra-exitosa/` is a static shell (`[...path].astro` → `SuccessPage.astro`) hosting the React `OrderFlow`, which polls `GET orders/:slug/` and branches on `paid_pending_data` (`ready`: summary card + `DeliveryForm`) vs terminal statuses (`complete`: thank-you header + one `OrderSummaryCard`).

The bug: the `ready` branch (`OrderFlow.tsx:133-139`) keeps its own `<OrderSummaryCard>` mounted while `DeliveryForm`'s internal `done` state (`DeliveryForm.tsx:153-159`) renders a second card with the receipt note. Result: card → "¡Gracias por su compra!" → card. The `complete` branch (pre-completed orders) already renders the correct single-card layout, so the fix converges the post-submit path onto it.

Constraints: no API, copy, routing, or SEO changes; keep the `409` idempotent re-submit behavior; preserve per-field `400` errors and `404`/`429` states untouched.

## Goals / Non-Goals

**Goals:**
- Post-submit confirmation renders exactly one summary card, owned by `OrderFlow`'s `complete` branch.
- `DeliveryForm` becomes form-only: it reports success upward and unmounts.
- Confirmation note becomes status-aware on the post-submit path (`shipped` / `delivered` / `receiptNote`), matching the pre-completed path.

**Non-Goals:**
- No polling, validation, copy, styling, or endpoint changes.
- No new components or state libraries.

## Decisions

**D1 — Lift completion via `onComplete(summary)` callback (Option A).**
`DeliveryForm` gains `onComplete: (summary: OrderSummary) => void`; `OrderFlow` passes `summary => setPhase({ kind: "complete", summary })`. The form's `done` state and its confirmation render are deleted; success paths (`200`, `409` + fresh `GET`) call `onComplete` instead of `setDone`. The form's `confirmation` prop is removed with the branch (interface, signature, call-site); `OrderFlow` keeps its own `confirmation` prop for the `complete` branch.
- *Why:* single owner for the confirmation render; reuses the already-correct `complete` branch; fixes the note-correctness gap for free.
- *Alternatives considered:* (B) parent conditionally hides its card — leaves two confirmation render sites; (C) child renders header only — splits one visual unit across components and keeps note logic duplicated. Both rejected as higher long-term confusion for equal line count.

**D2 — Keep `DeliveryForm`'s error/terminal states local.**
`400` field errors, `404`, `429`/`terminal`, and step navigation stay inside the form; only the success terminal lifts.
- *Why:* only success changes what the parent renders; error states are form-scoped and already correct.

**D3 — No `sending` reset on the success path.**
Success unmounts the form via the phase transition, so `setSending(false)` is unnecessary there (and the current `409` early-return already omits it). Error paths keep their existing `setSending(false)`.
- *Why:* avoids dead state updates on an unmounted component; minimal diff.

## Risks / Trade-offs

- [Risk] `onComplete` identity re-created per render could retrigger form effects → Mitigation: form has no effect depending on the callback; `OrderFlow` can pass an inline arrow (no memo needed).
- [Risk] Type drift if `OrderSummary` shape changes → Mitigation: callback types reuse the existing `OrderSummary` import; compiler catches mismatch.
- [Trade-off] `DeliveryForm` can no longer render standalone confirmation (e.g. in Storybook) → Accept: it was never used standalone; the parent is its only consumer.

## Migration Plan

No migration. Two-file edit, no data or deployment steps. Rollback: revert the change; bug returns, nothing else breaks.

## Open Questions

- None. The only consumer of `DeliveryForm` is `OrderFlow`'s `ready` branch (verified by grep); no other call sites to update.
