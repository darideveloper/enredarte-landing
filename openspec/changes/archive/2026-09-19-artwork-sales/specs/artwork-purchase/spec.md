## ADDED Requirements

### Requirement: Buy widget on available artworks
The system SHALL render a buy widget in the artwork info panel when the artwork's catalog `status` is `available`. The widget SHALL contain a currency selector (`mxn`/`usd`, defaulted by page language: `es`→`mxn`, `en`→`usd`), an email input with standard email validation, and a submit action. The submit button SHALL be disabled while the buy request is in flight.

#### Scenario: Available artwork shows the widget
- **WHEN** an artwork page renders for an artwork with `status == "available"`
- **THEN** the buy widget (currency selector + email input + submit) renders in the info panel's conversion slot

#### Scenario: Empty email submit raises a focused error
- **WHEN** the form is submitted with an empty or invalid email
- **THEN** no request fires, an inline error renders, the field is highlighted and focused (`aria-invalid`, `role="alert"`), and the error clears when the user types

### Requirement: Buy request redirects to Stripe Checkout
On submit with a valid email and currency, the system SHALL `POST artworks/:slug/buy/` with `{currency, email}` and on `201` (new reservation) or `200` (same-buyer live session) perform a full-page redirect to the returned `checkout_url`.

#### Scenario: Successful buy redirects
- **WHEN** the buy request returns `201` or `200` with `{checkout_url}`
- **THEN** the browser performs a full-page navigation to `checkout_url`

#### Scenario: Same buyer re-click follows the live session
- **WHEN** the buy request returns `200` (same email, live session)
- **THEN** the browser follows the returned URL exactly as for `201`

### Requirement: Artwork slug stashed before Stripe redirect
Before performing the full-page redirect to `checkout_url`, the system SHALL stash the artwork slug in `sessionStorage` so the cancel page can link back to the artwork.

#### Scenario: Slug available on return
- **WHEN** the buy request succeeds and the redirect fires
- **THEN** `sessionStorage` holds the artwork slug prior to navigation

### Requirement: Buy error states
The system SHALL map buy failures to UI states: `400` → inline field errors from `data`; `404` → "Obra no disponible" page; `409` → "another buyer is checking out / not available, retry" state; `502`/`503`/`429` → retry-later states (429 names the wait). Nothing SHALL be reserved client-side on `502`.

#### Scenario: Field errors render inline
- **WHEN** the buy request returns `400` with per-field errors in `data`
- **THEN** each error renders next to its field and the form stays editable

#### Scenario: Reserved by another buyer
- **WHEN** the buy request returns `409`
- **THEN** the widget shows a "sale in progress, try again in a few minutes" state with no redirect

#### Scenario: Service failures offer retry
- **WHEN** the buy request returns `502`, `503`, or `429`
- **THEN** the widget shows a retry-later state and the user can resubmit

### Requirement: Status badges for non-available artworks
The catalog status enum has five values (`available`, `reserved`, `sold`, `on_loan`, `not_available` — backend `ArtworkStatus`). The system SHALL render a non-interactive badge instead of the widget when `status` is `reserved` ("sale in progress"), `sold` ("sold"), or `on_loan`/`not_available`/any other value ("not available"). No buy button SHALL render in these states.

#### Scenario: Reserved artwork shows badge
- **WHEN** an artwork page renders with `status == "reserved"`
- **THEN** a "sale in progress" badge renders and no buy button exists

#### Scenario: Sold artwork shows badge
- **WHEN** an artwork page renders with `status == "sold"`
- **THEN** a "sold" badge renders and no buy button exists

#### Scenario: On-loan artwork shows not-available badge
- **WHEN** an artwork page renders with `status == "on_loan"` or `"not_available"`
- **THEN** a "not available" badge renders and no buy button exists

#### Scenario: Unknown status fails closed
- **WHEN** an artwork page renders with an unrecognized status value
- **THEN** a "not available" badge renders and no buy button exists
