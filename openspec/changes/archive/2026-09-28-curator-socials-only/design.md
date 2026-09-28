## Context

`CuratorHero.astro` (detail page) and `CuratorCard.astro` (gallery-embedded) each render an `(email || website)` contact row with a `stripUrlScheme` website label. The sibling artist components (`ArtistPage.astro:71-74,111-124`, `ArtistCard.astro:59-67`) already implement the target pattern: conditional `social_links.length > 0`, per-link external anchors, `socialLabel()` helper reading `global.footer.social.<platform>` with raw-platform fallback. Live API (`/api/artworks/art-curators/`) returns `social_links: [{id, platform, url}]` on both curators; Hugo has instagram, Renata has none. SEO (`personSchema` in `CuratorPage.astro:36-42`) already consumes `email/websiteUrl/social_links` and must keep working unchanged.

## Goals / Non-Goals

**Goals:**
- Visible curator contact = `social_links` only, in both Hero and Card, converging on the artist pattern.
- Empty state (Renata) renders no row and no orphan divider.
- Keep SEO JSON-LD with email + website + sameAs untouched.

**Non-Goals:**
- No new social-icons component, no new i18n keys, no API/type changes.
- No changes to artist pages, gallery artworks section, routing, or `personSchema` helper.
- No `docs/component-dependencies.md` rewrite unless it explicitly names curator email/website.

## Decisions

- **Mirror ArtistPage, don't abstract.** Copy the `socialLabel()` helper + `social_links.map()` block into `CuratorHero` and `CuratorCard`, using the localized label (`global.footer.social.<platform>` with raw-platform fallback) in both. Alternative (shared `SocialLinks.astro` molecule) rejected: only 2 call sites, artist components didn't abstract either — YAGNI. Note: `ArtistCard` uses raw `{link.platform}`; curators intentionally use the localized variant to match `ArtistPage`.
- **Conditional wraps divider.** In Hero the `border-t` divider lives on the contact container; the whole container (divider included) goes inside the `social_links.length > 0` guard so Renata shows clean bio-then-sal as flow. Card has no divider, same guard suffices.
- **Drop `stripUrlScheme` imports** in both curator components once website block is gone. Keep the helper itself (shared util, other past consumers).
- **Keep `mailto:`/website out of a11y tree entirely** (remove nodes, not hide with CSS) — screen readers and the 44px touch-target requirement then apply only to social anchors, which reuse existing classes.

## Risks / Trade-offs

- [Risk] Unknown future platforms lack `global.footer.social.<platform>` key → Mitigation: raw-platform fallback already in `socialLabel()`, same as artists.
- [Risk] Curator with 0 socials (Renata today) looks "contactless" → Mitigation: accepted per user decision (hide row); SEO still carries identity signals.
- [Risk] Spec archive must supersede two existing requirements (hero contact + card website/email) → Mitigation: delta specs use full-block MODIFIED + REMOVED with reason/migration so archive applies cleanly.

## Migration Plan

- Display-only, build-time SSG: no data migration, no rollback beyond revert. Verify via `pnpm run dev` on `/curadores/hugo-salinas` (1 link), `/curadores/renata-ortega` (no row), and a sala page embedding `CuratorCard`, in es + en.

## Open Questions

- None. Resolved: SEO kept, both Hero + Card in scope, text labels (no icons), empty = hidden.
