## Why

The current header navigation contains six hardcoded Spanish links (Salas, Artistas, Curadores, Gaceta, Eventos, Trade) whose `#` anchors do not exist anywhere on the page, plus a duplicated "Solicitar Acceso" CTA button that points to a nonexistent `#acceso` anchor. The nav is placeholder UI with no relationship to the actual page sections and no i18n support. This change trims the nav to the real content pillars (Home, Obras, Salas, Artistas), removes the dead CTA, and localizes the labels.

## What Changes

- Replace the six-item `navLinks` array in `Header.astro` with four links: **Home**, **Obras**, **Salas**, **Artistas**.
  - `Home` links to the localized home page path (`getLocalizedPath("home", lang)`), same logic as the logo.
  - `Obras`, `Salas`, `Artistas` remain UI-only `#` anchor placeholders (no routing), as the sections do not exist yet.
- Remove the **"Solicitar Acceso"** CTA button in both placements: the desktop right-section and the mobile drawer slot.
- Localize nav labels via existing `t("global.nav.…")` mechanism: add `nav.obras`, `nav.salas`, `nav.artistas` keys to `src/messages/es.json` and `src/messages/en.json`.
- Remove the now-unused `Btn` import from `Header.astro`.
- Relabel the `ghost` variant showcase in `design-system.astro` (it currently reads "(nav CTA)" / "Solicitar Acceso") to a generic example.
- Update the `Menu` showcase in `design-system.astro` to reflect the four Spanish nav items exactly (Home, Obras, Salas, Artistas).
- Sync `docs/component-dependencies.md` header tree: remove `Btn` from the `Header` subtree and the `Menu slot = Btn (CTA)` line.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `header-organism`: Navigation link set changes from six hardcoded links to four i18n-localized links (Home as a page path, rest as UI anchors); the CTA button ("Solicitar Acceso") is removed from both desktop bar and mobile drawer; `Btn` atom is no longer composed by the header.

## Impact

- `src/components/organisms/Header.astro` — nav array, CTA removal, imports.
- `src/messages/es.json`, `src/messages/en.json` — new `global.nav` keys.
- `src/pages/design-system.astro` — ghost Btn showcase relabeled; Menu showcase links updated.
- `docs/component-dependencies.md` — header tree synced.
- `src/components/molecules/Menu.astro`, `Link.astro`, `LangBtns.astro` — untouched; empty slot is harmless.
