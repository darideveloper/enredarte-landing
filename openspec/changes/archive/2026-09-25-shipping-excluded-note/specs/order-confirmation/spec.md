## ADDED Requirements

### Requirement: Shipping-excluded note on the ready-phase summary card
The success flow SHALL pass the short shipping-excluded string (`pages.purchase.shippingNote`) as the `note` of `OrderSummaryCard` in the `ready` (`paid_pending_data`) phase, so the buyer sees it next to the charged amount before completing delivery details. The `complete`-phase notes (receipt / shipped / delivered) SHALL remain unchanged.

#### Scenario: Ready phase shows the shipping note
- **WHEN** polling resolves to `paid_pending_data` with a summary
- **THEN** the summary card renders with the shipping-excluded note above the delivery form

#### Scenario: Complete phase keeps existing notes
- **WHEN** the order is `data_complete`, `shipped`, or `delivered` (or the delivery form just completed)
- **THEN** the single summary card renders with the existing receipt/shipping-status note, not the shipping-excluded string
