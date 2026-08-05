## Why

The project's own documentation (`docs/astro-react-islands.md:176`) mandates `@/` path aliases for cross-directory imports, but the codebase overwhelmingly uses relative imports (83 relative vs 5 alias). This inconsistency makes imports hard to reason about, produces deep `../../../` chains that break when files move, and contradicts the documented convention that the tsconfig alias was set up to serve.

## What Changes

- Convert every cross-directory relative import (`../`, `../../`, `../../../`) to the `@/` alias in all `.astro`, `.ts`, and `.tsx` files under `src/`.
- Keep same-directory relative imports (`./`) as-is — they are the documented pattern for siblings (e.g. `lib/i18n/utils` → `./ui`, `store/useField` → `./form`).
- Keep external package imports (astro, react, zustand, zod, etc.) as-is.
- Align the project's `docs/` code examples (which currently mix both styles) with the alias convention so docs and code agree.
- Add an automated validation script (`validate-imports`) to prevent regression of the convention (zero-dependency, mirrors `validate-i18n`).

## Capabilities

### New Capabilities
- `import-conventions`: Standardized, enforced import rule across all source files — cross-directory imports use `@/` aliases, same-directory imports use `./`.

### Modified Capabilities
<!-- No existing component behavior changes; this is a cross-cutting convention, not a per-component requirement change. -->

## Impact

- **Code:** 78 import statements across 26 files in `src/` (layouts, pages, all four component tiers, `lib/i18n`).
- **Config:** a zero-dependency `validate-imports` validation script wired into `build`; no runtime dependencies added.
- **Docs:** `docs/astro-i18n.md`, `docs/astro-site-config.md`, `docs/astro-react-islands.md`, `docs/astro-pwa.md` code examples that use cross-directory relative imports.
- **Risks:** low — purely mechanical change; `@/` alias already configured in `tsconfig.json` and used by 4 files. No behavior change. `astro build` must still pass.
