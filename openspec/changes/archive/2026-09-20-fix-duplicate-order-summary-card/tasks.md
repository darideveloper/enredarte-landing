## 1. DeliveryForm — lift completion

- [x] 1.1 Add `onComplete: (summary: OrderSummary) => void` to `DeliveryFormProps` and destructure it in the component signature.
- [x] 1.2 Replace `setDone(summary)` on `POST delivery/ → 200` with `onComplete(summary)`.
- [x] 1.3 Replace `setDone(await getOrderSummary(orderSlug))` on the `409` path with `onComplete(...)` of the fresh summary.
- [x] 1.4 Remove the `done` state and its confirmation render branch (the `if (done)` block with `<h2>` + `<OrderSummaryCard>`); remove the now-unused `OrderSummaryCard` value import; keep the `OrderSummary` type import for the new callback signature.
- [x] 1.5 Remove the now-unused `confirmation` prop from `DeliveryFormProps`, from the destructured component signature, and from the `<DeliveryForm …>` call-site in `OrderFlow.tsx`; remove the now-unused `ConfirmationCopy` import in `DeliveryForm.tsx`. (`OrderFlow` keeps its own `confirmation` prop for the `complete` branch; `SuccessPage.astro` is untouched.)

## 2. OrderFlow — own the confirmation

- [x] 2.1 Pass `onComplete={(summary) => setPhase({ kind: "complete", summary })}` to `DeliveryForm` in the `ready` branch.
- [x] 2.2 Verify the `ready` branch still renders `<OrderSummaryCard>` + form pre-submit, and the existing `complete` branch renders the thank-you header + single card with status-aware note post-submit.

## 3. Verification

- [x] 3.1 Run `tsc` / build to confirm no type errors (callback signature, removed imports).
- [x] 3.2 Manually verify on `/compra-exitosa/?order=<paid_pending_data-slug>`: submit full address + contact → exactly one summary card under "¡Gracias por su compra!" with receipt note; re-submit (`409`) → same single-card confirmation; pre-completed order → unchanged single-card `complete` render.
