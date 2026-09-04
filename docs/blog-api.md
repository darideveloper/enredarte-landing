---
created: 2026-09-01
updated: 2026-09-01
tags:
  - astro
  - api
  - blog
  - i18n
type: resource
status: active
---

# Blog API

Client-side API layer for the backend blog endpoints. No UI is built here — this doc is the contract that the future blog pages will consume.

## Backend contract (Bruno `Posts/`)

| Endpoint | Method | Auth | Response |
|----------|--------|------|----------|
| `/api/blog/posts/` | GET | none (public) | `Paginated<PostSummary>` — `?page` / `?page_size` |
| `/api/blog/posts/:slug/` | GET | none (public) | `Post` |

Posts use **flat bilingual fields** (`title_es`, `title_en`, ...) unlike the catalog types which use `Translations<T>`. `banner_image` is an **absolute** URL (`https://…/media/blog/banners/…` via CDN/`MEDIA_URL`) or `null`; consumers use it verbatim as `<img src>`/`ogImage`/`preload` with no `API_BASE_URL` prefix (legacy relative values, if any, render as-is). `content_es` / `content_en` carry raw Markdown (no rendering in this layer).

See `openspec/changes/add-blog-api/specs/blog-api/spec.md` and `design.md` (D1–D6) for the full decisions.

## Types (`src/lib/api/types.ts`)

```ts
export interface PostSummary {
  id: number
  slug: string
  author: string
  banner_image: string | null // absolute https://…/media/blog/banners/… or null; use verbatim, no API_BASE_URL prefix
  published_at: string | null // ISO datetime; null for drafts/unpublished
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  keywords_es: string
  keywords_en: string
}

export interface Post extends PostSummary {
  content_es: string // Markdown, detail only
  content_en: string // Markdown, detail only
}
```

Do **not** model posts with `Translations<T>` — the backend shape is flat `*_es`/`*_en`.

## Endpoint module (`src/lib/api/posts.ts`)

Mirrors the 10 catalog modules (`artworks.ts`, `artists.ts`, ...):

```ts
import { list, detail, pickPostField } from "@/lib/api/posts"

// list: GET /api/blog/posts/?page=1&page_size=11
const page = await list({ page: 1, page_size: 11 }) // Paginated<PostSummary>

// detail: GET /api/blog/posts/:slug/
const post = await detail("arte-contemporaneo-oaxaca") // Post

// flat bilingual accessor (distinct from pickTranslation)
pickPostField(post, "en", "title") // → post.title_en
pickPostField(post, "es", "content") // → post.content_es
```

- `list(params: ListParams = {})` — `ListParams` is `{ page?, page_size? }`.
- `detail(slug: string)` — keyed by **slug** (not numeric id, per D2).
- Both call `apiFetch` (`src/lib/api/client.ts`) so they inherit timeout / retry / `FetchError`. The endpoint is public but the injected `Authorization: Token ...` is harmless (D3).
- Path prefix is `/api/blog/posts/` (singular `api`), not `/apis/artworks/` (D4).

## Bilingual accessor

```ts
export function pickPostField(post: Post | PostSummary, lang: Lang, key: string): string {
  return (post as unknown as Record<string, string>)[`${key}_${lang}`] ?? ""
}
```

Valid `key` values: `title`, `description`, `keywords`, `content` (content only on `Post`). The helper avoids duplicating `` `${key}_${lang}` `` indexing in pages. It is separate from `pickTranslation` in `src/lib/i18n/utils.ts`, which handles the `Translations<T>` dictionary shape.

## Consumer notes

- `banner_image` is absolute **and nullable** — use `post.banner_image` verbatim as `src`/`ogImage`/`preload` when non-null, otherwise no image (gradient placeholder / hidden hero); `null` when no banner uploaded (`blog/models.py: banner_image blank=True, null=True` → `serializers.py: get_banner_image` returns `None`). Legacy relative values, if any, render as-is without prefix.
- Posts are **not** part of `buildSiteData` (`src/data/api.ts`) — blog pages fetch per-page in `getStaticPaths` (see `design.md` Risks).
- `detail` returns 404 for unknown/inactive slugs — handle `FetchError` with `status === 404`.
- New posts require a rebuild (static build staleness, same as catalog).
