## 1. Client Router Setup

- [x] 1.1 Add `import { ClientRouter } from "astro:transitions"` to `src/layouts/Layout.astro` and render `<ClientRouter />` in `<head>`.
- [x] 1.2 Add `document.addEventListener("astro:page-load", () => ScrollTrigger.refresh())` to `src/lib/gsap.ts` to complement the existing `window.load` refresh.

## 2. GSAP + VT Lifecycle — Hero

- [x] 2.1 Update `src/components/organisms/Hero.astro` `<section>` to carry `transition:animate="none"`.
- [x] 2.2 Rewrite Hero GSAP script with the triple-entry pattern: include a section-presence guard (`if (!document.querySelector(".js-hero-section")) return` as first line of `init()`), track `let mm`, call `mm?.revert()` at top of `init()`, register `astro:after-swap` for cleanup, register `astro:page-load` for re-init, call `init()` directly for first paint.
- [x] 2.3 Add `sessionStorage` guard: on `init()`, if `sessionStorage.getItem("hero-entered")` is set, jump straight to `gsap.set({ clearProps })` and return. Otherwise play the entrance timeline and call `sessionStorage.setItem("hero-entered", "1")`.

## 3. GSAP + VT Lifecycle — Gallery

- [x] 3.1 Update `src/components/organisms/Gallery.astro` `<section>` to carry `transition:animate="none"`.
- [x] 3.2 Rewrite Gallery GSAP script with the triple-entry pattern (same as Hero task 2.2, including section-presence guard, without session guard).

## 4. GSAP + VT Lifecycle — BannerBar

- [x] 4.1 Update `src/components/organisms/BannerBar.astro` `<div id="banner-bar">` to carry `transition:animate="none"`.
- [x] 4.2 Rewrite BannerBar GSAP script with the triple-entry pattern (same as Gallery task 3.2, including section-presence guard).

## 5. GSAP Docs — VT Integration Section

- [x] 5.1 Add a "View Transitions + GSAP" section to `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` documenting: the triple-entry pattern (`init()` + `astro:after-swap` + `astro:page-load`), `transition:animate="none"` on animated sections, `ScrollTrigger.refresh()` on `astro:page-load`, Hero entrance guard via `sessionStorage`, and `mm.revert()` instead of `gsap.context()` per the `gsap-core` skill. Cross-reference `docs/astro-client-side-page-transitions.md` §5.4 from this section.

## 6. Client Router Docs — Modular Rewrite

- [x] 6.1 Restructure `docs/astro-client-side-page-transitions.md`: keep §1-4 as the standalone Client Router base guide, keep original §5.1-5.3 as-is, add new §5.4 (GSAP), §5.5 (i18n), §5.6 (Zustand). Original §6 (customization), §7 (edge cases), §8 (troubleshooting), and §9 (summary) remain in place with updated content.
- [x] 6.2 Add §5.4 "Client Router + GSAP" with: the triple-entry lifecycle pattern, `transition:animate="none"` explanation, `ScrollTrigger.refresh()` on navigation, Hero entrance guard via `sessionStorage`, and the `mm.revert()` + `matchMedia` pattern (no `gsap.context()` nesting). Cross-reference `docs/gsap-scrolltrigger/01-setup` VT section from this subsection.
- [x] 6.3 Add §5.5 "Client Router + i18n" with: `<html lang>` attribute update via `<head>` swap, localized `<a href>` path compatibility, hreflang alternate link handling.
- [x] 6.4 Add §5.6 "Client Router + Zustand" noting that stores with `persist` middleware survive VT navigations (same JS runtime + localStorage) and route-derived state should use `window.location`.
- [x] 6.5 Update §3.1 code example to use dynamic `lang={lang}` instead of hardcoded `lang="en"`.
- [x] 6.6 Expand §8 troubleshooting table with: "GSAP animations flash on navigation" → add `transition:animate="none"` on the section, "Hero entrance replays on every visit" → add sessionStorage guard, "i18n: language attribute doesn't change" → verify `<ClientRouter />` is in the shared layout `<head>`.

## 7. Playwright Verification

- [x] 7.1 Open `https://enredarte-landing.localhost` via Playwright, snapshot the page, verify Hero animation runs on first load (banner scales, texts fade).
- [x] 7.2 Scroll to Gallery/BannerBar sections and verify ScrollTrigger reveals fire.
- [x] 7.3 Navigate via an internal link (e.g. to `/es/`) and back, verify Hero entrance does NOT replay (session guard) and Gallery/BannerBar re-trigger on scroll.
- [x] 7.4 Emulate `prefers-reduced-motion: reduce` via Playwright, reload, and verify content is visible without movement.
- [x] 7.5 Run `pnpm run build` and confirm production build succeeds with Client Router + updated components.
- [x] 7.6 Run `openspec validate "client-router-gsap-i18n-integration" --strict` and confirm green.
