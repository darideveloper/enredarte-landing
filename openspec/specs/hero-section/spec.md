## Purpose
Defines the `Hero` organism component, serving as the main entry point for the landing page with composed typography and image molecules.

## Requirements

### Requirement: Display composed hero section
The `Hero` organism SHALL assemble the `H1` typography molecule on the left and the `ImageBanner` molecule on the right, and SHALL render its textual and artwork content from props (title, description, badge, curator line, and featured artwork data) supplied by the homepage, instead of hardcoded mockup copy. The homepage SHALL derive those props from the primary gallery's hero view model (see `gallery-data`).

#### Scenario: Normal rendering
- **GIVEN** the homepage passes hero props resolved from the primary gallery
- **WHEN** the `Hero` component is rendered
- **THEN** it displays a two-column responsive layout, where the left column contains the H1, description, and curator info, and the right column contains an `ImageBanner`
- **AND** the title, description, curator line, badge, and artwork banner values are the passed props, not inline placeholder text

#### Scenario: No props provided
- **GIVEN** the `Hero` component is rendered without hero props (e.g. in the design system showcase)
- **THEN** it still renders without error, using safe defaults for the optional content

### Requirement: Accept dynamic H1 content via slot
The `Hero` component SHALL pass dynamic content to its internal `H1` molecule via slots.

#### Scenario: Slotted H1
- **WHEN** the user provides slotted content for the H1
- **THEN** it renders the slotted content correctly within the left column's `H1` molecule.

### Requirement: Choreographed GSAP entrance timeline
The `Hero` organism SHALL trigger a synchronized GSAP entrance animation sequence exactly once via the `astro:page-load` event and a direct `init()` call for first paint, SHALL respect `prefers-reduced-motion` via `gsap.matchMedia()`, SHALL animate the artwork banner using only `transform` (never hiding it with `opacity: 0`), SHALL carry `transition:animate="none"` on its root element to prevent View Transition cross-fade from competing with the GSAP fromTo reveal, SHALL revert its `gsap.matchMedia()` context on `astro:after-swap` before re-initializing, and SHALL skip the entrance animation on subsequent VT navigations within the same session (using `sessionStorage`) so the above-fold content appears instantly on return visits.

#### Scenario: First-load entrance animation
- **WHEN** the `Hero` component loads for the first time in a browser session and `prefers-reduced-motion` is `no-preference`
- **THEN** the artwork banner scales down smoothly (`scale: 1.08 → 1.0` without an opacity change), the room badge slides down (`y: -15 → 0`), the title slides up (`y: 30 → 0`), body description fades up (`y: 20 → 0`), the CTA slides up (`y: 20 → 0`), and the meta line fades in (opacity only) using GSAP timeline timing, and the sequence runs once (not doubled).

#### Scenario: Return visit via View Transition navigation
- **WHEN** the user navigates back to the home page via a client-side transition within the same session
- **THEN** all hero elements appear instantly at their final visible state with no entrance animation replayed.

#### Scenario: Reduced motion preference honored
- **WHEN** the user's operating system sets `prefers-reduced-motion: reduce`
- **THEN** the hero content is revealed without movement (elements jump to their final visible state) and no entrance timeline is played.

#### Scenario: View Transition cleanup on navigation away
- **WHEN** `astro:after-swap` fires during a client-side navigation away from the home page
- **THEN** the Hero's `gsap.matchMedia()` context is reverted, killing all GSAP tweens and ScrollTriggers created for the Hero section.