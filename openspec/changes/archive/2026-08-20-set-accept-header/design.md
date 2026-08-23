## Context

The fetch client in `src/lib/api/client.ts` injects `Authorization: Token <token>` on every request but does not set an `Accept` header. DRF defaults to JSON responses, but relying on defaults is fragile. Explicitly sending `Accept: application/json` follows HTTP best practices and prevents surprises if the backend default configuration ever changes.

## Goals / Non-Goals

**Goals:**
- Add `Accept: application/json` to all outgoing API requests
- Keep the change to a single line in the existing `apiFetch()` function

**Non-Goals:**
- No changes to how the token is managed, how retries work, or how responses are parsed
- No changes to any endpoint module, types, or data flow

## Decisions

- **Inline header set vs separate headers object**: The existing `headers.set("Authorization", ...)` pattern is reused — one additional `headers.set("Accept", "application/json")`. This keeps the change minimal and consistent with the existing code style.
- **No override mechanism**: All requests from the SSG client expect JSON. If a non-JSON endpoint is ever needed, an override can be added later through the `init.headers` parameter, which the `Headers` constructor already merges.

## Risks / Trade-offs

- [Low] If a downstream middleware overrides `Accept`, this header is ignored anyway — no negative impact.
- [Low] Build already verified — no functional change.