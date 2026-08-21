## Why

The Hero section on the landing page is 100% hardcoded placeholder copy ("Tierra, mundo y memoria", a fake curator, a local image), while the backend already marks one gallery as the primary Sala via the `is_primary` flag (`galeria-luz`). The hero should showcase the real primary gallery from the API instead of static mockup text, so the landing hero reflects actual collection data and stays correct as the backend changes.

## What Changes

- Add `is_primary: boolean` to the `Gallery` type in `src/lib/api/types.ts` (the backend already returns it).
- Add a `toHeroView(...)` helper in `src/data/api.ts` that selects the gallery where `is_primary === true` and resolves its localized name/description, curator name, and a featured artwork (primary image, title, artist, price, localized href).
- Pass the resolved hero data into `<Hero />` from `Home.astro` (currently `<Hero />` is rendered with no props).
- Update `Hero.astro` to render from props instead of hardcoded text, preserving the existing GSAP entrance animation and slot structure.
- Keep gallery numbering and the featured (`isLarge`) card driven by array order — the `is_primary` flag is used **only** to select the hero's gallery, not to reorder or renumber the gallery section.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `gallery-data`: The `Gallery` type SHALL include `is_primary`. The data layer SHALL expose the primary gallery and a hero view model (localized name/description, curator, featured artwork) resolved from API data.
- `hero-section`: The `Hero` organism SHALL render its content from props passed by the homepage (derived from the primary gallery) instead of hardcoded mockup text, while keeping the existing GSAP choreography.

## Impact

- **Types**: `src/lib/api/types.ts` — `Gallery` interface gains `is_primary`.
- **Data mapping**: `src/data/api.ts` — new `toHeroView` + primary-gallery selection.
- **Homepage**: `src/components/pages/landing/Home.astro` — compute hero data and pass to `<Hero />`.
- **Hero component**: `src/components/organisms/Hero.astro` — consume props; replace hardcoded copy. GSAP script unchanged.
- **Docs**: `docs/component-dependencies.md` may need a note if the Hero's data flow changes.
- **No backend changes**: `is_primary` is already returned by the API and `galeria-luz` is marked primary.
- **Out of scope (product/content decisions, not code-blocking)**: curator location ("Guadalajara, JAL" — `ArtCurator` has no location), changing the "Exhibición del mes" editorial badge label (kept verbatim, not API-sourced), "Ver Manifiesto" CTA (no content/route), "consult" price framing, and a per-artwork detail route.
