## Context

See `proposal.md` for motivation and background.

`src/components/organisms/BannerBar.astro` renders a dark statement strip with 4 `BannerText` components. We will add `class="banner-bar-item"` to each item and a `<script>` block importing `gsap` and `ScrollTrigger` from `src/lib/gsap.ts`.

## Goals / Non-Goals

**Goals:**
- Target `BannerText` elements inside `BannerBar.astro` with `banner-bar-item` class.
- Add `<script>` in `BannerBar.astro` executing `gsap.fromTo(".banner-bar-item", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: ".banner-bar", start: "top 85%" } })`.
- Add `clearProps: "transform,opacity"` on complete to maintain clean DOM styling.

**Non-Goals:**
- Modifying static text contents or responsive layout breakpoints.

## Decisions

### Decision 1: ScrollTrigger viewport trigger offset
- **Approach**: Set `scrollTrigger: { trigger: "#banner-bar", start: "top 85%" }`.
- **Rationale**: Triggering at 85% viewport height ensures the animation starts naturally as the user scrolls past the Hero, making the entrance smooth and noticeable without needing full section center alignment.

## Risks / Trade-offs

- **[Risk]**: Re-triggering on View Transitions navigation.
- **[Mitigation]**: Wrap initialization inside `initBannerBarAnimation()` and bind to `document.addEventListener("astro:page-load", initBannerBarAnimation)`.
