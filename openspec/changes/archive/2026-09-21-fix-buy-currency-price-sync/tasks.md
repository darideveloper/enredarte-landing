## 1. Island state lift

- [x] 1.1 Move currency state to `ArtworkPurchase`: add `useState<Currency>(initial)` in `src/components/organisms/ArtworkPurchase.tsx` where initial prefers `currencyForLang(lang)` and falls back to the currency with a (live ?? baked) price; derive `price` from state; pass `currency` + `onCurrencyChange` + reconciled `priceMxn`/`priceUsd` to `BuyWidget`; stop passing `lang` to it
- [x] 1.2 Make `BuyWidget` controlled in `src/components/organisms/BuyWidget.tsx`: replace local `useState<SalesCurrency>` with `currency: Currency` + `onCurrencyChange` + `priceMxn?`/`priceUsd?` props, disable the `<option>` lacking a positive price, keep options `MXN`/`USD`, map to lowercase `SalesCurrency` only at the `postBuy()` call
- [x] 1.3 Remove the `lang` prop (and now-unused `Lang` import) from `BuyWidget`; drop the `useState` import if unused

## 2. Static verification

- [x] 2.1 Run `pnpm validate-imports` and `pnpm validate-i18n` — both green
- [x] 2.2 Confirm no other callers of `BuyWidget` break (only `ArtworkPurchase` uses it) and `pnpm astro check` passes

## 3. Browser verification on the already-running dev server (playwright-cli)

> NEVER start the dev server — it is already running at `https://enredarte-landing.localhost` (portless). If it is down, stop and ask the user to start it with `pnpm run dev`.

- [x] 3.1 Open the running site with playwright-cli (`playwright-cli open https://enredarte-landing.localhost/obras`), `snapshot`, and follow one available artwork link to `/obras/{slug}` (prefer an artwork showing a price; record the chosen slug; if no available artwork exists, record the badge state and stop)
- [x] 3.2 On the artwork page, `snapshot` the purchase zone, read the price text via `eval`, then change the currency selector (`select <ref> "USD"` / `"MXN"`) and re-`snapshot` + `eval` — price text SHALL switch currency (e.g. `MX$…` ↔ `US$…`) with no reload
- [x] 3.3 Repeat 3.2 back to the original currency — price SHALL switch back; reload the page — selector SHALL reset to the lang default (`es`→`MXN`, `en`→`USD`); on a single-price artwork (if one exists) the missing-price option SHALL be disabled
- [x] 3.4 `playwright-cli close`, then report: chosen slug, price strings before/after toggle, and any console errors (`playwright-cli console`)
