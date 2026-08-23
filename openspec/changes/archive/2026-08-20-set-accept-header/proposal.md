## Why

The API client only sets `Authorization: Token` on requests but omits `Accept: application/json`. DRF defaults to JSON without it, but explicitly setting it is cleaner, avoids surprises if backend configuration changes, and follows HTTP best practices.

## What Changes

- Add `Accept: application/json` header to every API request in the fetch client
- No functional behavior changes — the header value DRF already assumes

## Capabilities

### New Capabilities
None — this is a modification of existing behavior.

### Modified Capabilities
- `api-client`: The fetch client currently only injects `Authorization`. It will also inject `Accept: application/json`.

## Impact

- Single file: `src/lib/api/client.ts` — one line added in `apiFetch()`
- No type, endpoint, or data contract changes
- No breaking changes