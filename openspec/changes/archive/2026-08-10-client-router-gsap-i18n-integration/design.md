## Context

The `gsap-astro-integration` change refactored GSAP components to rely on `astro:page-load` as the single init entry point. Without the Client Router runtime, `astro:page-load` never fires — all three GSAP organisms (`Hero.astro`, `Gallery.astro`, `BannerBar.astro`) are broken. The project has a generic `docs/astro-client-side-page-transitions.md` guide that describes `<ClientRouter />` setup but does not cover integration with the project's actual stack: i18n (route-based, `/<lang>/path`), GSAP (matchMedia + ScrollTrigger lifecycle), and Zustand (persistent stores across navigations).

## Goals / Non-Goals

**Goals:**
- Enable `<ClientRouter />` so `astro:page-load` fires and GSAP animations work on initial load and after every client-side navigation.
- Implement the full GSAP + VT lifecycle in all 3 organisms: `mm.revert()` on `astro:after-swap`, re-init on `astro:page-load`, direct `init()` for first paint, `ScrollTrigger.refresh()` on navigation, and `transition:animate="none"` on animated sections.
- Add a Hero entrance guard so the above-fold animation plays once per session, not on every VT navigation back to home.
- Rewrite `docs/astro-client-side-page-transitions.md` as a modular guide where each integration layer (base router, router + i18n, router + GSAP, Zustand notes) is a standalone section.
- Verify all animations work at `https://enredarte-landing.localhost` via Playwright (reduced-motion, navigation re-trigger, no-JS).

**Non-Goals:**
- Custom `::view-transition-*` CSS or `transition:persist` setup — the defaults are sufficient.
- Adding or modifying Zustand store behavior — only documenting that stores persist across VT navigations.
- Implementing `transition:name` morphing between pages.
- Adding hash/anchor scroll handling (§5.3 pattern) — the current site has no hash anchors.

## Decisions

**1. Use `mm.revert()` not `gsap.context()` for GSAP + VT**
- **Decision:** Each organism tracks its own `let mm: gsap.MatchMedia` reference, calls `mm.revert()` at the top of its init function and on `astro:after-swap`, then creates a fresh `gsap.matchMedia()`. No `gsap.context()` wrapping — `matchMedia` creates its own internal context.
- **Rationale:** `→ gsap-core skill`: "Do not nest `gsap.context()` inside matchMedia." `mm.revert()` kills all tweens and ScrollTriggers created in that matchMedia handler. Calling it before re-creating ensures the previous page's triggers are gone before the new page's triggers are created.
- **Alternative considered:** Using `gsap.context()` wrapper with `ctx.revert()` — rejected because it nests inside `matchMedia`.

**2. Direct `init()` call + `astro:page-load` + `astro:after-swap` — triple-entry pattern**
- **Decision:** The init function is registered on both `astro:page-load` (re-init after navigation) and `astro:after-swap` (cleanup before new page), and also called directly at script top-level for first paint. A **section-presence guard** (`if (!document.querySelector(ROOT)) return`) is the first line of `init()` — without it, stale listeners from a previous page create duplicate `matchMedia` contexts targeting the new page's DOM on every VT navigation:
  ```js
  let mm;
  const init = () => {
    if (!document.querySelector(".js-hero-section")) return;
    mm?.revert();
    mm = gsap.matchMedia();
    /* tweens */
  };
  document.addEventListener("astro:after-swap", () => mm?.revert());
  document.addEventListener("astro:page-load", init);
  init();
  ```
- **Rationale:** Without Client Router, the direct `init()` call is the only thing that works. With Client Router, `astro:page-load` fires on the first load too, but the direct call ensures first-paint timing. `astro:after-swap` kills old triggers before the new page's GSAP runs, avoiding callbacks on stale DOM. The section-presence guard prevents stale event listeners from the previous page (which persist on `document` after DOM swap) from creating duplicate `matchMedia` contexts — without it, both the old and new page's `init()` fire on `astro:page-load`, creating competing ScrollTriggers. `mm?.revert()` is idempotent, so double-calling is safe.
- **Alternative considered:** Using only `astro:page-load` without direct call — rejected. Without Client Router, the event never fires. Even with it, the timing may allow old triggers to fire on removed nodes.

**3. `transition:animate="none"` on GSAP-animated sections**
- **Decision:** Every section with GSAP `fromTo` entrance gets `transition:animate="none"` to skip the View Transition cross-fade on that element. The browser swaps it instantly; GSAP handles the reveal.
- **Rationale:** Without this, the VT cross-fade shows the new page at natural state before GSAP's `immediateRender` hides content and animates it back — a visible flash. With `transition:animate="none"`, there is no cross-fade, so the `fromTo` hides/applies/animates without competition.
- **Alternative considered:** Applying `gsap.set({ opacity: 0 })` in `astro:before-swap` — rejected as fragile timing.

**4. Hero entrance guard via `sessionStorage`**
- **Decision:** On `init()`, check `sessionStorage.getItem("hero-entered")`. If set, jump to final visible state instantly (no animation). If not set, play the full entrance timeline and set the flag.
- **Rationale:** The Hero entrance is above-fold and plays immediately. Replaying it every time the user navigates back to the home page is annoying. `sessionStorage` is cleared when the tab closes, so a fresh visit gets the full entrance.
- **Alternative considered:** `hasEntered` boolean flag — rejected because it resets on page navigation, defeating the purpose.

**5. `ScrollTrigger.refresh()` on every `astro:page-load`**
- **Decision:** Add `document.addEventListener("astro:page-load", () => ScrollTrigger.refresh())` to complement the existing `window.load` refresh in `@/lib/gsap.ts`.
- **Rationale:** After a VT navigation, the new page's images and fonts load asynchronously and shift layout. The `load` event only fires once (initial page load); VT navigations are JavaScript swaps, so `ScrollTrigger.refresh()` must be called explicitly after each navigation.
- **Alternative considered:** Calling `refresh()` inside each component's `init()` — rejected because it would run once per organism; a single global listener is simpler.

**6. Modular doc structure in `astro-client-side-page-transitions.md`**
- **Decision:** Restructure the guide so §3-4 are the base Client Router setup (standalone, no dependencies). §5 remains the re-init section with §5.1 (plain scripts), §5.2 (React), §5.3 (hash scrolling). Add §5.4 (Client Router + GSAP) and §5.5 (Client Router + i18n). Add §5.6 (Zustand persistence note). The §5.4 and §5.5 subsections are self-contained — a project skipping them still gets a complete Client Router guide.
- **Rationale:** "Make the doc as dynamic and flexible as possible" (user request). A project that wants only Client Router reads §3-4 and stops. A project with i18n continues to §5.5. A project with GSAP continues to §5.4.

## Risks / Trade-offs

- [VT navigation flashes on first GSAP section unless `transition:animate="none"` is set] → Applied on all 3 organisms; documented in both `astro-client-side-page-transitions.md` and `01-setup`.
- [Hero session guard uses `sessionStorage` — if the user opens a new tab to the home page, they get the entrance again] → This is the desired behavior. New tab = new session.
- [Old ScrollTriggers could fire between `astro:after-swap` and `astro:page-load` if no `after-swap` cleanup] → Mitigated by `mm?.revert()` on `astro:after-swap` removing old triggers before new ones are created.
- [Stale event listeners from the previous page persist on `document` after VT DOM swap — both old and new `init()` fire on `astro:page-load`] → Mitigated by a section-presence guard (`if (!document.querySelector(ROOT)) return`) as the first line of every `init()`.
- [Zustand store state persists across VT navigations — any page-derived state in stores may be stale] → Documented in the guide. The project's stores (`catalog`, `form`) use `persist` middleware (localStorage-backed); no route-derived state exists currently.
- [`transition:animate="none"` removes the smooth cross-fade for sections that use it] → Acceptable trade-off. GSAP handles the entrance animation; the browser's morph/cross-fade would compete. Only applied to sections with GSAP entrances — the rest of the page still gets VT cross-fades.

## Migration Plan

1. Add `<ClientRouter />` to `Layout.astro`.
2. Update Hero, Gallery, BannerBar (3 organisms) with the triple-entry pattern + `transition:animate="none"` + Hero session guard.
3. Rewrite `docs/astro-client-side-page-transitions.md` (modular structure).
4. Add VT + GSAP section to `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md`.
5. Verify via Playwright against `https://enredarte-landing.localhost`.

Rollback: remove `<ClientRouter />` from Layout.astro, revert component scripts to direct-call-only pattern.

## Open Questions

- None.
