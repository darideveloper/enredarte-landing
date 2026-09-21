## MODIFIED Requirements

### Requirement: Buy widget on available artworks
The system SHALL render a buy widget in the artwork info panel when the artwork's reconciled `status` (live status when the status check succeeds, otherwise the baked catalog snapshot) is `available`. The widget SHALL contain a currency selector (`MXN`/`USD`, defaulted by page language: `es`→`MXN`, `en`→`USD`), an email input with standard email validation, and a submit action. The selected currency SHALL be owned by the `ArtworkPurchase` island (single source of truth) and passed to the buy form as a controlled value; changing the selector SHALL update the selection everywhere in the purchase zone. The submit button SHALL be disabled while the buy request is in flight.

#### Scenario: Available artwork shows the widget
- **WHEN** an artwork page renders for an artwork with reconciled `status == "available"`
- **THEN** the buy widget (currency selector + email input + submit) renders in the info panel's conversion slot

#### Scenario: Currency selector drives the whole purchase zone
- **WHEN** the visitor changes the currency selector
- **THEN** the displayed price updates to the selected currency and the subsequent buy request sends the selected currency

#### Scenario: Currency without a price is disabled
- **WHEN** an artwork has no positive price in one currency (neither live nor baked)
- **THEN** that currency's selector option is disabled and the initial selection falls back to the currency that has a price

#### Scenario: Empty email submit raises a focused error
- **WHEN** the form is submitted with an empty or invalid email
- **THEN** no request fires, an inline error renders, the field is highlighted and focused (`aria-invalid`, `role="alert"`), and the error clears when the user types
