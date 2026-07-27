# enredarte-landing

Landing page for EnredArte — a bilingual (en/es) art discovery site built with Astro.

## Stack

- **Astro 7** — SSG with island architecture
- **React 19** — interactive components
- **Tailwind CSS v4** — utility-first styling
- **i18n** — custom catch-all routing with JSON translations
- **SEO** — BaseSEO/PageSEO, sitemap, robots.txt, JSON-LD
- **Zustand + Zod** — state management with validation
- **Docker** — multi-stage build (nginx)

## Commands

| Command | Action |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build site to `./dist/` (runs i18n validation) |
| `pnpm preview` | Preview production build |
| `pnpm validate-i18n` | Check translation key parity |

## Project Structure

```
src/
├── components/
│   ├── atoms/       # Smallest standalone components
│   ├── molecules/   # Combinations of atoms
│   └── organisms/   # Complex sections
├── data/            # Centralized business config
├── layouts/         # Page layouts
├── lib/             # Utilities (i18n, api, cn)
├── messages/        # Translation JSON files
├── pages/           # Catch-all i18n router
├── store/           # Zustand stores
└── styles/          # Global CSS (Tailwind)
```

## Before Deploying

- Update `site` URL in `astro.config.mjs` to the production domain
- Populate `src/data/site-config.ts` with real business data
- Add `og-image.jpg` and `apple-touch-icon.png` to `public/`
