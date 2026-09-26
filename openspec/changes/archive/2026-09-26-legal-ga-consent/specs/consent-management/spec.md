## ADDED Requirements

### Requirement: First-visit consent banner

The system SHALL render a consent banner on first visit (no stored choice) in the visitor's language (ES/EN via i18n keys with `validate-i18n` parity), offering accept-analytics and reject actions rendered as `Btn` atoms (accept = `primary`, reject = `inverse-outline`). No analytics storage, beacon, or tracking script SHALL execute before the visitor chooses, except the strictly-necessary local/session entries the site already uses. The banner SHALL NOT block page content from rendering or being navigable.

#### Scenario: Banner actions reuse the button atom

- **WHEN** the banner renders
- **THEN** both actions are `Btn`-atom buttons carrying the `consent-accept` / `consent-reject` ids the consent script listens on

#### Scenario: First visit shows banner and fires nothing

- **WHEN** a visitor with no stored consent choice loads any page
- **THEN** the banner appears in the page language and no visit-beacon `POST`, no GA request, and no `_ga` cookie is produced

#### Scenario: Accept enables analytics

- **WHEN** the visitor clicks accept
- **THEN** the choice `{ analytics: true }` persists, the banner dismisses, Consent Mode grants `analytics_storage`, GA loads, and the visit beacon is allowed
- **THEN** if the visitor is on an artwork page and had no prior grant, that view's visit beacon fires exactly once; re-accepting an existing grant fires no beacon

#### Scenario: Reject keeps analytics off

- **WHEN** the visitor clicks reject
- **THEN** the choice `{ analytics: false }` persists, the banner dismisses, Consent Mode stays denied, GA never loads, and no beacon fires

### Requirement: Consent Mode v2 defaults

The system SHALL set `gtag` consent defaults denying `ad_storage`, `analytics_storage`, `ad_user_data`, and `ad_personalization` before any tag can load, and SHALL update them to granted only for analytics after an accept. Consent state changes (re-consent from the footer) SHALL push live `consent update` commands.

#### Scenario: Defaults deny before choice

- **WHEN** any page head executes before a stored accept exists
- **THEN** consent defaults are `denied` for all four keys

#### Scenario: Re-consent updates live

- **WHEN** a visitor flips analytics consent via the footer control
- **THEN** a consent `update` command fires and GA loading/beacon behavior changes without a reload

### Requirement: Gated GA4 loading and events

The system SHALL load `gtag.js` only when analytics consent is granted and `PUBLIC_GA_MEASUREMENT_ID` is set; a missing ID SHALL silently disable GA with no error. It SHALL emit `page_view` on initial loads and ClientRouter SPA navigations except on `noIndex` compra pages, `begin_checkout` on successful `BuyWidget` checkout creation, and `purchase` (value + currency only) on `OrderFlow` completion. No event SHALL carry PII (no email, name, address, or order slug).

#### Scenario: Consented navigation emits one page_view

- **WHEN** a consenting visitor navigates from `/obras/obra-a` to `/obras/obra-b` via ClientRouter
- **THEN** exactly one GA `page_view` fires for `obra-b`

#### Scenario: Unconsented checkout emits nothing

- **WHEN** a visitor who rejected analytics completes checkout creation
- **THEN** no `begin_checkout` event fires and no GA request is issued

#### Scenario: Purchase carries value without PII

- **WHEN** a consenting visitor completes an order
- **THEN** one `purchase` event fires with value and currency and without email, name, address, or order slug

#### Scenario: Missing measurement ID disables silently

- **WHEN** `PUBLIC_GA_MEASUREMENT_ID` is unset
- **THEN** no `gtag.js` request is issued and no error surfaces

### Requirement: Consent persistence and footer re-consent

The system SHALL persist the choice as JSON (`{ analytics, ts }`) under the `enredarte-consent` localStorage key, honor a stored grant on later visits without re-showing the banner, and expose a footer cookie-settings control that re-opens the banner.

#### Scenario: Return visit honors stored grant

- **WHEN** a visitor with stored `{ analytics: true }` loads any page
- **THEN** no banner appears and GA loads with granted consent

#### Scenario: Footer control re-opens banner

- **WHEN** the visitor activates the footer cookie-settings control
- **THEN** the banner re-opens with the current choice reflected
