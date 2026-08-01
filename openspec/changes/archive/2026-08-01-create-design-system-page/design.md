## Context

We are establishing a visual testing and reference ground for the UI components. Since the project uses Astro with React islands (as documented in our architecture), we need a simple way to mount these components.

## Goals / Non-Goals

**Goals:**
- Provide a single URL (`/design-system`) where developers can see all Atoms.
- Demonstrate both vanilla Astro/Tailwind components and React islands (e.g. stateful atoms using Zustand).

**Non-Goals:**
- This is not a full documentation suite like Storybook. It's a lightweight, hardcoded Astro page.
- We will not deploy this route to production indexers (we should probably add a `<meta name="robots" content="noindex">` to it).

## Decisions

**1. Location and Routing**
- **Decision:** Create `src/pages/design-system.astro`.
- **Rationale:** Astro's file-based routing makes this the simplest approach. No need for a separate app or port.

**2. Layout**
- **Decision:** Use a simple, unbranded layout with distinct sections for Atoms, Molecules, Organisms.
- **Rationale:** The components themselves should stand out. The wrapper should be minimalistic (e.g. gray background with white cards for components) to allow components to contrast properly.

**3. Tooling**
- **Decision:** No external tooling (like Storybook or Histoire).
- **Rationale:** Overkill for our current scale. A single Astro page is faster to maintain and strictly uses our exact build pipeline.

## Risks / Trade-offs

- **Risk:** The page might end up in the production build.
  - **Mitigation:** We'll add a `noindex` meta tag to prevent search engines from indexing it, and potentially exclude it from the sitemap. If needed later, we can add middleware to block it in production environments.
