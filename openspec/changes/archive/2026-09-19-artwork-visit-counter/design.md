## Context

The landing is a fully static Astro site (`getStaticPaths` in `src/pages/[...path].astro` pre-renders every `/obras/:slug` + `/en/obras/:slug`). The backend visit endpoint (`POST /api/artworks/artworks/:slug/visit/`, see Bruno `Artworks/POST visit.bru`) is public, bodyless, throttled at 20/hour per client, and documented as "call once per artwork detail-page mount, fire-and-forget: never block render, never retry". Current state: no visit call exists anywhere; `views_count` is typed (`src/lib/api/types.ts`) but never rendered; `apiFetch` (`src/lib/api/client.ts`) injects `Authorization: Token` and retries network/timeout via `safeFetch`; the public `sales.ts` client shows the token-free `PUBLIC_API_BASE_URL` pattern; all artwork-page client scripts hook `astro:page-load` (ClientRouter active in `Layout.astro`).

## Goals / Non-Goals

**Goals:**
- Record one view per artwork detail mount from the browser, without affecting render, LCP, or navigation.
- Keep secrets safe: no `Authorization` header, no `API_TOKEN` in browser code.
- Respect the throttle: never retry, never beacon-loop, every mount counts exactly once.

**Non-Goals:**
- Displaying `views_count` anywhere (response body ignored).
- Session/daily dedupe, bot filtering, analytics dashboard.
- Server-side / build-time counting, middleware, or new backend endpoints.
- New dependencies or React islands.

## Decisions

**1. New `src/lib/api/artwork-visits.ts` helper, not `apiFetch`/`safeFetch` reuse.**
Rationale: `apiFetch` injects a token the endpoint forbids and requires `API_TOKEN`; `safeFetch` retries network/timeout, which the backend explicitly prohibits (retries burn the 20/hr budget, worst on `429`). The helper mirrors `sales.ts`'s `baseUrl()` (single `PUBLIC_API_BASE_URL` var, trailing-slash trim, missing-var guidance) and does a single bare `fetch`.
Alternative considered: extending `apiFetch` with an opt-out flag — rejected, adds a branch to the security-critical path for one caller.

**2. `fetch(..., { method: "POST", keepalive: true })` transport, no body.**
Rationale: mount-time (not unload-time) fire-and-forget; `keepalive` lets the POST survive a fast navigate-away without the `sendBeacon` payload/semantics mismatch. No `Content-Type` header (no body to describe).
Alternative considered: `navigator.sendBeacon` — rejected, designed for `pagehide`, offers no advantage on mount and complicates timeout/abort handling.

**3. Trigger: inline `<script>` in `ArtworkPage.astro` on `astro:page-load`, slug via `data-` attribute.**
Rationale: follows the established page-script pattern (`ArtworkImageViewer`, `Hero`, `Gallery` all init on `astro:page-load`); slug is already a build-time prop so no routing lookup is needed; covers both initial load and ClientRouter SPA swaps obra→obra. Guard against double-registration on re-swap (single module-level listener + current-slug check) so one navigation fires exactly one POST.
Alternative considered: firing from `BuyWidget` (`client:load`) — rejected, only mounts for `status == "available"`, would miss sold/reserved works and couple analytics to checkout JS. Alternative considered: dedicated `client:visible` island — rejected, heaviest vehicle for the lightest payload.

**4. Failure policy: catch-all swallow, `console.warn` in dev only, short timeout (~5s, no retry).**
Rationale: backend contract lists `404` (unknown/inactive slug) and `429` (throttled) as expected, non-actionable outcomes; user-visible errors or retries would both violate "never block render, never retry". `console.warn` (gated on `import.meta.env.DEV`) preserves debuggability without shipping noise.
Alternative considered: silent-in-all-envs — rejected per explore decision (dev warn aids verification).

**5. Timeout via `AbortSignal.timeout`, no `AbortController` plumbing.**
Rationale: one-shot POST needs no cancellation surface; `AbortSignal.timeout(5000)` bounds the socket without extra state. Abort/timeout errors join the same swallow path.

## Risks / Trade-offs

- [Double-fire on ClientRouter re-swap] → Mitigation: single `astro:page-load` listener reading the live `data-artwork-slug`; spec scenario asserts one POST per navigation.
- [Throttle `429` under rapid QA clicking] → Mitigation: none needed — expected outcome, silently swallowed; documented in spec.
- [Stale `views_count` in SSG HTML] → Accepted: count surfaces on next build/artist-ordering read; nothing renders it live by design.
- [Ad-blockers / offline] → Accepted: fetch rejects, swallowed; view simply uncounted.
- [`PUBLIC_API_BASE_URL` trailing slash / slug encoding] → Mitigation: trim trailing `/`, `encodeURIComponent(slug)`; covered in spec scenarios.
