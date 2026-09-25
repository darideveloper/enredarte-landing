## 1. Home + collection indexes

- [x] 1.1 Add Approach A header fade + per-card triggers to Home `#artworks-collection` (Astro script, scoped selectors, VT lifecycle, debounced refresh after filtering)
- [x] 1.2 Add shared header fade + `obras` per-card triggers + `salas`/`artistas`/`curadores` group staggers to CollectionIndex
- [x] 1.3 Verify Home/index filter-then-cap-tail, chip behavior, and no-JS visibility unchanged

## 2. Detail pages (sala, obra, artista, curador)

- [x] 2.1 Add CuratorCard fade + `#sala-artworks` header/filters fade + immersive per-row inner-content triggers to GalleryPage
- [x] 2.2 Add ArtworkInfoPanel header-lines fade + ArtistCard/Slider container fades to ArtworkPage (viewer scrub + BuyWidget untouched)
- [x] 2.3 Add `#artista-obras` header/featured/rows reveals + `#artista-salas` grid stagger to ArtistPage
- [x] 2.4 Add CuratorHero header-text fade (portrait frozen) + CuratorSalas header + grid stagger to CuratorPage

## 3. Blog + quiet pages + motion safety net

- [x] 3.1 Replace BlogIndex CSS `blog-enter` with GSAP header + grid stagger + PaginationNav/empty-state fades
- [x] 3.2 Add BlogPost quote/meta/body-block + aside fades (hero frozen, no per-paragraph stagger)
- [x] 3.3 Add single-block fades to SuccessPage, CancelPage, LegalPage h2 stagger (x3), 404, and Footer single fade (OrderFlow/DeliveryForm internals untouched)
- [x] 3.4 Add global `@media (prefers-reduced-motion: reduce)` CSS guard in `global.css` for non-GSAP motion (hovers, drawer, spinner)

## 4. Verification + docs

- [x] 4.1 Run `pnpm build` + validators (i18n, imports, markdown, 404) with zero regressions
- [x] 4.2 Manual pass: reduced-motion emulation, JS-disabled full visibility, mobile + tall desktop, VT forward/back with no ghost triggers
- [x] 4.3 Lighthouse LCP/CLS before/after on Home, sala, obra, blog index (no regression; no opacity on LCP images)
- [x] 4.4 Refresh `docs/component-dependencies.md` Notes if component imports changed
