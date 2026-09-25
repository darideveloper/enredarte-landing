## ADDED Requirements

### Requirement: Shipping-excluded microcopy in the purchase zone
The system SHALL render a shipping-excluded microcopy line (`pages.purchase.shippingNote`: `"+ Gastos de envío"` ES / `"+ Shipping costs"` EN) in the artwork purchase zone between the price line and the status label. The line SHALL render only when a formatted price is present and the reconciled `status` is `available`; it SHALL be hidden when the price is empty or when a non-available badge renders. The copy SHALL arrive via props from `ArtworkInfoPanel` (no island-internal i18n) and SHALL use the muted metadata treatment (`text-muted`, no accent color, no box, no icon).

#### Scenario: Available artwork with price shows the note
- **WHEN** an artwork page reconciles to `status == "available"` with a positive price in the selected currency
- **THEN** the shipping note renders between the price and the `Disponible` / `Available` status label

#### Scenario: Note hidden when price is empty
- **WHEN** neither currency yields a formatted price (price line hidden, e.g. price on request)
- **THEN** the shipping note does not render

#### Scenario: Note hidden on non-available states
- **WHEN** the reconciled `status` is `reserved`, `sold`, `on_loan`, or `not_available`
- **THEN** the badge renders without the shipping note

#### Scenario: Currency switch keeps the note static
- **WHEN** the visitor changes the MXN/USD selector
- **THEN** the price updates and the shipping note text stays unchanged
