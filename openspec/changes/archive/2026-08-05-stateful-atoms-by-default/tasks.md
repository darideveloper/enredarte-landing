## 1. Refactor the Input atom

- [x] 1.1 Refactor `src/components/atoms/Input.tsx` to be store-bound: add a required `field` prop and an optional `useField` prop (defaulting to the project `useField` hook), rendering value/error/setter via the hook with hydration-safe `mounted` handling
- [x] 1.2 Remove the `// DUMMY COMPONENT` header comment from `Input.tsx` (it becomes the reference stateful atom)
- [x] 1.3 Delete `src/components/atoms/ValidatedInput.tsx` outright (no consumers; its responsibilities fold into `Input`); update any remaining references

## 2. Rewrite `docs/astro-atomic-components.md`

- [x] 2.1 Replace the two-tier vanilla example (`Input` + `ValidatedInput`, lines ~113-172) with a single self-bound atom example (`<Input field=... />`)
- [x] 2.2 State the vanilla-vs-UI-library rule: UI-library projects require the wrapper tier; vanilla projects use self-bound atoms
- [x] 2.3 Update the shadcn "stateful atom" example (lines ~187-213) to clarify it applies only to the `ui/`-library case
- [x] 2.4 Update the `Step3Form` organism example (lines ~283-305) to use `<Input field=... />` instead of `ValidatedInput`
- [x] 2.5 Update the "Which approach to pick?" table and §6 consistency rules to reflect the vanilla default

## 3. Rewrite `docs/astro-zustand-zod.md`

- [x] 3.1 Reframe `useField()` as the hook vanilla atoms use by default (lines ~142-148, ~275)
- [x] 3.2 Update the §3 "Stateful atom" example (lines ~186-198) to the self-bound `Input` with injectable hook
- [x] 3.3 Document the injectable-hook prop pattern (default `useField` import; consumer may pass a custom hook/store)

## 4. Update remaining docs

- [x] 4.1 Update `docs/astro-react-islands.md` §5 example (lines ~111-130) to use `<Input field="user_name" client:load />` instead of `<ValidatedInput>`
- [x] 4.2 Update `docs/component-dependencies.md` Notes (lines ~134-137): replace the orphaned `Input.tsx`/`ValidatedInput.tsx` entry with a note that `Input` is the reference stateful atom and `ValidatedInput.tsx` no longer exists

## 5. Verify

- [x] 5.1 Confirm no references to `ValidatedInput` remain in `src/` or the four docs
- [x] 5.2 Confirm `src/store/form.ts`, `src/store/useField.ts`, and `zustand`/`zod` deps are unchanged
- [x] 5.3 Run `pnpm build` and confirm it succeeds (i18n validation + static routes unchanged)

## 6. Add AI-agent guidance notes for project replication

- [x] 6.1 Add a top-of-doc "two mutually exclusive approaches" callout with the decision rule and "ask the user if unsure" instruction to `docs/astro-atomic-components.md`
- [x] 6.2 Add a "PICK ONE" callout at §2 (`atoms/`) in `docs/astro-atomic-components.md`
- [x] 6.3 Add a reader note clarifying the `Step3Form` example mixes self-bound `Input` with UI-library wrapper atoms (approaches 1 + 2) in `docs/astro-atomic-components.md`
- [x] 6.4 Add the two-approaches guidance callout to `docs/astro-zustand-zod.md`
- [x] 6.5 Add the two-approaches guidance callout to `docs/astro-react-islands.md`
- [x] 6.6 Bump the `updated` frontmatter date to `2026-08-05` on the three edited docs
