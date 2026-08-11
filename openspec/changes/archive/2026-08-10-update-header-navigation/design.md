## Context

The header currently renders six hardcoded Spanish nav links whose `#` anchors don't exist on the page, plus a duplicated "Solicitar Acceso" CTA (`#acceso`, also nonexistent) shown on desktop and inside the mobile drawer. `Menu.astro` already accepts a `links` prop and renders each via `Link variant="nav"`. i18n exists via `getTranslations` + `src/messages/{es,en}.json`, and a `global.nav.home` key already exists. The header's `navLinks` array lives in `Header.astro`.

## Goals / Non-Goals

**Goals:**
- Reduce nav to four localized links: Home (page path), Obras, Salas, Artistas (UI anchors).
- Remove the CTA from both desktop and mobile drawer.
- Keep the existing layout, drawer, and hamburger behavior intact.

**Non-Goals:**
- Creating real sections/routes for Obras, Salas, Artistas — the anchors remain UI placeholders.
- Reworking `Menu.astro`, `Link.astro`, `LangBtns.astro`, or the hamburger logic.
- Touching `Footer.astro`.

## Decisions

- **Home as a page link, others as anchors.** Home reuses `getLocalizedPath("home", lang)` (same as the logo). The other three keep `#` hrefs since their sections don't exist yet. Alternative considered: all anchors — rejected because the user explicitly wants Home to redirect to the localized home page.
- **Labels via i18n, not hardcoded.** Add `global.nav.obras|salas|artistas` keys to both message files and build the `navLinks` array from a key list resolved through `getTranslations(lang)`. Alternative: keep hardcoded Spanish — rejected for consistency with the existing `global.nav.home` key and the es/en site.
- **Empty Menu slot left in place.** `Menu.astro` renders `<slot />` unconditionally; passing nothing renders nothing, so no component change is needed. Alternative: remove the slot from `Menu` — rejected as an unnecessary break to a shared molecule.
- **Drop the unused `Btn` import** from `Header.astro` once both CTA usages are removed.
- **Sync `docs/component-dependencies.md`** (AGENTS.md requirement): remove `Btn` from the `Header` subtree and the `Menu slot = Btn (CTA)` line.
- **Design-system page**: relabel the `ghost` showcase (drop "(nav CTA)" and "Solicitar Acceso") and update the `Menu` showcase to four links. This keeps the showcase truthful to the component usage, not a mirror of the live header.

## Risks / Trade-offs

- [Nav labels duplicated between `Header.astro` logic and design-system hardcoded examples] → Accepted; the design-system `Menu` showcase intentionally mirrors the four Spanish nav labels (Home, Obras, Salas, Artistas).
- [Dummy anchors could confuse later] → The proposal and spec record that Obras/Salas/Artistas are intentionally UI-only until sections exist.
