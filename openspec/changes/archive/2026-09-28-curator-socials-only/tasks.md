## 1. CuratorHero socials-only

- [x] 1.1 Replace the `(curator.email || curator.website)` block in `src/components/organisms/CuratorHero.astro` with a `social_links.length > 0` block rendering localized platform labels via a `socialLabel()` helper (mirroring `ArtistPage.astro`), keeping 44px touch targets and external indicators.
- [x] 1.2 Move the `border-t` divider inside the socials conditional so the empty state renders no row and no orphan divider; remove the now-unused `stripUrlScheme` import.

## 2. CuratorCard socials-only

- [x] 2.1 Replace the `(curator.email || curator.website)` block in `src/components/molecules/CuratorCard.astro` with the same socials-only block (dark variant styling unchanged, localized labels).
- [x] 2.2 Remove the now-unused `stripUrlScheme` import from `CuratorCard.astro`.

## 3. Verify (no SEO/type changes)

- [x] 3.1 Confirm `src/components/pages/curador/CuratorPage.astro` still passes `email` + `websiteUrl` + `sameAs` to `personSchema` and `src/lib/api/types.ts` still declares `email/website` (API-faithful, hidden from humans only).
- [x] 3.2 Run `pnpm run dev` and visually verify `/curadores/hugo-salinas` (1 instagram link), `/curadores/renata-ortega` (no contact row), and a sala page embedding `CuratorCard`, in es + en; run `pnpm validate-i18n` and `pnpm build`.
