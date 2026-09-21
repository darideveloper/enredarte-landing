## 0. Unblock prod (ops, no code)

- [x] 0.1 Rebuild and redeploy the landing image now so the baked HTML reflects the dashboard sale
- [x] 0.2 Verify `https://enredarte.mx/obras/cien-miradas` and `/en/obras/cien-miradas` show the `Vendida` badge instead of the buy form

## 1. Status client

- [x] 1.1 Create `src/lib/api/artwork-status.ts` (public `PUBLIC_API_BASE_URL`, no auth, ~8s timeout, `null` on any non-200) with decimal-string price normalization
- [x] 1.2 Verify parsing/throttle contract against the Bruno doc (`200` shape, `429` → null, no throw, no retry)

## 2. Purchase-zone island

- [x] 2.1 Create `ArtworkPurchase` island composing `BuyWidget` (baked props as first paint, `useState` + once-per-mount `useEffect`, instant swap, copy via props)
- [x] 2.2 Wire `ArtworkInfoPanel.astro` to render the island with baked snapshot + `t()` copy (buy, badges, status labels)
- [x] 2.3 Follow island conventions (`export function`, namespace React import, `@/` aliases, double quotes)

## 3. Verification

- [x] 3.1 `pnpm build` passes (validators + Astro build)
- [x] 3.2 Manual dev check: known-sold slug flips form → `Vendida` badge post-mount in es and en; status-match page shows no flash
- [x] 3.3 Failure drill: blocked backend / 429 keeps baked HTML fully interactive with no console errors
- [x] 3.4 Confirm exactly one status request per page mount in network panel (including client-side navigations)

## 4. Docs

- [x] 4.1 Regenerate `docs/component-dependencies.md` (new island + module in the ArtworkPage tree, Notes refresh)
