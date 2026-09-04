## MODIFIED Requirements

### Requirement: Minimal post card for the blog grid
The system SHALL provide `PostCard.astro` (`src/components/pages/blog/PostCard.astro`) as a Salon letterbox card for `PostSummary` entries, using `paper/ink/crimson/muted/card-dark/border-theme` tokens: `bg-card-dark` image letterbox `aspect-[4/3]` regular / `16/10` featured — featured wrapper is `flex-1 min-h-0 w-full` retaining `aspect-[16/10]` as intrinsic min inside `flex flex-col h-full` so `object-cover` fills the whole `auto-rows-fr` cell, overlay is `absolute inset-x-0 bottom-0` (not `inset-0`) with `pt-12` top reservation —, `brightness [0.92→0.72] scale-[1.05] 700ms`, `from-black/75` gradient, top-left date badge `bg-paper/90` (`absolute top-3 left-3`), `border border-transparent` resting + `shadow-2xl -translate-y-1` hover (Flat-By-Default), `focus-visible:ring-brand-500`, `flex flex-col h-full` outer + regular `shrink-0` image + `bg-paper p-5 md:p-6 flex flex-col flex-1` info, accent bar `2px crimson rounded-full` sliding in with `translate-x-3` (transform-only, no reflow), `h3 line-clamp-2 min-h-[48px] text-balance` + `p line-clamp-2` + `meta mt-auto pt-3 10px tracking[0.14em] uppercase muted` pinned, and an optional `featured` prop that spans `lg:col-span-2` with overlay title/CTA (`Headline` style + `readMore` `pages.blog.readMore` + `→` translate). Distinct from `molecules/ImageCard.astro` overlay chrome. The read contract (`pickPostField title/description`, `author • Intl.DateTimeFormat`, absolute `banner_image` URL used verbatim as `src` when present and hidden when `null` (no `API_BASE_URL` prefix), whole card `href=getLocalizedPostPath`) is preserved; `banner_image==null` renders a `bg-card-dark` gradient placeholder with no image chrome.

#### Scenario: Regular card salon Chrome
- **WHEN** `PostCard` renders `lang=es` with absolute `banner_image` `https://cdn/.../media/blog/banners/banner-1.jpg` and `featured=false`
- **THEN** the image block is `aspect-[4/3] bg-card-dark` with lazy `object-cover` and gradient overlay, `src` is the absolute URL verbatim (no prefix), hovering scales `1.05` and darkens to `brightness 0.72`; the info block is `bg-paper` with a crimson accent bar appearing via `opacity + translate-x-0 scale-y-100` while the text block shifts `translate-x-3` (width preserved, so `text-balance` does not re-wrap and card height does not change), title `line-clamp-2` `min-h-[48px]` stays `text-ink` → `crimson` on hover

#### Scenario: Equal heights in mosaic
- **WHEN** a row contains cards with `title` of 1 line vs 3 lines and `description` present vs empty
- **THEN** all cards in that `auto-rows-fr` row share the same height via `flex flex-col h-full` + `flex-1` info, and `meta` is `mt-auto` pinned to the bottom, so baselines align

#### Scenario: Featured spans two columns each page
- **WHEN** `BlogIndex` renders `posts.length>1` on `/blog` (page 1)
- **THEN** `posts[0]` renders `PostCard featured` with `lg:col-span-2 aspect-[16/10] flex-1 min-h-0 w-full` wrapper whose `img absolute inset-0 w-full h-full object-cover` fills the entire grid cell (no `bg-card-dark` gap when the row is taller), overlaying `author` `10px uppercase` + `h3 28/32px serif paper text-balance` + `description line-clamp-2 13px paper/80` + `readMore` bordered `paper/30 → paper` on hover via `absolute inset-x-0 bottom-0 pt-12`; remainder render regular

#### Scenario: Featured cover fills taller row
- **WHEN** `BlogIndex` `lg` row contains featured `lg:col-span-2` + regular card whose `bg-paper` info makes the row taller than `aspect-[16/10]`
- **THEN** the featured wrapper's `flex-1 min-h-0` stretches to the cell height and the image `object-cover` still fully covers the wrapper (center-cropped) with gradient `absolute inset-0` covering the stretched area; no `bg-card-dark` strip shows

#### Scenario: Featured overlay never collides with date badge on narrow
- **WHEN** featured renders at `320px` wide with a typical `title` (2-3 lines balance) + `description` `line-clamp-2` + CTA
- **THEN** the overlay `absolute inset-x-0 bottom-0 pt-12 p-6 md:p-8` stays bottom-anchored and remains clear of the `absolute top-3 left-3` date badge; the `pt-12` buffer plus `line-clamp-2`/`text-balance` clamping keeps the badge legible (edge 3-line narrow case covered via design Risks → fallback to flow column if QA shows overflow)

#### Scenario: Placeholder when banner null
- **WHEN** `banner_image==null`
- **THEN** no `<img>` renders; a `bg-card-dark flex flex-col min-h aspect-[4/3] p-6` gradient placeholder shows `meta` + `title 22px paper` + `line-clamp-3` description, preserving spacing

#### Scenario: Card remains keyboard-accessible
- **WHEN** the card is focused via keyboard
- **THEN** a `ring-2 ring-brand-500 ring-offset-2 ring-offset-paper` is visible and the entire card is an anchor to `href`
