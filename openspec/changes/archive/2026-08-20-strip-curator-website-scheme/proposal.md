## Why

On the gallery detail pages (`/salas/<slug>` and `/es/salas/<slug>`), the curator card renders the website URL with its full scheme — e.g. `https://www.example.com` — cluttering the visible text. We want the cleaner, scheme-free label (`www.example.com`) while keeping the full URL as the real link target.

## What Changes

- Add a small URL helper that strips the leading `http://` or `https://` scheme (and a trailing `/`) from a URL string.
- Update `CuratorCard` so the website link's visible text uses the scheme-stripped value, while its `href` keeps the original full URL.
- Behavior is display-only; no data, links, or SEO metadata change.
- Scope decision (kept as-is): the helper also handles `http://` and strips a single trailing `/`. Though only `https://` was explicitly requested, these are retained for robustness and a cleaner label (e.g. `www.example.com`, not `www.example.com/`).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `gallery-detail-page`: update the curator-block requirement so the website is displayed without its URL scheme (visible text stripped), while the link still targets the full URL.

## Impact

- `src/components/molecules/CuratorCard.astro` — website link visible text.
- `src/lib/utils.ts` — new `stripUrlScheme` (or similar) helper.
- No API/data changes; the `ArtCurator.website` value is untouched.
