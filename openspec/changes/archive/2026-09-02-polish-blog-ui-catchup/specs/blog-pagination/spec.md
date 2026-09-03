## MODIFIED Requirements

### Requirement: Static numbered pagination nav
The system SHALL provide `PaginationNav.astro` (`src/components/molecules/PaginationNav.astro`) as a static, server-rendered pagination bar for the blog index that is i18n-aware and responsive: numbered page links plus `Prev`/`Next` carry `t("pages.blog.pagination.prev/next/page")` strings, `getLocalizedBlogPagePath` for page 1↔base-path; `hidden md:flex` full numbered row (`Prev` ink ghost / `Next` crimson, `gap-2`, `focus:ring-brand-500`, current page `bg-ink text-paper border-ink`) and `flex md:hidden` collapsed `Prev — page/total — Next` (`flex-1`, `active:bg-ink`, `opacity-40` disabled). `total_pages<=1` (including empty) renders nothing. `getTranslations(lang)` is the source of truth for labels; page math (`page_size=12`, `page 1→base`) is unchanged.

#### Scenario: First page i18n omits page 1 link (desktop)
- **WHEN** `page==1 total_pages==3 lang=es` on `/blog`
- **THEN** desktop shows `1` current `bg-ink`, `2`→`/blog/page/2`, `3`→`/blog/page/3`, `Prev` disabled `opacity-40`, `Next` crimson→`/blog/page/2`, labels read `Anterior` / `Siguiente`, and a hidden `Página 1 de 3` via `t("pages.blog.pagination.page")` is included for `lg`

#### Scenario: Middle page correct base-path
- **WHEN** `page==2 lang=es` on `/blog`
- **THEN** desktop `Prev`→`/blog` (not `/blog/page/1`), `1`→`/blog`, `2` current, `3`→`/blog/page/3`, `Next`→`/blog/page/3`; mobile shows `Anterior` `2/3` `Siguiente` each `flex-1` with `Prev` linking to `/blog`

#### Scenario: English pagination
- **WHEN** `page==1 lang=en` on `/en/blog`
- **THEN** desktop numbers link to `/en/blog`, `/en/blog/page/2` etc., labels read `Previous`/`Next` and `Page 1 of 3`

#### Scenario: Collapsed mobile
- **WHEN** viewport `<md` and `total_pages==2`
- **THEN** no numbered row renders; a `flex md:hidden justify-between` bar shows `Prev` + `page/total` (`2/3`) + `Next` each reachable at `44px` touch, with disabled `opacity-40` when out of bounds

#### Scenario: No pagination when single page or empty
- **WHEN** `total_pages<=1`
- **THEN** the component returns early and renders no `<nav>` (and `BlogIndex` shows empty-state instead when `count==0`)
