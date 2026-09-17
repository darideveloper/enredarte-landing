## 1. Measure + token

- [x] 1.1 Confirm header token `93px` at `lg` (measured live: `header.getBoundingClientRect().bottom === 93`); adjust both files together if re-measured
- [x] 1.2 Confirm mobile/reduced-motion baselines unchanged (stacked images, static panel)

## 2. Panel + section (ArtworkPage, ArtworkInfoPanel)

- [x] 2.1 Move `overflow-hidden` from `section[data-scroll-section]` to `.artwork-image-zone` in `ArtworkPage.astro`
- [x] 2.2 Update panel classes in `ArtworkInfoPanel.astro`: `lg:top-0` → header token, `100vh` → `100svh` with token, add `lg:self-start`, keep `lg:overflow-y-auto`
- [x] 2.3 Verify single-image desktop renders static image with working sticky fallback and no bleed

## 3. Scrub offset (ArtworkImageViewer)

- [x] 3.1 Update ScrollTrigger `start: "top 80px"` → `"top 93px"`; keep trigger, `end`, scrub, lifecycle unchanged
- [x] 3.2 Verify multi-image desktop (2 and 4+ images): pin engages at header bottom with no dead-zone, counter advances, pin releases at last image — DESCOPED: no multi-image artwork in backend (all 30 artworks `data-count="1"`); scrub-path diff is the one-string `start` offset only, trigger/`end`/timeline/lifecycle untouched and reviewed

## 4. Docs + verification

- [x] 4.1 Update `docs/component-dependencies.md` artwork-detail note (header token, overflow scope)
- [x] 4.2 Run `playwright-cli` check per `artwork-viewer` spec (scrub + counter + preload, no duplicate pin-spacers across client-side nav) — DONE except scrub/counter live run, DESCOPED per 3.2 (no fixture); verified: preload `<link>` present, 0 pin-spacers incl. after 3 client-side navs, single-image static, mobile static, no X-bleed
- [x] 4.3 Run `openspec validate --change "artwork-info-scrub-sticky"` and fix findings
