## Why

Artworks are currently dead ends: every `ArtworkView.href` is the placeholder `"#"` (`src/data/api.ts:201`), and there is no way to see a single artwork's full data — its multiple images, localized description, year, dimensions, price, status, and taxonomy. The gallery pages surface artworks only as cards, so buyers can't inspect an individual piece.

## What Changes

- Add a build-time generated artwork detail page for every artwork, in both languages — `/obras/<slug>` (Spanish, root) and `/en/obras/<slug>` (English, `en/` prefix) — following the site's established i18n convention (mirroring the gallery-detail pattern where Spanish is root and English sits under `en/`). Extend the existing `[...path].astro` catch-all `getStaticPaths()` and add an `artwork` entry to its `COMPONENT_MAP`. No separate route file SHALL be introduced.
- New `ArtworkPage.astro` page component: images on the **left**, a fixed info panel on the **right**.
- Multi-image scroll experience via the installed GSAP `ScrollTrigger`: the section is pinned while a scrubbed timeline crossfades/translates through the artwork's images as the user scrolls, with the right info panel staying fixed for the whole pin. Images without multiple shots degrade gracefully to a single static image with no pin.
- Real artwork `href`s: `toArtworkView` stops emitting `"#"` and links to the localized detail path.
- Language switch preserves the artwork slug; pages emit localized SEO metadata (title, description, canonical, `og:image`).

## Capabilities

### New Capabilities
- `artwork-detail-page`: Generates and renders a per-artwork detail page in both languages, showing a scroll-driven multi-image viewer (GSAP ScrollTrigger pin + scrub) on the left with a fixed editorial spec panel on the right, plus localized SEO metadata and a slug-preserving language switch.

### Modified Capabilities
- `gallery-data`: The `toArtworkView` builder's `href` changes from a placeholder `"#"` to the localized artwork detail path, so artwork cards across the site become navigable.

## Impact

- **Routing**: `src/pages/[...path].astro` (`getStaticPaths()` + `COMPONENT_MAP`).
- **Data**: `src/data/api.ts` (artwork detail view builder, real `href` in `toArtworkView`).
- **i18n**: `src/lib/i18n/utils.ts` (artwork-path helper), `src/lib/i18n/routes.ts` if a page-key shape is reused; `src/messages/en.json` + `es.json` (detail-page labels, parity enforced by `validate-i18n`).
- **Components**: new `src/components/pages/obra/ArtworkPage.astro` (+ a new image-scrub molecule and an editorial info-panel molecule reusing existing atoms `Image`, `Headline`, `Btn`, `CardSummary`-style spec rows).
- **Animations**: GSAP `ScrollTrigger` (already registered in `src/lib/gsap.ts`); no new dependencies.
- **Docs**: `docs/component-dependencies.md` (new page tree + Notes).
- **No backend changes** — all data already fetched by `buildSiteData()`.
