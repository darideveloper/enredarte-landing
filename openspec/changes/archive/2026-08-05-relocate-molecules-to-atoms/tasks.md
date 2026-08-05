# Tasks: relocate-molecules-to-atoms

## 1. Relocate components

- [x] 1.1 `git mv src/components/molecules/CardInfo.astro src/components/atoms/CardInfo.astro`
- [x] 1.2 `git mv src/components/molecules/CardSummary.astro src/components/atoms/CardSummary.astro`
- [x] 1.3 `git mv src/components/molecules/LangBtns.astro src/components/atoms/LangBtns.astro`
- [x] 1.4 `git mv src/components/molecules/Title.astro src/components/atoms/Title.astro`
- [x] 1.5 Fix `LangBtns.astro` internal import: `../atoms/Btn` → `./Btn` (and verify `../../lib/...` imports still resolve from the new location)

## 2. Update consumer imports

- [x] 2.1 Update `src/components/organisms/Header.astro` — `LangBtns` import → `../atoms/LangBtns.astro`
- [x] 2.2 Update `src/components/organisms/Gallery.astro` — `Title` import → `../atoms/Title.astro`
- [x] 2.3 Update `src/components/pages/landing/Home.astro` — `Title` import → `../../atoms/Title.astro`
- [x] 2.4 Update `src/components/molecules/ImageCard.astro` — `CardInfo` import → `../atoms/CardInfo.astro`
- [x] 2.5 Update `src/components/molecules/ImageBanner.astro` — `CardSummary` import → `../atoms/CardSummary.astro`
- [x] 2.6 Update `src/pages/design-system.astro` — `LangBtns`, `CardSummary`, `Title`, `CardInfo` imports → `../components/atoms/...`

## 3. Update documentation

- [x] 3.1 Update `docs/component-dependencies.md`: Home tree (CardSummary, Title, CardInfo), Layout/Header tree (LangBtns), and design-system tree to reflect atoms placement
- [x] 3.2 Update `docs/astro-atomic-components.md`: document that atoms MAY import sibling atoms (LangBtns → Btn), so the import rules table stays truthful

## 4. Verify

- [x] 4.1 Grep for stale references: no remaining `molecules/{CardInfo,CardSummary,LangBtns,Title}` imports anywhere in `src/`
- [x] 4.2 Build or run dev server (`pnpm run dev` or project build script) and confirm no broken imports
- [x] 4.3 Confirm no other docs reference these components as molecules (e.g. `docs/astro-i18n.md` mentions LangBtns)
