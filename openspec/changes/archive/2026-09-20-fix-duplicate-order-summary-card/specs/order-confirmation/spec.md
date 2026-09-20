## ADDED Requirements

### Requirement: Single confirmation render after delivery submit
After the delivery form submits successfully, the system SHALL render exactly one order summary card together with the purchase confirmation header. The pre-submit summary card SHALL unmount when the confirmation renders.

#### Scenario: Post-submit confirmation shows one card
- **WHEN** the delivery request returns `200` (or `409` resolved to a fresh summary)
- **THEN** one confirmation header and exactly one summary card render, and the delivery form unmounts

#### Scenario: No stacked cards
- **WHEN** the confirmation renders after submit
- **THEN** no second summary card without a receipt note remains visible above or below it
