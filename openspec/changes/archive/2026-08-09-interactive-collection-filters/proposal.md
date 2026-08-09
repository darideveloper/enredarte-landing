## Why

The "Colección completa" section on the landing page is static: a single line of single-select filter tabs and a fixed grid of artworks, with zero client-side interactivity. We need real faceted filtering — multiple filter groups (artist, discipline, technique, theme, format, scale), multi-select per group, a loading state, and a grid that updates when filters change. Filter state must live in its own Zustand store (separate from `form.ts`), per the project's shared-store pattern. There is no API yet, so filtering runs against hardcoded dummy data in a shape that maps 1:1 to a future backend.

## What Changes

- **New separate Zustand store** `src/store/catalog.ts` holding filter *state* — multi-select selections per group and a loading flag. Only the selections are persisted to localStorage via `persist` + `partialize` (transient loading state and fixture data excluded), mirroring `form.ts`. The store owns no fixture or localization data.
- **New fixture data module** `src/data/catalog.ts`: 5 artists + 6 filter groups (discipline 6, technique 7, theme 15, format 6, scale 2) with bilingual `{ slug, es, en }` entries, plus ~12–16 artworks enriched with facet slugs. `src/data/` already exists (`site-config.ts`).
- **`FilterBtn` converted from Astro to React** (`atoms/FilterBtn.tsx`): a self-bound atom that derives its active state from the catalog store and toggles its selection on click. **BREAKING**: the `.astro` version and its `active` prop are removed.
- **`Filters` converted from Astro to React** (`molecules/Filters.tsx`): renders one facet row per group — label fixed at left, option chips filling remaining width with horizontal overflow and a hidden scrollbar. On mobile (< `md`) the label stacks above the chips so they use the full row width. **BREAKING**: the single-line `{ text, value }` list API is replaced by a `groups` prop of facet definitions.
- **Scroll UX for overflowing rows**: rows with more chips than fit are scrollable by mouse wheel (native non-passive `wheel` listener translating the wheel delta to horizontal `scrollLeft`, clamped to bounds, only intercepting when the row can actually scroll) and by trackpad swipe. Paper-gradient edge fades signal that more content exists on the side that can still scroll. The row wrapper uses `min-w-0` so the inner `overflow-x-auto` container shrinks and scrolls instead of overflowing the page. Touch keeps native scroll.
- **Drag-to-scroll**: overflowing rows are scrollable by mouse drag (`pointerType === "mouse"`, ~5px threshold, capture-phase `click` suppression so a plain click still toggles). Touch keeps native scroll.
- **`Artworks` converted from Astro to React** (`organisms/Artworks.tsx`): a React island owning the grid container, an inline loader overlay, and visibility toggling of its `ImageCard` slot children based on store selections.
- **`ImageCard` stays Astro** and is reused as slot children of `Artworks`, stamped with `data-*` facet attributes at the call site. **No new React card component.**
- **`Home.astro`**: section keeps `Title`/`Headline`, hydrates `<Filters client:load>` and `<Artworks client:load>` islands, localizes fixture labels server-side per `lang`, and passes them as props. Old `filterOptions`/`artworksData` arrays are removed (moved to `src/data/catalog.ts`).
- **`design-system.astro`**: showcases updated to the React `FilterBtn`/`Filters`/`Artworks` (with `client:*` directives where interactivity is required).
- **`docs/component-dependencies.md`** updated to reflect new files, React conversions, the catalog store, and removal of old Astro components.
- **Loading behavior**: toggling any filter sets `isLoading`, shows an inline loader overlay over the grid, waits a simulated ~400 ms (the future home of a `safeFetch`-backed API call), then reveals matching artworks. The loader message is passed from Astro as a localized prop.
- **Matching rule**: within a group selections combine with OR; across groups with AND; an empty group matches everything.

## Capabilities

### New Capabilities
- `catalog-filter-store`: A separate Zustand store (`src/store/catalog.ts`) holding multi-select filter selections per facet group and a loading flag; selections persisted via `persist`/`partialize` following the `form.ts` storage pattern. Fixture group definitions live in `src/data/catalog.ts` and are passed to the `Filters` island as localized props.

### Modified Capabilities
- `filter-btn-atom`: `FilterBtn` becomes a self-bound React atom bound to the catalog store. The single-select `active` prop is replaced by deriving active state from the store's selections for its group/value; clicking toggles membership.
- `filters-molecule`: `Filters` becomes a React molecule rendering multiple facet rows (label left, horizontally scrollable chips right, hidden scrollbar, wheel + swipe scrolling, edge-fade affordances, multi-select per row; label stacks above chips on mobile) instead of a single-line flex-wrap list.
- `artworks-organism`: `Artworks` becomes a React island that owns the responsive grid container, renders an inline loader while filters are applied, and toggles visibility of its Astro `ImageCard` slot children based on catalog-store selections.

## Impact

- **New files**: `src/store/catalog.ts`, `src/data/catalog.ts`, `src/components/atoms/FilterBtn.tsx`, `src/components/molecules/Filters.tsx`, `src/components/organisms/Artworks.tsx`.
- **Removed files**: `src/components/atoms/FilterBtn.astro`, `src/components/molecules/Filters.astro`, `src/components/organisms/Artworks.astro`.
- **Modified files**: `src/components/pages/landing/Home.astro`, `src/pages/design-system.astro`, `src/messages/es.json`, `src/messages/en.json` (loader message key), `docs/component-dependencies.md`.
- **Reused as-is**: `ImageCard.astro` (slot children), `Title.astro`, `Headline.astro`, `cn` util, all design tokens (`crimson`, `paper`, `ink`, `muted`, `border-theme`), `@astrojs/react` + zustand + zod deps (already installed).
- **Orphaned components activated**: when the real API arrives, the store's filter action will call `safeFetch` from `src/lib/api/client.ts`; for now it simulates latency with a timeout. `GlobalLoader.tsx` is *not* reused — an inline grid overlay replaces it (its orphaned status stays).
- **No new dependencies.**
- **i18n**: filter labels remain bilingual (`es`/`en`) in the fixture data module; localization happens server-side in `Home.astro`, islands receive already-localized strings (matches the existing `<BookingForm translations={...} />` convention). The loader message is the one UI copy addition to `messages/*.json`.
