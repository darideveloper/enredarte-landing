## Why

The landing currently has no language-aligned currency display. Prices in cards, banners, the hero, and the homepage collection grid are pre-formatted server-side as USD strings (e.g. `$12,500 USD`) and the artwork detail page falls back to MXN only if USD is zero. There is no per-language behavior, no real currency choice, and the homepage collection grid never displays prices at all (a wiring bug at `Home.astro:89` feeds the price into the wrong prop). Visitors on `/` (Spanish) see US prices and a Mexican audience has no first-class experience.

## What Changes

- Carry the **raw** `price_mxn` and `price_usd` numbers from the API through all view models and components instead of pre-formatting at build time.
- Add a single `formatPrice(amount, currency, locale?)` helper plus a `currencyForLang(lang)` rule that maps `es → MXN` and `en → USD`. Render prices on the server with `Intl.NumberFormat(locale, { style: "currency", currency })` so each language gets the right currency, the right symbol (`MX$` / `US$`), and the right thousands separator automatically.
- Update `CardSummary`, `ImageBanner`, `ImageRowCard`, `ArtworkInfoPanel`, `Hero`, and the relevant page components to receive the raw numbers + `lang` and format at render time. There is no visible UI toggle — the URL's language is the only source of truth.
- Add a real `price` slot to `CardInfo` / `ImageCard` and fix the `Home.astro:89` wiring so the homepage collection grid displays prices for the first time.
- Move the hardcoded hero fallback string `"Desde consulta con curador"` into i18n messages.

## Capabilities

### New Capabilities
- `price-formatting`: Defines how artwork prices are derived, formatted, and rendered across the landing based on the current language. Establishes the `formatPrice` helper, the lang→currency rule, and the contract for carrying raw numbers through view models.

### Modified Capabilities
- `artwork-detail-page`: The info panel must pick the price for the current language (MXN when `lang === "es"`, USD when `lang === "en"`), instead of the current `priceUsd ?? priceMxn` fallback.
- `image-row-card`: The `ImageRowCard` molecule must forward both `priceMxn` and `priceUsd` numbers (plus `lang`) to `CardSummary` instead of a pre-formatted `price` string. Empty/zero values continue to suppress the price line.
- `card-info-molecule`: Add an optional `price` prop (already-formatted string) rendered next to existing metadata. Existing `subtitle` / `meta` / `curator` behavior is unchanged.

## Impact

- Code: `src/lib/format/price.ts` (new), `src/data/api.ts` (view models), `src/components/atoms/CardSummary.astro`, `src/components/atoms/CardInfo.astro`, `src/components/molecules/ImageBanner.astro`, `src/components/molecules/ImageRowCard.astro`, `src/components/molecules/ImageCard.astro`, `src/components/molecules/ArtworkInfoPanel.astro`, `src/components/organisms/Hero.astro`, `src/components/pages/landing/Home.astro`, `src/components/pages/artista/ArtistPage.astro`, `src/components/pages/galeria/GalleryPage.astro` (lang passthrough), `src/components/pages/obra/ArtworkPage.astro`, i18n messages (`src/messages/es.json`, `src/messages/en.json`).
- Tests / visual review: every page that shows a price — homepage hero, homepage collection grid, artist page, gallery page, artwork detail.
- Docs: `docs/component-dependencies.md` (new module, prop-type change propagation), `openspec/specs/image-row-card/spec.md` (note: raw numbers, not pre-formatted strings).
- No backend, no client-side state, no zustand store, no `localStorage`/cookie. Server-rendered, language-driven, no hydration cost.
