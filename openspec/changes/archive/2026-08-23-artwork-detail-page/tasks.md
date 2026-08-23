## 1. Data layer

- [x] 1.1 Add `getLocalizedArtworkPath(slug, lang)` to `src/lib/i18n/utils.ts` (returns `/obras/<slug>` for `es`, `/en/obras/<slug>` for `en` — mirroring `getLocalizedSalaPath`), alongside the existing `getLocalizedSalaPath`
- [x] 1.2 Add `toArtworkDetailView(artwork, siteData, lang)` in `src/data/api.ts` resolving primary + non-primary images (localized alt), localized title/description, artist name, formatted prices, status, and localized taxonomy labels via `getFacetLabel`
- [x] 1.3 Update `toArtworkView` in `src/data/api.ts` so `href` uses `getLocalizedArtworkPath` instead of `"#"`

## 2. Routing

- [x] 2.1 Extend `getStaticPaths()` in `src/pages/[...path].astro` to emit `obras/<slug>` (es) and `en/obras/<slug>` (en) for every artwork, with `props: { pageKey: "artwork", artworkSlug, lang, siteData }`
- [x] 2.2 Add an `artwork` entry to `COMPONENT_MAP` in `[...path].astro`, AND extend the prop-destructure type (currently `{ pageKey, lang, gallerySlug?, siteData }`) to include `artworkSlug?: string`, AND update the `<PageComponent ... />` forwarding call so it also passes `artworkSlug` (currently only `lang`, `pageKey`, `gallerySlug`, `siteData` are forwarded)
- [x] 2.3 Pass the slug-preserving `localizedPaths` (via `getLocalizedArtworkPath`) through `Layout` → `Header` → `LangBtns` for the artwork page

## 3. Components

- [x] 3.1 Create `src/components/molecules/ArtworkInfoPanel.astro` (right column): localized title, artist, year, dimensions, description, price/status, and spec rows (discipline, technique, theme, format, scale), omitting missing fields; reuse `Headline`, `Btn`
- [x] 3.2 Create `src/components/molecules/ArtworkImageViewer.astro` (left column): layered image stack; static single-image fallback; exposes the container/lifecycle hooks for the scroll script

## 4. Scroll-driven viewer (GSAP)

- [x] 4.1 Add the ScrollTrigger pin + scrub script for the viewer (only when `images.length > 1`): `ScrollTrigger.create({ trigger, pin, scrub, start/end derived from image count })` with a scrubbed timeline using `ease: "none"` that crossfades/translates the image children
- [x] 4.2 Wrap the effect in `gsap.matchMedia()` so it is disabled for `prefers-reduced-motion: reduce` and small screens (images stack instead)
- [x] 4.3 Wire the lifecycle: `mm.revert()` on `astro:after-swap`, re-init on `astro:page-load` (mirror `Hero.astro` pattern), rely on `src/lib/gsap.ts` `ScrollTrigger.refresh()`

## 5. Artwork page

- [x] 5.1 Create `src/components/pages/obra/ArtworkPage.astro` receiving `{ lang, pageKey: "artwork", artworkSlug, siteData }` (note: `pageKey` is forwarded by `[...path].astro` to every page, mirroring how `GalleryPage` receives it — destructure but do not require it): looks up the artwork, resolves the detail view, renders the viewer (left) + info panel (right), and wires `PageSEO` with explicit localized `title`/`description`/`ogImage`
- [x] 5.2 Confirm artwork cards across homepage and gallery pages navigate to the localized artwork path (`/obras/<slug>` for es, `/en/obras/<slug>` for en) via the updated `toArtworkView` href

## 6. i18n

- [x] 6.1 Add artwork detail-page labels to `src/messages/en.json`: status (e.g. `available`, `sold`, `reserved`), spec-table taxonomy headers (`discipline`, `technique`, `theme`, `format`, `scale`), and CTA labels. Note: `year` and `dimensions` are top-level fields rendered above the spec list, not spec-table headers. Spanish values (e.g. es: "Técnica", "Disciplina", "Temática", "Formato", "Escala") are listed in design.md Decision 6 for reference.
- [x] 6.2 Add the matching keys to `src/messages/es.json` (parity enforced by `validate-i18n`)

## 7. Docs & validation

- [x] 7.1 Update `docs/component-dependencies.md` (new `ArtworkPage` tree, `ArtworkImageViewer`/`ArtworkInfoPanel`, `getLocalizedArtworkPath`, `toArtworkDetailView`; refresh Notes)
- [x] 7.2 Run `pnpm build` (runs `validate-i18n` + `validate-imports`) and confirm it passes
- [x] 7.3 Manual check: open `/obras/<slug>` (es) and `/en/obras/<slug>` (en), verify the pinned multi-image scroll (multi-image artwork), the single-image fallback, reduced-motion/mobile behavior, spec panel, language switch, and that gallery/homepage cards link to the page
