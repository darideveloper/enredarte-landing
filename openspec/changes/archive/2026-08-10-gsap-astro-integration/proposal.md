## Why

The GSAP docs (`docs/gsap-scrolltrigger/`) were generated from another project and duplicate the general GSAP API knowledge already owned by the official `greensock/gsap-skills` installed in `.agents/skills/`, and they describe an `src/scripts/` system that does not match the real `src/lib/gsap.ts` + `astro:page-load` integration. Separately, the working integration has correctness/perf gaps: reduced-motion users get full motion, the hero hides its LCP banner at `opacity: 0`, animation inits double-fire on first load, and `@/lib/gsap.ts` ships an unused `TextPlugin` with no global config.

## What Changes

- Refactor `docs/gsap-scrolltrigger/` so the GSAP skills are the single source of truth for GSAP API knowledge: replace duplicated API explanations/tables with `→ gsap-<skill>` pointers and keep only Astro-specific integration content (shared module, `astro:page-load` lifecycle, bundling/SSR-safety, SEO/LCP guidance, copy-paste component templates, project pitfalls). Add a **prerequisite notice** that the installed `gsap-*` skills (`.agents/skills/gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`) are required for the skill-pointer convention to resolve.
- Rewrite the documented bootstrapping to match the real implementation: `src/lib/gsap.ts` shared wrapper (SSR-safe registration) instead of `src/scripts/gsap-init.ts`; standardize all templates to `import { gsap, ScrollTrigger } from "@/lib/gsap"`.
- **BREAKING** (docs): remove the global `gsap.config({ force3D: true })` recommendation (contradicts the `gsap-performance` skill) and the `no-js`/`.js-reveal`-only recommendation, replaced with a dual-approach comparison (`fromTo` + `clearProps` vs CSS fallback).
- Fix doc navigation: `[[astro-gsap]]` dangling link in `docs/component-dependencies.md` → `[[gsap-scrolltrigger]]`, and register the GSAP docs in `docs/astro.md`.
- Fix `src/lib/gsap.ts`: drop unused `TextPlugin`; add `ScrollTrigger.config({ limitCallbacks, ignoreMobileResize })`, `gsap.defaults()`, and refresh-on-load.
- Fix `Hero.astro`, `Gallery.astro`, `BannerBar.astro`: respect `prefers-reduced-motion` via `gsap.matchMedia()`, single init on `astro:page-load` (remove double-fire), and (Hero only) stop hiding the banner at `opacity: 0` to preserve LCP.
- Remove unused `@gsap/react` dependency from `package.json`.

## Capabilities

### New Capabilities
- (None)

### Modified Capabilities
- `gsap-animation`: Centralized module requirements change (drop `TextPlugin`, add ScrollTrigger config/defaults/refresh, SSR-safe registration) and the documentation requirement changes (docs live at `docs/gsap-scrolltrigger/`, GSAP skills are the source of truth, `[[astro-gsap]]` link fixed).
- `hero-section`: Entrance animation must respect `prefers-reduced-motion` via `matchMedia`, initialize once via `astro:page-load`, and not hide the LCP banner image with `opacity: 0`.
- `banner-bar-organism`: Scroll entrance must respect `prefers-reduced-motion` and initialize once via `astro:page-load`.
- `gallery-organism`: Add a GSAP scroll-reveal requirement covering the grid/header entrance, reduced-motion handling, and single init via `astro:page-load`.

## Impact

- **`src/lib/gsap.ts`**: plugin set, global config, defaults, refresh wiring.
- **`src/components/organisms/Hero.astro`**: matchMedia-wrapped timeline, LCP-safe banner tween, single init.
- **`src/components/organisms/Gallery.astro`**, **`src/components/organisms/BannerBar.astro`**: matchMedia-wrapped tweens, single init.
- **`package.json`**: remove `@gsap/react`.
- **`docs/gsap-scrolltrigger/*.md`**: full refactor (dedup + Astro integration accuracy).
- **`docs/component-dependencies.md`**, **`docs/astro.md`**: navigation fixes.
- **`openspec/specs/{gsap-animation,hero-section,banner-bar-organism,gallery-organism}`**: spec deltas updated.
- **No new dependencies.**