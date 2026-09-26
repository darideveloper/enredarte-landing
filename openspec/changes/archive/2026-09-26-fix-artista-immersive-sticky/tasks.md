## 1. Artista sticky parity fix

- [x] 1.1 Remove `overflow-hidden` from `#artista-obras` section in `src/components/pages/artista/ArtistPage.astro` (keep `container-site-canvas` spacing)
- [x] 1.2 Replace group rows tween with per-row inner-cells reveals (`Array.from(row.children)`, `trigger: row`, `start: "top 85%"`) matching `GalleryPage.astro`
- [x] 1.3 Keep header fade, featured `ImageBanner` fade, and `#artista-salas` stagger unchanged

## 2. Verification

- [x] 2.1 Run `openspec validate fix-artista-immersive-sticky --type change --strict` (docs/specs consistency)
- [x] 2.2 Dev-check `/artistas/valentina-cruz` vs `/salas/{slug}` on desktop: tall-row info pins at `~35svh`; no horizontal scrollbar; reduced-motion static; no console errors
