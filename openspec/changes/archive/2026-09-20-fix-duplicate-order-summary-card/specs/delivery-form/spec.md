## MODIFIED Requirements

### Requirement: Delivery submit states
On `200` the system SHALL lift completion to the parent (`OrderFlow`), which renders the purchase confirmation (order is `data_complete`); `DeliveryForm` SHALL NOT render its own confirmation screen. On `409` (not awaiting data, e.g. re-submit) it SHALL fetch the fresh summary and lift it the same way. On `400` it SHALL render per-field errors from `data` on the originating step. On `404` (unknown order slug) it SHALL show an order-not-found state with a catalog link. On `429` it SHALL show wait-and-retry without losing entered data.

#### Scenario: Successful delivery shows confirmation
- **WHEN** the delivery request returns `200`
- **THEN** the form reports the fresh summary to the parent and the parent's confirmation screen renders

#### Scenario: Re-submit is treated as success
- **WHEN** the delivery request returns `409`
- **THEN** the form fetches the fresh summary, reports it to the parent, and the parent's confirmation screen renders (not an error)

#### Scenario: Field errors return to their step
- **WHEN** the delivery request returns `400` with per-field errors
- **THEN** the errors render inline on the step owning each field with input preserved

#### Scenario: Unknown order shows not-found
- **WHEN** the delivery request returns `404`
- **THEN** an order-not-found state renders with a catalog link

### Requirement: Confirmation content
The confirmation screen (rendered by the parent `OrderFlow` `complete` branch) SHALL show exactly one order summary (artwork title, image, amount + currency, artist) plus a status-aware note (`shipped` / `delivered` / receipt note by order status). It SHALL NOT invent a folio or reference number. `DeliveryForm` SHALL NOT render a summary card in its success path.

#### Scenario: Confirmation shows summary and receipt note
- **WHEN** the order reaches `data_complete` via this form or a prior submit
- **THEN** exactly one summary and the status-appropriate note render
