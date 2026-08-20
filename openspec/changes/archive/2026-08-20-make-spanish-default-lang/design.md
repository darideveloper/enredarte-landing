## Context

The i18n system keys "default language" off **which language owns the empty URL prefix**. Currently English owns the bare paths (`/`, `/salas/:slug`) and Spanish lives under `/es`. The translation fallback (`defaultLang`) is `en`. The goal is to make Spanish the default: Spanish owns the unprefixed root paths and English moves under `/en`.

The system is data-driven: routing, language detection, `LangBtns`, nav, and SEO all derive from `routes` + `getLangFromUrl`. This keeps the surface area small — but three pieces must change in lockstep to avoid wrong-language rendering: the `routes` table, `getLangFromUrl`, and `defaultLang`.

## Goals / Non-Goals

**Goals:**
- Spanish owns unprefixed root URLs (`/`, `/salas/:slug`); English moves under `/en`.
- Translation fallback resolves missing keys to Spanish.
- URL→language detection treats any non-`/en` path as Spanish.
- Preserve old Spanish-prefixed URLs (`/es/*`) via redirects.
- Emit `x-default` hreflang at the root; default SEO lang to `es`.
- Keep the architecture documentation consistent.

**Non-Goals:**
- Migrating to Astro's built-in `i18n` config (out of scope; the custom system stays).
- Preserving old English unprefixed URLs (`/salas/:slug` becomes Spanish — collision, cannot redirect).
- Fixing the placeholder hardcoded link in `Hero.astro` (follow-up, not a real route).
- Handling 3+ languages.

## Decisions

**Decision 1: Swap the `routes` prefixes in `routes.ts`**
`home: { en: "en", es: "" }`. Spanish gets the empty prefix; English gets `en`. This single table drives all localized path resolution (`getLocalizedPath`, `getPageKeyFromUrl`), so most of the system auto-adapts.

**Decision 2: Flip `getLangFromUrl`**
`if (firstSegment === "en") return "en"; return "es"`. Since Spanish is the default, only the `/en` segment maps to English; everything else (including root) is Spanish. This mirrors the existing one-line rule, minimizing the diff.

**Decision 3: Flip `defaultLang` to `"es"` in `ui.ts`**
Keeps the translation fallback aligned with the no-prefix default language. Both were `en`; both become `es`. Keeps the concept of "default = no prefix = fallback" consistent.

**Decision 4: Swap path assignment in `getStaticPaths` in `[...path].astro`**
- Routes loop: English push uses `params: { path: langPaths.en }`; Spanish push uses `params: { path: undefined }` (the undefined → root mapping now belongs to Spanish).
- Gallery loop: `salas/${slug}` → Spanish, `en/salas/${slug}` → English (swap the two pushes).

**Decision 5: Rework legacy redirects in `astro.config.mjs`**
Replace the `/en/*` → `/*` generation with `/es/*` → `/*` generation:
```js
if (route.es === "") acc["/es"] = "/"
else acc[`/es/${route.es}`] = `/${route.es}`
```
Rationale: after the swap `/en` is a real page, so the old `/en` redirects would break it; the old Spanish-prefixed URLs are now obsolete and should 301 to their unprefixed equivalents. Scope matches the current behavior — only routes in `routes` (currently `home`) are covered.

**Decision 6: SEO changes in `BaseSEO.astro`**
- Default prop `lang = "es"`.
- Add `<link rel="alternate" hreflang="x-default" href="${BUSINESS_DATA.url}/" />` alongside the existing `en`/`es` alternates (which auto-adjust via `getLocalizedPath`).

## Risks / Trade-offs

- **English unprefixed URLs lost** → Bare paths change meaning; `/salas/:slug` (previously English) is now Spanish. No redirect is possible because the target is occupied. Mitigation: acceptable per the audience being Spanish-first; the change is BREAKING and documented.
- **Out-of-sync triple** (routes / `getLangFromUrl` / `defaultLang`) → If any of the three flips alone, pages render in the wrong language. Mitigation: change all three in the same change/task; verified by build.
- **`/en` redirect conflict** → Keeping the old `/en` redirects would send the real English homepage to the (now Spanish) root. Mitigation: the redirect block is replaced, not appended.
- **Sala routes outside redirect map** → `getStaticPaths` generates `/es/salas/*` pages that won't be covered by the `routes`-driven redirect map. Mitigation: accepted, matches current behavior; old `/es/salas/*` URLs 404.

## Migration Plan

1. Apply all source edits in a single change (routes, utils, ui, `[...path].astro`, astro config, SEO).
2. Run `pnpm run build` — i18n validation and import validation gate the build.
3. Manually verify: `/` renders Spanish home, `/en` renders English home, `/salas/:slug` Spanish, `/en/salas/:slug` English; `/es` 301s to `/`; hreflang includes `x-default`.
4. Rollback: revert the change; the old `/en` redirect scheme is restored by reversing the config edit.

## Open Questions

- Should sala-level `/es/salas/*` redirects be added later via a data-driven map? (Out of scope now; current `routes` only covers `home`.)
