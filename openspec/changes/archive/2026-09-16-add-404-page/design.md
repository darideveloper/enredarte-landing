## Context

Unknown URLs currently fall through to the web server's default 404 response: unbranded, no navigation back into the gallery. The infrastructure for a fix already exists — `nginx.conf` serves `error_page 404 /404.html`, and Astro maps `src/pages/404.astro` to `dist/404.html` by convention — but the source file doesn't exist yet.

Constraints: the site is fully static (`getStaticPaths` + CDN/nginx), bilingual (ES default, EN under `/en/`), and the 404 must be a single static file with no backend fetch (build must succeed even when the API is down). The shared `Layout` (`body.flex.min-h-screen.flex-col` → Header / `main` / Footer) is used by every page and must not change for one page's benefit. Branding is governed by `DESIGN.md` (Gallery Salon: paper/ink/crimson, serif display, sharp corners, eyebrow rule, crimson ≤10%).

## Goals / Non-Goals

**Goals:**
- One new file (`src/pages/404.astro`) + i18n keys + docs touch; nothing else modified.
- Vertically and horizontally centered editorial block reusing `Layout`, `Headline`, and `Btn` unchanged.
- ES-primary bilingual copy in the salon voice; `noindex` so error responses never index.

**Non-Goals:**
- No per-language 404 files, no client-side language detection, no nginx/config changes.
- No GSAP, no imagery, no hit tracking — fastest render for a lost visitor (Operate mode).
- No `Layout` refactor (`flex-1` on `main`) to achieve centering.

## Decisions

**1. `src/pages/404.astro` → `dist/404.html` via Astro convention.**
Why: zero wiring — the filename alone creates the build output, and nginx already serves it. Alternative (explicit redirect rules or a catch-all fallback route in `[...path].astro`) would add config surface and could mask genuine 404 status codes.

**2. Self-contained centering: `min-h-[60svh] grid place-items-center text-center` on the page section.**
Why: centers on both axes without touching `Layout`, so every other page is unaffected. `grid place-items-center` beats `flex-col justify-center items-center` (one utility, single child). `svh` over `vh` avoids mobile-chrome jump; `60svh` (not `100svh`) accounts for Header/Footer height so no overflow scrollbar appears. Alternative (adding `flex-1` to Layout's `main`) gives truer viewport centering but changes all pages for one page's benefit — rejected.

**3. Bilingual static block (ES-primary + EN secondary), keys under `pages.notFound.*`.**
Why: a single static file cannot know the attempted language server-side, and a client-side swap script adds JS dependence plus duplicated markup for ~4 strings. Rendering both lines is always correct and survives with JS disabled. Alternative (separate `404/en/` output) doesn't work with a single nginx `error_page` path without server config changes — rejected.

**4. Editorial composition from existing atoms only: `Headline` eyebrow → serif `404` → crimson hairline (`w-12 h-px bg-crimson`, same as `blog-prose hr::after`) → description → `Btn` primary (`/`) + `Btn` ghost (`/obras`).**
Why: reuses the proven `BlogIndex` empty-state pattern, satisfies the Eyebrow Rule and Crimson Rule, introduces no new tokens or components. Copy follows the salon voice precedent (`noPostsHint`) — warm and guiding, e.g. framing the miss as "esta sala no existe" with the collection still open.

**5. `noindex` via the existing `PageSEO`/`BaseSEO` chain (same mechanism as `design-system.astro`).**
Why: error responses must never index; reusing the chain avoids a bespoke `<meta>` path.

## Risks / Trade-offs

- [Single static file can't localize CTAs per attempted language] → Mitigation: bilingual labels on both CTAs; ES-first matches the default-language convention.
- [`getLangFromUrl(Astro.url)` on a static 404 may reflect `/404` rather than the attempted URL] → Mitigation: don't depend on it at all; render both languages unconditionally.
- [Centered minimal page could feel empty on tall desktop viewports] → Mitigation: `max-w-3xl` container matches `LegalPage` rhythm; Header/Footer fill the frame so the void reads as gallery whitespace, not a bug. Accept.
- [Stale external links to removed artworks 404 silently with no signal] → Mitigation: explicitly out of scope (no tracking); revisit if content churn demands it.
- [Dev-server preview differs from the real 404 path] → Mitigation: verify via the production build output (tasks 3.1–3.2), since only built `dist/404.html` served through nginx `error_page` represents real 404 behavior.

## Migration Plan

No migration. Additive change: new page + new i18n keys. Rollback is file deletion. Deploy with the normal static build; verify `dist/404.html` exists post-build.

## Open Questions

- Final ES/EN copy wording in the salon voice (draft proposed at implementation; confirm tone before merge).
- Symmetric bilingual (equal weight) vs. ES-primary with a smaller EN line — default is ES-primary unless review prefers symmetry.
