## MODIFIED Requirements

### Requirement: Inquiry CTA follows the spec data
The conversion slot of the info panel SHALL render in normal document flow directly after the artwork's spec list, spaced by the info panel's standard `gap-8` rhythm, and SHALL NOT be anchored to the bottom of the panel container. For artworks with catalog `status == "available"` the slot SHALL host the buy widget (currency + email + submit) instead of the mailto inquiry CTA; for any other status it SHALL host the corresponding status badge. The full buy-widget behavior (request, redirect, error states, badges) is specified in `artwork-purchase`.

#### Scenario: CTA renders after the spec data
- **GIVEN** an artwork detail page with spec rows in the info panel
- **WHEN** the page renders
- **THEN** the conversion slot appears directly after the spec list in normal document flow, spaced by the panel's standard vertical gap

#### Scenario: CTA does not overflow short viewports
- **GIVEN** a desktop viewport whose height is short enough that the sticky info panel's content exceeds the viewport
- **WHEN** the page renders
- **THEN** the conversion slot remains inside the scrollable panel and does not overflow the panel or the viewport

#### Scenario: Available artwork hosts the buy widget
- **GIVEN** an artwork with `status == "available"`
- **WHEN** the page renders
- **THEN** the conversion slot contains the buy widget and no mailto inquiry CTA
