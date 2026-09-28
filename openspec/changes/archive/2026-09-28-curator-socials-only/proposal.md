## Why

Curator profiles currently expose personal contact channels (email + website) to humans while the artist profiles already went socials-only. Live API data confirms curators carry rich `social_links` (e.g. Hugo Salinas → instagram) that are never rendered visibly — only buried in JSON-LD `sameAs`. Unifying curators on socials-only reduces personal-data exposure and converges on the proven artist pattern.

## What Changes

- `CuratorHero.astro` (curator detail page): remove the visible email + website row; render `social_links` as text links instead (same styling). Empty state renders nothing.
- `CuratorCard.astro` (embedded curator block on gallery/sala pages): same swap — email + website out, `social_links` in, dark variant styling unchanged.
- SEO unchanged: `CuratorPage.astro` keeps passing `email` + `websiteUrl` to `personSchema` (hidden for humans, kept for machines).
- No API, type, routing, or i18n-key changes; `ArtCurator.email/website` stay in `types.ts` as API-faithful fields.

## Capabilities

### New Capabilities
- None — no new capability; this is a display convergence on the existing artist socials pattern.

### Modified Capabilities
- `curator-detail-page`: hero contact block changes from email/website to socials-only; empty state keyed on `social_links`.
- `gallery-detail-page`: curator block (`CuratorCard`) changes from full data (photo, name, bio, email, website) to socials-only (photo, name, bio, socials); website-scheme-stripping and mailto requirements are removed.

## Impact

- Affected code: `src/components/organisms/CuratorHero.astro`, `src/components/molecules/CuratorCard.astro` (+ dead `stripUrlScheme` import removal in both).
- Untouched: `src/components/pages/curador/CuratorPage.astro` (SEO call site), `src/lib/api/types.ts`, `src/lib/seo/schema.ts`, gallery artworks section, artwork/artist pages, `src/messages/*`. Note: the gallery detail page IS visually affected via its embedded `CuratorCard` curator block — only its artworks section is untouched.
- Verified live data: `hugo-salinas` shows 1 instagram link; `renata-ortega` has 0 socials → renders no contact row.
- Docs: `docs/component-dependencies.md` notes curator contact rendering only if it names email/website explicitly.
