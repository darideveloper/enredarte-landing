# Design — Hero from primary gallery

## Context

The landing hero (`src/components/organisms/Hero.astro`) is entirely hardcoded mockup copy. The backend DRF API already returns `is_primary` on galleries and marks `galeria-luz` as the single primary Sala. The frontend `Gallery` type (`src/lib/api/types.ts`) doesn't model `is_primary`, and `Home.astro` renders `<Hero />` with no props. A recent (uncommitted) change already switched gallery numbering to array-index based and removed `sort_order` from `Base`.

Decision already made by the stakeholder: **array order remains authoritative** for gallery numbering and the featured (`isLarge`) card; `is_primary` is used **only** to select which gallery the hero features.

## Goals / Non-Goals

**Goals**
- Model `is_primary` on the `Gallery` type.
- Add a hero view model resolved from the primary gallery.
- Render the hero from props instead of hardcoded copy.
- Keep the existing GSAP entrance choreography and slot structure intact.

**Non-Goals**
- Reordering/renumbering the gallery section (stays array-order).
- Adding backend changes (`is_primary` already exists).
- Curator location, "Exhibición del mes" editorial badge, "Ver Manifiesto" CTA, "consult" price framing, or a per-artwork detail route (out of scope, product decisions).

## Decisions

### D1: Model `is_primary` on the `Gallery` type
Add `is_primary: boolean` to the `Gallery` interface in `src/lib/api/types.ts`. The backend returns it (verified live: `galeria-luz` → `true`). Rationale: it's the single authoritative signal for "main Sala". Alternative (index position) rejected because it conflates hero selection with display order, which the stakeholder chose to keep separate.

### D2: Add `toHeroView(...)` in `src/data/api.ts`
New function selecting `siteData.galleries.find(g => g.is_primary)` (fallback: first gallery), then resolving:
- localized `title`/`description` via the existing `pickTranslation`
- curator name via existing `resolveGalleryCurator`
- featured artwork via existing `resolveGalleryArtworks` (first by `artwork_links.sort_order`) and `primaryImage` (image with `is_primary`, else first); its localized title, artist name (via `resolveArtistName`), and price
- `href` via existing `getLocalizedSalaPath`

Rationale: reuses the established data-layer helpers and keeps a single source of truth in `data/api.ts` alongside `toSalaView`/`toArtworkView`.

### D3: Pass hero data through `Home.astro` into `<Hero />`
`Home.astro` computes `hero = toHeroView(...)` and renders `<Hero sala={hero} />`. `Hero.astro` gains a `sala` prop and renders title/description/badge/curator/artwork from it, with safe defaults so the design-system showcase (which renders `<Hero />` without props) doesn't break.

### D4: Badge and CTA behavior
- Badge reads `Sala NN` from the primary gallery's **array index** (consistent with the gallery section) plus the editorial "Exhibición del mes" label (unchanged, not API-sourced).
- Primary CTA ("Entrar a la Sala") links to `/salas/<slug>` via `getLocalizedSalaPath`.
- The artwork banner `href` links to the gallery detail page (a per-artwork detail route doesn't exist yet), and the price is the real `price_usd` formatted like `toArtworkView`, omitted when absent.

## Risks / Trade-offs

- **Hero badge may not be "Sala 01"** → The primary gallery `galeria-luz` is at index 1, so its hero badge reads "Sala 02". This is the intended consequence of keeping array order authoritative; accepted per stakeholder decision. [Risk] Confusion that the hero gallery isn't "Sala 01" → Mitigation: document this in the code comment; revisit only if a product requirement demands primary = 01.
- **No primary gallery** → fallback to first-in-array keeps the hero functional. [Risk] None material; seeding guarantees a primary.
- **Design-system showcase breakage** → `<Hero />` with no props must render with safe defaults. [Risk] Runtime error on null → Mitigation: default prop values in `Hero.astro`.
- **Featured artwork may lack a price** → some artworks may be `price_usd: 0`. [Risk] empty price line → Mitigation: omit price when absent (consistent with `toArtworkView`).

## Migration Plan
Pure frontend additive change; no data migration. Deploy together with the uncommitted numbering change (`remove-gallery-sort-order`) to keep the data layer coherent. Rollback: revert the hero props wiring in `Home.astro`/`Hero.astro` and the type addition; the hero falls back to hardcoded copy.
