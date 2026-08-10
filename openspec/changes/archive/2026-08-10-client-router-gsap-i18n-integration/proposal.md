## Why

The project has a documented guide for `<ClientRouter />` (`docs/astro-client-side-page-transitions.md`) but it describes a generic setup with no integration guidance for the project's actual stack (i18n, GSAP, Zustand). Meanwhile, the GSAP components (Hero, Gallery, BannerBar) were refactored to rely on `astro:page-load` which never fires without the Client Router runtime — breaking all animations. Implementing Client Router fixes the animation issue AND adds SPA-like page transitions, but requires careful coordination with GSAP lifecycle cleanup, reduced-motion handling, i18n head management, and entrance-repeat guards.

## What Changes

- Add `<ClientRouter />` to `Layout.astro` enabling `astro:page-load` and SPA-like navigation between pages.
- Implement the canonical GSAP + VT pattern in all 3 organisms: `mm.revert()` cleanup on `astro:after-swap`, re-init on `astro:page-load`, direct `init()` call for first paint, `ScrollTrigger.refresh()` on every navigation, `transition:animate="none"` on sections with GSAP entrances to prevent VT cross-fade competing with `fromTo` reveals.
- Add a Hero entrance guard (`sessionStorage`) so the above-fold entrance animation plays only once per session, not on every VT navigation back to the home page.
- Update `docs/astro-client-side-page-transitions.md` with dedicated, modular sections: a standalone Client Router setup (§3–4), a Client Router + i18n subsection, a Client Router + GSAP subsection with the full `mm.revert()` + lifecycle + `transition:animate="none"` pattern, a Zustand persistence note, and an expanded troubleshooting table.
- Update `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` with a VT + GSAP section covering the pattern, `ScrollTrigger.refresh()` on navigation, and the Hero entrance guard.
- Verify all animations work on the running site at `https://enredarte-landing.localhost` via Playwright: reduced-motion emulation, navigation re-trigger, no-JS fallback.

## Capabilities

### New Capabilities
- `client-router-integration`: Defines the Client Router setup, the modular doc structure (standalone router, router + i18n, router + GSAP), and the shared lifecycle pattern (`astro:after-swap` cleanup + `astro:page-load` re-init) required for the project's stack.

### Modified Capabilities
- `hero-section`: Entrance now uses `sessionStorage` guard so the animation plays only once per session; section carries `transition:animate="none"`; GSAP lifecycle uses `mm.revert()` + `astro:after-swap` + `astro:page-load` + direct `init()`.
- `banner-bar-organism`: Section carries `transition:animate="none"`; GSAP lifecycle uses `mm.revert()` + `astro:after-swap` + `astro:page-load` + direct `init()`.
- `gallery-organism`: Same VT-safe lifecycle as BannerBar.
- `gsap-animation`: Docs now include a VT + GSAP section covering the full pattern, `ScrollTrigger.refresh()` on navigation, and Hero entrance guard; the shared module's `load`-event refresh is complemented by `astro:page-load` refresh.

## Impact

- **`src/layouts/Layout.astro`**: add `<ClientRouter />` import and component.
- **`src/lib/gsap.ts`**: add `ScrollTrigger.refresh()` listener on `astro:page-load` to complement the existing `load`-event refresh.
- **`src/components/organisms/Hero.astro`**: `transition:animate="none"`, session flag, `mm.revert()` pattern.
- **`src/components/organisms/Gallery.astro`**, **`src/components/organisms/BannerBar.astro`**: `transition:animate="none"`, `mm.revert()` pattern.
- **`docs/astro-client-side-page-transitions.md`**: modular rewrite with i18n + GSAP + Zustand subsections, expanded troubleshooting.
- **`docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md`**: add VT + GSAP section.
- **`openspec/specs/{hero-section,banner-bar-organism,gallery-organism,gsap-animation,client-router-integration}`**: spec deltas.
- No new npm dependencies.
