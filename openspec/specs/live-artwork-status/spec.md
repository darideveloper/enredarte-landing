# live-artwork-status Specification

## Purpose
Live sale-status reconciliation for the artwork purchase zone: a public status endpoint client plus a purchase-zone island that corrects the baked snapshot at view time, so sold artworks stop showing as purchasable between rebuilds.

## Requirements

### Requirement: Live status reconciliation on artwork pages
The system SHALL fetch the live sale status for the viewed artwork exactly once per page mount via public `GET /api/artworks/artworks/:slug/status/` (no auth header) and SHALL reconcile the purchase zone (price label, status label, conversion slot) when the live `status` differs from the baked catalog snapshot. The fetch SHALL be fire-and-forget: it never blocks render, never retries, and any failure (non-200, timeout, network error) leaves the baked HTML untouched.

#### Scenario: Sold artwork self-corrects after mount
- **WHEN** a page baked with `status == "available"` mounts and the live status returns `"sold"`
- **THEN** the price and status labels update to the live values and the buy form is replaced by the `sold` badge with no buy button present

#### Scenario: Matching status renders no visible change
- **WHEN** the live status equals the baked status
- **THEN** the purchase zone renders identically to the baked markup with no flash or layout shift

#### Scenario: Backend failure keeps baked HTML
- **WHEN** the status request fails for any reason (`404`, `429`, timeout, offline)
- **THEN** no UI change occurs and the page remains fully interactive with its baked content

#### Scenario: Released hold restores the buy widget
- **WHEN** a page baked with a non-available status mounts and the live status returns `"available"`
- **THEN** the badge is replaced by the buy widget with the live prices

### Requirement: Public status endpoint client
The system SHALL provide a `src/lib/api/artwork-status.ts` module that calls the public status endpoint using `PUBLIC_API_BASE_URL` with no `Authorization` header, an ~8s timeout, and `Accept: application/json`. It SHALL return the normalized `{ slug, status, priceMxn, priceUsd }` (decimal strings parsed to numbers) on `200` and `null` on any other outcome. It SHALL NOT use the token-based `apiFetch` client and SHALL NOT throw.

#### Scenario: Live status parses
- **WHEN** the endpoint returns `200` with `{ slug, status: "sold", price_mxn: "12500.00", price_usd: "750.00" }`
- **THEN** the module resolves `{ slug, status: "sold", priceMxn: 12500, priceUsd: 750 }`

#### Scenario: Throttle resolves null
- **WHEN** the endpoint returns `429`
- **THEN** the module resolves `null` without throwing and without scheduling a retry

### Requirement: Purchase-zone island owns one fetch per mount
The `ArtworkPurchase` island SHALL fire the status fetch exactly once per mount (guarded against StrictMode/view-transition remount double-fire), SHALL render byte-identical markup to the baked static output before the response arrives (no loading skeleton), and SHALL swap instantly on a differing live status. It SHALL receive all copy (buy, badge, status labels) as props and SHALL NOT persist live status anywhere (no store, no storage).

#### Scenario: Single request per visit
- **WHEN** the artwork page mounts (including client-side navigations)
- **THEN** exactly one status request fires for that artwork slug

#### Scenario: No skeleton flash
- **WHEN** the island hydrates before the status response arrives
- **THEN** it shows the baked purchase zone as-is with no placeholder or spinner
