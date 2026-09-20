## 1. Strings and data

- [x] 1.1 Add `global.footer.random` ("Descubrir una obra" / "Discover an artwork") to `src/messages/es.json` and `src/messages/en.json`
- [x] 1.2 Compute `availableSlugs` in `src/pages/[...path].astro` (`siteData.artworks` filtered by `status === "available"`, slugs only) and pass into `Layout`

## 2. Component

- [x] 2.1 Create `src/components/atoms/RandomArtworkBtn.tsx` (props `slugs`, `lang`, `label`, `currentSlug?`; exported `pickRandom`; `window.location.assign(getLocalizedArtworkPath(...))`; renders nothing on empty draw; crimson-accent styling visually distinct from `Link variant="footer"`)
- [x] 2.2 Add optional `artworkSlugs` prop to `src/layouts/Layout.astro` and forward to `Footer`
- [x] 2.3 Render `<RandomArtworkBtn client:load>` as last item of the nav column in `src/components/organisms/Footer.astro` (parse current artwork slug from `Astro.url`, pass `lang` + translated label)

## 3. Verification

- [x] 3.1 Run `pnpm validate-i18n && pnpm validate-imports`
- [x] 3.2 Run `pnpm build` (validates `validate-markdown` / `validate-404` hooks) and spot-check footer button on `/`, `/obras`, and an artwork page
- [x] 3.3 Refresh `docs/component-dependencies.md` (Layout/Footer import change per repo rule)

## 4. Follow-up (verification suggestion)

- [x] 4.1 Showcase `RandomArtworkBtn` in `src/pages/design-system.astro` (dark wrapper + empty-draw case) and list it in `docs/component-dependencies.md`
