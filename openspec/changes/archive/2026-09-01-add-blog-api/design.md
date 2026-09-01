## Context

The frontend already ships a mature API layer (the `api-client` capability): per-resource modules under `src/lib/api/`, a token-injecting `apiFetch` client, shared `Paginated<T>` / `ListParams` / `FetchError` types, and a `fetchAll` helper. The backend additionally exposes a public blog API — documented in the Bruno collection (`Posts/GET list`, `Posts/GET detail`) — that the frontend does not yet consume.

Key backend facts from Bruno:
- `GET /api/blog/posts/` → `Paginated<PostSummary>`, **public** (`auth: none`).
- `GET /api/blog/posts/:slug/` → `Post` (full Markdown `content_es`/`content_en`), **public**.
- Posts use **flat bilingual fields** (`title_es`, `title_en`, …), unlike catalog types which use a `Translations<T>` dictionary.
- `banner_image` is a **relative** path (`/media/blog/...`) and **nullable** (`null` when no banner, per `blog/models.py: ImageField(blank=True,null=True)` → `serializers.py: get_banner_image` returns `None`); catalog image URLs arrive absolute. `published_at` is also **nullable** (`DateTimeField(null=True,blank=True)`) for drafts.

## Goals / Non-Goals

**Goals:**
- Add `PostSummary` / `Post` types mirroring the backend exactly.
- Add `src/lib/api/posts.ts` with `list` / `detail` reusing `apiFetch`.
- Add a `pickPostField` helper for flat bilingual selection.

**Non-Goals:**
- No blog index or post-detail pages/components.
- No Markdown rendering of `content_es` / `content_en`.
- No `banner_image` absolutizing inside the API layer (consumers prefix `API_BASE_URL`).
- Not added to `buildSiteData` (posts are fetched per-page, not part of the static catalog build).

## Decisions

**D1 — Per-resource module mirrors the 10 catalog modules.**
`posts.ts` exports `list(params?: ListParams)` and `detail(slug: string)`, building query params and calling `apiFetch` exactly like `artworks.ts` / `artists.ts`. Rationale: uniformity, reuse of timeout/retry/`FetchError`. Alternative (a bespoke fetch) rejected — it would duplicate client logic.

**D2 — `detail` keyed by slug, not numeric id.**
Catalog `detail` takes a numeric `id`. The blog backend looks up by **slug** and returns 404 on missing/inactive. The `posts.ts` `detail(slug: string)` signature reflects this; it is a minimal, backend-forced deviation.

**D3 — Reuse `apiFetch` despite the endpoint being public.**
The blog endpoint is public (`auth: none`), yet `posts.ts` calls `apiFetch` (which injects `Authorization: Token …`). The token is redundant but harmless on a public DRF view, and reusing `apiFetch` keeps all endpoint modules consistent and avoids expanding the client surface. Alternative (`publicApiFetch` with no token) considered but deferred — it would add a second code path; revisit only if build-time token-lessness is required.

**D4 — Path prefix is `/api/blog/posts/`, not `/apis/artworks/`.**
Catalog endpoints live under `/apis/artworks/...` (plural `apis`); the blog endpoint is `/api/blog/posts/...` (singular `api`, `/blog/` segment). This is a backend routing fact. The module hardcodes the correct path; `apiFetch` only concatenates `API_BASE_URL + path`, so no client change is needed.

**D5 — Types mirror the backend exactly; `banner_image` stays relative and nullable.**
Per the `api-client` spec ("types mirror the backend response shapes exactly"), `Post.banner_image` is stored as the raw relative string **or `null`** and `published_at` as `string | null`. Absolutizing to `API_BASE_URL + banner_image` is a consumer responsibility (documented contract, with null-check), not done in the API layer — consistent with how catalog types are pure mirrors (`Artist.photo: string | null`, `Gallery.logo: string | null`).

**D6 — `content_es` / `content_en` typed as `string` (Markdown).**
No renderer is added. The field is carried as raw Markdown for a future change to render.

## Risks / Trade-offs

- **[Token sent to a public endpoint]** → Harmless on DRF public views; no auth check performed. Mitigation: D3 defers a tokenless client unless a real need appears.
- **[Relative `banner_image` breaks `<img>` if consumer forgets to prefix or ignores null]** → Documented as a consumer contract in D5; a future UI change must prefix `API_BASE_URL` with `banner_image ? API_BASE_URL + banner_image : fallback`.
- **[Posts not in `buildSiteData`]** → Blog pages must fetch their own data in `getStaticPaths`. Acceptable; matches per-page data needs and avoids bloating the static catalog.
- **[Static build staleness]** → New posts require a rebuild, same as the catalog. Consistent with current architecture.
