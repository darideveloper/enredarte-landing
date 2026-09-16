## 1. Grid change

- [x] 1.1 Make the static grid class in `src/components/pages/index/CollectionIndex.astro` (~line 136) conditional: `artistas` renders `mt-10 grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, all other pageKeys keep `mt-10 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3`
- [x] 1.2 Confirm no other lines in `CollectionIndex.astro` changed (card builders, `obras` branch, container, header copy untouched)

## 2. Verification

- [x] 2.1 Run `pnpm run dev` and open `/artistas` + `/en/artistas`: 1 col mobile → 2 col `sm` → 3 col `md` → 4 col `lg`, card content (image, name, link, meta) unchanged
- [x] 2.2 Open `/curadores`, `/en/curadores`, `/salas`, `/en/salas`: still 1 → 2 → 3 at all breakpoints, visually unchanged
- [x] 2.3 Run `pnpm run build` to confirm no type/template errors

## 3. Docs sync

- [x] 3.1 Update `docs/component-dependencies.md` CollectionIndex tree: note the artistas `lg:grid-cols-4` (+ `md:3`) exception alongside the shared `lg:grid-cols-3` static grid
