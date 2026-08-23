## 1. Shared Navigation Source

- [x] 1.1 Create `src/lib/nav.ts` exporting `getNavLinks(lang)` returning the four nav links (Home → `getLocalizedPath("home", lang)`; Obras/Salas/Artistas → `#obras`/`#salas`/`#artistas`), with labels from `global.nav.*`
- [x] 1.2 Refactor `src/components/organisms/Header.astro` to import `getNavLinks` instead of building the nav array inline, keeping rendered output identical

## 2. Atom Variants

- [x] 2.1 Add `variant="footer"` to `src/components/atoms/Link.astro` (uppercase, `tracking-[0.1em]`, `text-paper/60 hover:text-paper`, crimson animated underline), matching the nav variant styling but light-on-dark
- [x] 2.2 Add `variant="inverse"` to `src/components/atoms/LangBtns.astro` (active `text-paper`, inactive `text-paper/60 hover:text-paper`, separator visible on dark), mirroring the Link footer variant approach

## 3. i18n Keys

- [x] 3.1 Add `global.footer.rights`, `global.footer.poweredBy`, `global.footer.social.facebook`, `global.footer.social.instagram` to `src/messages/en.json`
- [x] 3.2 Add the same keys to `src/messages/es.json` with Spanish values

## 4. Footer Rebuild

- [x] 4.1 Rebuild `src/components/organisms/Footer.astro`: dark `bg-ink` shell with light foreground and `border-white/10` top border
- [x] 4.2 Brand column: `Logo` (light variant, links to localized home) + tagline from `pages.home.description` + inline SVG Facebook/Instagram icons from `SOCIAL_LINKS` with localized `aria-label`s
- [x] 4.3 Nav column: `Headline`-styled heading + links from `getNavLinks(lang)` using `Link variant="footer"`
- [x] 4.4 Contact column: `Headline`-styled heading + phone (`tel:`), email (`mailto:`), and full address from `BUSINESS_DATA`
- [x] 4.5 Bottom bar: `© {year} {name}` + `global.footer.rights`, `global.footer.poweredBy` label + `DariDevTeam` brand link to `https://darideveloper.com`, and `LangBtns` (inverse variant)

## 5. Docs & Verification

- [x] 5.1 Update `docs/component-dependencies.md` (Footer tree: Logo/Link/Headline/LangBtns + lib/nav.ts; Header tree: lib/nav.ts) per AGENTS.md
- [x] 5.2 Run `pnpm run build` — `validate-i18n`, `validate-imports`, and `astro build` all pass
- [x] 5.3 Manually verify at `https://enredarte-landing.localhost`: dark footer renders on both `/` and `/es`, header output is unchanged, footer nav mirrors header, contact/social links work, language switcher is readable on the dark bottom bar
