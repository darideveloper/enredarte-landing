## Why

The site feels static below the hero on most pages: only Home (BannerBar, Gallery) and the ArtworkPage viewer have scroll motion, while CollectionIndex, GalleryPage artworks, ArtistPage, CuratorPage, Blog, Legal, Compra, and 404 have none. We want rich, attractive on-scroll reveals everywhere relevant — without slowing the site or harming SEO — by extending the proven Approach A (`fromTo` + `clearProps`, no CSS pre-hiding) and explicitly freezing hero/LCP zones.

## What Changes

- Add Approach A scroll reveals (`y + autoAlpha`, `clearProps`, `toggleActions: "play none none none"`, `start: "top 80-85%"`) to every relevant below-fold section; heroes/LCP images stay static (Hero entrance timeline unchanged, no ScrollTrigger on heroes).
- Home `#artworks-collection`: header fade + per-card triggers (each card `start "top 85%"`, limit-12 tail semantics preserved).
- CollectionIndex (`obras` uncapped per-card triggers; `salas`/`artistas`/`curadores` group stagger) + shared index header fade.
- GalleryPage: CuratorCard fade + `#sala-artworks` header/filters fade + immersive ImageRowCard per-row triggers (inner content only, sticky wrapper untouched).
- ArtworkPage: ArtworkInfoPanel header-lines fade only + ArtistCard/Slider container fades; viewer scrub timeline and BuyWidget/status badge untouched.
- ArtistPage: `#artista-obras` header + featured banner + editorial rows stagger; `#artista-salas` grid stagger.
- CuratorPage: CuratorHero header-text fade only (portrait untouched) + CuratorSalas header + grid stagger.
- BlogIndex: header fade + PostCard grid stagger (replacing CSS `@keyframes blog-enter`) + PaginationNav/empty-state fades; BlogPost: quote/meta/body-block fades + aside fade, hero frozen.
- Compra/Legal/404/Footer: single header/block fades (lowest priority, no stagger except Legal h2 blocks).
- Every new block: Astro `<script>` only (never inside React islands), section-scoped `js-<prefix>-*` selectors, `gsap.matchMedia()` reduced-motion no-op branch, `mm?.revert()` on `astro:after-swap` + re-init on `astro:page-load` + presence guard, `transition:animate="none"` on animated roots.
- Global `@media (prefers-reduced-motion: reduce)` CSS guard in `src/styles/global.css` for non-GSAP motion (hovers, drawer, spinner).
- Performance budget: grid reveals override global defaults locally (`duration 0.7-0.8`, `power2.out`; group grids add `stagger 0.08-0.12`, per-card grids fire independently with no cross-trigger stagger); no new `pin`/`scrub`; no opacity animation on any `[fetchpriority=high]` / `lcpPreload` image.

## Capabilities

### New Capabilities
- `scroll-reveal-sections`: SEO-safe, performant on-scroll reveals for all relevant below-fold sections across Home, indexes, sala/obra/artista/curador detail, blog, compra/legal/404/footer — including trigger map, hero-freeze rule, lifecycle, reduced-motion, and performance budget.

### Modified Capabilities
- None (existing `gsap-animation` spec for the shared module/docs/lifecycle stays unchanged; this change only consumes it).

## Impact

- Touched: ~10 page/organism components (Home, CollectionIndex, GalleryPage, ArtworkPage, ArtistPage, CuratorHero/CuratorSalas, BlogIndex, BlogPost, SuccessPage, CancelPage, LegalPage, 404, Footer); `BlogIndex.astro` CSS (`blog-enter` keyframes removed); `src/styles/global.css` (reduced-motion guard); `docs/component-dependencies.md` Notes refresh if imports change.
- Untouched: `src/lib/gsap.ts` (no changes needed), `Layout.astro`/`BaseSEO.astro`/`[...path].astro` routing/SSG, all React islands internals (`Filters`, `Artworks`, `ArtworkSlider`, `BuyWidget`, `OrderFlow`, `DeliveryForm`), ArtworkImageViewer scrub, Filters `gsap.ticker` smoothing, build pipeline.
- Risks: stale triggers after `Artworks` filtering (mitigated by per-card one-shot triggers + debounced `refresh`, never card inline-state fights); sticky/scrub collisions (animate inner content only); VT ghost triggers (revert lifecycle); LCP regression (opacity ban on LCP images, verified by Lighthouse).
