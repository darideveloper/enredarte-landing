## Context

The catalog client (`src/lib/api/`) has 10 near-identical resource modules, each hardcoding two paths with the plural prefix `/apis/artworks/<resource>/` (`list` at line 9, `detail` at line 13 — 20 literals total). The blog module (`posts.ts`) already uses singular `/api/blog/posts/`. `apiFetch` (`client.ts:58`) is path-agnostic (`` `${baseUrl}${path}` ``), so the prefix lives entirely in those literals. Active specs pin the old prefix (`api-client` scenarios, `gallery-data` purpose line) and `docs/blog-api.md` documents the split as a backend routing fact (D4). The user explicitly asked for a **direct update** of the endpoints — no refactor. There are no automated tests in the repo; the build (`getStaticPaths` → `buildSiteData` → `fetchAll`) is the acceptance gate.

## Goals / Non-Goals

**Goals:**

- Every catalog request goes to singular `/api/artworks/…` (10 resources × list/detail).
- Active specs and docs agree with the new prefix; no stale `/apis/` references outside archive history.
- Backend liveness verified before the rename merges.

**Non-Goals:**

- No client refactor (no shared `CATALOG_BASE` constant, no resource factory) — follow-up material, explicitly out per the direct-update request.
- No change to auth, pagination, types, retry/timeout, env handling, or blog endpoints.
- No backend change; no dual-prefix fallback in the frontend.
- No edits to `openspec/changes/archive/` history.

## Decisions

**D1 — Direct literal replacement, no abstraction.**
Replace the `/apis/artworks/` literal with `/api/artworks/` in each of the 10 modules (20 lines). Rationale: smallest reviewable diff; matches the existing convention where every module (including `posts.ts`) hardcodes its own path; exactly what was requested.
Alternative considered: introduce `CATALOG_BASE = "/api/artworks"` in `client.ts`/`constants.ts` and build paths from it — rejected for this change (touches the same 20 lines anyway plus adds an abstraction nobody asked for). Viable follow-up if the prefix ever churns again.

**D2 — `client.ts` untouched.**
Concatenation, `Authorization: Token`, `Accept`, env validation, and retry are prefix-independent. No client change needed (same conclusion as the earlier blog D4).

**D3 — Single prefix, no fallback.**
The client requests `/api/artworks/…` only. Rationale: this is a static build — a wrong prefix fails loudly at build time via the existing `FetchError` path, which is preferable to silently masking backend drift with try-both logic.

**D4 — Specs/docs updated in the same change.**
`api-client` (normative path scenarios) and `gallery-data` (source-path requirement) deltas plus the `docs/blog-api.md` D4 note move together with the code, so the merge leaves no contradictions. Archive history is record, not contract — left alone.

## Risks / Trade-offs

- [Backend does not serve `/api/artworks/…` yet] → Mitigation: verification task (curl both prefixes against live `API_BASE_URL`) is a merge gate in `tasks.md`; do not merge on assumption.
- [A hardcoded `/apis/` hiding outside `src/lib/api/`] → Mitigation: repo-wide grep for `/apis/` after the edit; expected remainders are docs prose and `openspec/changes/archive/` only.
- [No test suite to catch regressions] → Mitigation: `pnpm build` with real `API_BASE_URL`/`API_TOKEN` is the acceptance check (exercises all 10 `list` paths via `buildSiteData`); curl covers `detail` paths.
- [Stale build artifacts mask the result] → Mitigation: clean rebuild (`dist/`, `.astro/` output is gitignored per-checkout state anyway).
