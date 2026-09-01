## Why

The backend exposes a public blog API (`GET /api/blog/posts/` and `GET /api/blog/posts/:slug/`), documented in the Bruno collection under `Posts/`, but the frontend has no client for it. This change adds the API-only layer (types + endpoint module + bilingual accessor) following the existing `api-client` conventions, so future pages can consume posts without reimplementing fetch/timeout/retry/error handling. No UI is built in this change.

## What Changes

- Add `PostSummary` and `Post` TypeScript types in `src/lib/api/types.ts` mirroring the backend's flat bilingual field shape (NOT the `Translations<T>` dict used by catalog types), with `banner_image: string | null` and `published_at: string | null` per `blog/models.py` nullability.
- Add `src/lib/api/posts.ts` exporting `list(params?: ListParams): Promise<Paginated<PostSummary>>` and `detail(slug: string): Promise<Post>`, following the per-resource module pattern established by the 10 catalog modules.
- Export a small `pickPostField(post, lang, key)` helper for flat bilingual field selection, because the existing `pickTranslation` only handles the `Translations<T>` dictionary shape.

## Capabilities

### New Capabilities
- `blog-api`: Client-side API layer for the backend blog posts endpoints — TypeScript types, the `posts.ts` endpoint module (`list`/`detail`), and a flat bilingual field accessor.

### Modified Capabilities
<!-- No existing capability's requirements change; blog-api is a new, independent layer. -->

## Impact

- `src/lib/api/types.ts` (new types)
- `src/lib/api/posts.ts` (new module)
- Reuses existing `apiFetch`, `Paginated<T>`, `ListParams`, and `FetchError` from `src/lib/api/client.ts` and `src/lib/api/types.ts`
- Extends the surface described by the `api-client` capability, but does not alter its requirements
- No UI, routing, or Markdown rendering is introduced in this change
