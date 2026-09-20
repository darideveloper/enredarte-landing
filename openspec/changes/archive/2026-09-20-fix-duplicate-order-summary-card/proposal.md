## Why

After submitting the delivery form on `/compra-exitosa/` (`?order=<slug>`), the artwork summary card renders twice: the pre-submit card stays mounted while the form's own success state renders a second card with the receipt note. Users see a duplicated "Cien miradas" card stacked above the "¡Gracias por su compra!" block — a visible trust-breaking bug on the money moment.

## What Changes

- `OrderFlow` becomes the single owner of the confirmation render: on delivery success it transitions `ready → complete` and renders the thank-you header + one `OrderSummaryCard` via the existing `complete` branch.
- `DeliveryForm` stops self-rendering the confirmation (`done` branch removed); on `POST delivery/ → 200` (or `409` + fresh `GET` summary) it reports the fresh `OrderSummary` upward via an `onComplete` callback instead of local `setDone`.
- Confirmation note logic unifies on the `complete` branch (`shipped` / `delivered` / `receiptNote` by status) instead of the form's hardcoded `receiptNote`.
- No route, copy, SEO, polling, validation, or API-contract changes.

## Capabilities

### New Capabilities

- None — this is a render-ownership bugfix, not a new capability.

### Modified Capabilities

- `order-confirmation`: confirmation after delivery submit SHALL render exactly one summary card (currently renders two on the post-submit path; the pre-completed `complete` path already renders one).
- `delivery-form`: successful submit SHALL lift completion to the parent via callback instead of rendering its own confirmation screen.

## Impact

- Affected code: `src/components/organisms/OrderFlow.tsx` (ready branch + `complete` transition), `src/components/organisms/DeliveryForm.tsx` (remove `done` state/render, add `onComplete` prop).
- No API, i18n copy, routing, or backend changes. Risk is low and localized to the success shell; the `complete` branch already exercised by pre-completed orders covers the target render.
