## 1. Remove page components and duplicate atom

- [ ] 1.1 Delete `src/components/pages/services/Services.astro`
- [ ] 1.2 Delete `src/components/pages/about/About.astro`
- [ ] 1.3 Delete `src/components/atoms/Button.tsx`

## 2. Remove routes and dynamic route wiring

- [ ] 2.1 Remove `services` and `about` entries from `src/lib/i18n/routes.ts` so only `home` remains
- [ ] 2.2 Remove the `Services` and `About` imports from `src/pages/[...path].astro`
- [ ] 2.3 Remove the `services` and `about` entries from `COMPONENT_MAP` in `src/pages/[...path].astro`

## 3. Trim Footer navigation

- [ ] 3.1 Change the Footer links array in `src/components/organisms/Footer.astro` from `["home", "services", "about"]` to `["home"]`

## 4. Clean orphaned translations

- [ ] 4.1 Remove `global.nav.services`, `global.nav.about`, `global.learnMore`, `pages.services.*`, and `pages.about.*` from `src/messages/en.json`
- [ ] 4.2 Remove `global.nav.services`, `global.nav.about`, `global.learnMore`, `pages.services.*`, and `pages.about.*` from `src/messages/es.json`

## 5. Verify

- [ ] 5.1 Confirm no imports of `atoms/Button` remain anywhere in `src/`
- [ ] 5.2 Confirm no references to removed translation keys remain in `src/`
- [ ] 5.3 Run the build (`pnpm build`) and confirm it succeeds with only Home routes generated
- [ ] 5.4 Update `docs/astro-i18n.md` and `docs/astro-atomic-components.md` to drop the removed page/Button references (optional follow-up)
