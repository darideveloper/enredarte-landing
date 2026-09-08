## Why

A technical quality and accessibility audit of the newly introduced curator detail page (`CuratorPage.astro`) revealed several WCAG AA and integrity defects: curator biography text fails WCAG AA contrast (3.2:1 against the paper background), the curated rooms section hardcodes the Spanish string "Explora" on English routes, card molecules duplicate `<h2>` headings causing an invalid heading outline, and mobile touch targets on curator contact links are under 24px in height. Resolving these issues ensures the curator pages meet accessibility standards (WCAG 2.1/2.2 AA), enforce strict bilingual parity, and maintain design system integrity.

## What Changes

- Extract hardcoded "Explora" string in `CuratorSalas.astro` into translation catalogs (`src/messages/es.json` and `src/messages/en.json`) under `global.curator.explore`.
- Upgrade `CuratorHero.astro` typography contrast: switch bio copy from `text-muted` to `text-ink/85` (contrast > 10:1) and tune `--color-muted` in `src/styles/global.css` from `#8A8478` to `#6E685C` (contrast 4.66:1 against `#F2EDE4`).
- Add configurable heading levels (`headingTag`) to `CardInfo.astro` and `ImageCard.astro`, specifying `<h3>` in `CuratorSalas.astro` to nest semantically under the section's `<h2>`.
- Enlarge mobile touch target hitboxes for email and website links in `CuratorHero.astro` to at least 44px (`min-h-[44px]` and `py-2.5`).
- Enhance accessibility attributes on fallback monograms (`aria-hidden="true"` with accessible wrapper `aria-label`) and external links (`(opens in a new tab)` screen reader context).
- Replace hardcoded hex colors (`#CCC`, `#999`, `#0D0D0D`) in card molecules with semantic design tokens (`text-paper/80`, `text-paper/60`, `bg-ink`).
- Add lazy loading and async decoding props to `Image.astro`.

## Capabilities

### New Capabilities

### Modified Capabilities
- `curator-detail-page`: Enforce WCAG AA contrast on hero copy, bilingual localization for the curated rooms eyebrow, semantic heading hierarchy for exhibition cards, accessible touch targets, and assistive technology labels.

## Impact

- **Affected files**:
  - `src/messages/es.json`, `src/messages/en.json`
  - `src/styles/global.css`
  - `src/components/organisms/CuratorHero.astro`
  - `src/components/organisms/CuratorSalas.astro`
  - `src/components/atoms/CardInfo.astro`
  - `src/components/molecules/ImageCard.astro`
  - `src/components/atoms/Image.astro`
- **Dependencies & APIs**: No new dependencies or backend API changes.
- **Validation**: Strict i18n key parity enforced by `validate-i18n.ts`.
