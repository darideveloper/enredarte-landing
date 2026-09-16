## Context

`enredarte-landing` currently supports two worktree conventions: manual siblings (`../enredarte-<branch>`) and agent-driven central-store worktrees via the `opencode-worktree` plugin (`.opencode/worktree.jsonc`: `copyFiles: [".env"]`, `symlinkDirs: ["node_modules"]`, `postCreate`/`preDelete` hooks syncing `openspec/changes/`). `astro.config.mjs` hardcodes `site: "https://enredarte.mx"`, so a copied `.env` keeps main's `SITE_URL` and each worktree must override it for correct canonicals. `vetoxzyn` deliberately removed the plugin, runs real `pnpm install` per sibling, isolates openspec proposals, and resolves `site` as `PORTLESS_URL ?? SITE_URL ?? prod-fallback`, making stale `SITE_URL` copies harmless.

## Goals / Non-Goals

**Goals:**
- One supported convention: manual siblings in the same terminal session, identical to vetoxzyn.
- Per-checkout URL correctness without per-worktree `.env` edits (consume `PORTLESS_URL`).
- Eliminate symlink/TTY install failures and snapshot-commit / openspec-leak risks from the plugin hooks.
- Keep the enredarte-specific `.env` contract (`API_BASE_URL`/`API_TOKEN` → shared dashboard) and switch `dev` to plain `portless run` (MITM prefix documented only).

**Non-Goals:**
- No change to production serving (Docker/nginx), SEO component behavior, or backend contract.
- No migration of existing central-store worktrees (none are live per `git worktree list`); no new tooling or dependencies.
- No change to the component-dependency-map or i18n workflows.

## Decisions

- **Delete `.opencode/worktree.jsonc`, forbid `worktree_create`/`worktree_delete` here** (vetoxzyn `AGENTS.md:15` wording). Why: plugin opens a new terminal + central store, breaks the same-session rule, and its `preDelete` snapshot commit cannot cover gitignored openspec state. Alternative (keep plugin, fix hooks) rejected: keeps two conventions and the symlink/TTY failure mode.
- **Real `pnpm install` per sibling, no `node_modules` symlink.** Why: matches vetoxzyn, removes the `test -L` guard and the risk of committing a symlink path via `git add -A`. Trade-off: ~minutes per new sibling; accepted (siblings are long-lived).
- **Plain `portless run` dev script, MITM prefix documented only.** Why: exact vetoxzyn parity; the `NODE_OPTIONS=--use-openssl-ca` prefix is only needed behind a MITM corporate proxy, and baking it in hides that from developers who don't need it. Alternative (keep prefix baked in) rejected per GAP-1 decision.
- **`.env.example` carries `SITE_URL=https://enredarte-landing.localhost`.** Why: the documented bootstrap copies `.env` from main, which does not exist on a fresh clone — vetoxzyn's checklist requires the example to carry the dev URL so `cp .env.example .env` works. Backend vars stay enredarte-specific.
- **`site: process.env.PORTLESS_URL ?? process.env.SITE_URL ?? 'https://enredarte.mx'` + `process.loadEnvFile('.env')` shim** (vetoxzyn `astro.config.mjs:16-28` pattern). Why: config files can't see `.env` via bare `process.env`; Node 22 `loadEnvFile` fills CLI-unset vars with CLI env winning, and the chain guarantees dev resolves the per-checkout URL while builds without env still emit prod (never localhost) into sitemap/canonicals. Alternative (keep hardcoded `site`, document override) rejected: preserves the exact stale-canonical bug being removed.
- **Openspec isolation (vetoxzyn model).** Why: auto-copying `openspec/changes/` spreads half-written proposals across branches and the snapshot commit silently drops them (gitignored). New rule: active proposals never cross; only `openspec/changes/archive/` (tracked) is copied by hand, plus markdown-only `.opencode/skills/openspec-*` + `commands/opsx-*.md` sync per sibling.
- **Docs rewrite, not patch.** Why: `AGENTS.md` § Git worktrees and `docs/astro-worktrees.md` currently describe the plugin layout, symlink bootstrap, and `SITE_URL`-override gotcha — all inverted by this change. Rewrite both to the vetoxzyn structure (same-session rule, pre-flight `git status`, manual bootstrap + skills sync, harmless-`SITE_URL` note, `portless list` verify), keeping enredarte's backend note and documenting `NODE_OPTIONS=--use-openssl-ca` for MITM proxies only. Add the `PORTLESS_URL → SITE_URL → prod` consumer rule to `docs/astro-site-config.md` and touch `docs/astro-portless.md` for the chain reference.
- **Agent-environment server rules (vetoxzyn parity).** Why: the user named "agent driving" as an explicit goal, and Astro ≥7.3 auto-backgrounds under agent env vars (`OPENCODE`/`OPENCODE_PID`), orphaning the `portless run` supervisor (proxy 404, direct port alive). Port the rules into `AGENTS.md` § Development (canonical foreground start, never `--background`, agents never autostart) and the "Running under AI agents" fix pattern into `docs/astro-portless.md` (`astro dev stop` → relaunch with agent vars stripped → verify with `portless list`). Alternative (plugin ban only) rejected per review decision.

## Risks / Trade-offs

- [Risk] A teammate still has a central-store worktree from the plugin era → Mitigation: `git worktree list` shows none live; docs state manual siblings only, and orphaned entries are removed with `git worktree remove/prune` after stopping their server.
- [Risk] `loadEnvFile` behavior differs outside Node 22 → Mitigation: guarded `try/catch` (missing `.env` falls through to fallback); `engines` already require Node ≥22.
- [Risk] Longer sibling setup (full install) → Mitigation: documented once; siblings are per-branch and long-lived.
- [Risk] Active proposal stranded in a sibling at merge time → Mitigation: docs require archiving back `openspec/changes/archive/` to main before merge; pre-flight `git status` check catches dirty state.

## Migration Plan

1. Land config + docs in one change (no phased rollout; dev-only workflow).
2. Delete `.opencode/worktree.jsonc`; change `package.json:dev` to plain `portless run`; add `SITE_URL` to `.env.example`; update `AGENTS.md` (§ Development foreground-start rule + § Git worktrees), `docs/astro-worktrees.md`, `docs/astro-site-config.md` (consumer rule), and `docs/astro-portless.md` (chain reference + "Running under AI agents").
3. Verify: `pnpm run dev` on main → `https://enredarte-landing.localhost`; `portless list` shows route; `astro build` green (sitemap emits prod domain when env absent).
4. Rollback: revert the single change (restores `worktree.jsonc`, `dev` prefix, hardcoded `site`, `.env.example`, and all docs).

## Open Questions

Resolved during proposal review:
- GAP-1 (decided: plain run): `dev` becomes plain `portless run pnpm astro dev`; MITM prefix documented only.
- GAP-2 (decided: add rule): `docs/astro-site-config.md` gains the consumer rule.
- GAP-3 (decided: nothing to clean): no live central-store worktrees; hashed plugin dir holds only the empty `test/` leftover.
