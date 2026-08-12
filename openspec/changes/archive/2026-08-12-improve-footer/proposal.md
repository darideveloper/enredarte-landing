## Why

The footer is the only section of the site that ignores the design system: it renders with raw Tailwind grays (`bg-gray-50`, `text-gray-600`), hardcodes its content (a single "home" link, literal "Facebook"/"Instagram" text), and mislabels its first column with the "Inicio" nav label. It reuses none of the existing atoms and duplicates the nav links that `Header.astro` builds inline, so the two can drift out of sync.

## What Changes

- Rebuild `src/components/organisms/Footer.astro` as a dark (`bg-ink`) organism composed from existing atoms: `Logo` (new `bg-red-circle` variant), `Link`, `Headline`, and `LangBtns`.
- Add a `footer` variant to the `Link` atom for light-on-dark footer links (nav-style uppercase with the crimson animated underline).
- Add an `inverse` variant to the `LangBtns` atom so the language switcher is readable on the dark footer (its default `text-ink`/`text-muted` colors are invisible on `bg-ink`). Variant styles are structured as a per-variant object (`active`/`inactive`/`separator`) for easy extension.
- Add a `bg-red-circle` variant to the `Logo` atom referencing `logo-bg-red-circle.webp` (round red badge logo).
- Extract the shared navigation links into a new `src/lib/nav.ts` exporting `getNavLinks(lang)`, consumed by both `Header` and `Footer` (single source of truth).
- Brand column: round red-badge logo (`bg-red-circle` variant, fully rounded, doubled size `h-20`) + localized tagline (reusing the existing `pages.home.description` key) + social links as inline SVG icons (Facebook, Instagram) with localized `aria-label`s.
- Nav column: Home / Obras / Salas / Artistas, mirroring the header exactly (Home → localized path; the rest remain `#obras`, `#salas`, `#artistas` anchors, as-is).
- Contact column: phone (`tel:`), email (`mailto:`), and full address, all sourced from `BUSINESS_DATA`.
- Bottom bar: `© {year} {name}` + localized rights, a localized "Powered by" label followed by a `DariDevTeam` brand link to `https://darideveloper.com`, and the `LangBtns` language switcher (inverse variant for the dark palette).
- Responsive layout: footer content (columns and social icons) is centered on mobile and tablet, switching to the left-aligned three-column layout only from `lg` up.
- Add new i18n keys to **both** `en.json` and `es.json` (`global.footer.rights`, `global.footer.poweredBy`, `global.footer.social.*`) — parity is enforced by `pnpm validate-i18n`.
- Update `docs/component-dependencies.md` to match the new dependency structure (per AGENTS.md).

## Capabilities

### New Capabilities

- `footer-organism`: the footer organism — dark palette, atomic composition (Logo/Link/Headline/LangBtns), shared nav consumption, `BUSINESS_DATA`-driven contact/social content, and localized bottom bar.

### Modified Capabilities

- `link-atom`: the `Link` atom gains a `footer` variant requirement for light-on-dark link styling (the existing `nav` variant's `hover:text-ink` is unusable on `bg-ink`, and `cn()` does not resolve class conflicts).
- `lang-btns-molecule`: the `LangBtns` atom gains an `inverse` variant requirement so the language switcher renders readably on the dark footer.
- `logo-atom`: the `Logo` atom gains a `bg-red-circle` variant mapping to the round red badge asset `logo-bg-red-circle.webp`.

## Impact

- **Components**: `Footer.astro` (rebuilt, responsive centering below `lg`), `Header.astro` (refactored to consume shared nav), `Link.astro` (new `footer` variant), `LangBtns.astro` (new `inverse` variant), `Logo.astro` (new `bg-red-circle` variant).
- **New file**: `src/lib/nav.ts`.
- **i18n**: `src/messages/en.json`, `src/messages/es.json` (new keys, parity enforced by `pnpm validate-i18n`).
- **Docs**: `docs/component-dependencies.md` (sync per AGENTS.md).
- **No** dependency changes, new packages, or API changes.
