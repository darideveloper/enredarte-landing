## ADDED Requirements

### Requirement: Blog post types mirror the backend shape
The system SHALL declare `PostSummary` and `Post` types in `src/lib/api/types.ts` that mirror the backend blog response exactly, using flat bilingual fields (`*_es` / `*_en`) rather than the `Translations<T>` language-keyed dictionary used by catalog types.

- `PostSummary`: `id: number`, `slug: string`, `author: string`, `banner_image: string | null`, `published_at: string | null`, `title_es: string`, `title_en: string`, `description_es: string`, `description_en: string`, `keywords_es: string`, `keywords_en: string`
- `Post` extends `PostSummary` with `content_es: string` and `content_en: string` (full Markdown body, present only on detail)

#### Scenario: List response shape
- **GIVEN** a `GET /api/blog/posts/` response
- **THEN** it is typed as `Paginated<PostSummary>` and each result carries flat `*_es` / `*_en` fields (no `translations` dict)

#### Scenario: Detail response shape
- **GIVEN** a `GET /api/blog/posts/:slug/` response
- **THEN** it is typed as `Post` and additionally exposes `content_es` / `content_en`

### Requirement: Post endpoint module
The system SHALL provide `src/lib/api/posts.ts` exporting `list` and `detail` for the blog resource, matching the per-resource module pattern of the catalog endpoints.

#### Scenario: List posts
- **GIVEN** a call to `listPosts({ page: 1, page_size: 12 })`
- **THEN** it requests `GET /api/blog/posts/?page=1&page_size=12` and returns `Paginated<PostSummary>`

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
