## Context

- `Footer.astro` builds its contact column from `BUSINESS_DATA` / `PHONES` / `EMAIL` in `src/data/site-config.ts`; current values are US-format dummies (`+1…`, `hello@enredarte.com`, `123 Main St`, `XX`, `lat 0/lng 0`).
- Final info is now defined: MX phone `+52 624 176 4802`, WhatsApp `+52 1 624 176 4802` (`wa.me/5216241764802`), `info@enredarte.com`, location `Mexico City, Mexico`, domain `enredarte.mx`, FB/IG unchanged, map parked.
- Routing: all pages resolve through `src/pages/[...path].astro` + `src/lib/i18n/routes.ts` (currently only `home`) plus hardcoded gallery/artwork/artist/blog/curator path blocks. Language is URL-derived (`/en/…` vs default `es`). `pnpm validate-i18n` enforces `es.json`/`en.json` parity.
- `docs/component-dependencies.md` is a living pages→components map (per AGENTS.md) and must be refreshed if the footer/page graph changes.

## Goals / Non-Goals

**Goals:**
- Footer shows final contact data with correct `tel:` / `wa.me` / `mailto:` hrefs and plain-text location.
- Business domain updated to `enredarte.mx` wherever `BUSINESS_DATA.url` is consumed.
- Map code preserved but invisible (commented / unreferenced) for later reactivation.
- Three Spanish-slug legal stub pages with gallery-contextualized sample text + disclaimer, linked from footer, ES+EN localized.

**Non-Goals:**
- No real legal counsel text; stubs are explicitly sample content.
- No Google Maps embed, no contact form, no hours display, no extra socials.
- No SEO sitemap/canonical overhaul beyond what new routes inherit from `Layout`.

## Decisions

- **Site-config as single source of truth (over hardcoding in Footer):** add `WHATSAPP` const alongside `PHONES`/`EMAIL`, update `PHONES.main` / `EMAIL` / `BUSINESS_DATA.url`, simplify `ADDRESS` consumption to a `LOCATION_SHORT = "Mexico City, Mexico"` (keep full `ADDRESS` object commented or intact for later). *Alternative: hardcode strings in Footer — rejected (breaks business-data-driven contract in `footer-organism` spec).*
- **WhatsApp as third contact `<li>` (over merging phone/WhatsApp into one line):** keeps `tel:` vs `wa.me` intents distinct, preserves `Link variant="footer"` styling per line, adds `target="_blank" rel="noopener"`. *Alternative: single "Tel / WhatsApp" line — rejected (ambiguous href, worse a11y).*
- **Map parked via code comment + unrendered constant (over deleting `GOOGLE_MAPS`):** user explicitly asked to keep for later; footer renders location as plain text, no Maps URL. *Alternative: delete — rejected (loses user-requested reuse).*
- **Legal pages via `routes.ts` + `[...path].astro` extension (over 4 standalone static files):** add `aviso-de-privacidad` / `terminos-y-condiciones` / `politica-de-cookies` keys to `routes` map, add a generic `LegalPage` component to `COMPONENT_MAP`. No `localizedPaths` change needed — `LangBtns` falls back to `getLocalizedPath(pageKey)`, same as `home`. Reuses `Layout`, SEO slot, language derivation, and keeps Spanish slugs canonical (`/aviso-de-privacidad`, `/es/` is default so ES path is root-level; EN under `/en/…`). *Alternative: standalone static files per locale — rejected (duplicates layout/i18n wiring, diverges from established routing pattern).*
- **Sample legal copy contextualized to gallery (over lorem ipsum):** Aviso covers controller/contact/ARCO/data-use for inquiries; Términos covers COA, 65% artist share, MXN/price-on-request, insured DHL/FedEx; Cookies covers necessary/preferences/analytics use plus consent note. All carry a visible "Texto de ejemplo — pendiente de revisión legal" disclaimer. *Alternative: generic lorem — rejected (less useful for legal review).*
- **New i18n keys under `global.footer.legal.*` + `pages.legal.*` (over reusing `contact` keys):** keeps footer labels and page bodies namespaced; both files updated symmetrically so `validate-i18n` passes.

## Risks / Trade-offs

- [Risk] Sample legal text mistaken for final counsel → Mitigation: prominent in-page disclaimer + `proposal`/stub headers marking sample status; flag for legal review in tasks.
- [Risk] `routes.ts` extension breaks `getPageKeyFromUrl` fallback or localized paths → Mitigation: extend `COMPONENT_MAP` + `localizedPaths` together; verify `pnpm build` emits `/aviso-de-privacidad`, `/terminos-y-condiciones`, `/politica-de-cookies` plus `/en/…` equivalents.
- [Risk] `BUSINESS_DATA.url` change affects OG/canonical/metadata snapshots → Mitigation: grep consumers, update tests/snapshots, verify `pnpm build`.
- [Risk] WhatsApp number format confusion (`+52 1…` vs `+52…`) → Mitigation: display `+52 1 624 176 4802`, href strictly `https://wa.me/5216241764802` (no `+`, spaces, or dashes).
- [Risk] `docs/component-dependencies.md` drift → Mitigation: update footer/page entries in same change.

## Migration Plan

1. Land site-config + Footer + i18n + legal pages + docs in one change (no phased rollout needed; additive routes, no breaking changes).
2. Deploy normally (`pnpm build` must pass + `pnpm validate-i18n`).
3. Rollback: revert single change commit; no data migration.
4. Follow-ups (out of scope): real legal copy, Maps reactivation using parked `GOOGLE_MAPS`, `SITE_URL=https://enredarte.mx` env alignment if needed.

## Open Questions

- None — phone/WhatsApp/email/location/social/domain/legal set (3 links) all confirmed by user in Q1–Q9 plus Cookies follow-up. Only remaining review gate is legal counsel sign-off on stub copy (tracked as task, not a design blocker).
