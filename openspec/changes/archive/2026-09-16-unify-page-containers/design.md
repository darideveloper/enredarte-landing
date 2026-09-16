## Context

The site grew two layout dialects plus one broken hybrid. Landing (`Home.astro:64`, `Gallery.astro:30`, `Hero.astro:38-40`, `Header.astro:20`) is full-bleed `px-6 md:px-14` with no cap — correct for gallery mosaics (`md:gap-[3px]` needs width). `Footer.astro:22`, `CollectionIndex.astro:63`, `BlogPost.astro:118`, `CuratorHero.astro:29` / `CuratorSalas.astro:21` are centered `mx-auto max-w-6xl` — correct for reading. But `BlogIndex.astro:47,65,74`, `GalleryPage.astro:81,98,105`, `BlogPost.astro:96,111` hero, and `ArtistPage.astro:91` inner use `max-w-6xl` **without** `mx-auto`: capped width stuck left on wide viewports. Additionally `GalleryPage.astro:97` (`#sala-artworks`) has no section-level x-padding, and `BannerBar.astro:17` uses `md:px-12` instead of `md:px-14`. Tailwind v4 (CSS-first, `@utility` supported) and a `cn()` helper (`src/lib/utils.ts`) are available. Build: Astro SSG (`getStaticPaths`), verified with `pnpm run dev` at `https://enredarte-landing.localhost`.

## Goals / Non-Goals

**Goals:**

- One documented container contract (canvas vs reading vs narrow) applied to every page and section organism.
- Blog grid and all listing/detail headers visually align with landing edges at all viewports.
- Zero `max-w-*` layout containers without `mx-auto`; zero hand-rolled page containers after migration.

**Non-Goals:**

- No changes to `ArtworkPage` immersive split, `Hero` split-layout cell (`px-6 lg:px-16` bespoke to the two-column hero), `LegalPage` `max-w-3xl` measure, `PostCard` internals, grid spans/columns, pagination logic, animations, routing, i18n, or data fetching.
- No new dependencies. No design-system page restyle (`design-system.astro` uses its own `max-w-5xl` showcase shell — out of scope).

## Decisions

1. **Two tiers, not one rule.** Pure full-bleed (strip all caps) would stretch `BlogPost` body prose and legal text to ~1800px on wide monitors — a readability regression. Pure centered (cap landing too) would strangle the gallery mosaics the design system is built around. Canvas-for-grids + reading-for-prose preserves both intents. Alternative rejected: single `max-w-7xl mx-auto` compromise — still mismatches landing edges, satisfying nobody.
2. **Shared construct: Tailwind v4 `@utility container-site` with variants** (`container-site-canvas`, `container-site-reading`, `container-site-narrow`) in `src/styles/global.css`, over a `Container.astro` component. Rationale: most targets are `<section>`/`<div>` wrappers that already carry many layout classes; a utility composes with existing `class=` + `cn()` usage (e.g. `Gallery.astro:30`, `CuratorHero.astro:28`) with a smaller diff than wrapping every block in a component. Fallback: if `@utility` variants prove awkward with the `md:` responsive prefix, use plain CSS classes under `@layer components` — same contract, different mechanism.
3. **Footer goes full-bleed section + centered inner** (same pattern as `CuratorHero` today): section keeps edge-to-edge background, inner keeps `mx-auto max-w-6xl`. Rationale: footer background should span viewport like landing sections; its link columns stay readable. Alternative (fully full-bleed footer content) rejected — column sprawl at 1920px.
4. **Blog header hairline goes full-bleed** with the header container. Rationale: landing dividers span content width; a capped hairline inside a full-bleed header would look like a second, conflicting measure.
5. **Migrate file-by-file, class-only.** Each edit replaces container classes with the utility; no DOM restructuring, so visual review per page is sufficient (no snapshot infra in repo).

## Risks / Trade-offs

- [Risk] Featured `PostCard` (`lg:col-span-2`) at ~1800px canvas width becomes very large → Mitigation: visual check at 1920px during verification; if oversized, follow-up change caps card media (explicitly not this change).
- [Risk] `@utility` with responsive variants misbehaves → Mitigation: fallback to `@layer components` plain classes; contract (class names per tier) unchanged.
- [Risk] `#sala-artworks` padding gap: removing inner caps without adding section padding pushes content to viewport edges → Mitigation: spec requires section-level `px-6 md:px-14`; task order puts it in the same edit.
- [Risk] Caches/`.astro` stale output masking regressions → Mitigation: verify with fresh `pnpm run dev` + hard refresh, and `pnpm run build` once at the end.

## Migration Plan

1. Add `@utility container-site-*` variants to `src/styles/global.css`.
2. Adopt canvas variant in landing reference sections first and verify pixel-identical output (locks the reference before others match it).
3. Migrate canvas sections file-by-file (blog → sala → artista → post hero → collection → curator inners → banner bar → footer), verifying each at 375/768/1440/1920px against landing edges.
3. Update `docs/component-dependencies.md` (new shared construct).
4. `pnpm run build` to confirm SSG still emits all routes. Rollback: revert class edits (no data/routing changes, so rollback is trivial).

## Open Questions (resolved with user)

1. Footer: **confirmed** full-bleed section + centered `max-w-6xl` inner.
2. Blog header: **confirmed** hairline full-bleed with the header container.
3. `design-system.astro` showcase shell (`max-w-5xl`): **confirmed** untouched.
4. `CollectionIndex` header: **confirmed** all full-bleed (header + grid).
