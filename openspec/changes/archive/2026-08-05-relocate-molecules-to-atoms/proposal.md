## Why

Four presentational components currently live in `src/components/molecules/` but behave as atoms: they are single-leaf, stateless, prop-driven UI primitives. `CardInfo`, `CardSummary`, and `Title` render exactly one root element with no child-component composition; `LangBtns` is a self-contained language switcher. Their placement in `molecules/` mislabels them against the project's own atomic design model (molecules = "combinations of atoms"), which obscures the architecture and makes the component tiers inconsistent.

## What Changes

- **Move** `src/components/molecules/CardInfo.astro`, `CardSummary.astro`, `Title.astro`, and `LangBtns.astro` to `src/components/atoms/` (via `git mv`, no content change).
- **Relabel** the tier classification of these components from molecule → atom:
  - `card-info-molecule` → atom
  - `card-summary` → atom
  - `title-molecule` → atom
  - `lang-btns-molecule` → atom
- **Update all consumer import paths** (design-system page, Header, Gallery, ImageCard, ImageBanner, Home) to reference the new locations.
- **Update** `LangBtns.astro`'s internal `Btn` import from `../atoms/Btn` to `./Btn`.
- **Update documentation** so it stays in sync: `docs/component-dependencies.md` (diagram + design-system tree) and `docs/astro-atomic-components.md` (document that atoms MAY import sibling atoms).
- **BREAKING (docs, spec model)**: The capability specs (`card-info-molecule`, `card-summary`, `lang-btns-molecule`, `title-molecule`) are reclassified as atom capabilities; their spec files are updated via MODIFIED delta specs under the existing identifiers, which are retained.

### Design decision: `LangBtns` is a boundary case

`LangBtns` composes the `Btn` atom plus i18n URL derivation. Under a strict reading of `docs/astro-atomic-components.md`, atoms may only import from `store/*` and `lib/*` — importing another atom (`Btn`) is a molecule trait. **Decision:** accept the move to atoms for consistency with the other three and document that atoms may import sibling atoms; update `docs/astro-atomic-components.md` accordingly. Alternative (leave `LangBtns` in `molecules/`) is noted in `design.md` but not chosen.

## Capabilities

### New Capabilities

- (none — all four components already have capability specs; they are reclassified, not introduced)

### Modified Capabilities

- `card-info-molecule`: reclassified as an atom; identical props/rendering, tier reclassified molecule → atom.
- `card-summary`: reclassified as an atom; identical props/rendering, tier reclassified molecule → atom.
- `lang-btns-molecule`: reclassified as an atom; identical props/rendering; component may import sibling atoms.
- `title-molecule`: reclassified as an atom; identical props/rendering, tier reclassified molecule → atom.

## Impact

- **Files moved (no content change):** `CardInfo.astro`, `CardSummary.astro`, `Title.astro`, `LangBtns.astro` → `src/components/atoms/`.
- **Import path fixes (9 import statements, 6 files):**
  - `src/pages/design-system.astro` — imports all four
  - `src/components/organisms/Header.astro` — `LangBtns`
  - `src/components/organisms/Gallery.astro` — `Title`
  - `src/pages/.../Home.astro` (`src/components/pages/landing/Home.astro`) — `Title`
  - `src/components/molecules/ImageCard.astro` — `CardInfo` (relative)
  - `src/components/molecules/ImageBanner.astro` — `CardSummary` (relative)
- **Internal import fix:** `LangBtns.astro` (`../atoms/Btn` → `./Btn`).
- **Specs updated:** 4 capability specs reclassified.
- **Docs updated:** `docs/component-dependencies.md`, `docs/astro-atomic-components.md`.
- **No user-facing or behavioral change:** identical props, rendering, and component API.
- **No dependency changes:** no package.json changes.