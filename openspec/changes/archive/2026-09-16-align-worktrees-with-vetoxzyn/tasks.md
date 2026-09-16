## 1. Config removal and site chain

- [x] 1.1 Delete `.opencode/worktree.jsonc` (force-added plugin config) and confirm `git status` shows the deletion
- [x] 1.2 Update `astro.config.mjs`: add guarded `process.loadEnvFile('.env')` shim and change `site` to `process.env.PORTLESS_URL ?? process.env.SITE_URL ?? 'https://enredarte.mx'` with the vetoxzyn-style chain comment
- [x] 1.3 Change `package.json:dev` to plain `portless run pnpm astro dev` and document `NODE_OPTIONS=--use-openssl-ca` for MITM proxies only (decided GAP-1)
- [x] 1.4 Add `SITE_URL=https://enredarte-landing.localhost` to `.env.example` keeping the backend placeholders (review MISSING-1)

## 2. Docs rewrite to manual-siblings-only

- [x] 2.1 Rewrite `AGENTS.md` § Git worktrees (same-session manual siblings, `worktree_create`/`worktree_delete` forbidden, real `pnpm install`, harmless stale `SITE_URL`, manual skills/commands + `archive/`-only openspec sync, pre-flight status, `portless list` check) and add the § Development foreground-start rule (never `--background`, agents never autostart) (review MISSING-2)
- [x] 2.2 Rewrite `docs/astro-worktrees.md` to the vetoxzyn structure with enredarte specifics: backend `.env` contract (`API_BASE_URL`/`API_TOKEN` → shared dashboard), MITM-prefix note, bootstrap + skills-sync commands (including the `.env.example` fresh-clone fallback), stopping/team-rules/troubleshooting kept
- [x] 2.3 Add the `PORTLESS_URL → SITE_URL → prod` consumer rule to `docs/astro-site-config.md`; update the chain reference in `docs/astro-portless.md` and port its "Running under AI agents" section (orphan cause + fix pattern) (decided GAP-2, review MISSING-2)
- [x] 2.4 Verify `docs/component-dependencies.md` needs no update (docs-only change: no pages/components added, removed, renamed, or re-imported; expect noop per the living-doc rule)

## 3. Verification

- [x] 3.1 Run `pnpm run dev` on main and confirm `https://enredarte-landing.localhost` serves; verify with `portless list`
- [x] 3.2 Run `pnpm build` (validate-i18n + validate-imports + markdown) and confirm sitemap/canonicals emit the prod domain when env is absent
- [x] 3.3 Dry-run the documented sibling lifecycle on a scratch branch: `git worktree add` → copy `.env` → `pnpm install` → manual skills sync → `pnpm run dev` (branch-subdomain URL) → stop → `git worktree remove` + `prune`
- [x] 3.4 Run `openspec validate "align-worktrees-with-vetoxzyn"` (decided GAP-3: no central-store cleanup; hashed plugin dir holds only the empty `test/` leftover)
