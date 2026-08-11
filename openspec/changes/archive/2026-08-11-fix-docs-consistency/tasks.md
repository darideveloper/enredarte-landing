## 1. Single source of truth refactors

- [x] 1.1 In `docs/astro-pwa.md` §6, remove the duplicated nginx service-worker/manifest/`/_astro/` caching block and replace it with a note referencing `docs/astro-docker-deployment.md` as the canonical source
- [x] 1.2 In `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` §5, replace the full GSAP+VT lifecycle code with a short cross-reference to `docs/astro-client-side-page-transitions.md` §5.4, keeping only what is needed inline for context

## 2. Version and factual fixes

- [x] 2.1 In `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md`, change `astro@^7` to `astro@^5 || ^6`
- [x] 2.2 In `docs/astro-client-side-page-transitions.md` §9, change "three things" to "four things"
- [x] 2.3 In `docs/astro-portless.md` §3, remove the redundant `vite.server.port` block, keeping only `server.port`
- [x] 2.4 In `docs/astro-pwa.md` §5, change the theme-color meta tag from `#dd4d57` to `#fe676e`
- [x] 2.5 In `docs/astro-docker-deployment.md`, replace pinned versions with placeholders: `node:22-alpine` → `node:lts-alpine`, `pnpm@10.18.3` → `pnpm@<latest>`, and the `engines.node` example → `>= LTS`
- [x] 2.6 In `docs/astro-react-islands.md` and `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md`, replace pinned dependency versions with generic placeholders or note they are examples

## 3. i18n doc fixes

- [x] 3.1 In `docs/astro-i18n.md`, add a note near the top stating the pattern scales to 3+ languages (add to `ui.ts`, `routes.ts`, and the validation script)
- [x] 3.2 In `docs/astro-i18n.md` §9, change `npm run validate-i18n` to `pnpm run validate-i18n` (both in the pipeline snippet and the prose)
- [x] 3.3 In `docs/astro-i18n.md` §9, add an explicit `pnpm add -D tsx` install step in the build-time validation section body
- [x] 3.4 In `docs/astro-i18n.md` §12, add a cross-reference to `docs/astro-client-side-page-transitions.md` for i18n + View Transitions behavior

## 4. Frontmatter

- [x] 4.1 Add standard frontmatter (`created`, `updated`, `tags`, `type: resource`, `status: active`) to `docs/astro-seo.md`
- [x] 4.2 Add standard frontmatter to `docs/astro-client-side-page-transitions.md`
- [x] 4.3 Add standard frontmatter to all 7 files in `docs/gsap-scrolltrigger/` (README + 01–06)

## 5. Local note callouts

- [x] 5.1 In `docs/astro-fetch-wrapper.md`, wrap the `enredarte-landing` `src/lib/api/` orphaned-files note in a `🏠 Local note (enredarte-landing)` callout
- [x] 5.2 In `docs/astro-atomic-components.md`, wrap the "This repository is vanilla-only" statement in a `🏠 Local note (enredarte-landing)` callout
- [x] 5.3 In `docs/gsap-scrolltrigger/README.md`, wrap the "Real project note" in a `🏠 Local note (enredarte-landing)` callout
- [x] 5.4 In `docs/gsap-scrolltrigger/02-loader-and-entrance-orchestration.md`, wrap the `GlobalLoader.tsx` note in a `🏠 Local note (enredarte-landing)` callout

## 6. Reveal taxonomy and helper disclaimers

- [x] 6.1 In `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` §4, add the hybrid approach (C) alongside A (`fromTo` + `clearProps`) and B (CSS `.js-reveal` + `.no-js`), and update the framing so the three are not described as two mutually exclusive options
- [x] 6.2 In `docs/gsap-scrolltrigger/03-section-reveal-pattern.md`, label the template as using approach C (hybrid)
- [x] 6.3 In `docs/gsap-scrolltrigger/03-section-reveal-pattern.md` and `04-scroll-effects-marquee-and-counters.md`, add a stronger disclaimer near the `reveal-helper.ts` and `animate-counters.ts` code stating they are convenience-only and not the reference implementation

## 7. Verification

- [x] 7.1 Re-read each edited doc to confirm no duplicated blocks remain and all cross-references point to existing headings/files
- [x] 7.2 Confirm all files in `docs/` and `docs/gsap-scrolltrigger/` now carry consistent frontmatter
