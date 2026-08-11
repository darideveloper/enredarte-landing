## Why

The `docs/` directory diverged from the actual codebase in 16+ places: PWA is fully documented but never implemented, the nginx config template describes a different server than the one deployed, env type declarations are missing, the build pipeline adds an undocumented step, and ~19 files use semicolons against the documented convention. These inconsistencies mislead developers reading the docs for this specific project and erode trust in the reusable docs set.

## What Changes

- **Delete** `docs/astro-pwa.md` — PWA is not implemented and not planned
- **Rewrite** nginx template in `docs/astro-docker-deployment.md` to be a single reusable config with explicitly annotated PWA-only sections; sync actual `nginx.conf` to the no-PWA variant
- **Add** legacy `/en/` → `/` redirects to `astro.config.mjs` using the `routes` object (build-time only, zero runtime cost)
- **Fix** `docs/astro-site-config.md` §3 environment variable types: remove `SITE_URL` from `ImportMetaEnv` (non-`PUBLIC_` vars are server-only; only `PUBLIC_*` vars are exposed to client bundles via `import.meta.env`), mark `PUBLIC_ANALYTICS_ID` as optional
- **Document** `validate-imports` in `docs/astro-i18n.md` §9 build pipeline section
- **Add** `(example)` suffixes to `prices.ts`, `vehicle-features.ts`, `faq.ts` in `docs/astro-site-config.md` architecture diagram
- **Remove semicolons** from 19 files (17 `.astro` files in `src/components/` frontmatter/scripts, `src/pages/design-system.astro`, `lib/gsap.ts`) to match the documented "No semicolons" convention
- **Update** `docs/astro-react-islands.md` §1 dependency versions to match actual `package.json`; remove "No semicolons" from §7 (the convention is now enforced by the codebase itself, no longer aspirational)
- **Add** `<main>` wrapper around `<slot />` in `Layout.astro` to match the layout pattern documented in `docs/astro-client-side-page-transitions.md`
- **Remove** PWA reference from `docs/astro.md` optional list
- **Enforce `@/` imports** — convert the remaining same-directory `./` imports in `src/` to `@/`, tighten `validate-imports` to ban `./` and `../` project imports, and document the sole exception: `astro.config.mjs` (loaded directly by Node, so `@/` cannot resolve there)

## Capabilities

### New Capabilities

- `docs-codebase-sync`: Aligns the documentation set with the actual codebase by removing inaccurate content, syncing config templates, documenting missing steps, and enforcing style conventions across source files

### Modified Capabilities

- `docs-consistency`: Extends existing doc consistency rules with requirements for portable nginx templates, PWA-conditional documentation, env type correctness, and build pipeline documentation completeness

## Impact

- **Docs:** 5 files modified (`astro.md`, `astro-docker-deployment.md`, `astro-i18n.md`, `astro-site-config.md`, `astro-react-islands.md`), 1 deleted (`astro-pwa.md`); spec deltas: new `specs/docs-codebase-sync/spec.md`, modified `specs/docs-consistency/spec.md`
- **Code:** 25 files modified (`nginx.conf`, `astro.config.mjs`, `scripts/validate-imports.ts`, `Layout.astro`, `lib/gsap.ts`, `lib/i18n/utils.ts`, `store/useField.ts`, `components/seo/PageSEO.astro`, 16 `.astro` files in `src/components/`, `src/pages/design-system.astro`)
- **No API changes, no dependency changes, no breaking changes**
