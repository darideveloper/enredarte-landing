## Context

The footer (`src/components/organisms/Footer.astro`) is the only section of the site that ignores the established design system. Every other section uses the theme tokens (`bg-paper`, `text-muted`, `text-crimson`, `border-border-theme`), the serif heading language, and the atomic components (`Link`, `Headline`, `Logo`, `LangBtns`). The footer instead hardcodes Tailwind grays, a single "home" nav link, literal social names, and duplicates the nav-link construction that `Header.astro` already builds inline (Header.astro:16-21). Because there is no shared nav source, the header and footer can drift apart.

This change rebuilds the footer as a dark editorial organism, extracts the duplicated nav into one shared helper, and extends the `Link` atom with a light-on-dark variant.

## Goals / Non-Goals

**Goals:**
- Reuse existing atoms (`Logo`, `Link`, `Headline`, `LangBtns`) instead of re-implementing their markup.
- Eliminate nav-link duplication by giving `Header` and `Footer` a single nav source.
- Match the design language with a dark (`bg-ink`) footer that contrasts the paper pages.
- Source all contact/social/business data from `site-config.ts` (`BUSINESS_DATA`, `SOCIAL_LINKS`).
- Keep i18n parity (`pnpm validate-i18n`) by adding new keys to both `en.json` and `es.json`.
- Sync `docs/component-dependencies.md` per AGENTS.md.

**Non-Goals:**
- No newsletter signup, no new dependencies, no API changes.
- Not fixing the pre-existing broken `#obras`/`#salas`/`#artistas` section anchors (they mirror the header as-is).
- Not refactoring other components beyond the shared-nav extraction.

## Decisions

### 1. New shared nav source: `src/lib/nav.ts`
Extract the nav array from `Header.astro` into `getNavLinks(lang)` in `src/lib/nav.ts`, returning `[{ label, href }]` for Home (localized path via `getLocalizedPath("home", lang)`) and Obras/Salas/Artistas (anchors `#obras`/`#salas`/`#artistas`). Both `Header` and `Footer` import it.
- **Alternative considered:** leaving the array duplicated and letting the footer hardcode its own links — rejected because it re-introduces the drift this change is meant to fix.
- **Alternative considered:** a `Menu` molecule for the footer nav — rejected because `Menu` is a mobile drawer + desktop row layout (Menu.astro), not a vertical link list; a plain `Link`-mapped `<ul>` fits the footer better.

### 2. New `Link` atom variant: `footer`
Add `variant="footer"` to `Link.astro` mirroring `nav` styling (uppercase, `tracking-[0.1em]`, animated crimson underline) but with light-on-dark colors (`text-paper/60 hover:text-paper`).
- **Why a new variant and not a `class` override:** `cn()` in `lib/utils.ts` is a plain join with no tailwind-merge, so `hover:text-paper` passed via `class` would not reliably override `hover:text-ink` from the `nav` variant. A first-class variant keeps the atom's API consistent and the conflict impossible.
- **Alternative considered:** a dark/inverse flag on the `nav` variant — rejected as a second axis of complexity; a dedicated variant is simpler to reason about.

### 3. Dark footer palette
`bg-ink` background with light foreground (`text-paper` / `text-paper/60`) and hairline borders (`border-white/10`). `Logo variant="light"`. Crimson accents from the palette remain readable and on-brand on dark (social hover, nav underline, headline accents).
- **Alternative considered:** keeping the paper palette — rejected by design decision to make the footer an editorial contrast.

### 4. Footer structure: three columns + bottom bar, no new molecule
Three columns: **brand** (`Logo` + tagline + social icons), **nav** (shared `getNavLinks`), **contact** (phone/email/address from `BUSINESS_DATA`). A bottom bar holds the copyright line, the "Powered by" attribution, and `LangBtns`.
Column headings reuse the `Headline` atom; a `FooterColumn` molecule is **not** created because only two columns use a text heading — the heading styling is already DRY through the `Headline` atom.
- **Alternative considered:** a data-driven columns map and a `FooterColumn` molecule — rejected as over-abstraction (YAGNI); two identical headings are cheap and the markup stays readable.

### 5. Social icons as inline SVG
Inline Facebook/Instagram SVG icons (no icon library dependency) with localized `aria-label`s, sourced from `SOCIAL_LINKS` via `BUSINESS_DATA.social`.
- **Alternative considered:** text links — rejected by design decision; icon links read as a real footer.

### 6. New `LangBtns` atom variant: `inverse`
`LangBtns` hardcodes light-mode colors — active link `text-ink`, hover `text-ink` (LangBtns.astro:33) — which are invisible on `bg-ink`, and `cn()` is a plain join so a `class` override cannot resolve the conflict. Add an `inverse` variant swapping the active color to `text-paper`, inactive/hover to `text-paper/60` / `text-paper`, and keeping the separator readable on dark. This mirrors the `Link` `footer` variant approach and keeps the atom API consistent.
- **Alternative considered:** arbitrary-variant classes on the wrapper (`[&_a]:text-paper/60`) — rejected as brittle CSS that fights the atom's own classes.
- **Alternative considered:** dropping the switcher from the footer — rejected because the language switcher is an explicit footer block.

### 7. i18n keys (both files)
New `global.footer.rights`, `global.footer.poweredBy`, `global.footer.social.facebook`, `global.footer.social.instagram`. Reuse existing `pages.home.description` (tagline), `global.footer.links` (nav heading), `global.footer.contact` (contact heading), and `global.nav.*` (labels via shared nav). The bottom bar renders the localized `poweredBy` label followed by a `DariDevTeam` brand link to `https://darideveloper.com`. Validate with `pnpm validate-i18n`.

## Risks / Trade-offs

- [Light-on-dark links need custom variants] → New `footer` variant in `Link.astro`; tested in the footer where it is the only consumer.
- [Light-on-dark language switcher needs custom colors] → New `inverse` variant in `LangBtns.astro`, mirroring the `Link` variant approach.
- [Anchor placeholders `#obras`/`#salas`/`#artistas` don't resolve to real section ids] → Known, pre-existing, out of scope; mirrored as-is to stay consistent with the header.
- [Adding keys risks breaking `validate-i18n` if one file is missed] → Both `en.json` and `es.json` updated together; `pnpm run build` runs the validator and gates the merge.
- [Header refactor could change header output] → `getNavLinks` returns the exact same array; verified by building and visually checking the header.
- [`docs/component-dependencies.md` drift] → Updated in the same change (per AGENTS.md), covering both the Header and Footer trees.
