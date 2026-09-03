## MODIFIED Requirements

### Requirement: Minimal post card for the blog grid
The system SHALL provide `PostCard.astro` (`src/components/pages/blog/PostCard.astro`) as a Salon letterbox card for `PostSummary` entries, using `paper/ink/crimson/muted/card-dark/border-theme` tokens: `bg-card-dark` image letterbox `aspect-[4/3]` regular / `16/10` featured, `brightness [0.92→0.72] scale-[1.05] 700ms`, `from-black/75` gradient, top-left date badge `bg-paper/90`, `border border-transparent` resting + `shadow-2xl -translate-y-1` hover (Flat-By-Default), `focus-visible:ring-brand-500`, `flex flex-col h-full` outer + `shrink-0` image + `bg-paper p-5 md:p-6 flex flex-col flex-1` info, accent bar `2px crimson rounded-full` sliding in with `translate-x-3` (transform-only, no reflow), `h3 line-clamp-2 min-h-[48px] text-balance` + `p line-clamp-2` + `meta mt-auto pt-3 10px tracking[0.14em] uppercase muted` pinned, and an optional `featured` prop that spans `lg:col-span-2` with overlay title/CTA (`Headline` style + `readMore` `pages.blog.readMore` + `→` translate). Distinct from `molecules/ImageCard.astro` overlay chrome. The read contract (`pickPostField title/description`, `author • Intl.DateTimeFormat`, `API_BASE_URL+banner_image`, whole card `href=getLocalizedPostPath`) is preserved; `banner_image==null` renders a `bg-card-dark` gradient placeholder with no image chrome.

#### Scenario: Regular card salon Chrome
- **WHEN** `PostCard` renders `lang=es` with `banner_image` and `featured=false`
- **THEN** the image block is `aspect-[4/3] bg-card-dark` with lazy `object-cover` and gradient overlay, hovering scales `1.05` and darkens to `brightness 0.72`; the info block is `bg-paper` with a crimson accent bar appearing via `opacity + translate-x-0 scale-y-100` while the text block shifts `translate-x-3` (width preserved, so `text-balance` does not re-wrap and card height does not change), title `line-clamp-2` `min-h-[48px]` stays `text-ink` → `crimson` on hover

#### Scenario: Equal heights in mosaic
- **WHEN** a row contains cards with `title` of 1 line vs 3 lines and `description` present vs empty
- **THEN** all cards in that `auto-rows-fr` row share the same height via `flex flex-col h-full` + `flex-1` info, and `meta` is `mt-auto` pinned to the bottom, so baselines align

#### Scenario: Featured spans two columns each page
- **WHEN** `BlogIndex` renders `posts.length>1` on `/blog` (page 1)
- **THEN** `posts[0]` renders `PostCard featured` with `lg:col-span-2 aspect-[16/10]` overlaying `author` `10px uppercase` + `h3 28/32px serif paper text-balance` + `description line-clamp-2 13px paper/80` + `readMore` bordered `paper/30 → paper` on hover; remainder render regular

#### Scenario: Placeholder when banner null
- **WHEN** `banner_image==null`
- **THEN** no `<img>` renders; a `bg-card-dark flex flex-col min-h aspect-[4/3] p-6` gradient placeholder shows `meta` + `title 22px paper` + `line-clamp-3` description, preserving spacing

#### Scenario: Card remains keyboard-accessible
- **WHEN** the card is focused via keyboard
- **THEN** a `ring-2 ring-brand-500 ring-offset-2 ring-offset-paper` is visible and the entire card is an anchor to `href`

