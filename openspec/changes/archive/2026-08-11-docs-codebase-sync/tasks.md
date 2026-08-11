## 1. PWA Documentation Cleanup

- [x] 1.1 Delete `docs/astro-pwa.md`
- [x] 1.2 Remove `[[astro-pwa|PWA Out of the Box]]` from `docs/astro.md` optional section

## 2. Nginx Configuration Unification

- [x] 2.1 Rewrite nginx template in `docs/astro-docker-deployment.md` §2 — single config block with PWA-only sections annotated (`## PWA: remove this block if not using PWA`)
- [x] 2.2 Sync actual `nginx.conf` to match no-PWA variant of template (add X-XSS-Protection header, extended gzip_types, static assets cache block)
- [x] 2.3 Qualify PWA-dependent Key Rules in §Key Rules (service-worker no-cache, `error_page 404 /offline/index.html`) as PWA-only, not universal

## 3. Legacy Redirects

- [x] 3.1 Import `routes` in `astro.config.mjs` and add `legacyRedirects` map (if the `@/` alias does not resolve in the `.mjs` config context, use a relative `./src/lib/i18n/routes.ts` import)
- [x] 3.2 Add `redirects` property to `defineConfig()`

## 4. Environment Variable Types Fix

- [x] 4.1 Remove `SITE_URL` from `ImportMetaEnv` example in `docs/astro-site-config.md` §3 (non-`PUBLIC_` vars are server-only; only `PUBLIC_*` are exposed to client bundles)
- [x] 4.2 Mark `PUBLIC_ANALYTICS_ID` as optional in the doc example with a comment
- [x] 4.3 Update the §3 prose sentence that references `import.meta.env.SITE_URL` so it no longer dangles after the removal

## 5. Build Pipeline Documentation

- [x] 5.1 Add `validate-imports` to build command in `docs/astro-i18n.md` §9
- [x] 5.2 Document what `validate-imports` checks and why it exists

## 6. Site-Config Architecture Diagram

- [x] 6.1 Add `(example)` suffix to `prices.ts`, `vehicle-features.ts`, `faq.ts` in `docs/astro-site-config.md` §0 architecture diagram
- [x] 6.2 Clarify in §2 that these are optional patterns, not current project files

## 7. Semicolons Removal — Source Files

- [x] 7.1 Remove semicolons from `src/lib/gsap.ts`
- [x] 7.2 Remove semicolons from all `.astro` files in `src/components/` (frontmatter + script blocks) — 16 files (Footer.astro excluded: its only `;` is the `&copy;` HTML entity)
- [x] 7.3 Remove semicolons from `src/pages/design-system.astro`
- [x] 7.4 Verify build passes after all semicolon changes (`pnpm build`)

## 8. React Islands Doc Updates

- [x] 8.1 Update `@astrojs/react` version from `^5` to `^6` in `docs/astro-react-islands.md` §1
- [x] 8.2 Remove "No semicolons" from §7 conventions (now enforced by codebase, not aspirational)

## 9. Layout Semantic Wrapper

- [x] 9.1 Wrap `<slot />` in `<main>...</main>` in `src/layouts/Layout.astro`

## 10. Docs-Consistency Spec Delta

- [x] 10.1 Verify new requirements in `specs/docs-consistency/spec.md` are applied during implementation (PWA-conditional, build pipeline completeness, env type correctness, semicolons convention)

## 11. Verification

- [x] 11.1 Run `pnpm build` — must pass with no errors
- [x] 11.2 Run `pnpm validate-i18n` — must pass
- [x] 11.3 Run `pnpm validate-imports` — must pass
- [x] 11.4 Spot-check: `docs/astro-pwa.md` does not exist
- [x] 11.5 Spot-check: `nginx.conf` has X-XSS-Protection header, extended gzip_types, static assets cache block, no PWA blocks
- [x] 11.6 Spot-check: `astro.config.mjs` has `redirects` property with `/en` → `/` mapping
- [x] 11.7 Spot-check: `Layout.astro` has `<main>` wrapper around `<slot />`

## 12. `@/` Import Convention Enforcement

- [x] 12.1 Convert remaining same-directory `./` imports in `src/` to `@/` (`src/store/useField.ts`, `src/lib/i18n/utils.ts`, `src/components/seo/PageSEO.astro`)
- [x] 12.2 Tighten `scripts/validate-imports.ts` to flag single-dot `./` relative imports (regex `\.{2,}` → `\.{1,}`) and update the error message
- [x] 12.3 Update `docs/astro-react-islands.md` §7 convention to "always use `@/`, including same-directory imports"
- [x] 12.4 Update `docs/astro-i18n.md` §9 validator description + architecture diagram, and document the config-file `@/` exception in §4.1
- [x] 12.5 Add a comment in `astro.config.mjs` explaining why it imports `routes` relatively, and verify `pnpm build` passes with the stricter rule
