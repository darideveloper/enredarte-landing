## Context

The project is an Astro 7 landing site with React islands, Tailwind 4, and Zod/Zustand form state. The `@/*` alias (`tsconfig.json`) is configured and works in both Astro/Vite and the existing 4 files that already use it (`Input.tsx`, `Btn.tsx`, `Logo.astro`, `GlobalLoader.tsx`). The documented convention (`docs/astro-react-islands.md`) requires `@/` for cross-directory imports, yet 78 imports across 26 files still use `../`-style relative paths, including deep `../../../` chains in `Home.astro` and `BaseSEO.astro`.

The codebase has no ESLint config — only `tsx` (for a validate script), Astro, and Tailwind. `package.json` currently exposes `validate-i18n` as the only validation script.

## Goals / Non-Goals

**Goals:**
- Every cross-directory import under `src/` uses `@/`.
- Same-directory imports stay `./`.
- Docs code examples agree with the convention.
- An automated, dependency-free check prevents regression.
- `pnpm build` passes after the change.

**Non-Goals:**
- Renaming files, restructuring directories, or changing export names/signatures.
- Migrating the 4 already-alias files (they already conform).
- Adding ESLint or any new runtime/build dependency just for this (prefer a zero-dependency script, consistent with the existing `validate-i18n` approach).
- Rewriting external package imports.

## Decisions

### Decision 1: Apply the strict reading — all `../` cross-directory imports become `@/`
The docs' examples (`@/components/atoms/ValidatedRadioGroup` inside a molecule, `@/lib/utils`) show the alias used even between component tiers, not just when jumping to shared layers. So `organisms → molecules` and `molecules → atoms` also become `@/components/...`.

**Alternatives considered:**
- *Keep component-tree-internal imports relative* (`organisms → molecules` stays `../`). Rejected: contradicts the docs' own examples and leaves two conventions in place.

### Decision 2: Same-directory imports stay `./`
Files in the same folder (e.g. `lib/i18n/utils.ts → ./ui`, `seo/PageSEO.astro → ./base/BaseSEO.astro`, `atoms/LangBtns.astro → ./Btn`) keep relative `./` paths. Aliasing a sibling adds noise with no benefit, and the docs use `./` for intra-directory files (`./client` in the fetch-wrapper doc).

### Decision 3: Enforce with a zero-dependency validation script (no ESLint)
Add a small script (TS, run with the already-present `tsx`) that scans `src/` for cross-directory relative imports and exits non-zero on violations, wired into a `validate-imports` npm script. Pattern match on `from "../..."` and `import("../...")` in `.astro`/`.ts`/`.tsx` files, ignoring `messages/` only when it is intra-directory (none exist). This mirrors the existing `scripts/validate-i18n.ts` approach and avoids pulling ESLint + plugins into a project that has none.

**Alternatives considered:**
- *ESLint + `eslint-plugin-import` `no-relative-parent-imports`*: more powerful but adds a full lint toolchain and config to a project with none. Rejected for this change; can be adopted later.
- *No enforcement*: rejected — the drift already happened once.

### Decision 4: The alias check uses a single regex against `src/**/*.{astro,ts,tsx}`
A `validate-imports` script greps for `from\s+["']\.{2,}/`, `import\(["']\.{2,}/`, and bare `import ["']\.{2,}/` (side-effect imports like CSS, no `from` clause) under `src/` (excluding nothing within `src/`). If any match remains, the script lists them and fails. This is deliberately simple and dependency-free.

### Decision 5: JSON message imports move to `@/messages/...`
`lib/i18n/ui.ts` imports `../../messages/en.json`. Since `messages/` is a sibling of `lib/` under `src/`, the cross-directory rule applies and it becomes `@/messages/en.json`. Vite/Node resolve this via the same alias.

## Risks / Trade-offs

- **Build breakage from an aliased path Vite can't resolve** → The alias is already proven in 4 files; `pnpm build` runs after the edit, and the validate script runs first to catch stragglers.
- **Over-broad regex flags valid relative imports** → Same-directory `./` and external packages never match `\.{2,}/`; only `../` matches, which is exactly the target set.
- **Drift recurs without enforcement** → The `validate-imports` script runs in CI/build; future `../` imports fail fast.
- **Mechanical churn touches many files** → No behavior change; changes are import strings only; easy to review and revert.
