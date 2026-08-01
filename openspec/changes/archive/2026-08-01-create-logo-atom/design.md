## Context

Brand logo assets are stored in the `/public` directory (`logo-dark.png`, `logo-light.png`, `logo-bg-red.png`, `favicon.svg`).

## Goals / Non-Goals

**Goals:**
- Implement `Logo.astro` using clean Astro component props.
- Map variants using an internal dictionary object (`logoVariants`) to avoid complex conditionals.
- Expose `href`, `alt`, and `class` props for flexible usage.

**Non-Goals:**
- Replacing existing organism headers across all pages in this single change (will be done progressively or in header refactor).

## Decisions

**1. Astro Component File Type**
- **Decision:** Build as an `.astro` component (`src/components/atoms/Logo.astro`).
- **Rationale:** Standard static branding elements don't require client-side JavaScript hydration; an `.astro` component renders zero client JS.

**2. Variant Dictionary Mapping**
- **Decision:** 
```ts
const logoVariants = {
  dark: "/logo-dark.png",
  light: "/logo-light.png",
  "bg-red": "/logo-bg-red.png",
  icon: "/favicon.svg",
}
```
- **Rationale:** Easy to maintain and add future logo variants.
