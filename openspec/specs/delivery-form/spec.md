# delivery-form Specification

## Purpose
Two-step delivery data capture for paid orders and the purchase confirmation screen.

## Requirements

### Requirement: Two-step delivery form
When the order summary has `status == "paid_pending_data"`, the system SHALL show a two-step form: step 1 contact (`receiver_name`, `receiver_phone`), step 2 address (`country`, `state`, `city`, `postal_code`, `neighborhood`, `street`, `exterior_number` required; `interior_number`, `between_street_1`, `between_street_2`, `reference`, `delivery_notes` optional). Client-side validation SHALL mirror backend max-lengths. A single `POST orders/:slug/delivery/` with all 14 fields SHALL fire on step-2 submit.

#### Scenario: Paid order shows step one
- **WHEN** the summary reports `paid_pending_data`
- **THEN** the delivery form renders starting at the contact step

#### Scenario: Address step submits the full payload
- **WHEN** the user completes step 2 and submits
- **THEN** one delivery request carries all required and optional fields

### Requirement: Delivery submit states
On `200` the system SHALL show the purchase confirmation (order is `data_complete`). On `409` (not awaiting data, e.g. re-submit) it SHALL also show confirmation. On `400` it SHALL render per-field errors from `data` on the originating step. On `404` (unknown order slug) it SHALL show an order-not-found state with a catalog link. On `429` it SHALL show wait-and-retry without losing entered data.

#### Scenario: Successful delivery shows confirmation
- **WHEN** the delivery request returns `200`
- **THEN** the confirmation screen renders

#### Scenario: Re-submit is treated as success
- **WHEN** the delivery request returns `409`
- **THEN** the confirmation screen renders (not an error)

#### Scenario: Field errors return to their step
- **WHEN** the delivery request returns `400` with per-field errors
- **THEN** the errors render inline on the step owning each field with input preserved

#### Scenario: Unknown order shows not-found
- **WHEN** the delivery request returns `404`
- **THEN** an order-not-found state renders with a catalog link

### Requirement: Confirmation content
The confirmation screen SHALL show the order summary (artwork title, image, amount + currency, artist) plus a receipt/email note. It SHALL NOT invent a folio or reference number.

#### Scenario: Confirmation shows summary and receipt note
- **WHEN** the order reaches `data_complete` via this form or a prior submit
- **THEN** the summary and the receipt note render
