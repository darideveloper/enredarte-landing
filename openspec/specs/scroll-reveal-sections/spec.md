## Purpose

Defines the SEO-safe, performant on-scroll reveal coverage for all relevant below-fold sections across Home, collection indexes, sala/obra/artista/curador detail pages, blog, compra/legal/404, and footer — including the trigger map, hero/LCP freeze rule, View Transitions lifecycle, reduced-motion handling, and performance budget. Consumes the shared module and lifecycle documented in `gsap-animation` without changing it.

## Requirements

### Requirement: SEO-safe reveal mechanism
Every scroll reveal SHALL use Approach A (`gsap.fromTo` with `y + autoAlpha`, ending in `clearProps: "transform,opacity,visibility"`), with no CSS pre-hiding, no `opacity-0`/`js-reveal` classes, and no changes to SSR HTML bytes, so crawlers and no-JS users always see full content.

#### Scenario: Crawler and no-JS see full content
- **WHEN** a page is rendered with JavaScript disabled (or fetched as raw SSG HTML)
- **THEN** all section headers, cards, grids, and body copy are fully visible with no hidden or blank blocks.

#### Scenario: Reveal restores clean DOM
- **WHEN** any reveal tween completes
- **THEN** the animated elements carry no residual inline `transform`/`opacity`/`visibility` styles (GSAP `clearProps` applied).

### Requirement: Hero and LCP freeze
No ScrollTrigger SHALL target a hero section or any image rendered with `fetchpriority="high"` / covered by `lcpPreload`, and no `autoAlpha` animation SHALL apply to those images. The existing Hero load-only entrance timeline stays unchanged.

#### Scenario: Heroes stay static on scroll
- **WHEN** a user scrolls any page (Home hero, GalleryPage hero, ArtistPage hero, CuratorHero, BlogPost hero, ArtworkPage viewer zone)
- **THEN** no scroll-driven tween plays on the hero container or its LCP image, and Lighthouse LCP does not regress vs. baseline.

### Requirement: Home collection reveals
Home `#artworks-collection` SHALL fade its header once and reveal each artwork grid card via its own per-card trigger on scroll-in, preserving filter-then-cap-tail (`limit=12`) semantics and leaving the Filters chips themselves unanimated.

#### Scenario: Home collection animates on scroll
- **WHEN** each collection card approaches the viewport (per-card trigger `start "top 85%"`, `play none none none`)
- **THEN** the Title/Headline header fades up once (`y:30`) and each visible ImageCard fades up independently (`y:40`, `duration 0.7-0.8`, `power2.out`).

#### Scenario: Filtering does not break reveals
- **WHEN** filter selections change on Home
- **THEN** no card re-animates, visibility follows existing `computeVisibility` rules, and a debounced `ScrollTrigger.refresh()` re-measures triggers below the grid.

### Requirement: Collection index reveals
All four `CollectionIndex` pages SHALL fade their shared header; `obras` SHALL reveal its uncapped grid via per-card triggers like Home; `salas`/`artistas`/`curadores` static grids SHALL stagger in as groups (single trigger + stagger).

#### Scenario: Index grids animate
- **WHEN** any index page grid section scrolls into view
- **THEN** the header fades once, `obras` cards reveal per-card (`start "top 85%"`), and `salas`/`artistas`/`curadores` cards stagger as a group with the same motion tokens as Home.

### Requirement: Gallery detail reveals
GalleryPage SHALL fade the CuratorCard once, fade the `#sala-artworks` header + filters bar once, and reveal each immersive ImageRowCard via its own row trigger animating inner content only (sticky wrapper untouched).

#### Scenario: Sala rows reveal per row
- **WHEN** each immersive row approaches the viewport (`start "top 85%"`)
- **THEN** its inner content (image panel lines, title, tags) fades up while the `md:sticky` wrapper position never animates.

### Requirement: Artwork detail restraint
ArtworkPage SHALL NOT add any trigger inside the scrub/viewer image zone; it SHALL fade ArtworkInfoPanel header lines only, plus single fades on the ArtistCard and ArtworkSlider containers, leaving BuyWidget/status badge, Swiper internals, and the viewer scrub timeline untouched.

#### Scenario: Viewer scrub undisturbed
- **WHEN** scrolling the artwork immersive section on desktop
- **THEN** the existing pin-less scrub crossfade and counter behave exactly as before, with no competing tween on the same section.

#### Scenario: Conversion slot static
- **WHEN** the price/status/conversion slot renders (BuyWidget or badge)
- **THEN** it appears instantly with no reveal animation.

### Requirement: Artist and curator reveals
ArtistPage `#artista-obras` SHALL fade its header, fade the featured ImageBanner once, and reveal each editorial row via its own row trigger animating inner content only (sticky wrapper untouched); `#artista-salas` SHALL stagger its gallery grid. CuratorPage SHALL fade CuratorHero header text only (portrait untouched) and stagger the CuratorSalas grid with its header.

#### Scenario: Artist and curator sections animate
- **WHEN** each artist/curator section scrolls into view
- **THEN** headers fade once and cards/rows animate in; curator/artist portrait images never animate opacity.

#### Scenario: Artista rows reveal per row without breaking sticky
- **WHEN** each `#artista-obras .js-artista-row` approaches the viewport (`start "top 85%"`, `play none none none`)
- **THEN** its inner content (image cell and info cell children) fades up (`y:40`, `duration 0.8`, `power2.out`, `clearProps`) while the `md:sticky` info wrapper itself never receives inline `transform`/`opacity`.

### Requirement: Blog reveals with CSS replacement
BlogIndex SHALL fade its header, stagger its PostCard grid via GSAP, and fade PaginationNav/empty-state; the existing CSS `@keyframes blog-enter` SHALL be removed in the same change. BlogPost SHALL keep its hero frozen and fade the description quote, meta row, body blocks (light, no per-paragraph stagger), and sticky aside.

#### Scenario: Single animation driver on blog index
- **WHEN** the blog mosaic scrolls into view
- **THEN** cards animate exactly once (GSAP), with no competing CSS keyframe entrance.

### Requirement: Compra, legal, 404, footer restraint
SuccessPage, CancelPage, LegalPage (x3 slugs), 404, and Footer SHALL use single header/block fades only (Legal h2 blocks may stagger lightly); no motion inside OrderFlow/DeliveryForm internals or footer nav behavior.

#### Scenario: Quiet pages stay quiet
- **WHEN** any compra/legal/404 page or the footer scrolls into view
- **THEN** at most one gentle fade plays per block with no stagger except Legal h2 groups.

### Requirement: Lifecycle, scoping, and motion safety
Every new reveal block SHALL live in its host Astro `<script>` (never inside a React island), scope selectors to its own section root with unique `js-<prefix>-*` classes, guard on section presence, init on `astro:page-load` (+ immediate first-paint call), revert via `mm?.revert()` on `astro:after-swap`, carry `transition:animate="none"` on its root, branch `gsap.matchMedia()` for `prefers-reduced-motion` (no-op reduce branch), animate only `y`/`autoAlpha`, and create no new `pin`/`scrub`.

#### Scenario: VT navigation leaves no ghosts
- **WHEN** navigating between pages via View Transitions (forward and back)
- **THEN** no trigger from the previous page fires, no tween targets a detached node, and reveals re-init correctly on the new page.

#### Scenario: Reduced motion means no movement
- **WHEN** the OS requests `prefers-reduced-motion: reduce`
- **THEN** all new blocks render content statically with zero `y`/`x`/`scale` displacement.

#### Scenario: Performance budget holds
- **WHEN** any grid reveal plays on a mid-range phone
- **THEN** it uses `duration 0.7-0.8`, `power2.out`, per-card triggers (Home/`obras`) or `stagger 0.08-0.12` with a single trigger (small grids), and transform/opacity properties only.

### Requirement: Global reduced-motion CSS guard
The site SHALL include a global `@media (prefers-reduced-motion: reduce)` guard in `global.css` that neutralizes non-GSAP motion (Tailwind/CSS transitions, drawer slide, `animate-spin` loader), so reduced-motion users get a static site beyond the GSAP no-op branches.

#### Scenario: Reduced-motion CSS is static
- **WHEN** the OS requests `prefers-reduced-motion: reduce`
- **THEN** CSS transitions/animations across header drawer, hovers, and loader complete near-instantly with no sliding, spinning, or smooth scrolling.
