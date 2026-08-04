## Purpose

Defines the requirement for the `BannerText` atom component.

## ADDED Requirements

### Requirement: Banner Text Rendering
The system SHALL provide a `BannerText` atom component that renders dynamic slotted content with small font sizing (`text-[11px]`), tracking, and highlighted bold elements (`[&>b]:text-crimson [&>b]:font-semibold`).

#### Scenario: Slotted content rendering
- **GIVEN** `BannerText` is rendered with `<b>COA</b> firmado en cada obra`
- **THEN** it renders the slot text cleanly
- **AND** the `<b>COA</b>` tag is styled with crimson text and semi-bold font weight.
