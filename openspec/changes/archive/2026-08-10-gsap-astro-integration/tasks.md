## 1. Docs Refactor — Setup & Shared Module

- [x] 1.1 Rewrite `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` to document `src/lib/gsap.ts` as the canonical shared module (SSR-safe, no `TextPlugin`, with `ScrollTrigger.config({ limitCallbacks, ignoreMobileResize })`, `gsap.defaults()`, and refresh-on-load) replacing `src/scripts/gsap-init.ts`.
- [x] 1.2 Replace duplicated GSAP API explanations in `01` with `→ gsap-<skill>` pointers and remove the global `gsap.config({ force3D: true })` guidance.
- [x] 1.3 Add Astro-specific sections to `01`: SSR-safe registration guard, bundling/tree-shaking note (never `is:inline`), `astro:page-load` lifecycle + `gsap.context()` cleanup for View Transitions, and the dual SEO-safe reveal approach (`fromTo`+`clearProps` vs `.js-reveal`/`.no-js`).

## 2. Docs Refactor — Patterns & Pitfalls

- [x] 2.1 Add a prerequisite notice to `docs/gsap-scrolltrigger/README.md` (in the Skill map section) and `01-setup-and-mandatory-files.md` stating that the installed `gsap-*` skills at `.agents/skills/` are required for the `→ gsap-<skill>` pointers to resolve. Mention the skills are pinned by `skills-lock.json`.
- [x] 2.2 Update – position-parameter pointer, imports, loader note
- [x] 2.3 Update – matchMedia/toggleActions/easing pointers, imports, LCP tip
- [x] 2.4 Update – scrub/pin/parallax pointers, force3D fix, imports
- [x] 2.5 Update – reduced-motion/matchMedia/layout-thrash pointers
- [x] 2.6 Update – imports standardized
- [x] 2.7 Update `docs/gsap-scrolltrigger/README.md`: add a "Skill map" table (local file → skills), replace `src/scripts/` references with `src/lib/gsap.ts`, update the quick-start import, add a "Real project" note comparing templates vs the actual implementation, and include the prerequisite notice from task 2.1.

## 3. Docs Navigation

- [x] 3.1 Fix the dangling link
- [x] 3.2 Register in docs/astro.md

## 4. Shared GSAP Module

- [x] 4.1 Update `src/lib/gsap.ts`: remove `TextPlugin` import/registration, add `ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })`, `gsap.defaults({ ease: "power4.out", duration: 1.2 })`, and `window.addEventListener("load", () => ScrollTrigger.refresh())`.

## 5. Component Fixes

- [x] 5.1 Update `src/components/organisms/Hero.astro`: remove the direct `initHeroAnimation()` call (single init via `astro:page-load`), wrap the timeline in `gsap.matchMedia()` with a reduced-motion fallback, and change the banner tween to animate `scale` only (no `opacity: 0 → 1`).
- [x] 5.2 Update `src/components/organisms/Gallery.astro`: remove the direct init call (single init via `astro:page-load`) and wrap header/card tweens in `gsap.matchMedia()` with a reduced-motion fallback.
- [x] 5.3 Update `src/components/organisms/BannerBar.astro`: remove the direct init call (single init via `astro:page-load`) and wrap the stagger tween in `gsap.matchMedia()` with a reduced-motion fallback.

## 6. Dependency Cleanup

- [x] 6.1 Grep the repo to confirm `@gsap/react` has no imports, then remove it from `package.json` and run `pnpm install` to update the lockfile.

## 7. Verification

- [x] 7.1 Run `pnpm run validate-imports` (fast-fails if `@gsap/react` removal broke imports).
- [x] 7.2 Run `pnpm run dev` and verify Hero, Gallery, and BannerBar animate on scroll and run exactly once on first load.
- [x] 7.3 In DevTools, emulate `prefers-reduced-motion: reduce` and verify content reveals without movement.
- [x] 7.4 Disable JS in DevTools and verify all content is visible without JS.
- [x] 7.5 Run `pnpm run build` and confirm the production build succeeds.
- [x] 7.6 Run `openspec validate "gsap-astro-integration" --strict` and archive the change when green.