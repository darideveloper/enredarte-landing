## Context

`CuratorCard` (`src/components/molecules/CuratorCard.astro`) renders the curator website link using the raw `curator.website` value for both the visible text and the `href` (`src/components/molecules/CuratorCard.astro:52-56`). The visible text currently shows the full URL including its scheme (e.g. `https://www.example.com`). This is a small, display-only change; the underlying `ArtCurator.website` data is unchanged.

## Goals / Non-Goals

**Goals:**
- Show the curator website without its `http://`/`https://` scheme and trailing slash in the visible text.
- Keep the link's real target (`href`) as the full, original URL.
- Keep the helper reusable and trivial.

**Non-Goals:**
- Changing the stored `ArtCurator.website` value or the API.
- Stripping `www.` (visible text keeps the host as-is).
- Changing any other link or SEO metadata.

## Decisions

- **Add a `stripUrlScheme` helper in `src/lib/utils.ts`** (next to the existing `cn` helper) rather than inlining the logic in the component. Rationale: keeps the transform testable and reusable, and the file is the established home for shared utilities. Alternative considered: a component-local inline function — rejected for reusability and consistency with where `cn` lives.
- **Regex-based stripping** (`/^https?:\/\//`) instead of string slicing (`url.slice(7)`), plus a trailing-slash strip. Rationale: `http://` is 7 chars but `https://` is 8, so hardcoded slicing would be wrong for `http`; the regex handles both schemes. A trailing `/` is removed so the label doesn't read `example.com/`.
- **Display-only application**: `href={curator.website}` is untouched; only the visible text goes through `stripUrlScheme`. This keeps the real link intact per the requirement.

## Risks / Trade-offs

- [URL without a scheme (e.g. `example.com`)] → Mitigation: the regex is a no-op when there's no scheme, so the text is left unchanged; behavior degrades gracefully.
- [Trailing path beyond the host, e.g. `https://example.com/about`] → Mitigation: only a single trailing `/` is stripped; any path is preserved in the label. Acceptable for the current dummy-data usage.
