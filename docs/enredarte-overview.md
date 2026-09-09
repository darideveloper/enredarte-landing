---
created: 2026-09-09
updated: 2026-09-09
tags:
  - enredarte
  - overview
  - requirements
type: area-note
status: active
---

# EnredArte Landing — Project Overview

> **TODO(owner):** replace the product snapshot and audience list below with final
> copy. Everything else in this doc is verified against code (file:line anchors).

## 1. Product snapshot

**TODO(owner):** 2–3 sentences on what EnredArte is. Draft: bilingual (es/en)
landing + catalogue for art galleries — browse salas, artworks, artists and
curators, filter the collection interactively, read the journal (blog).

Audiences: **TODO(owner)** — assumed: visitors/buyers, artists, curators.

## 2. Feature inventory (with code anchors)

- Homepage hero from the primary gallery (`src/data/api.ts` `toHeroView`, `src/components/organisms/Hero.astro`).
- Salas grid from backend galleries (`src/components/organisms/Gallery.astro`).
- Interactive collection: `Filters.tsx` + `Artworks.tsx` islands (`client:load`) bound to `src/store/catalog.ts`; facet chips disable when they cannot match (`computeViableOptions`).
- Detail pages per gallery / artwork / artist / curator (`src/components/pages/sala|obra|artista|curador/`, `src/pages/[...path].astro:40-69,117-126`).
- Blog index, 11 posts per page (`[...path].astro:74`), + per-post detail (`src/components/pages/blog/`).
- Legal stubs (sample copy — **flag for legal-counsel review**): `aviso-de-privacidad`, `terminos-y-condiciones`, `politica-de-cookies`.
- Language switch preserves slug/page (`localizedPaths`, `[...path].astro:160-191` → `Layout` → `Header` → `LangBtns`).
- Prices are language-driven: `es → MXN`, `en → USD` (`src/lib/format/price.ts` `currencyForLang`).
- GSAP entrances/reveals on Hero, Gallery, BannerBar, ArtworkPage (`src/lib/gsap.ts`, `docs/gsap-scrolltrigger/`).

## 3. Route table (es / en)

| Page | es | en |
|---|---|---|
| Home | `/` | `/en` |
| Legal (×3) | `/aviso-de-privacidad` … | `/en/aviso-de-privacidad` … |
| Gallery | `/salas/<slug>` | `/en/salas/<slug>` |
| Artwork | `/obras/<slug>` | `/en/obras/<slug>` |
| Artist | `/artistas/<slug>` | `/en/artistas/<slug>` |
| Curator | `/curadores/<slug>` | `/en/curadores/<slug>` |
| Blog index | `/blog`, `/blog/page/N` | `/en/blog`, `/en/blog/page/N` |
| Blog post | `/blog/:slug` | `/en/blog/:slug` |

Plus: `design-system.astro` (noindex showcase, not part of the runtime tree), `robots.txt.ts`. Single catch-all route: `src/pages/[...path].astro`. Canonical domain: `https://enredarte.mx` (`BUSINESS_DATA.url`, `astro.config.mjs` `site`).

## 4. Backend dependency

Build-time only. `getStaticPaths` calls `buildSiteData()` (catalog) plus an
isolated blog fetch (`fetchAll(listPosts)` + `detail(slug)` per post). Server-only
`API_BASE_URL` / `API_TOKEN` must be present or the build throws (`FetchError`,
no silent fallback). New posts need a rebuild.

> Backend spec lives in a **separate project** — it is intentionally not linked
> or referenced here. If backend behavior is needed (new field, endpoint change,
> token issue), **ask the owner directly**.

## 5. Environment

| Var | Value / source |
|---|---|
| `API_BASE_URL` | backend base URL (deploy secret) |
| `API_TOKEN` | DRF token (deploy secret; never commit) |
| `SITE_URL` | `https://enredarte-landing.localhost` (dev) |

## 6. Build & deploy (this project)

```bash
pnpm validate-i18n && pnpm validate-imports && NODE_OPTIONS=--use-openssl-ca astro build && pnpm validate-markdown
```

`node:22-alpine` + `pnpm@10.18.3` (`Dockerfile`), non-PWA nginx (`/404.html`),
`pnpm run dev` serves `https://enredarte-landing.localhost` via portless.

## 7. Ask-the-owner triggers

New backend field · new route/page · legal copy finality · room-mockup revival
(`docs/future/artwork-room-mockups.md`) · domain/redirect changes · token rotation.

## 8. Pattern docs index

Reusable guides (not project-specific): `astro.md` hub, `astro-atomic-components`,
`astro-react-islands`, `astro-zustand-zod`, `astro-fetch-wrapper`, `astro-i18n`,
`astro-seo`, `astro-site-config`, `astro-portless`, `astro-docker-deployment`,
`astro-client-side-page-transitions`, `astro-markdown`, `blog-api`,
`gsap-scrolltrigger/`. Runtime composition: `component-dependencies.md`.
Parked ideas: `docs/future/`.
