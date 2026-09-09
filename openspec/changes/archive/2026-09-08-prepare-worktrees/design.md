## Context

`enredarte-landing` is an Astro 7 + React 19 + Tailwind v4 site run via `portless` (`pnpm run dev` → `portless enredarte-landing pnpm astro dev` → `https://enredarte-landing.localhost`). `astro.config.mjs` honors the injected `PORT` with `strictPort: true`. Active branches `dari` / `mehedi` / `silvia` share one checkout, and `main` is currently dirty (16 modified + 3 untracked), so branch switching is costly. Gitignored paths (`node_modules/`, `.env` with `SITE_URL`/`API_BASE_URL`/`API_TOKEN`, `.astro/`, `dist/`, plus `.*/` dotfolders) are per-checkout state. Portless `0.10.3` supports `portless run` with name inference (`package.json` name → repo root → basename) and branch-subdomain prefixing in worktrees.

## Goals / Non-Goals

**Goals:**

- One-line dev entrypoint change so every checkout gets a collision-free URL with zero per-worktree config.
- Documented, copy-pasteable worktree lifecycle (add → bootstrap → run concurrently → remove) tuned to this repo's ignores and env.
- Main-checkout behavior byte-identical to today.

**Non-Goals:**

- No `SITE_URL`-follows-`PORTLESS_URL` wiring; worktree canonicals may still point at main until manually overridden.
- No helper scripts (`new-worktree.sh`), no `astro.config.mjs` changes, no CI/production changes.
- No folder-basename URL scheme; branch-prefix URLs are the standard.

## Decisions

1. **Use `portless run` with no `--name` override.**
   - Why: `package.json:name` is `enredarte-landing`, so main resolves to the exact current URL; worktrees automatically become `<branch>.enredarte-landing.localhost`. Zero bookkeeping, cross-platform (no `$(basename $PWD)` shell expansion in `package.json`).
   - Alternative considered: `portless run --name $(basename $PWD)` for folder-based URLs. Rejected: fragile on Windows, loses the branch signal, and diverges from portless's documented worktree convention.
   - Alternative considered: unique hardcoded names per worktree (`portless enredarte-landing-mehedi`). Rejected: requires a file edit per worktree, defeating the purpose.

2. **Sibling worktree directories (`../enredarte-<branch>`), never nested.**
   - Why: nesting inside the main checkout interacts badly with watchers, `dist/` output, and mental model; enforced sibling naming keeps `git worktree list` predictable and matches the existing `/mnt/hd/develop/astro/` multi-project layout.
   - Bootstrap per worktree is `pnpm install` (shared content-store keeps it fast) + `cp ../enredarte-landing/.env .env`.

3. **Docs live in `AGENTS.md` only.**
   - Why: `AGENTS.md` is already the dev-workflow source of truth (portless section) and is agent-visible; `docs/component-dependencies.md` is unrelated (component graph) and stays untouched. `README.md` stays untouched to avoid duplication drift.
   - `SITE_URL` caveat documented, not fixed: changing config to read `PORTLESS_URL` adds runtime/env precedence complexity, so it ships as a separate follow-up change (decision: auto-follow `PORTLESS_URL` later).

## Risks / Trade-offs

- [Risk] Branch names with `/` (e.g. `feature/x`) may sanitize unexpectedly in the subdomain → Mitigation: verify with `portless list` after first run; document the observed form.
- [Risk] Two checkouts running `build`/`preview` concurrently compete for CPU but not ports (ephemeral `PORT` per process) → Mitigation: acceptable on dev machines; no fixed ports introduced.
- [Risk] Stale worktree entries after folder deletion → Mitigation: document `git worktree prune` and prefer `git worktree remove`.
- [Risk] `.env` drift between checkouts (token rotation, URL edits) → Mitigation: single source is main's `.env`; worktrees re-copy on demand. No secrets committed.

## Migration Plan

1. Merge/commit or stash current dirty state on `main` (new worktrees start clean regardless).
2. Apply one-line `package.json` change; run `pnpm run dev` on main and confirm `portless list` still shows `https://enredarte-landing.localhost`.
3. Add one worktree (`mehedi`), bootstrap, run both dev servers, confirm both URLs live.
4. Rollback: revert the one line; hardcoded name restores single-URL behavior.

## Open Questions

Resolved during proposal review:

- Worktree `SITE_URL` → follow-up change wires a `PORTLESS_URL` fallback; this change documents manual override only.
- Workflow docs → `AGENTS.md` only, no `README.md` duplication or link.
- Folder naming → enforce the `../enredarte-<branch>` sibling convention in docs (URLs derive from branch, but the convention keeps `git worktree list` predictable).
