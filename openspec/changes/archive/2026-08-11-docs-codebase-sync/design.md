## Context

The `docs/` directory contains 14 files designed as reusable guides for any Astro project. A cross-reference audit found 16 inconsistencies between these docs and the actual codebase. Some are minor (example annotations missing), some are structural (PWA fully documented but never implemented), and some are convention mismatches (semicolons used in code but docs say "No semicolons").

The existing `docs-consistency` spec already defines rules for doc portability, single source of truth, and local note callouts. This change extends those rules and fixes the actual codebase where docs and code disagree.

## Goals / Non-Goals

**Goals:**
- Remove inaccurate documentation (PWA)
- Unify the nginx template into a single reusable config with PWA annotations
- Sync the actual `nginx.conf` with the no-PWA variant of the template
- Add missing legacy redirects for `/en/` URLs
- Fix `ImportMetaEnv` type documentation (server-only vs client vars)
- Document the `validate-imports` build step
- Annotate example-only data files in the site-config architecture diagram
- Remove semicolons from all source files to match the documented convention
- Update dependency versions in the React Islands doc
- Add semantic `<main>` wrapper to `Layout.astro`

**Non-Goals:**
- Implementing PWA (explicitly deferred)
- Fixing BaseSEO schema richness, OG type mapping, or baseDescription prop (deferred to SEO implementation)
- Updating Zustand store example in docs (intentionally generic)
- Adding `.js-reveal` or `.no-js` CSS fallback (project uses approach A: fromTo + clearProps)
- Removing semicolons from `src/lib/i18n/` files (they are already semicolon-free; left untouched to keep the diff focused on the files the audit identified)

## Decisions

### Decision 1: Nginx template structure — single file with PWA annotations

**Chosen:** One nginx config block in `docs/astro-docker-deployment.md` with `## PWA: remove this block` comments delimiting PWA-only sections. The actual `nginx.conf` is the template with PWA sections removed.

**Alternatives considered:**
- *Two separate config files in docs:* doubles maintenance, easy to drift apart
- *Keep actual nginx minimal, doc shows PWA version only:* leaves the reader guessing which parts to remove; the annotated single block is self-documenting

### Decision 2: Semicolon removal — manual file-by-file

**Chosen:** Walk each affected file manually, removing semicolons from statement ends in TypeScript code. Astro frontmatter and script blocks only — no changes to HTML/CSS.

**Alternatives considered:**
- *Prettier/eslint auto-fix:* Would reformat more than just semicolons, causing noise. No prettier or eslint config currently exists in the project.
- *sed one-liner:* Too risky — could strip semicolons inside strings, for-in loops, or object literals that need them.

### Decision 3: Legacy redirects — generated from routes object

**Chosen:** Import `routes` from `@/lib/i18n/routes.ts` into `astro.config.mjs` and `reduce` over it to build the redirects map. This is a build-time-only operation — Astro generates static HTML redirect pages. If the `@/` alias does not resolve in the `.mjs` config context, fall back to a relative `./src/lib/i18n/routes.ts` import (the doc example in `docs/astro-i18n.md` §4.1 shows `astro.config.ts`; the project uses `.mjs`).

**Alternatives considered:**
- *nginx redirects:* Would need server config changes; Astro build-time redirects are simpler and work on any host
- *Hardcoded redirects list:* Would need updating whenever routes change; route-driven generation is zero-maintenance

### Decision 4: Scope boundary for SEO issues

The following doc/code mismatches are explicitly out of scope because they touch the SEO component hierarchy which is planned for a future overhaul:
- BaseSEO `baseDescription` prop (doc says it exists, code doesn't have it)
- BaseSEO OG type dynamic mapping (doc describes `ogTypeMap`, code hardcodes "website")
- BaseSEO JSON-LD field richness (doc describes `logo`, `geo`, `openingHoursSpecification`, code has minimal fields)

These will be addressed when the SEO system is fully implemented.

## Risks / Trade-offs

- **Risk:** Semicolon removal could break JSX expressions or template literals → **Mitigation:** Only remove statement-ending semicolons; keep semicolons inside `for(;;)`, `while()`, and object literal shorthand where removal would break syntax. Run `pnpm build` after changes to catch any compilation errors.
- **Risk:** Legacy redirects add one HTML file per route to the build output → **Mitigation:** Current site has 1 route (`home`), so exactly 1 additional file (`dist/en/index.html`). Negligible.
- **Trade-off:** The nginx template becomes longer with PWA annotation comments → accepted for reusability and self-documentation.
