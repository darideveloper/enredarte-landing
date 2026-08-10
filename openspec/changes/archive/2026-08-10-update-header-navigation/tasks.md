## 1. i18n message keys

- [x] 1.1 Add `global.nav.obras`, `global.nav.salas`, `global.nav.artistas` to `src/messages/es.json` (`Obras`, `Salas`, `Artistas`)
- [x] 1.2 Add `global.nav.obras`, `global.nav.salas`, `global.nav.artistas` to `src/messages/en.json` (`Works`, `Rooms`, `Artists`)

## 2. Header component

- [x] 2.1 In `src/components/organisms/Header.astro`, add `getTranslations` to the i18n import and create `t` from the current `lang`
- [x] 2.2 Replace the six-item `navLinks` array with a key-based list producing four links: Home → `getLocalizedPath("home", lang)`, Obras/Salas/Artistas → UI anchors (`#obras`, `#salas`, `#artistas`), labels from `t("global.nav.…")`
- [x] 2.3 Remove the mobile CTA (`Btn` slotted into `Menu`, "Solicitar Acceso")
- [x] 2.4 Remove the desktop CTA block (`hidden md:block` wrapper with `Btn` → `#acceso`)
- [x] 2.5 Remove the now-unused `import Btn` from `Header.astro`

## 3. Design system page

- [x] 3.1 In `src/pages/design-system.astro`, relabel the `Btn` ghost showcase (line ~130): drop "(nav CTA)" annotation and change "Solicitar Acceso" text to a generic example
- [x] 3.2 Update the `Menu` showcase (line ~392) to the four Spanish items exactly: Home, Obras, Salas, Artistas

## 4. Documentation sync

- [x] 4.1 In `docs/component-dependencies.md`, remove the `Btn.astro` line from the `Header` subtree and the `Menu <slot/> = Btn.astro (CTA)` line

## 5. Verification

- [x] 5.1 Run the dev server (`pnpm run dev`) and confirm the header renders four localized links, no CTA, and the mobile drawer still toggles
- [x] 5.2 Confirm `pnpm build` / typecheck passes with no unused-import errors
