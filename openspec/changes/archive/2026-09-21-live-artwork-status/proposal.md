## Why

Sold artworks keep showing as purchasable on the landing: detail pages are fully static (status baked at build time), so a sale made in the dashboard stays invisible until someone manually rebuilds and redeploys. Buyers then hit a misleading "another buyer is checking out" error on an already-sold piece. The backend now exposes a public, side-effect-free `GET .../artworks/:slug/status/` endpoint — the landing should use it to reconcile the purchase zone at view time.

## What Changes

- Artwork detail pages fetch the live sale status once per page mount (fire-and-forget, never blocking render) and reconcile the purchase zone when it differs from the baked snapshot.
- When live status is not `available`, the buy form is replaced by the existing `Vendida` / `Venta en curso` / `No disponible` badge, and the price + status labels update to the live values.
- Any fetch failure (404, 429 throttled, timeout, offline) keeps the baked HTML untouched — the page never breaks because the backend is unreachable.
- No change to the buy flow itself (`POST buy/`, Stripe redirect, error matrix), no change to catalog grids, no new dependencies.

## Capabilities

### New Capabilities

- `live-artwork-status`: live sale-status reconciliation for the artwork purchase zone — public status endpoint client, purchase-zone island owning baked→live state, once-per-mount fetch policy with silent fallback.

### Modified Capabilities

- `artwork-purchase`: the conversion slot's widget-vs-badge decision is now driven by the reconciled (live) status instead of the baked catalog status alone; badge labels and buy error matrix are otherwise unchanged.
- `artwork-detail-page`: the price and status labels in the info panel become live-reconciled alongside the conversion slot; layout, SEO, and routing are unchanged.

## Impact

- Touched: `src/lib/api/` (new public `artwork-status.ts` module), new `ArtworkPurchase` island composing the existing `BuyWidget`, `ArtworkInfoPanel.astro` wiring (props only), `docs/component-dependencies.md` refresh.
- Backend dependency: public `GET /api/artworks/artworks/:slug/status/` (already shipped per Bruno docs); no auth, throttled 120/hour per client.
- No hosting change (stays static + nginx); no store change (local island state, deliberately not persisted).
