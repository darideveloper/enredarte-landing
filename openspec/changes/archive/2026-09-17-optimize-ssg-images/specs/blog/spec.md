## ADDED Requirements

### Requirement: Blog hero responsive LCP
The blog detail hero SHALL render `banner_image` with `sizes="100vw"`, `widths [960,1600,2400]`, explicit `loading="eager" fetchpriority="high" decoding="async"`, and a responsive preload; the sticky aside thumb SHALL stay `loading="lazy"` decorative (`alt="" aria-hidden`).

#### Scenario: Post hero preloads right-sized banner
- **WHEN** a post page with `banner_image` loads
- **THEN** head preloads the matching banner variant and the hero `<img>` is eager/high with no double-download

### Requirement: Markdown body images stay lazy
CMS markdown images SHALL remain native `<img loading="lazy" decoding="async">` (no srcset pass) until a rehype image pipeline exists.

#### Scenario: Body image defers
- **WHEN** post content contains `![alt](url)`
- **THEN** it renders lazy/async with no layout break
