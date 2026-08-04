## Context

See proposal.md for motivation. We are building the `BannerText` atom component.

## Goals / Non-Goals

**Goals:**
- Implement `BannerText.astro` rendering `<slot />`.
- Use Tailwind classes: `flex items-center gap-2 text-[11px] text-banner-text tracking-[0.04em] font-sans [&>b]:text-crimson [&>b]:font-semibold`.

**Non-Goals:**
- Container layout for trust bar is deferred to a trust bar / banner molecule/organism if needed.

## Decisions

- **Nested bold element styling:** Utilizing `[&>b]:text-crimson [&>b]:font-semibold` ensures clean design consistency without requiring explicit subcomponents or extra props for bold words.

## Risks / Trade-offs

None.
