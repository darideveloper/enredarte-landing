## 1. Update BannerBar Component

- [x] 1.1 Add `id="banner-bar"` to container and `class="banner-bar-item"` to `BannerText` components in `BannerBar.astro`.
- [x] 1.2 Add `<script>` block in `BannerBar.astro` importing `gsap` and `ScrollTrigger` from `src/lib/gsap.ts` and constructing the ScrollTrigger staggered cascade reveal (`y: 25 → 0`, `stagger: 0.15`).

## 2. Verification

- [x] 2.1 Run `npx astro build` to verify type safety and static build completion.
