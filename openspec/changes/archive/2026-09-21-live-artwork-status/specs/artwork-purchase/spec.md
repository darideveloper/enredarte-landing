## MODIFIED Requirements

### Requirement: Buy widget on available artworks
The system SHALL render a buy widget in the artwork info panel when the artwork's reconciled `status` (live status when the status check succeeds, otherwise the baked catalog snapshot) is `available`. The widget SHALL contain a currency selector (`mxn`/`usd`, defaulted by page language: `es`→`mxn`, `en`→`usd`), an email input with standard email validation, and a submit action. The submit button SHALL be disabled while the buy request is in flight.

#### Scenario: Available artwork shows the widget
- **WHEN** an artwork page renders for an artwork with reconciled `status == "available"`
- **THEN** the buy widget (currency selector + email input + submit) renders in the info panel's conversion slot

#### Scenario: Empty email submit raises a focused error
- **WHEN** the form is submitted with an empty or invalid email
- **THEN** no request fires, an inline error renders, the field is highlighted and focused (`aria-invalid`, `role="alert"`), and the error clears when the user types

### Requirement: Status badges for non-available artworks
The catalog status enum has five values (`available`, `reserved`, `sold`, `on_loan`, `not_available` — backend `ArtworkStatus`). The system SHALL render a non-interactive badge instead of the widget when the reconciled `status` (live status when the status check succeeds, otherwise the baked catalog snapshot) is `reserved` ("sale in progress"), `sold` ("sold"), or `on_loan`/`not_available`/any other value ("not available"). No buy button SHALL render in these states.

#### Scenario: Reserved artwork shows badge
- **WHEN** an artwork page reconciles to `status == "reserved"`
- **THEN** a "sale in progress" badge renders and no buy button exists

#### Scenario: Sold artwork shows badge
- **WHEN** an artwork page reconciles to `status == "sold"`
- **THEN** a "sold" badge renders and no buy button exists

#### Scenario: On-loan artwork shows not-available badge
- **WHEN** an artwork page reconciles to `status == "on_loan"` or `"not_available"`
- **THEN** a "not available" badge renders and no buy button exists

#### Scenario: Unknown status fails closed
- **WHEN** an artwork page reconciles to an unrecognized status value
- **THEN** a "not available" badge renders and no buy button exists
