## 1. Cross-directory imports → @/ alias

- [x] 1.1 Rewrite imports in `src/layouts/Layout.astro` (3): `Header`, `Footer` → `@/components/organisms/...`, `getLangFromUrl` → `@/lib/i18n/utils`
- [x] 1.2 Rewrite imports in `src/pages/[...path].astro` (3): `Layout` → `@/layouts/Layout.astro`, `routes` → `@/lib/i18n/routes`, `Home` → `@/components/pages/landing/Home.astro`
- [x] 1.3 Rewrite imports in `src/pages/design-system.astro` (18): all `../components/...` → `@/components/...`
- [x] 1.4 Rewrite imports in `src/components/organisms/Header.astro` (6): `Logo`, `Btn`, `LangBtns`, `Menu` → `@/components/...`; `cn` → `@/lib/utils`; i18n → `@/lib/i18n/utils`
- [x] 1.5 Rewrite imports in `src/components/organisms/Footer.astro` (2): `BUSINESS_DATA` → `@/data/site-config`; i18n → `@/lib/i18n/utils`
- [x] 1.6 Rewrite imports in `src/components/organisms/Hero.astro` (3): `H1`, `Headline`, `ImageBanner` → `@/components/...`
- [x] 1.7 Rewrite imports in `src/components/organisms/Gallery.astro` (4): `Title`, `Headline`, `ImageCard` → `@/components/...`; `cn` → `@/lib/utils`
- [x] 1.8 Rewrite imports in `src/components/organisms/Artworks.astro` (2): `cn` → `@/lib/utils`; `ImageCard` → `@/components/molecules/ImageCard.astro`
- [x] 1.9 Rewrite imports in `src/components/organisms/BannerBar.astro` (2): `cn` → `@/lib/utils`; `BannerText` → `@/components/atoms/BannerText.astro`
- [x] 1.10 Rewrite imports in `src/components/molecules/Menu.astro` (2): `Link` → `@/components/atoms/Link.astro`; `cn` → `@/lib/utils`
- [x] 1.11 Rewrite imports in `src/components/molecules/H1.astro` (1): `cn` → `@/lib/utils`
- [x] 1.12 Rewrite imports in `src/components/molecules/Filters.astro` (2): `cn` → `@/lib/utils`; `FilterBtn` → `@/components/atoms/FilterBtn.astro`
- [x] 1.13 Rewrite imports in `src/components/molecules/ImageCard.astro` (3): `cn` → `@/lib/utils`; `Image`, `CardInfo` → `@/components/atoms/...`
- [x] 1.14 Rewrite imports in `src/components/molecules/ImageBanner.astro` (3): `Image`, `CardSummary` → `@/components/atoms/...`; `cn` → `@/lib/utils`
- [x] 1.15 Rewrite imports in `src/components/pages/landing/Home.astro` (9): i18n → `@/lib/i18n/utils`; `PageSEO`, `Hero`, `BannerBar`, `Gallery`, `Title`, `Headline`, `Filters`, `Artworks` → `@/components/...`
- [x] 1.16 Rewrite imports in `src/components/seo/base/BaseSEO.astro` (3): `BUSINESS_DATA` → `@/data/site-config`; `SITE_TITLE` et al → `@/consts`; i18n → `@/lib/i18n/utils`
- [x] 1.17 Rewrite imports in `src/lib/i18n/ui.ts` (2): `en.json`, `es.json` → `@/messages/...`
- [x] 1.18 Rewrite `cn` imports in atom files `Title`, `Headline`, `Image`, `CardInfo`, `CardSummary`, `FilterBtn`, `BannerText`, `Link`, `LangBtns` → `@/lib/utils` (9 files)
- [x] 1.19 Rewrite i18n import in `src/components/atoms/LangBtns.astro` (1): → `@/lib/i18n/utils`; confirm `./Btn` stays relative

## 2. Same-directory imports (verify no change)

- [x] 2.1 Confirm `./` imports stay relative: `store/useField.ts → ./form`, `lib/i18n/utils.ts → ./ui|./routes`, `atoms/LangBtns.astro → ./Btn`, `seo/PageSEO.astro → ./base/BaseSEO.astro`, `lib/api/* → ./client|./types`

## 3. Automated enforcement

- [x] 3.1 Create `scripts/validate-imports.ts` scanning `src/**/*.{astro,ts,tsx}` for `from "..."` / `import("...")` paths starting with `../`; exit non-zero and print offenders on match
- [x] 3.2 Add `"validate-imports": "tsx scripts/validate-imports.ts"` npm script and wire it into `build` (alongside `validate-i18n`)
- [x] 3.3 Run `pnpm validate-imports` — must pass clean

## 4. Documentation alignment

- [x] 4.1 Update code examples in `docs/astro-i18n.md`, `docs/astro-site-config.md`, `docs/astro-fetch-wrapper.md`, `docs/astro-react-islands.md`, `docs/astro-pwa.md` to use `@/` for cross-directory imports (keep `./` for same-directory)
- [x] 4.2 Update `docs/component-dependencies.md` Notes if import-path references appear there

## 5. Verification

- [x] 5.1 Run `pnpm build` — must succeed
- [x] 5.2 Run `pnpm validate-imports` — must pass
- [x] 5.3 Grep `src/` for remaining `../` imports and confirm zero cross-directory occurrences remain (only `./` siblings allowed)

## 6. Artifact accuracy fixes (from verification)

- [x] 6.1 Correct proposal/design import counts (78 across 26 files) and design-system count (18)
- [x] 6.2 Align proposal enforcement wording with design decision (validation script, not ESLint)
- [x] 6.3 Add `docs/astro-pwa.md` to doc-alignment task coverage

## 7. Bare-import gap (found in re-verification)

- [x] 7.1 Extend `validate-imports.ts` regex to also catch bare side-effect imports (`import "../..."`, e.g. CSS) — the original `from`/`import(` patterns missed them
- [x] 7.2 Convert `src/layouts/Layout.astro` and `src/pages/design-system.astro` `import "../styles/global.css"` → `@/styles/global.css`
- [x] 7.3 Update `docs/astro-react-islands.md` and `docs/astro-pwa.md` `import '../styles/global.css'` examples → `@/styles/global.css`
- [x] 7.4 Update `design.md` Decision 4 to document the bare-import pattern
