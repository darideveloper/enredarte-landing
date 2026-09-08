## 1. Internationalization & Tokens

- [x] 1.1 Add `"explore": "Explora"` and `"explore": "Explore"` to `src/messages/es.json` and `src/messages/en.json`, and verify with `./node_modules/.bin/tsx scripts/validate-i18n.ts`
- [x] 1.2 Tune `--color-muted` to `#6E685C` in `src/styles/global.css` and verify contrast against `#F2EDE4` satisfies WCAG AA (>= 4.5:1)

## 2. Card Molecules & Atoms

- [x] 2.1 Update `src/components/atoms/CardInfo.astro` to support configurable `headingTag` (`h2` | `h3` | `h4`, defaulting to `h2`) and replace hardcoded `#CCC` / `#999` with semantic design tokens (`text-paper/80`, `text-paper/60`)
- [x] 2.2 Update `src/components/molecules/ImageCard.astro` to accept and forward `headingTag` to `CardInfo`, and replace `bg-[#0D0D0D]` with `bg-ink`
- [x] 2.3 Update `src/components/atoms/Image.astro` to accept `loading` and `decoding` props, defaulting to `lazy` and `async`

## 3. Curator Organisms

- [x] 3.1 Update `src/components/organisms/CuratorSalas.astro` to use localized `{t("global.curator.explore")}` and pass `headingTag="h3"` to `ImageCard`
- [x] 3.2 Update `src/components/organisms/CuratorHero.astro` to set bio text to `text-ink/85`, add `min-h-[44px] py-2.5` to email and website links, add `aria-hidden="true"` to the monogram initials fallback with container `aria-label`, and add screen-reader announcement for the external link

## 4. Verification & Audit

- [x] 4.1 Run validation scripts (`validate-i18n.ts` and `validate-imports.ts`) and verify zero errors
- [x] 4.2 Run design detector and verify clean output across modified components
- [x] 4.3 Re-audit `CuratorPage.astro` to confirm score improves from 13/20 to >= 18/20
