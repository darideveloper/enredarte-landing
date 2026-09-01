## 1. Add blog post types

- [x] 1.1 Add `PostSummary` interface to `src/lib/api/types.ts` with flat bilingual fields: `id`, `slug`, `author`, `banner_image: string | null`, `published_at: string | null`, `title_es`, `title_en`, `description_es`, `description_en`, `keywords_es`, `keywords_en`
- [x] 1.2 Add `Post` interface extending `PostSummary` with `content_es: string` and `content_en: string`
- [x] 1.3 Do NOT model posts with the `Translations<T>` dictionary (use flat `*_es` / `*_en` fields)

## 2. Create the posts endpoint module

- [x] 2.1 Create `src/lib/api/posts.ts` exporting `list(params: ListParams = {}): Promise<Paginated<PostSummary>>` that builds `page` / `page_size` query params and calls `apiFetch("/api/blog/posts/...")`
- [x] 2.2 Add `detail(slug: string): Promise<Post>` calling `apiFetch(\`/api/blog/posts/${slug}/\`)`
- [x] 2.3 Use `apiFetch` (token-bearing, consistent with catalog modules) — no new client variant

## 3. Add the flat bilingual accessor

- [x] 3.1 Export `pickPostField(post, lang: "es" | "en", key)` from `src/lib/api/posts.ts` returning `post[\`${key}_${lang}\`]`

## 4. Verify

- [x] 4.1 Run `pnpm validate-imports` and confirm no errors
- [x] 4.2 Run `astro check` (or `tsc --noEmit`) and confirm the new types and module type-check
- [x] 4.3 Spot-check the `Post` / `PostSummary` types against the Bruno `Posts` collection responses
