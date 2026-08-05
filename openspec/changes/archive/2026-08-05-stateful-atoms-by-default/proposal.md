## Why

The current documented component model (docs/astro-atomic-components.md) prescribes a two-tier pattern for vanilla atoms: a presentational `Input` plus a separate stateful `ValidatedInput` wrapper that binds the store via `useField()`. In a vanilla project (no `ui/` directory, no shadcn), the atom already IS the primitive — so a separate stateful wrapper is pure duplication. This duplication only exists to serve UI-library projects where generated `ui/` primitives must not be edited and need a wrapper. The project is vanilla-only, so atoms should be self-sufficient and store-bound by default, with the store hook injectable via props.

## What Changes

- **BREAKING (docs)**: Replace the two-tier vanilla atom example (`Input` + `ValidatedInput`) with a single self-bound atom in `docs/astro-atomic-components.md`.
- **BREAKING (docs)**: State the vanilla-vs-UI-library rule explicitly: UI-library projects require wrappers (primitives are generated and reinstalled); vanilla projects bind atoms directly to the store.
- **BREAKING (code)**: Refactor `src/components/atoms/Input.tsx` from presentational-only to a store-bound atom that accepts an injectable `useField` hook and `field` key via props (Option 1). The code is changed now — not deferred — so the docs and the reference implementation stay in sync for template reuse.
- **BREAKING (code)**: Delete `src/components/atoms/ValidatedInput.tsx` outright — its responsibilities fold into the refactored `Input`, and no consumers exist.
- Update `docs/astro-zustand-zod.md`, `docs/astro-react-islands.md`, and `docs/component-dependencies.md` to match the single-atom model.
- Keep `src/store/form.ts`, `src/store/useField.ts`, `zustand`, and `zod` unchanged — they remain the shared store machinery. A presentation-only (non-store-bound) input is intentionally not modeled by this change.

## Capabilities

### New Capabilities
- `stateful-atom-by-default`: Vanilla atoms in this project SHALL be self-contained and bind to a Zustand store directly, using an injectable `useField` hook and store/field key provided via props. A presentational-only variant SHALL NOT be the default; UI-library projects are the only case that requires a wrapper layer.

### Modified Capabilities
- (none — no active spec in `openspec/specs/` defines the two-tier wrapper pattern; the archived `atomic-components` spec already mandates "atoms import from `store/*` directly", which this change reinforces rather than contradicts)

## Impact

- **Docs rewritten**: `docs/astro-atomic-components.md`, `docs/astro-zustand-zod.md`, `docs/astro-react-islands.md`, `docs/component-dependencies.md`.
- **Code changed**: `src/components/atoms/Input.tsx` (store-bound refactor + injectable hook prop); `src/components/atoms/ValidatedInput.tsx` (deleted outright).
- **Code unchanged**: `src/store/form.ts`, `src/store/useField.ts`, `package.json` deps (`zustand`, `zod`).
- **No runtime consumers affected**: no React islands currently use `Input` or `ValidatedInput`, so there is zero user-facing change.
- **No overlap with active change** `derive-pagekey-in-components` (different files).
