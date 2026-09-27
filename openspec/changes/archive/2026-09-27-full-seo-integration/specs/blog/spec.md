# blog Specification — Change Delta

Delta requirements for the blog capability under the `full-seo-integration` change. This adds typed JSON-LD, keyword meta, and an RSS feed for blog routes, and updates the localized-SEO requirement to reflect the new schema contract.

## ADDED Requirements

### Requirement: Blog emits BlogPosting and Blog structured data
Blog detail pages SHALL emit `BlogPosting` JSON-LD (via `BaseSEO` `jsonType="BlogPosting"` with `extraJson` carrying `headline`, `author` as a `Person`, and `datePublished`; `image` and `url` come from the base `ogImage`/canonical). Blog index pages SHALL emit `Blog` JSON-LD. This supersedes the prior default of `LocalBusiness` for blog routes.

#### Scenario: Post detail emits BlogPosting
- **WHEN** a `BlogPost` detail page renders with a published post
- **THEN** its `<script type="application/ld+json">` contains `"@type": "BlogPosting"` with `headline`, `author.name`, `datePublished`, and an absolute `image`

#### Scenario: Blog index emits Blog
- **WHEN** a blog index page renders
- **THEN** its JSON-LD contains `"@type": "Blog"`

### Requirement: Blog pages render keyword meta
Blog index and detail pages SHALL pass their computed `keywords` (index: `pages.blog.keywords`; detail: `keywords_*`) through `PageSEO`, and SHALL render `<meta name="keywords">` when a non-empty value resolves.

#### Scenario: Blog index keywords meta
- **WHEN** `/blog` renders
- **THEN** the page emits `<meta name="keywords" content="…">` derived from `pages.blog.keywords`

#### Scenario: Post keywords meta
- **WHEN** a post with non-empty `keywords_*` renders
- **THEN** the page emits `<meta name="keywords" content="…">` with the post keywords

### Requirement: Blog RSS feed
The system SHALL expose per-locale RSS feeds of published posts via `@astrojs/rss`: one for `es` and one for `en`. Each feed SHALL include each published post's localized `title`, `description`, `pubDate` (`published_at`), `author`, and a link to the localized post URL. Feeds SHALL be emitted only for published (non-draft) posts, reusing the blog fetch (`fetchAll(listPosts)`); a feed fetch error SHALL propagate and fail the build, consistent with the blog build contract.

#### Scenario: RSS exposes published posts per locale
- **WHEN** a request hits the `es` RSS route
- **THEN** the response is valid RSS XML listing each published post with localized `es` title, description, pubDate, author, and `es` post link, excluding drafts

#### Scenario: English RSS feed
- **WHEN** a request hits `/en/rss.xml`
- **THEN** the response is valid RSS XML listing each published post with localized `en` title, description, pubDate, author, and `en` post link, excluding drafts

#### Scenario: Feeds discoverable
- **WHEN** a page with the SEO slot renders or `robots.txt` is generated
- **THEN** the `<head>` carries `<link rel="alternate" type="application/rss+xml">` per locale and `robots.txt` references the feed URL(s)

## MODIFIED Requirements

### Requirement: SEO metadata per post
The system SHALL pass to `PageSEO` for a post detail: `title=title_*`, `description=description_*`, `keywords` from `keywords_*`, `ogImage` as the absolute `banner_image` verbatim when not null, `alternateUrls` for the es/en post paths, and `jsonType="BlogPosting"` with the BlogPosting `extraJson`. Blog index pages SHALL use `pages.blog.title/description/keywords` from `messages/{es,en}.json` and `jsonType="Blog"`.

#### Scenario: Post detail emits BlogPosting SEO
- **WHEN** a post detail renders with an absolute `banner_image`
- **THEN** `PageSEO` receives the localized `title_*`, `description_*`, `keywords_*`, the verbatim `banner_image` as `ogImage`, es/en `alternateUrls`, and `jsonType="BlogPosting"` with the BlogPosting `extraJson`

#### Scenario: Blog index emits Blog SEO
- **WHEN** a blog index page renders
- **THEN** `PageSEO` receives `pages.blog.title/description/keywords` and `jsonType="Blog"`