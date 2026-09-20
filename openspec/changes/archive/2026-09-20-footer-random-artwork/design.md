## Context

The site is fully static: `src/pages/[...path].astro#getStaticPaths` pre-renders every artwork page and builds `siteData` (all artworks with `status`) at build time. `src/layouts/Layout.astro` renders `<Footer />` with zero props on every page; `Footer.astro` derives only `lang` from `Astro.url`. Existing interactive elements are React islands (`.tsx` + `client:load`, e.g. `FilterBtn`, `BuyWidget`) with shared state in `zustand` stores — but this button needs no shared state. Artwork URLs are produced by `getLocalizedArtworkPath(slug, lang)` (`/obras/<slug>` / `/en/obras/<slug>`).

## Goals / Non-Goals

**Goals:**
- One-click random jump to an *available* artwork from the footer nav column (last item), same tab, correctly localized.
- Exclude the artwork currently being viewed from the draw; hide the button when no destination exists.
- Props-only React atom, no new dependencies, i18n-parity safe (`pnpm validate-i18n` passes).

**Non-Goals:**
- No new server route or `/random` redirect (static output has no server).
- No shared store, no analytics, no "avoid recently seen" history.
- No visual redesign of the footer beyond the single distinct button.

## Decisions

- **React island with `client:load`** over plain `<script>`: heavier (React hydrates on every page), but explicitly required. Consistent with the 14 existing `client:load` islands. Alternative `client:visible`/`idle` rejected — footer-adjacent pages trigger it near-immediately anyway, and consistency beats micro-deferral.
- **Build-time slug list as props** (`availableSlugs: string[]` computed in `[...path].astro`, threaded `Layout → Footer → island`) over client-side fetch: no API for random artwork exists, and the static build already holds every slug + status. Keeps runtime to `Math.random()` + `location.assign()`.
- **Exclude-current via `Astro.url` in `Footer.astro`** (parse current artwork slug from pathname, pass as `currentSlug?` prop) over threading `artworkSlug` through `Layout`: `Layout` never receives page slugs today; parsing in `Footer` mirrors the existing `getLangFromUrl(Astro.url)` pattern and avoids touching every page component's `Layout` call.
- **Atom location `src/components/atoms/RandomArtworkBtn.tsx`**: single-button unit like `FilterBtn.tsx`; props `{ slugs, lang, label, currentSlug? }`; navigation via `window.location.assign(getLocalizedArtworkPath(pick, lang))`. Pure function `pickRandom(slugs, currentSlug?)` exported for verification.
- **Distinct button styling** (crimson-accent button, final utility classes chosen at implementation; MUST differ visually from `Link variant="footer"` plain links): explicitly requested to stand out as the last nav item.
- **Hide on empty draw** over disabled state: avoids a dead control on the rare all-sold / single-artwork-current edge.

## Risks / Trade-offs

- [Risk] `client:load` React on 100% of pages for trivial logic → Mitigation: accepted requirement; component stays dependency-free (no store, no gsap/zod) to keep the island minimal.
- [Risk] Build-time list goes stale between deploys (sold status changes) → Mitigation: same staleness as all pre-rendered pages; rebuild picks it up. No worse than status badges today.
- [Risk] `Footer` URL-parsing breaks on future route shapes → Mitigation: reuse `getLocalizedArtworkPath` inverse lightly (segment match on `/obras/<slug>` incl. `/en/` prefix); non-matching paths yield `undefined` = no exclusion.
- [Risk] `docs/component-dependencies.md` drift → Mitigation: refresh it in the same change (repo rule for Layout/Footer import changes).
- [Risk] Button absent on the 404 page → Accepted: `404.astro` renders `Layout` without slugs, so the empty-draw rule hides the button there. No fix planned.
