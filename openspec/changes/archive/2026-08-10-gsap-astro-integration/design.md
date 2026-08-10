## Context

`enredarte-landing` is an Astro 7 SPA/MPA site styled with Tailwind v4. GSAP is consumed through a shared SSR-safe wrapper `src/lib/gsap.ts` and used in three organisms — `Hero.astro`, `Gallery.astro`, `BannerBar.astro` — each initializing animations in its `<script>`. The local guide `docs/gsap-scrolltrigger/` (7 files) documents a different, idealized `src/scripts/` system and duplicates the general GSAP API knowledge owned by the official `greensock/gsap-skills` installed at `.agents/skills/gsap-*`. The working integration has correctness gaps: reduced-motion users get full motion, the hero hides its LCP banner at `opacity: 0`, inits double-fire on first load (direct call + `astro:page-load`), and `@/lib/gsap.ts` registers an unused `TextPlugin` with no global config.

## Goals / Non-Goals

**Goals:**
- Make the installed `gsap-*` skills the single source of truth for GSAP API knowledge; local docs keep only Astro-specific integration content and point to skills.
- Align the docs with the real integration (`src/lib/gsap.ts`, `@/lib/gsap` imports, `astro:page-load`), remove the erroneous global `force3D` guidance, and fix doc navigation (`[[astro-gsap]]` dangling link, missing index entry).
- Harden the real components: respect `prefers-reduced-motion`, single init, LCP-safe hero banner.
- Update affected OpenSpec spec deltas to match.

**Non-Goals:**
- Adding new animation features, plugins, or View Transitions (`<ClientRouter />`) to the site — `gsap.context()` cleanup is documented for VT projects, not added to the current MPA code.
- Overhauling the loader pattern; the GSAP loader remains an optional documented pattern (the project uses a CSS-only `GlobalLoader.tsx`).
- Editing any content of the installed `gsap-*` skills (they are pinned by `skills-lock.json`).

## Decisions

**1. Skill-first docs with inline pointers**
- **Decision:** In `docs/gsap-scrolltrigger/`, delete duplicated API explanations/tables (easing table, `toggleActions` semantics, `matchMedia`, `scrub`/`pin`, `start`/`end`, position parameter, `immediateRender`, layout-thrash rules, `refresh()`) and replace each with a one-line `→ gsap-<skill> skill §<section>` pointer. A "Skill map" table in the README maps each local file to the skills it depends on. The README and `01-setup` will carry a **prerequisite notice**: the `gsap-*` skills installed at `.agents/skills/` (pinned by `skills-lock.json`) are required — without them the skill pointers cannot resolve.
- **Rationale:** Keeps one canonical source (the skills) and makes docs updates cheap. The prerequisite notice prevents readers from treating the pointers as broken or missing content. Alternative (keep tables + add callouts) was rejected by the user because duplication remains.

**2. Document the real Astro integration as canonical**
- **Decision:** Rewrite `01-setup-and-mandatory-files.md` around `src/lib/gsap.ts` (SSR-safe shared wrapper, no `TextPlugin`, with `ScrollTrigger.config`, `gsap.defaults`, refresh-on-load) instead of `src/scripts/gsap-init.ts`; standardize every template to `import { gsap, ScrollTrigger } from "@/lib/gsap"`.
- **Rationale:** The existing wrapper is the working, SSR-safe pattern; `gsap-init.ts` ran client-side only and wasn't SSR-safe. Astro bundles normal `<script>` imports into a shared, cacheable chunk and tree-shakes subpath imports (`gsap/ScrollTrigger`) — never `is:inline` for GSAP.
- **Alternative considered:** keeping the generic `src/scripts/` system — rejected (documents a system the project doesn't use and drops SSR safety).

**3. Remove global `force3D` guidance**
- **Decision:** Drop `gsap.config({ force3D: true })` from the docs; point to the `gsap-performance` skill (which warns against forcing it "just in case").
- **Rationale:** Global `force3D: true` promotes excessive GPU layers; modern GSAP handles it per-tween/auto. Aligns docs with the official skill.

**4. Dual reveal approach (SEO-safe)**
- **Decision:** Document two equivalent reveal strategies: (a) the project's `fromTo` + `clearProps` (no CSS pre-hiding; GSAP's `immediateRender` applies the hidden state only when JS runs and `clearProps` restores natural state — indexable and no-JS-safe), and (b) the CSS `.js-reveal`/`.no-js` fallback from the original guide.
- **Rationale:** Both are SEO-safe; the real project uses (a). Keeps the guide useful to consumers who prefer progressive enhancement.

**5. Lifecycle: single init on `astro:page-load`**
- **Decision:** Components initialize animations only through `document.addEventListener("astro:page-load", init)`, removing the direct call to eliminate double-fire (Astro fires `astro:page-load` on initial load and after every view transition). Document `gsap.context()` + `astro:after-swap` revert as the pattern to add when View Transitions are enabled.
- **Rationale:** Double init re-creates tweens/triggers targeting the same elements, causing wasted work and glitchy re-entrances.

**6. Accessibility: `gsap.matchMedia()` in every organism**
- **Decision:** Wrap each component's animations in `gsap.matchMedia()` — a `(prefers-reduced-motion: no-preference)` branch with full animation and a `(prefers-reduced-motion: reduce)` branch that reveals content without movement.
- **Rationale:** Required for WCAG 2.2; matches the `gsap-core` skill's recommended pattern.

**7. LCP-safe hero banner**
- **Decision:** Change the banner tween from `{ scale, opacity }` to `scale` only (no `opacity`), so the above-the-fold LCP image is never hidden.
- **Rationale:** `opacity: 0` at init delays LCP measurement. Alternatives (CLS wrapper or `content-visibility`) rejected as heavier than animating only transform.

**8. Navigation fixes**
- **Decision:** `docs/component-dependencies.md:124` `[[astro-gsap]]` → `[[gsap-scrolltrigger]]`; add the guide to `docs/astro.md` index; keep the `docs/gsap-scrolltrigger/` folder structure.
- **Rationale:** The wiki-link resolution convention maps doc names, but no `astro-gsap.md` exists; the folder is the correct target.

## Risks / Trade-offs

- [Removing duplicated docs content may lose useful local nuance (e.g. recommended `start` values)] → Migration is a pointer plus a short retained "recommended for this site" value where it's a genuine local decision, not API knowledge.
- [Single `astro:page-load` init could miss cases where the DOM isn't ready] → `astro:page-load` is guaranteed to fire after the page render; scripts also query within the component root with null guards.
- [Reduced-motion branches: if the OS setting is `reduce`, content must still be revealed] → With the `fromTo` + `clearProps` approach content is visible by default, so the `reduce` branch needs no animation; with the `.js-reveal` CSS approach, the `reduce` branch fades content in without movement.
- [Docs/guide drift if skills update] → `skills-lock.json` pins skill versions; pointers reference section names, which are stable in the skills.
- [Hero LCP gains are modest] → Low-risk change; measured gains come from never hiding the LCP element.

## Migration Plan

No runtime deployment concerns (docs + small client-script edits). Rollback: revert the touched component scripts; docs edits are reversible via git.

1. Refactor docs (README + 01–06, navigation fixes).
2. Update `src/lib/gsap.ts` (remove `TextPlugin`, add config/defaults/refresh).
3. Update `Hero.astro`, `Gallery.astro`, `BannerBar.astro` (matchMedia, single init, LCP-safe banner).
4. Remove `@gsap/react` from `package.json` (verify nothing imports it first).
5. Update spec deltas (already written) and archive the change.
6. Verify: `pnpm run validate-imports` passes (guards against removing a still-imported dep), `pnpm build` succeeds, and manual checks for reduced-motion/no-JS.

## Open Questions

- None blocking. (Confirm during implementation that `@gsap/react` has no imports anywhere — `grep` shows none working.)