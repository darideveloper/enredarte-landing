## Context

The DRF backend already returns `price_mxn` and `price_usd` as separate numeric fields on every artwork, so the data plumbing is in place. The Astro app today:

- **Pre-formats** prices as display strings in `src/data/api.ts` at build time (four sites: `toArtworkView`, `toArtworkDetailView`, `toHeroView`, and one in `Hero.astro`'s fallback string).
- **Picks** USD-or-MXN in exactly one place — `ArtworkInfoPanel.astro:25` (`const price = artwork.priceUsd ?? artwork.priceMxn`) — a static, server-side, non-user-controllable fallback.
- **Renders** the pre-formatted strings in `CardSummary`, `ImageBanner`, `ImageRowCard`, `ArtworkInfoPanel`, and `Hero`. The homepage collection grid (`Home.astro:89`) accidentally feeds the price into `ImageCard`'s `curator` slot, so prices are invisible there.
- Has **no** `formatPrice` helper, **no** currency store, **no** UI toggle, **no** exchange-rate layer. The user has confirmed: the URL's language is the only source of truth (`es → MXN`, `en → USD`), with no visible currency control.

The project uses zustand for filter state (`src/store/catalog.ts`) but never persists currency. Pages are server-rendered once per language route. There is one i18n message bundle (`src/messages/{es,en}.json`) and a `getTranslations(lang)` helper.

## Goals / Non-Goals

**Goals**
- Make the displayed currency track the URL's language, server-rendered, with zero client-side hydration cost.
- Centralize all price formatting in a single `formatPrice` helper using `Intl.NumberFormat` for idiomatic locale output (`MX$250,000`, `US$12,500`).
- Carry raw `priceMxn` / `priceUsd` numbers through the view model layer so a single build serves both languages correctly.
- Fix the homepage collection grid so it actually displays prices, and add a real `price` slot to `CardInfo` / `ImageCard`.
- Move the hardcoded `"Desde consulta con curador"` fallback into i18n messages.

**Non-Goals**
- No visible currency toggle UI.
- No client-side currency state, no zustand currency store, no `localStorage` / `sessionStorage` for currency.
- No exchange-rate fetching, no client-side conversion, no new backend endpoint. The DRF contract is unchanged.
- No new i18n keys for currency names — `Intl.NumberFormat` handles localization.
- No new dependencies.

## Decisions

### Decision: Server-side per-page format using `Intl.NumberFormat`

**Rationale:** Astro renders each language route independently. Picking the currency from `lang` at render time and formatting with `Intl.NumberFormat` produces idiomatic output (`MX$` / `US$`, correct grouping, no decimal places for whole-peso amounts) without hydration, without a store, and without any client JS. The user explicitly said the language is the source of truth, so this is the simplest possible implementation.

**Alternatives considered:**
- *Client-side zustand store + visible toggle* — rejected; user said no visible UI.
- *Client-side `Intl.NumberFormat` after hydration* — rejected; server can already do this per page, no benefit to deferring.
- *Hardcoded `MXN_PER_USD` constant + runtime conversion* — rejected; user chose to use the backend's two precomputed numbers.

### Decision: Stop pre-formatting prices in `src/data/api.ts`

**Rationale:** The current `toArtworkView`, `toArtworkDetailView`, and `toHeroView` all produce `price` / `priceUsd` / `priceMxn` as formatted strings. Pre-formatting bakes a language assumption into the view model, so switching to a single source of formatting at the leaf requires these to be raw numbers.

**Alternatives considered:**
- *Keep pre-formatted strings, branch in each renderer on `lang`* — rejected; the strings can't be re-formatted, and we'd have to either ship both per artwork or re-think the API.
- *Pre-format both currencies and let the renderer pick one* — rejected; wastes build time, harder to reason about, and the renderer would still have to pick a string per language.

### Decision: Single `src/lib/format/price.ts` module

**Rationale:** A dedicated module holds `formatPrice`, `currencyForLang`, and a `pickPrice` helper. Mirrors the existing `src/lib/utils.ts` (cn, stripUrlScheme) and `src/lib/i18n/utils.ts` style: small, no Astro imports, easily testable. The leaf components import only what they need; nothing else changes.

**Alternatives considered:**
- *Inline the helper in each component* — rejected; same logic in 4+ places is the duplication we're removing.
- *Put it under `src/lib/i18n/`* — rejected; it's not translation logic.

### Decision: Add a `price` slot to `CardInfo` / `ImageCard`

**Rationale:** The homepage collection grid is the primary discoverability surface and currently displays zero prices. The bug at `Home.astro:89` shows the author intended to display a price there. Adding a `price?: string` prop to `ImageCard` (forwarded to `CardInfo`) closes the loop. Parents pass an already-formatted string; the atom stays presentational and matches the `CardSummary` shape (which is also a presentational price line).

**Alternatives considered:**
- *Have the homepage use `ImageRowCard` instead* — rejected; the collection grid is a 4:5 aspect grid, not a 2:1 row layout.
- *Render the price outside `CardInfo` (in `Home.astro` itself)* — rejected; that would break the overlay/hover styling and split price rendering across files.

### Decision: Add `pages.home.hero.consultCurator` to both message bundles

**Rationale:** The literal string is currently hardcoded in `Hero.astro:26`. Moving it to `src/messages/es.json` and `src/messages/en.json` follows the existing i18n pattern (`getTranslations(lang)`) and unblocks the English hero (which today always shows Spanish copy when there's no featured price).

**Alternatives considered:**
- *Just add a translation inside `Hero.astro` with a ternary* — rejected; the project standardizes on the `getTranslations` helper.

## Risks / Trade-offs

- **Breaking change for any code reading the old `price?: string` field** → the prop is renamed/retyped on `ArtworkView`, `ArtworkDetailView`, `HeroArtworkView`. All consumers are inside this repo, so a single PR catches them. Mitigated by following the existing view-model type plumbing.
- **Homepage collection grid changes UX** (now shows prices for the first time) → confirmed by user. No graceful fallback needed; just ensure `price` is omitted cleanly when the chosen currency is missing.
- **Intl output varies slightly across Node/ICU versions** → Astro builds run on Node 18+ which ships with full ICU. Output is deterministic for the locales used (`es-MX`, `en-US`). No mitigation needed.
- **`ImageRowCard` receives `lang` for the first time** → adds a required prop on a molecule used in 3 places. Each call site already has `lang` in scope, so the change is mechanical. Mitigated by TypeScript catching any missed call site at build time.
- **No visual currency toggle means users can't override** → explicit user decision. Documented in proposal non-goals.

## Migration Plan

- This is a single PR replacing pre-formatted strings with raw numbers + a format helper. No runtime data migration.
- Rollback is a `git revert` of the PR; no schema or build-output state is changed.
- Verify on the dev server (`pnpm run dev`) by visiting `/`, `/en`, `/obras/<slug>`, `/en/obras/<slug>`, `/salas/<slug>`, `/artistas/<slug>`, and the homepage collection grid. Confirm the right currency shows in the right language and that the price line is absent when the chosen currency is zero.

## Open Questions

None at apply time. The user has confirmed: backend source, no visible toggle, language-driven, fix the homepage bug, use `Intl.NumberFormat` with full locale.
