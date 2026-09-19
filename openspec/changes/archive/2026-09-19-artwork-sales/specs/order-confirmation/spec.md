## ADDED Requirements

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
