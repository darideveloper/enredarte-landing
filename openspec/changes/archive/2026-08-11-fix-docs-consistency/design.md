## Context

The `docs/` directory is a portable knowledge base: each file documents a feature pattern meant to be replicated in any fresh Astro project. Because the set grew organically (different authors, different dates), it accumulated internal integrity issues: the same nginx caching block and the same GSAP+View-Transitions code live in two docs each; a nonexistent Astro version (`^7`) is pinned; frontmatter is inconsistent; project-specific notes about `enredarte-landing` appear inside otherwise-generic guides; and small factual slips exist (a summary counting "three things" while listing four, two different `theme_color` values).

The user has decided, per issue, how each problem should be resolved (see the review conversation). This design records the conventions those decisions imply so the fixes are applied consistently.

## Goals / Non-Goals

**Goals:**
- Make the docs internally consistent: one canonical owner per piece of duplicated content.
- Keep the docs portable: version-agnostic placeholders, no unmarked project-specific content.
- Unify frontmatter and small factual slips (counts, colors, `npm`/`pnpm`).
- Make the GSAP reveal-strategy taxonomy honest (three approaches, not two).

**Non-Goals:**
- Rewriting `[[...]]` wiki-links to markdown links (decided: keep as-is).
- Changing `docs/component-dependencies.md` (project-specific by design; keep as-is).
- Verifying any codebase behavior — docs-only change.

## Decisions

### D1. Single source of truth per duplicated topic
- **Nginx SW/manifest caching rules:** owned by `docs/astro-docker-deployment.md` (the nginx.conf there). `docs/astro-pwa.md` §6 keeps only a short note pointing at it.
- **GSAP + View Transitions pattern:** owned by `docs/astro-client-side-page-transitions.md` §5.4. `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` §5 becomes a short cross-reference to it, keeping only the `transition:animate="none"` snippet inline for context (see task 1.2).
- **Why this direction:** the PWA caching rules are server config best owned by the deployment doc; the VT+GSAP pattern is a navigation-lifecycle concern best owned by the transitions doc (which also holds the full lifecycle event table). Cross-doc references use relative markdown links so they work in any renderer.

### D2. "Local note" callout convention
Non-portable notes about the current repo are wrapped in:
```
> **🏠 Local note (enredarte-landing):** ...
```
Applied to the four known spots (fetch-wrapper, atomic-components, gsap/README, gsap/02). Any future project-specific note must use the same callout.

### D3. Frontmatter convention
Every top-level doc (except `docs/component-dependencies.md`, intentionally unchanged) and every `gsap-scrolltrigger/*.md` file gets the standard frontmatter:
```
---
created: <date>
updated: <date>
tags: [...]
type: resource
status: active
---
```
`astro.md` keeps `type: area-note`; the gsap-scrolltrigger sub-guide files use `type: resource` with tags like `gsap`, `animation`, `documentation`. Dates: `created`/`updated` set to the last edit date (today for newly-frontmattered files).

### D4. Version-agnostic placeholders
Pinned versions in reusable code/config become generic: `node:lts-alpine`, `pnpm@<latest>` (or note "example version"). The impossible `astro@^7` becomes `astro@^5 || ^6` (per the user's decision). The docker `engines` example becomes `node >= LTS`.

### D5. Honest reveal-strategy taxonomy
`docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` §4 gains a third approach:
- A. `fromTo` + `clearProps`
- B. CSS `.js-reveal` + `.no-js`
- C. Hybrid: `.js-reveal` CSS hiding + `gsap.set(autoAlpha: 1)` + `.from()` (what `03-section-reveal-pattern.md` actually uses)

`03` labels its template as approach C. This removes the "mutually exclusive two options" framing that the template already contradicted.

### D6. Small factual fixes
- Transitions §9 summary: "three things" → "four things".
- Portless §3: drop `vite.server.port`, keep `server.port`.
- i18n §9: `npm run validate-i18n` → `pnpm run validate-i18n`; add explicit `pnpm add -D tsx` in the validation section body; add a "scales to 3+ languages" note near the top; add a Client Router cross-ref in §12.
- PWA theme color: unify to `#fe676e` (manifest value) in §5.
- gsap/03 + 04: strengthen the helper-code disclaimer (convenience-only, not the reference implementation).

## Risks / Trade-offs

- [Cross-doc references break if a file is renamed] → The links are relative markdown links; the AGENTS.md convention already documents keeping `docs/component-dependencies.md` in sync, and the same discipline applies here.
- [Removing duplicated code makes a single doc harder to read in isolation] → Acceptable: the docs are a set; the canonical owner is chosen deliberately and the pointer keeps the reader on track.
- [Frontmatter dates drift] → `updated` is set to today; no automated enforcement is added (out of scope).
- ["Local note" callout relies on human discipline] → The convention is documented in the specs; future authors follow it.

## Migration Plan

Docs-only change. No runtime migration, no rollback concerns beyond git revert. Apply in the order: (1) single-source refactors, (2) version placeholders + factual fixes, (3) frontmatter, (4) local-note callouts, (5) reveal taxonomy.

## Open Questions

None.
