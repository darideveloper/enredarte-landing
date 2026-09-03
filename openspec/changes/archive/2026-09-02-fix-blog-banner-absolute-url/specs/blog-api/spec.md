## MODIFIED Requirements

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
