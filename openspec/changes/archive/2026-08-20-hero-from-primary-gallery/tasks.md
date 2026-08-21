## 1. Data layer

- [x] 1.1 Add `is_primary: boolean` to the `Gallery` interface in `src/lib/api/types.ts`
- [x] 1.2 Add a `HeroView` interface and a `toHeroView(...)` helper in `src/data/api.ts` that selects the gallery with `is_primary === true` (falling back to the first gallery), resolving localized title/description, curator name, featured artwork (primary image, title, artist, price), and localized href — reusing `pickTranslation`, `resolveGalleryCurator`, `resolveGalleryArtworks`, `primaryImage`, `resolveArtistName`, and `getLocalizedSalaPath`

## 2. Homepage wiring

- [x] 2.1 In `src/components/pages/landing/Home.astro`, compute the hero view model from the primary gallery and its array index, and pass it to `<Hero />` (line 52)

## 3. Hero component

- [x] 3.1 Update `src/components/organisms/Hero.astro` to accept a `sala` prop with safe defaults and render title, description, badge ("Sala NN — Exhibición del mes"), curator line, and the `ImageBanner` artwork from props instead of hardcoded copy
- [x] 3.2 Point the primary CTA ("Entrar a la Sala") and the artwork banner `href` to the gallery detail path via `getLocalizedSalaPath`, and show the real `price_usd` (omitted when absent) in the banner

## 4. Verification

- [x] 4.1 Ensure the design-system showcase still renders `<Hero />` (no props) without error
- [x] 4.2 Run typecheck/build and manually verify the homepage hero shows the primary gallery data (`galeria-luz`) with correct localized content and intact GSAP animation
- [x] 4.3 Update `docs/component-dependencies.md` if the Hero's data flow changed

## 5. Docs

- [x] 5.1 Confirm the `gallery-data` and `hero-section` main specs are consistent with the deltas in this change
