## Context

See proposal.md for motivation. The homepage `Home.astro` currently only displays the `<Hero />` component.

## Goals / Non-Goals

**Goals:**
- Render the `Gallery` component on the `Home.astro` page.
- Populate the `Gallery` with the standard set of 5 mock `salasData` used during the component's development.

**Non-Goals:**
- Fetching real data from an API or CMS is out of scope. We are relying on hardcoded mockup data.
- Building the `<Manifesto />` or `<Agenda />` sections is out of scope for this specific change. They will be added in subsequent changes.

## Decisions

**1. Data Location**
- Rationale: For now, we will define `const salasData = [...]` directly inside the frontmatter of `Home.astro`. This keeps it simple and allows us to test the visual integration instantly.
- Alternatives: Moving the data to a separate `src/data/mock.ts` file. (Rejected for simplicity; it can be refactored later when real data fetching is implemented).

## Risks / Trade-offs

- None. This is a straightforward UI composition.
