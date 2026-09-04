# blog-api Specification

## Purpose
Client-side API layer for the backend blog posts endpoints — TypeScript types, the `posts.ts` endpoint module (`list`/`detail`), and a flat bilingual field accessor. Mirrors the public `GET /api/blog/posts/` and `GET /api/blog/posts/:slug/` endpoints documented in the Bruno `Posts/` collection without building UI. Banner images are absolute URLs.

## Requirements

### Requirement: Blog post types mirror the backend shape
The system SHALL declare `PostSummary` and `Post` types in `src/lib/api/types.ts` that mirror the backend blog response exactly, using flat bilingual fields (`*_es` / `*_en`) rather than the `Translations<T>` language-keyed dictionary used by catalog types. `banner_image` is an absolute URL (`https://…/media/blog/banners/…` via `MEDIA_URL`/CDN) or `null` when no banner, used verbatim in the UI without `API_BASE_URL` prefix (legacy relative values, if any, are rendered as-is).

- `PostSummary`: `id: number`, `slug: string`, `author: string`, `banner_image: string | null` (absolute URL or null), `published_at: string | null`, `title_es: string`, `title_en: string`, `description_es: string`, `description_en: string`, `keywords_es: string`, `keywords_en: string`
- `Post` extends `PostSummary` with `content_es: string` and `content_en: string` (full Markdown body, present only on detail)

#### Scenario: List response shape
- **GIVEN** a `GET /api/blog/posts/` response
- **THEN** it is typed as `Paginated<PostSummary>` and each result carries flat `*_es` / `*_en` fields (no `translations` dict) and `banner_image` as absolute `https://…` or `null`

#### Scenario: Detail response shape
- **GIVEN** a `GET /api/blog/posts/:slug/` response
- **THEN** it is typed as `Post` and additionally exposes `content_es` / `content_en`; `banner_image` is the same absolute URL verbatim

#### Scenario: Banner image used verbatim
- **GIVEN** a post with `banner_image == "https://cdn.example.com/media/blog/banners/banner-1.jpg"`
- **THEN** the UI renders `src` as that absolute URL verbatim, without prefixing `API_BASE_URL` (previously `API_BASE_URL + banner_image` caused double `https://…https://…`)

#### Scenario: Null banner still handled
- **GIVEN** `banner_image == null`
- **THEN** no image `src` is rendered (card shows placeholder, detail hides hero, no `ogImage`/`preloadImage`)

### Requirement: Post endpoint module
The system SHALL provide `src/lib/api/posts.ts` exporting `list` and `detail` for the blog resource, matching the per-resource module pattern of the catalog endpoints.

#### Scenario: List posts
- **GIVEN** a call to `listPosts({ page: 1, page_size: 11 })`
- **THEN** it requests `GET /api/blog/posts/?page=1&page_size=11` and returns `Paginated<PostSummary>`

#### Scenario: Post detail by slug
- **GIVEN** a call to `detailPost("arte-contemporaneo-oaxaca")`
- **THEN** it requests `GET /api/blog/posts/arte-contemporaneo-oaxaca/` and returns a `Post`

### Requirement: Flat bilingual field accessor
The system SHALL export `pickPostField(post, lang, key)` returning `post[\`${key}_${lang}\`]` for `lang` of `"es" | "en"`, so consumers select `title`, `description`, `keywords`, or `content` without duplicating indexing logic. This accessor is distinct from `pickTranslation`, which only handles the `Translations<T>` dictionary.

#### Scenario: Select by language
- **GIVEN** a post with `title_es` and `title_en`
- **WHEN** `pickPostField(post, "en", "title")` is called
- **THEN** it returns `post.title_en`

### Requirement: Public endpoint reuses the shared client
The posts module SHALL call `apiFetch` (consistent with the 10 catalog modules). The blog endpoint is public (`auth: none` in Bruno); the injected DRF token is redundant but harmless on a public view.

#### Scenario: Request uses shared client
- **GIVEN** `listPosts()` runs
- **THEN** the request is made through `apiFetch` (same timeout / retry / `FetchError` behavior as catalog modules) to `/api/blog/posts/`
