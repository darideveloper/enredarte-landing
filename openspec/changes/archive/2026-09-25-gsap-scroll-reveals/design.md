## Context

Current state: `src/lib/gsap.ts` already provides the shared foundation (SSR-safe `registerPlugin(ScrollTrigger)`, `ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })`, `gsap.defaults({ ease: "power4.out", duration: 1.2 })`, `refresh` on `window load` + `astro:page-load`). Four motion surfaces exist: `Hero.astro` (load-only entrance timeline, sessionStorage-gated), `Gallery.astro` (scroll header + grid stagger), `BannerBar.astro` (scroll stagger), `ArtworkImageViewer.astro` (pin-less scrub crossfade). Everything else — CollectionIndex grids, GalleryPage `#sala-artworks`, ArtistPage, CuratorHero/Salas, BlogIndex/Post, Compra/Legal/404/Footer — has no scroll motion. `Layout.astro` runs `<ClientRouter />` (View Transitions), `BaseSEO.astro` is pure SSR, `[...path].astro` precomputes LCP preload sets. React islands (`Filters`, `Artworks`, `ArtworkSlider`, `BuyWidget`, `OrderFlow`, `DeliveryForm`) hydrate independently. `global.css` has no `.js-reveal`/`.no-js`/reduced-motion rules; `BlogIndex.astro` is the only file with a reduced-motion guard (CSS keyframes `blog-enter`).

Constraints: SSG HTML must stay fully indexable; LCP images (`fetchpriority="high"` + `lcpPreload`) must not shift; VT navigations must not leak triggers; filter interactions flip `card.hidden` at runtime; sticky (`GalleryPage` immersive rows, `ArtworkPage` image zone) + scrub zones must not get competing triggers.

## Goals / Non-Goals

**Goals:**
- Rich, coherent on-scroll reveals on every relevant below-fold section using one repeatable shape; Home/`obras` 12-card grids use per-card triggers (user decision).
- Zero SEO/LCP regression: raw HTML unchanged, no pre-hiding, no opacity on LCP images.
- 60fps on mid-range phones: transforms/opacity only, local duration/ease overrides, no new pin/scrub.
- Full `prefers-reduced-motion` + no-JS safety by construction, including a global CSS guard for non-GSAP transitions (user decision: in scope).
- VT-safe lifecycle on every new block.

**Non-Goals:**
- No hero redesign and no ScrollTrigger on any hero/LCP zone.
- No loader/preloader, no `ScrollSmoother`, no marquee/counter/parallax system (guide capabilities unused).
- No `reveal-helper.ts` extraction, no `animation-manager.ts`, no changes to `src/lib/gsap.ts`.
- No motion inside conversion islands or filter wheel-smoothing.
- No CSS-hide (`.js-reveal`/`.no-js`) migration — Approach A only.

## Decisions

### D1 — Approach A (`fromTo` + `clearProps`), not doc template B/C
Why: A needs no CSS/HTML changes; content is visible by default so crawlers, no-JS users, and VT pre-swap states never see blank sections. B/C (`03-section-reveal-pattern.md`) require `<html class="no-js">` + swap script + `.js-reveal` CSS that this repo does not have; pasting it verbatim would hide content for no-JS users. Alternative considered: adopt C wholesale — rejected because it adds layout/CSS surface for zero visual gain over A.
SEO argument: `immediateRender` hides elements only after JS runs; SSR bytes are identical before/after.

### D2 — Per-component scoped scripts, duplicated ~30-line shape, no helper
Why: each section wants slightly different choreography (single fade vs. header+grid vs. per-row). The guide itself marks the verbose template canonical and the helper convenience-only with a behavior trade-off (single staggered group). Duplication keeps sections independently deletable and avoids premature abstraction. Revisit only if 5+ identical reveals ship unchanged.
Namespace: `js-<prefix>-header` / `js-<prefix>-card` (+ `js-<prefix>-row` for immersive/editorial rows), root `id` per section, queries scoped to section root.

### D3 — Per-card triggers for Home/`obras` grids, single triggers elsewhere
Why (user decision): Home and `obras` 12-card grids get one ScrollTrigger per card (`start "top 85%"`, `play none none none`) so each card animates as it enters — livelier than a single group stagger. All other grids/rows keep the cheaper shape: headers single fade, small grids single trigger + stagger, immersive/editorial rows one trigger per row. Alternatives rejected: `scrub` (wrong feel, extra work), `once: true` + kill (complicates VT re-init), group-only stagger on the flagship grids (calmer but less attractive — rejected per user pick).

### D4 — Local motion tokens override global defaults for grids
Why: global `duration 1.2 / power4.out` is cinematic for one header but heavy for 12-card grids. All grids use `duration 0.7-0.8, ease power2.out, y 40`; headers use `duration 0.7, y 30, power2.out`. Group-stagger grids (small indexes, sala/artist/curator rows) add `stagger 0.08-0.12` under a single trigger; per-card grids (Home/`obras`) fire independently with no cross-trigger stagger (D3). Only `y` + `autoAlpha`; `clearProps: "transform,opacity,visibility"` on complete. `will-change` not pre-applied (GSAP promotes during tween; avoids layer bloat per gsap-performance skill).

### D5 — Heroes and LCP images frozen
Why: LCP measurement penalizes opacity-hidden candidates; `[...path].astro` + `Layout` already preload the exact responsive variant. Rule: no ScrollTrigger whose trigger or target is a hero section or contains a `[fetchpriority="high"]` image; no `autoAlpha` on those images. Hero entrance timeline (load-only) stays as-is. `CuratorHero`/`ArtworkInfoPanel` get text-only fades, never image fades.

### D6 — VT lifecycle copied from Hero/Gallery on every block
Pattern: presence guard → `mm?.revert()` → `gsap.matchMedia()` → two branches → `astro:after-swap → mm?.revert()` → `astro:page-load → init` + immediate `init()` for first paint; `transition:animate="none"` on every animated root (prevents VT cross-fade flashing natural state before GSAP hides it). `ScrollTrigger.refresh()` stays centralized in `lib/gsap.ts`; blocks add a debounced `refresh()` only where filtering changes layout (Home/`obras` grids).

### D7 — GSAP in Astro `<script>` only, never in React islands
Why: islands hydrate independently; GSAP inside them double-registers and couples animation to hydration timing. `Filters`/`Artworks`/`Slider`/`BuyWidget`/`OrderFlow` internals are untouched; reveal targets are the Astro-rendered wrappers/slots around them. Filter wheel-smoothing (`gsap.ticker` in `Filters.tsx`) is interaction code, not reveal — untouched.

### D8 — BlogIndex: replace CSS keyframes, don't layer GSAP on top
Why: `blog-enter` CSS stagger + GSAP stagger on the same cards = double entrance. Delete the `<style>` block, keep markup, drive via GSAP like every other grid. PaginationNav/empty-state get single fades.

### D9 — Filtered grids: per-card triggers + refresh after filtering
`Artworks.tsx` flips `card.hidden` per selection; per-card triggers (user decision for Home/`obras`) go stale when cards hide/show. Decision: per-card one-shot triggers on visible cards; on filter change, no re-animation — call debounced `ScrollTrigger.refresh()` (≈150ms) so hidden cards' triggers re-measure and positions below the grid settle. Triggers whose card is `hidden` never fire (no viewport intersection). Cap-tail (`limit=12` on Home) semantics untouched.

### D10 — Sticky/scrub exclusion zones
`GalleryPage` immersive rows (`md:sticky top-[35svh]`) and `ArtworkPage` scrub section: animate inner content (title/meta/tags/panel lines), never the sticky wrapper or the viewer image zone. No second ScrollTrigger inside `data-scroll-section` image zone.

## Risks / Trade-offs

- [Stale trigger positions after images/fonts/filtering] → centralized `refresh` on `load`/`page-load` + debounced `refresh` after filter settles; `ignoreMobileResize` avoids URL-bar thrash. Per-card grids (12 triggers) cost more than group triggers — accepted per user pick; mitigated by one-shot `play none none none` + short durations.
- [VT ghost triggers / double-init] → per-block `mm?.revert()` + presence guard + scoped selectors; unique prefixes prevent cross-page collisions.
- [LCP/CLS regression] → opacity ban on LCP images; transforms only; `clearProps` restores layout; verify with Lighthouse before/after.
- [Jank on low-end phones with 12 per-card triggers] → short local durations (`0.7-0.8`), `power2.out`, no stagger across triggers (each card fires independently), no pin/scrub; `limitCallbacks: true`.
- [Reduced-motion users get movement] → `matchMedia` no-op branch everywhere (Approach A needs no fade fallback since content is visible) + global CSS guard for non-GSAP transitions (in scope per user decision: Tailwind hovers, drawer, `animate-spin`).
- [BlogIndex visual change during migration] → delete CSS keyframes in the same commit as GSAP add; net motion equivalent, single driver.
- [Scope creep into conversion UI] → explicit exclusion list in specs; review gate: any diff inside `BuyWidget`/`OrderFlow`/`DeliveryForm`/`ArtworkSlider` internals rejects.

## Migration Plan

No data/build migration (static SSG, no deps added — `gsap@^3.12.7` already installed). Rollout: land all blocks in one change (order: Home → indexes → sala → artista/curador → obra light → blog → compra/legal/404/footer), run `pnpm build` + validators, Lighthouse LCP/CLS check, reduced-motion + JS-disabled + VT back/forth manual pass. Rollback: revert the change (each block is additive script + classes; no shared module touched, so revert is clean).

## Open Questions

Resolved before implementation (user decisions locked):
- Q1 grid style → per-card triggers for Home/`obras` grids; single trigger + stagger elsewhere.
- Q2 BlogIndex → delete CSS `blog-enter`, GSAP is the single driver.
- Q3/Q4 Legal/Footer → Legal h2 blocks stagger lightly; footer single-block fade.
- Q5 reduced-motion CSS guard → in scope in this change (`global.css` media query).
- Q6 batch vs stagger → plain per-card triggers, no `ScrollTrigger.batch`.
