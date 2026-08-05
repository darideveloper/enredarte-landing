# Design: relocate-molecules-to-atoms

## Context

The project follows a 4-tier atomic design hierarchy (`docs/astro-atomic-components.md`): atoms are the smallest self-contained components, molecules are combinations of atoms, organisms compose molecules. Four components currently live in `src/components/molecules/` despite behaving as single-leaf, stateless, prop-driven primitives:

- `CardInfo` — one root `<a>`, no child-component composition
- `CardSummary` — one root `<a>`, no child-component composition
- `Title` — one root `<div>` wrapping an `<h2>` and optional raw `<a>`, no child-component composition
- `LangBtns` — composes two `Btn` atoms plus i18n URL derivation

The tier misclassification makes the architecture inconsistent: structurally identical presentational components (e.g. `Headline`, `BannerText`, `FilterBtn`) already live in `atoms/`, while these four sit one tier up. This is a pure relocation refactor — no props, rendering, or behavior change.

## Goals / Non-Goals

**Goals**
- Move all four components into `src/components/atoms/` with identical content.
- Fix every consumer import so the build stays green.
- Update specs and docs to reflect the new tier, keeping `docs/component-dependencies.md` in sync (per AGENTS.md).

**Non-Goals**
- No component API, styling, or behavior changes.
- No new capabilities or dependencies.
- No re-architecture of the atomic hierarchy beyond the documented atom-imports-atom allowance.

## Decisions

### D1: Relocate via `git mv` (preserve history), not copy+delete
Move files with `git mv` so git tracks the rename and the working tree diff is clean.
**Alternatives considered:** copy+delete loses history and risks content drift. Rejected.

### D2: `LangBtns` moves to atoms despite composing `Btn`
`LangBtns` imports `../atoms/Btn` and i18n utils. Strict reading of `docs/astro-atomic-components.md` (line 71) limits atoms to importing from `store/*` and `lib/*`, which would make `LangBtns` a molecule by definition. **Decision:** accept the move and update the doc to allow atoms to import sibling atoms (vanilla atoms are still standalone, they just may reuse another atom). Rationale: the user's intent is a consistent presentational-primitive tier; `LangBtns` is stateless and self-contained, and the resulting dependency (`LangBtns → Btn`) is acyclic and shallow. The atom-imports-atom edge is explicitly documented in `astro-atomic-components.md` to prevent confusion.
**Alternatives considered:**
- *Leave `LangBtns` in `molecules/`.* Respects the letter of the current doc but splits the refactor and leaves one presentational primitive above the rest. Rejected per user direction.
- *Move `LangBtns` but inline the `Btn` markup.* Duplicates the button styles and loses reuse. Rejected.

### D3: Capability specs keep their existing identifiers
The existing spec folders are `card-info-molecule`, `card-summary`, `lang-btns-molecule`, `title-molecule`. OpenSpec applies delta specs onto the main spec by folder name; renaming capability folders is not a first-class CLI operation. **Decision:** write MODIFIED delta specs under the existing folder names, updating the molecule→atom classification in requirement text. Spec identifiers stay as-is; the component tier is described in the requirement wording and in docs.
**Alternative considered:** creating new `*-atom` capability folders and deleting the old ones at archive time — requires manual spec surgery with no CLI support. Rejected as higher risk for no functional gain.

### D4: Import path changes follow relative conventions
Consumers already use a mix of absolute (`../molecules/Title.astro`) and relative (`./CardInfo.astro`) imports. Update each to point at `atoms/` keeping the same style (absolute `../atoms/...`, relative `./...`→`../atoms/...` for ImageCard/ImageBanner which sit in `molecules/`).
**Rationale:** minimal, mechanical diff; matches existing conventions; no import-alias reconfiguration needed (project has no `@/` alias in these files).

## Risks / Trade-offs

- [Atoms now import atoms (LangBtns → Btn), deviating from the documented import table] → Update `docs/astro-atomic-components.md` to state atoms MAY import sibling atoms; keep the "molecules compose atoms" rule intact.
- [Missed consumer import → broken build] → The 9 import statements / 6 files are enumerated in the proposal; verification task greps for any remaining `molecules/{CardInfo,CardSummary,LangBtns,Title}` references.
- [Spec identifiers still say `*-molecule`] → Accepted trade-off; requirement text and docs reflect the atom tier. Note in docs that identifier ≠ tier.
- [Docs drift if `component-dependencies.md` is not updated] → Dedicated task updates the diagram and design-system tree.

## Migration Plan

1. `git mv` the four components `molecules/` → `atoms/`.
2. Fix `LangBtns.astro` internal import (`../atoms/Btn` → `./Btn`).
3. Update the 6 consumer files (9 import statements).
4. Update `docs/component-dependencies.md` and `docs/astro-atomic-components.md`.
5. Verify: grep for stale references; run `pnpm run dev` / build.
6. Archive the change (applies the delta specs to main specs).

Rollback: `git revert` the move + import commits; files and imports return atomically. No data or behavior risk.

## Open Questions

- None blocking. The `LangBtns` boundary case is decided in D2. If the user later prefers strict atomic purity, `LangBtns` can be moved back to `molecules/` as a follow-up.
