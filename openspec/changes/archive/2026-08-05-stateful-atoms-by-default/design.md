## Context

The project is vanilla-only: no `ui/` directory, no shadcn, no Radix — atoms are hand-written with Tailwind. The archived `atomic-components` spec already mandates "atoms import from `store/*` directly", so a store-bound atom is sanctioned. However, the current docs (docs/astro-atomic-components.md) still present a generic two-tier model — a presentational `Input` plus a stateful `ValidatedInput` wrapper — which is the right shape for UI-library projects but redundant here. The codebase has two orphaned mirror files (`Input.tsx`, `ValidatedInput.tsx`) that echo those docs. No React islands currently consume either, so this change is convention-first with zero runtime impact.

## Goals / Non-Goals

**Goals:**
- Codify that vanilla atoms are store-bound by default, with an injectable store hook.
- Replace the two-tier `Input`/`ValidatedInput` example in the docs with a single self-bound atom.
- Keep the shared store (`form.ts`, `useField.ts`, `zustand`, `zod`) untouched.
- Keep docs and code consistent (AGENTS.md requires `docs/component-dependencies.md` in sync).
- Make the two approaches (vanilla self-bound vs UI-library wrapper) unambiguous in the docs, with explicit "pick one, ask the user if unsure" guidance, so the architecture can be replicated in other Astro projects.

**Non-Goals:**
- No new form feature, no real form UI, no consumers.
- No changes to `src/store/*` or `package.json` deps.
- No changes to existing `Btn`, `Logo`, `Link`, or other shipped atoms.
- No overlap with the active `derive-pagekey-in-components` change.

## Decisions

### Option 1: injectable `useField` hook via props
The atom accepts the store-binding hook and field key as props (per the user's decision):

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: string
  useField?: (field: string) => { value: unknown; error?: string; setValue: (v: unknown) => void; mounted: boolean }
  label?: string
  // ...
}
```

- **Why**: lets any consumer bind the atom to whichever store they choose without forking the component. Matches the "dynamic store from props" requirement.
- **Alternative rejected — Option 2 (weld to one store)**: simpler props but loses flexibility; a consumer wanting a different store (e.g. prefs/filters) would need a new component.
- **React validity note**: calling a hook variable at the top level is legal as long as it is always called unconditionally; a default `useField` import guarantees that.
- **Store targeting**: the injectable hook lets a consumer point the atom at any store (e.g. a future prefs/filters store), not just the validated `form.ts`. Each distinct store follows the same pattern (one shared hook, persisted state), so a second store does not fork `Input`.

### Single self-bound atom, no separate wrapper
The refactored `Input` folds in what `ValidatedInput` did (value/error/setter + hydration-safe render via `useField`). `ValidatedInput.tsx` is **deleted outright** — no consumers exist, and its responsibilities live entirely in `Input`.

### Docs rewrite, scoped and faithful
- `docs/astro-atomic-components.md`: §2 becomes "Self-bound atoms (vanilla)" + "UI-library atoms (with `ui/`)" with the wrapper tier documented ONLY for the UI-library case; update `Step3Form` example and the "Which approach" table; adjust consistency rules if needed.
- `docs/astro-zustand-zod.md`: reframe `useField` as the hook atoms use by default; update the §3 example to the self-bound atom; document the injectable-hook prop.
- `docs/astro-react-islands.md`: replace `<ValidatedInput>` in §5 with `<Input field=... client:load />`.
- `docs/component-dependencies.md`: update Notes (the orphaned list entry for `Input.tsx`/`ValidatedInput.tsx` becomes "reference pattern for stateful atoms").

## Risks / Trade-offs

- **Zero consumers now** → The code change is demonstrative, not exercised. Mitigation: keep code change minimal and correct; verify with `pnpm build` (type-check still validates the refactor).
- **Docs drift if left stale** → Rewriting 4 docs in the same change keeps them truthful. Mitigation: task 5 verification re-reads all four for consistency.
- **Hook-in-prop misuse** → A consumer could pass a non-hook. Mitigation: the default `useField` import + typed prop signature make the misuse path unlikely; documented in `astro-zustand-zod.md`.
- **No presentation-only path modeled** → A truly state-less input (not bound to any store) is intentionally excluded from this change; interface is store-bound by default. If such a case later appears, a separate presentational atom can be added then (aligned with the UI-library-only wrapper rule).
- **Active change overlap on docs** → `derive-pagekey-in-components` touches `docs/astro-i18n.md`, not the four docs here. No conflict; sequence independently.

## Migration Plan

1. Refactor `src/components/atoms/Input.tsx` (injectable hook + store-bound default).
2. Delete `src/components/atoms/ValidatedInput.tsx`.
3. Rewrite the 4 docs to the self-bound model.
4. Run `pnpm build`; confirm zero consumers and i18n validation pass.
5. Rollback = `git revert` (docs + 2 files); store untouched either way.

## Open Questions

- (none — resolved: `ValidatedInput.tsx` is deleted outright; no consumers exist, and a re-export would be dead code.)
