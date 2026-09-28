## 1. Renderer (`src/lib/markdown.ts`)

- [x] 1.1 Normalize Spanish diacritics in heading slug generation (NFD strip) with uniqueness handling
- [x] 1.2 Wrap `<table>` output in a framed keyboard-scrollable container and mark header cells with `scope="col"`
- [x] 1.3 Verify heading `h1→h2` demotion, lazy figures, external-link affordance, and code/video paths unchanged

## 2. Shared prose styles (`Markdown.astro` + `global.css`)

- [x] 2.1 Apply heading ladder: `h2` ~32–34px + 40–48×2px crimson marker, `h3` ~22–24px, `h4` ink with left-border signal
- [x] 2.2 Soften body ink / reduce leading 1.85 → ~1.75 while headings stay pure ink
- [x] 2.3 Replace `display:block` table rules with wrapper-frame styles: zebra rows, hover, mono+nowrap key column, `min-w`, sticky `th`, sharp corners
- [x] 2.4 Complete `on-dark` overrides for tables/links/hr/code and tighten `compact` heading margins

## 3. Blog consolidation (`BlogPost.astro`)

- [x] 3.1 Drop the inline duplicated `prose-*` string and consume the shared atom styles, keeping layout/meta/reveal hooks intact
- [x] 3.2 Grep-verify no remaining inline prose duplication and no broken selectors

## 4. Verification

- [x] 4.1 Run `pnpm build` (LegalPage entry check) with no new warnings
- [x] 4.2 Screenshot pass (desktop + 390px, ES): `aviso-de-privacidad`, `politica-de-cookies` (table), one blog post — confirm heading scan, table frame/scroll, sticky header + focus-visible wrapper state, no crimson-rule breach

## 5. Plain-CSS port (mechanism correction: `prose-*` utilities generate no CSS without the typography plugin — supersedes the utility mechanism of 2.1–2.3, outcomes unchanged)

- [x] 5.1 Port heading/body/link/list/blockquote/code/table element styles to plain CSS under `.blog-prose, .markdown-prose` in `global.css`
- [x] 5.2 Strip dead `prose-*` utilities from the `Markdown` atom string (keep `hyphens-auto`), document `global.css` as the style source
- [x] 5.3 Verify no `prose-*` class remains the sole carrier of any visible style (grep + computed-style check)

## 6. Re-verification (computed styles, not screenshots)

- [x] 6.1 Live computed-style check on `/aviso-de-privacidad`: h2 ~32px Georgia ink vs p 15px body, links crimson + underlined, ul disc with padding
- [x] 6.2 Live computed-style check on `/politica-de-cookies` table: ink header, zebra rows, mono nowrap first column, scroll-in-frame at 390px
- [x] 6.3 Run `pnpm build` with no new warnings
