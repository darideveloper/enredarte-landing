## MODIFIED Requirements

### Requirement: ScrollTrigger staggered cascade entrance
The `BannerBar` organism SHALL trigger a GSAP ScrollTrigger staggered cascade entrance sequence when scrolled into view, SHALL initialize via a direct `init()` call for first paint AND the `astro:page-load` event for client-side navigations, SHALL carry `transition:animate="none"` on its root element, SHALL revert its `gsap.matchMedia()` context on `astro:after-swap` before re-initializing, SHALL respect `prefers-reduced-motion` so reduced-motion users get no movement, and SHALL source its four value-proposition items from i18n (`global.banner.*`) as markdown (`**COA** firmado en cada obra` / `**COA** with each work`, `**Envío asegurado** DHL / FedEx` / `**Insured shipping** DHL / FedEx`, `El **65%** es para el artista` / `**65%** goes to the artist`, `**Curaduría personal**` / `**Personal curation**`) rendered via the shared `markdown-rendering` renderer inside `BannerText` (`renderInline` unwrapped, `breaks: true`, trusted CMS), requiring `lang` prop (no default) so callers must pass `lang` explicitly. The `BannerText` styling SHALL target `strong` (from `**`) as well as `b` (`[&>strong]:text-crimson`).

#### Scenario: Scroll entrance animation
- **WHEN** the `BannerBar` container enters 85% of the viewport height on scroll and `prefers-reduced-motion` is `no-preference`
- **THEN** the value proposition text items cascade into view from below (`y: 25 → 0`, `opacity: 0 → 1`, `stagger: 0.15`) with smooth `power2.out` easing, and clear inline transform styles upon completion, and the sequence runs once (not doubled).

#### Scenario: Re-init after client-side navigation
- **WHEN** `astro:page-load` fires after a client-side navigation to a page containing the BannerBar
- **THEN** the previous `gsap.matchMedia()` context is reverted, a new context is created, and the ScrollTrigger cascade entrance is ready to fire when the user scrolls the BannerBar into view.

#### Scenario: Reduced motion preference honored
- **WHEN** the user's operating system sets `prefers-reduced-motion: reduce`
- **THEN** the banner items are shown without any entrance animation or movement.

#### Scenario: Banner copy is i18n and formal
- **WHEN** the BannerBar is rendered in ES or EN with markdown `**` in `global.banner.*`
- **THEN** all four items display the parsed `<strong>` with crimson emphasis, including `El **65%** es para el artista` in positive form
