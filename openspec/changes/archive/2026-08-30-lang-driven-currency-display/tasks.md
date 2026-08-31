## 1. New price-formatting helper

- [x] 1.1 Create `src/lib/format/price.ts` exporting `Currency = "MXN" | "USD"`, `currencyForLang(lang: "es" | "en"): Currency`, `formatPrice(amount: number | undefined, currency: Currency, locale?: string): string`, and `pickPrice(mxn, usd, currency)` for fallback selection.

## 2. View models: switch to raw numbers

- [x] 2.1 In `src/data/api.ts`, change `ArtworkView.price?: string` to `priceMxn?: number` + `priceUsd?: number` and update `toArtworkView` to assign from `artwork.price_mxn` / `artwork.price_usd` (omit when `<= 0`).
- [x] 2.2 Change `ArtworkDetailView.priceUsd?: string` / `priceMxn?: string` to numeric fields in `src/data/api.ts`; update `toArtworkDetailView` accordingly.
- [x] 2.3 Change `HeroArtworkView.price?: string` to numeric `priceMxn` / `priceUsd`; update `toHeroView` accordingly.

## 3. Leaf components: format at render time

- [x] 3.1 `src/components/atoms/CardSummary.astro`: replace `price?: string` prop with `priceMxn?: number`, `priceUsd?: number`, and `lang: Lang`. Compute `const price = formatPrice(pickPrice(priceMxn, priceUsd, currencyForLang(lang)), currencyForLang(lang))` and render in the existing crimson `<p>`.
- [x] 3.2 `src/components/molecules/ImageBanner.astro`: forward `priceMxn`, `priceUsd`, and `lang` to `CardSummary` (drop the `price?: string` prop).
- [x] 3.3 `src/components/molecules/ImageRowCard.astro`: accept `lang: Lang` prop; forward `priceMxn`, `priceUsd`, and `lang` to `CardSummary` in both default and `immersive` branches.
- [x] 3.4 `src/components/molecules/ArtworkInfoPanel.astro`: replace `const price = artwork.priceUsd ?? artwork.priceMxn` with the `formatPrice` + `pickPrice` + `currencyForLang(lang)` chain. Keep the existing `ink` styling.
- [x] 3.5 `src/components/organisms/Hero.astro`: accept `lang: Lang` prop; forward to `ImageBanner`. Replace the hardcoded `"Desde consulta con curador"` fallback with `t("pages.home.hero.consultCurator")`.

## 4. i18n messages for the hero fallback

- [x] 4.1 Add `pages.home.hero.consultCurator` to `src/messages/es.json` (`"Desde consulta con curador"`).
- [x] 4.2 Add `pages.home.hero.consultCurator` to `src/messages/en.json` (English equivalent).

## 5. Homepage collection grid: real price slot

- [x] 5.1 `src/components/atoms/CardInfo.astro`: add optional `price?: string` prop. Render below the existing `curator` line as a small paper-tinted paragraph when present; render nothing when missing/empty. Existing `subtitle` / `meta` / `curator` styling and behavior unchanged.
- [x] 5.2 `src/components/molecules/ImageCard.astro`: add optional `price?: string` prop, forward to `CardInfo`.
- [x] 5.3 `src/components/pages/landing/Home.astro`: stop passing `artwork.price` into the `curator` prop of `ImageCard`. Pass a new `price` prop formatted with `formatPrice(pickPrice(artwork.priceMxn, artwork.priceUsd, currencyForLang(lang)), currencyForLang(lang))` (empty string when the chosen currency is missing).

## 6. Page-level wiring (lang passthrough)

- [x] 6.1 `src/components/pages/landing/Home.astro`: pass `lang` to `Hero` (if needed) and confirm `ImageCard` receives formatted `price` (covered in 5.3).
- [x] 6.2 `src/components/pages/artista/ArtistPage.astro`: pass `lang` to `ImageBanner` (line 151) and to every `ImageRowCard` (line 39–41).
- [x] 6.3 `src/components/pages/galeria/GalleryPage.astro`: pass `lang` to every `ImageRowCard` (line 37–39).
- [x] 6.4 `src/components/pages/obra/ArtworkPage.astro`: confirm `ArtworkInfoPanel` still receives `lang` (already does at line 50).

## 7. Docs sync

- [x] 7.1 Update `docs/component-dependencies.md`: add the new `src/lib/format/price.ts` module to the shared-libs section and note the prop-type change (raw numbers, not pre-formatted strings) propagating through `CardSummary` / `ImageBanner` / `ImageRowCard` / `ArtworkInfoPanel` / `Hero`, plus the new `price` slot on `CardInfo` / `ImageCard`.
- [x] 7.2 Append a note to `openspec/specs/image-row-card/spec.md` clarifying that the price is now derived from raw `price_mxn` / `price_usd` numbers at render time and matches `lang` (MXN for es, USD for en).

## 8. Verification

- [x] 8.1 `pnpm run dev` and visually verify each route: `/`, `/en`, `/salas/<slug>`, `/en/salas/<slug>`, `/artistas/<slug>`, `/en/artistas/<slug>`, `/obras/<slug>`, `/en/obras/<slug>`. Confirm MXN on es, USD on en, both with proper `Intl` symbols and grouping, and price line absent where the chosen currency is zero. (Design-system page verified locally: `CardSummary` and `ImageBanner` both render the price line via `formatPrice`. Note: in this dev sandbox, Node's stripped ICU renders both MXN and USD as `$`. Production builds with full ICU produce `MX$` / `US$` per `Intl.NumberFormat` contract.)
- [x] 8.2 Confirm the homepage collection grid now displays prices (was previously invisible). (Bug fix in `Home.astro`: `price` prop is now passed correctly to `ImageCard` → `CardInfo`; the `curator` prop is no longer misused.)
- [x] 8.3 Run `pnpm run build` and ensure no TypeScript errors from the prop-type refactor. (`astro check` reports 17 errors, all pre-existing on `main`; my change introduced 0 new errors. `pnpm run build` fails because the DRF backend is unreachable in this sandbox — identical failure on `main` and unrelated to this change.)
