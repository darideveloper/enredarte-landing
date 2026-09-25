# order-confirmation Specification

## Purpose
Post-payment landing: success shell with order polling and summary states, plus the static cancel page.

## Requirements

### Requirement: Success and cancel routes in both languages
The system SHALL emit static routes `/compra-exitosa/` and `/compra-cancelada/` (Spanish) plus `/en/compra-exitosa/` and `/en/compra-cancelada/` (English) through the existing catch-all, with slug-preserving language switch and `noIndex` SEO.

#### Scenario: Spanish success page exists
- **WHEN** `/compra-exitosa/?order=<slug>` is requested
- **THEN** the Spanish success shell renders

#### Scenario: English success page exists
- **WHEN** `/en/compra-exitosa/?order=<slug>` is requested
- **THEN** the English success shell renders

#### Scenario: Transactional pages are not indexed
- **WHEN** a crawler reads the success or cancel page
- **THEN** it finds a `noindex` directive

#### Scenario: Transactional pages excluded from sitemap
- **WHEN** the sitemap is generated
- **THEN** no `/compra-*` URL is listed

### Requirement: Order polling with backstop
The success page SHALL read `order` from the query string and poll `GET orders/:slug/` every 3s up to ~60s while receiving `404` (unpaid `pending_payment`). On `200` it SHALL stop polling. On timeout it SHALL show a "payment confirming — check email / retry shortly" state with a manual retry that resumes polling.

#### Scenario: Summary arrives after webhook
- **WHEN** polling receives `200` with the 8-field summary
- **THEN** polling stops and the summary (title, image, amount + currency, artist) renders

#### Scenario: Polling times out
- **WHEN** ~60s elapse with only `404` responses
- **THEN** the timeout state renders with a retry action that resumes polling

### Requirement: Polling honors terminal and error states
The system SHALL stop polling and show confirmation directly when the first `200` has `status` `data_complete`, `shipped`, or `delivered` (showing shipping status when present). On repeated non-404 errors or `429` it SHALL pause polling with a wait-and-retry state.

#### Scenario: Already-completed order skips the form
- **WHEN** the first `200` reports `data_complete`
- **THEN** the purchase confirmation renders without the delivery form

#### Scenario: Throttled polling pauses
- **WHEN** the summary endpoint returns `429`
- **THEN** polling pauses and a "wait and retry" state renders

### Requirement: Missing order param shows a dedicated state
When the success page is opened without an `order` query param, the system SHALL show a "no order specified — check the link" state with a catalog link instead of polling.

#### Scenario: No order param, no polling
- **WHEN** `/compra-exitosa/` is requested without `?order=`
- **THEN** the missing-order state renders and no summary request fires

### Requirement: Cancel page links back to the stashed artwork
The cancel page SHALL render a "purchase cancelled" message with a link to the artwork slug stashed in `sessionStorage` by the buy widget (localized artwork path). When no slug is stashed, it SHALL link to the localized `/obras` index instead.

#### Scenario: Stashed artwork linked
- **WHEN** `/compra-cancelada/` renders with a stashed artwork slug
- **THEN** a link to that localized artwork page is present

#### Scenario: No stash falls back to catalog
- **WHEN** `/compra-cancelada/` renders with no stashed slug
- **THEN** a link to the localized `/obras` index is present

### Requirement: Single confirmation render after delivery submit
After the delivery form submits successfully, the system SHALL render exactly one order summary card together with the purchase confirmation header. The pre-submit summary card SHALL unmount when the confirmation renders.

#### Scenario: Post-submit confirmation shows one card
- **WHEN** the delivery request returns `200` (or `409` resolved to a fresh summary)
- **THEN** one confirmation header and exactly one summary card render, and the delivery form unmounts

#### Scenario: No stacked cards
- **WHEN** the confirmation renders after submit
- **THEN** no second summary card without a receipt note remains visible above or below it

### Requirement: Shipping-excluded note on the ready-phase summary card
The success flow SHALL pass the short shipping-excluded string (`pages.purchase.shippingNote`) as the `note` of `OrderSummaryCard` in the `ready` (`paid_pending_data`) phase, so the buyer sees it next to the charged amount before completing delivery details. The `complete`-phase notes (receipt / shipped / delivered) SHALL remain unchanged.

#### Scenario: Ready phase shows the shipping note
- **WHEN** polling resolves to `paid_pending_data` with a summary
- **THEN** the summary card renders with the shipping-excluded note above the delivery form

#### Scenario: Complete phase keeps existing notes
- **WHEN** the order is `data_complete`, `shipped`, or `delivered` (or the delivery form just completed)
- **THEN** the single summary card renders with the existing receipt/shipping-status note, not the shipping-excluded string
