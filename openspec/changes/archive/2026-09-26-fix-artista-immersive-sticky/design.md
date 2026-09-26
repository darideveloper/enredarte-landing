## Context

`ImageRowCard[immersive]` pins its info panel with `md:sticky md:top-[35svh]` (`src/components/molecules/ImageRowCard.astro:41`). Sticky needs an unbroken `overflow:visible` ancestor chain and no ancestor inline `transform` while sticking. `GalleryPage#sala-artworks` satisfies both: no `overflow-hidden` on the section and per-row reveals targeting `Array.from(row.children)` with the comment "sticky wrapper never animated". `ArtistPage#artista-obras` violates both: `overflow-hidden` on the section (`ArtistPage.astro:135`) and a group `gsap.fromTo(rows, …, trigger: works)` tween that puts `transform`/`autoAlpha` inline on the row itself.

## Goals / Non-Goals

**Goals:**
- Restore sticky parity between `/artistas/{slug}` and `/salas/{slug}` with a page-only fix.
- Keep Approach A reveals (`fromTo` + `clearProps`, no CSS pre-hiding) and the reduced-motion / View Transitions lifecycle.

**Non-Goals:**
- No changes to `ImageRowCard`, `ImageBanner`, `Artworks` island, `src/lib/gsap.ts`, routing, data fetching, i18n, or SEO.
- No `pin`/`scrub`, no LCP image animation, no `docs/component-dependencies.md` update (no import change).

## Decisions

- **Remove `overflow-hidden` from `#artista-obras` only** (keep it on the hero and `#artista-salas`, which contain no sticky). Alternative `overflow-x-clip` considered; plain removal matches sala exactly and `y`-only reveals don't need x-containment. If horizontal overflow appears in QA, fall back to `overflow-x-clip`.
- **Copy sala's per-row cells reveal verbatim** into `ArtistPage` (`forEach` row → `gsap.fromTo(cells, {y:40, autoAlpha:0}, {…, trigger: row, start: "top 85%"})`). Alternative of keeping group stagger with `clearProps` rejected: `clearProps` restores sticky only after completion, and shared trigger mistimes tall rows.
- **Leave featured `ImageBanner` fade as-is** — no sticky inside, single fade is safe.

## Risks / Trade-offs

- [Risk] Removing `overflow-hidden` exposes horizontal overflow from reveals → Mitigation: reveals animate `y` only; verify no x-scrollbar on desktop/mobile, else use `overflow-x-clip`.
- [Risk] Per-row triggers increase ScrollTrigger count on long artist lists → Mitigation: same pattern already ships on sala/home; one-shot `play none none none` tweens, no scrub.

## Migration Plan

Page-only Astro edit; SSG rebuild picks it up. Rollback: restore section class + group tween.

## Open Questions

- None. QA will confirm `overflow-x-clip` fallback is unneeded.
