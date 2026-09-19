## ADDED Requirements

### Requirement: Artwork detail page records a view on mount

The artwork detail page SHALL carry its artwork slug into the browser (via a `data-` attribute) and SHALL run a page script that fires the `artwork-visit-counter` visit exactly once per mount on `astro:page-load` (initial load plus every ClientRouter navigation), in both languages and for every artwork status. The script SHALL NOT introduce a hydrated framework island and SHALL NOT alter layout, SEO metadata, or the conversion slot (buy widget / status badge) specified in `artwork-detail-page`.

#### Scenario: Slug reaches the browser

- **WHEN** `/obras/<slug>` or `/en/obras/<slug>` renders
- **THEN** the page markup exposes the artwork slug in a `data-` attribute readable by the visit script

#### Scenario: Available and sold works both count

- **WHEN** an artwork with `status == "sold"` (badge branch, no buy widget) mounts
- **THEN** the visit `POST` still fires exactly once
