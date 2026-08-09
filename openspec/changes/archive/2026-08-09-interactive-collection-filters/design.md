## Context

The "Colección completa" section on the landing page is fully static: `Home.astro` renders a single-line `Filters` (flex-wrap of single-select tabs) and an `Artworks` grid of `ImageCard`s, with no `client:*` hydration anywhere. The project uses Astro islands + React for interactivity, a vanilla-only atomic component hierarchy (`atoms` → `molecules` → `organisms`), and Zustand as the shared cross-island state layer (`docs/astro-zustand-zod.md`). The only existing store (`src/store/form.ts`) uses `persist` + `partialize`. No API exists yet; `src/lib/api/client.ts` (`safeFetch`) is orphaned and available. `ImageCard.astro` must stay Astro to remain reusable (Gallery, design-system).

## Goals / Non-Goals

**Goals:**
- Faceted, multi-select filtering across 6 groups (artist, discipline, technique, theme, format, scale) using the provided fixture values.
- Filter state in a dedicated Zustand store, persisted per the existing storage pattern.
- Grid updates with an inline loader when filters change, using hardcoded dummy data.
- React only where required (filter chips, rows, grid container/loader); keep `ImageCard` as Astro via the slot pattern.
- Localized labels (`es`/`en`) resolved server-side in `Home.astro`, islands receive already-localized props.
- Reuse existing design tokens and component conventions.

**Non-Goals:**
- No real API integration — dummy data only; the simulated delay is a stub that a future `safeFetch` call will replace.
- No pagination, search, sort, or result-count UI.
- Filter labels are NOT added to `messages/*.json` — they come from the fixture data module. The only UI copy addition is the loader message.
- No changes to `form.ts`, `useField.ts`, `ImageCard`, Gallery, or the design-system page's other sections beyond updating showcases for the converted components.

## Decisions

### D1. Separate `catalog` Zustand store at `src/store/catalog.ts`
Holds **state only**: `selections: Record<GroupKey, string[]>` and `isLoading: boolean`. Uses `persist` with key `enredarte-catalog-storage`; `partialize` returns **only `selections`** (excluding `isLoading` and any non-state data), so nothing but the chosen slugs is written to localStorage. A `toggle(group, value)` action toggles membership, sets `isLoading`, and clears it after a ~400 ms simulated delay.
- **Why**: The docs mandate separate stores per concern and one shared hook per store. Persistence gives a better UX and matches the established pattern. Keeping the store state-only means the fixture data and localization stay where SSR can handle them.
- **Alternative considered**: Colocating state in `form.ts` — rejected (violates separate-concerns rule) and in React component state — rejected (breaks cross-island sharing). Storing fixture groups in the store — rejected (would force bilingual data into the client and complicate `partialize`; groups belong in `src/data/catalog.ts` and flow in as localized props).

### D2. The slot pattern: Astro `ImageCard` children + `data-*` facet attributes + DOM show/hide
`Artworks.tsx` (React) renders `{children}` (pre-rendered Astro `ImageCard`s) inside a `ref`'d grid div. A `useEffect` (deps: `selections`, `isLoading`) queries `[data-artist]` cards and toggles `card.hidden` based on the store's matching predicate. This works because `@astrojs/react` passes slot children as **opaque, memoized raw HTML** inside an `<astro-slot>` element (`display: contents`), so React never reconciles the cards and our `hidden` mutations are never wiped.
- **Why**: Keeps `ImageCard` Astro (reusable by Gallery), keeps cards SSR'd/SEO-friendly, and zero JS cost for the card markup. Confirmed against the installed `@astrojs/react` source (`server.js` wraps children in `StaticHtml` memo; `static-html.js`; Astro injects `astro-island,astro-slot{display:contents}`).
- **Alternative considered**: Pure-React card component — rejected (duplicates `ImageCard` markup, makes it no longer reusable). `experimentalReactChildren` flag — explicitly NOT enabled (would convert slots to real VDOM and make DOM mutation fragile).

### D3. `FilterBtn` as a self-bound React atom
`atoms/FilterBtn.tsx` derives `active` from `useCatalogStore(s => s.selections[group].includes(value))` and calls `toggle(group, value)` on click. Same chip classes as today (`text-[10px] tracking-[0.06em] uppercase px-[18px] py-[9px]`; active `border-crimson text-ink bg-white`; inactive `border-border-theme text-muted`).
- **Why**: Follows the vanilla self-bound atom pattern (`Input.tsx`, `stateful-atom-by-default` spec). Each chip manages its own active state via the store, satisfying the requirement that each button connect to Zustand.
- **Alternative considered**: Presentational chip + parent-owned handlers — rejected (spec requires self-bound store connection).

### D4. `Filters` as a React molecule rendering facet rows
Each row: fixed-width label (`shrink-0`) on the left and a `flex-1 overflow-x-auto` options container with Tailwind arbitrary properties to hide the scrollbar (`[scrollbar-width:none]` + `[&::-webkit-scrollbar]:hidden`). On viewports below `md` the row stacks vertically (`flex flex-col gap-2 md:flex-row md:items-center md:gap-4`): the label sits above the chips and the chips span the full row width, so mobile rows get a much larger scroll window than the ~220px that a fixed-width label would leave. Receives `groups` prop (localized definitions) from Astro; renders `FilterBtn` per option.
- **Why**: Matches the requested "label left, options filling the available width, horizontal overflow, no visible scrollbar" layout with pure Tailwind v4, no new dependencies; the `md` breakpoint matches the rest of the page (`Home.astro`, the artworks grid).
- **Alternative considered**: Keeping the fixed-width label on mobile — rejected (cramped scroll window on small screens); a grid/wrapper refactor — rejected (unneeded complexity for a 2-class responsive change).

### D4b. Overflowing rows scroll by wheel + swipe, with edge fades
The options container is `overflow-x-auto`, so trackpad horizontal swipes scroll natively. Mouse wheel scrolling is added with a native `wheel` listener registered via `addEventListener("wheel", handler, { passive: false })` — React's synthetic `onWheel` is passive, so `preventDefault` would be ignored. The handler translates the wheel delta (whichever axis is larger) into horizontal `scrollLeft`, clamped to `[0, scrollWidth - clientWidth]`, and only calls `preventDefault` when there is room to scroll — so page scrolling still works over non-overflowing rows and at row edges. The row wrapper carries `min-w-0` so the flex item is allowed to shrink below its content width and the inner container actually scrolls rather than overflowing the page. Because the scrollbar is hidden by design, paper-gradient edge fades (`bg-linear-to-l from-paper to-transparent` / mirrored) render on whichever side can still scroll as an affordance, driven by `scroll`/`resize` listeners.
- **Why**: A hidden scrollbar means users need another way to discover and drive scrolling; wheel-to-horizontal plus edge fades cover mouse users, and native `overflow-x-auto` covers touch.
- **Alternative considered**: Swiper 12 (`docs/gsap-scrolltrigger/06-optional-swiper-scroller.md`) — rejected; that doc itself recommends plain CSS `overflow-x:auto` for lightweight chip strips, and it would add a dependency.

### D4c. Drag-to-scroll (implemented)
Click-and-drag scrolling of overflowing rows, mouse-only (`pointerType === "mouse"` so touch keeps native scroll). `pointerdown` records the start position/scroll offset; `pointermove` scrolls the row once movement exceeds a ~5px threshold and calls `setPointerCapture`; `pointerup`/`pointercancel` end the drag. A capture-phase `click` listener suppresses the chip's `onClick` toggle after a real drag (so a plain click still toggles). The container also carries `select-none` to prevent text selection during drag.
- **Why**: Trackpad swipe and wheel already work; drag is the remaining mouse affordance for discovering scrollable rows.
- **Alternative considered**: Swiper's drag — rejected (dependency, see D4b).

### D5. Localization at the Astro boundary
`src/data/catalog.ts` exports fixtures in the future-API shape (`{ slug, es, en }`) plus enriched artworks. `Home.astro` selects the current `lang` and passes already-localized `groups` to `<Filters client:load groups={...}>`. The store deals only in slugs and never sees localized labels or group definitions.
- **Why**: Mirrors the existing `<BookingForm translations={t('global.booking')} client:idle />` convention; when the API lands, only `Home.astro`'s data source changes — islands and store shape stay identical.
- **Alternative considered**: Islands importing `messages/*.json` directly — rejected (breaks the server-localizes pattern and couples client to i18n bundles). Store holding bilingual groups — rejected (see D1).

### D6. Inline loader overlay inside `Artworks.tsx`
Grid wrapper gets `relative`; when `isLoading` → `absolute inset-0 bg-paper/80 z-10` overlay with a crimson spinner and a localized loading message. The message is passed from `Home.astro` as a prop (read from `messages/*.json`, e.g. "Cargando…"/"Loading…"). Cards are never unmounted.
- **Why**: Lightweight, non-blocking, matches GlobalLoader's visual language without the full-screen modal. The orphaned `GlobalLoader.tsx` stays orphaned (it is `fixed inset-0 z-50`). The message is UI copy, so it follows the normal i18n path rather than the fixture module.

### D7. Fixture artwork count
~12–16 artworks (the current 8 plus more from existing `public/images/`) each tagged with facet slugs, so most filter options return real results.
- **Why**: 8 artworks leave most of the 41 options with empty result sets; a slightly larger dummy set makes the interaction demonstrable.

## Fixture Data Reference

Source of truth for the slugs used in `src/data/catalog.ts`. Group option slugs and artwork facet slugs MUST match exactly.

**Por artista — Artist** (seeded with 5 sample artists; slugs derived from the names already used in the artwork data):

| slug | es | en |
|---|---|---|
| `alvaro-macias` | Álvaro Macias | Álvaro Macias |
| `daniel-ortega` | Daniel Ortega | Daniel Ortega |
| `regina-ibarra` | Regina Ibarra | Regina Ibarra |
| `mariana-solis` | Mariana Solís | Mariana Solís |
| `artista-invitado` | Artista invitado | Guest artist |

**Por disciplina — Discipline (6):**

| slug | es | en |
|---|---|---|
| `pintura` | Pintura | Painting |
| `collage` | Collage | Collage |
| `ilustracion` | Ilustración | Illustration |
| `fotografia` | Fotografía | Photography |
| `escultura` | Escultura | Sculpture |
| `street-art` | Street Art | Street Art |

**Por técnica — Technique (7):**

| slug | es | en |
|---|---|---|
| `acrilico` | Acrílico | Acrylic |
| `oleo` | Óleo | Oil |
| `acuarela` | Acuarela | Watercolor |
| `mixta` | Mixta | Mixed media |
| `tinta` | Tinta | Ink |
| `lapiz` | Lápiz | Pencil |
| `carboncillo` | Carboncillo | Charcoal |

**Por temática — Theme (15):**

| slug | es | en |
|---|---|---|
| `naturaleza` | Naturaleza | Nature |
| `retrato` | Retrato | Portrait |
| `paisaje` | Paisaje | Landscape |
| `abstracto` | Abstracto | Abstract |
| `surrealismo` | Surrealismo | Surrealism |
| `urbano` | Urbano | Urban |
| `musica` | Música | Music |
| `cultura-popular` | Cultura popular | Popular culture |
| `identidad` | Identidad | Identity |
| `memoria` | Memoria | Memory |
| `nostalgia` | Nostalgia | Nostalgia |
| `feminismo` | Feminismo | Feminism |
| `ciencia-ficcion` | Ciencia ficción | Science fiction |
| `fantasia` | Fantasía | Fantasy |
| `minimalismo` | Minimalismo | Minimalism |

**Por tipo de pieza — Format (6):**

| slug | es | en |
|---|---|---|
| `obra-original` | Obra original | Original work |
| `edicion-limitada` | Edición limitada | Limited edition |
| `prints` | Prints | Prints |
| `series` | Series | Series |
| `esculturas` | Esculturas | Sculptures |
| `objetos` | Objetos | Objects |

**Por tamaño — Scale (2):**

| slug | es | en |
|---|---|---|
| `mini-obras` | Mini obras | Mini works |
| `gran-formato` | Gran formato | Large format |

## Risks / Trade-offs

- [React islands currently exist only as server-rendered markup; this introduces the first `client:*` hydration] → Mitigation: keep islands narrowly scoped (filters + grid) per `docs/astro-react-islands.md`; `@astrojs/react` is installed and configured.
- [Slot children are opaque HTML; DOM visibility toggling is imperative rather than idiomatic React] → Mitigation: guarded by `if (isLoading) return` to prevent mid-transition flicker; relies on the default (non-experimental) slot path; documented in design so future maintainers don't enable `experimentalReactChildren`.
- [Persisted selections may restore across page navigations and surprise users] → Mitigation: expected behavior for filter UX; `partialize` persists only `selections`; users can toggle chips off individually to clear them.
- [Dummy filter latency (400ms) may feel artificial] → Mitigation: isolated in the store's `toggle` so swapping in a `safeFetch` call later replaces only that layer.
- [Design-system page showcases Astro components that are being removed] → Mitigation: update showcases to the React versions with `client:*` where needed.
- [Fixture slug mismatch (artwork facets vs group options) silently yields empty results] → Mitigation: fixture slug tables are captured in the Fixture Data Reference below; a verification task diffs artwork facet slugs against the group option slugs.
- [Hidden scrollbar makes overflow undiscoverable; a flex wrapper without `min-w-0` causes page-level horizontal overflow instead of row scrolling] → Mitigation: non-passive native wheel listener translates wheel to horizontal scroll, edge fades signal scrollability, `min-w-0` on the row wrapper keeps overflow inside the row.
- [Wheel-to-horizontal hijacks vertical page scroll] → Mitigation: only `preventDefault` when the row can actually scroll in the delta direction (clamped target differs from current); page scroll passes through otherwise.
- [Drag-to-scroll is mouse-only] → Mitigation: touch keeps native `overflow-x-auto` scroll; pen input is not handled (rarely used on chip strips) and can be added later if requested.

## Migration Plan

1. Add `src/data/catalog.ts` (fixtures) and `src/store/catalog.ts` (store) — additive, no breakage.
2. Add React `FilterBtn.tsx`, `Filters.tsx`, `Artworks.tsx` — additive (new file paths).
3. Swap `Home.astro` to the React islands with slot children; delete old Astro `FilterBtn`/`Filters`/`Artworks`.
4. Update `design-system.astro` showcases and `docs/component-dependencies.md`.
5. Run `pnpm run build` (runs `validate-i18n` + `validate-imports`) and visually verify.

**Rollback**: restore the three deleted `.astro` files and revert `Home.astro`; store/data modules are additive and can remain.

## Open Questions

- None blocking. The 5th artist seed is `artista-invitado` (Guest artist), matching the "Artista invitado" artwork already in the data. No dedicated "clear all filters" UI in this change; users clear selections by toggling chips off. Drag-to-scroll is implemented (design D4c); pen input is the only remaining unhandled pointer type and is intentionally out of scope.
