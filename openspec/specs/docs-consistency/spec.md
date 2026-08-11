## Purpose

Defines the portability and integrity rules for the reusable `docs/` set — single source of truth per topic, cross-doc references instead of duplicated content, non-portable project notes marked with a consistent callout, version-agnostic placeholders, and uniform YAML frontmatter.

## Requirements

### Requirement: Single source of truth per topic
The reusable docs in `docs/` SHALL own each piece of technical content in exactly one place. When two docs would need the same config, code block, or pattern, one doc SHALL be the canonical owner and the other SHALL reference it with a relative markdown link instead of duplicating the content.

#### Scenario: Nginx caching rules owned by the deployment doc
- **WHEN** the nginx service-worker, manifest, or `/_astro/` cache rules are described
- **THEN** they appear in full only in `docs/astro-docker-deployment.md`, with any PWA-only sections explicitly annotated as removable

#### Scenario: GSAP + View Transitions pattern owned by the transitions doc
- **WHEN** the GSAP lifecycle pattern for `<ClientRouter />` navigation is described
- **THEN** the full pattern appears in `docs/astro-client-side-page-transitions.md` §5.4, and `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` links to it instead of repeating the full code

### Requirement: Non-portable notes marked with a local callout
Any note that describes the current `enredarte-landing` project rather than a reusable pattern SHALL be wrapped in a `🏠 Local note (enredarte-landing)` callout so readers can distinguish portable guidance from project context. Additionally, example-only data files in architecture diagrams SHALL be marked with `(example)` to distinguish them from actual project files.

#### Scenario: Project-specific note is flagged
- **WHEN** a doc contains a statement about the current repository (e.g. orphaned `src/lib/api/`, the vanilla-only component approach, `GlobalLoader.tsx`)
- **THEN** the statement is wrapped in `> **🏠 Local note (enredarte-landing):** ...`

#### Scenario: Example-only files in diagrams are marked
- **WHEN** an architecture diagram lists a file that does not exist in the current project but is shown as a reusable pattern
- **THEN** the file is suffixed with `(example)` and the surrounding text clarifies it is optional

### Requirement: Version-agnostic placeholders
Reusable docs SHALL NOT pin versions that go stale (e.g. `astro@^7`, `node:22-alpine`, `pnpm@10.18.3`). Where a version is needed, the doc SHALL use a generic placeholder (e.g. `node:lts-alpine`, `pnpm@<latest>`) or state an example version as an example.

#### Scenario: Impossible version is replaced
- **WHEN** a doc pins an Astro version that does not exist (e.g. `astro@^7`)
- **THEN** the pin is replaced with a version range that exists or a generic placeholder

#### Scenario: Runtime image uses LTS placeholder
- **WHEN** the Dockerfile uses a node base image
- **THEN** it references an LTS placeholder (e.g. `node:lts-alpine`) rather than a single historical version

### Requirement: Uniform YAML frontmatter
Every top-level doc except `docs/component-dependencies.md` (intentionally project-specific and unchanged), and every file in `docs/gsap-scrolltrigger/`, SHALL carry the standard frontmatter (`created`, `updated`, `tags`, `type`, `status`), consistent with the rest of the docs set.

#### Scenario: Missing frontmatter is added
- **WHEN** a doc currently lacks frontmatter (e.g. `astro-seo.md`, `astro-client-side-page-transitions.md`, the `gsap-scrolltrigger/*.md` files)
- **THEN** it gains `created`, `updated`, `tags`, `type`, and `status` fields matching the set's convention

### Requirement: Internal statements agree with themselves
Docs SHALL NOT contain self-contradictory or inaccurate statements: summaries SHALL count their own items correctly, colors and commands SHALL be consistent within a file, and config snippets SHALL show only the configuration that is actually needed.

#### Scenario: Summary counts match its items
- **WHEN** `docs/astro-client-side-page-transitions.md` §9 states how many steps the recipe has
- **THEN** the number matches the number of items listed

#### Scenario: Package-manager commands are consistent
- **WHEN** a doc shows package-manager commands
- **THEN** they use `pnpm` (the project convention) unless the command explicitly concerns npm itself

#### Scenario: Config shows only needed keys
- **WHEN** `docs/astro-portless.md` shows the `astro.config.mjs` dev-server snippet
- **THEN** it shows only the `server.port` key (no redundant `vite.server.port` wrapper)

### Requirement: Reveal-strategy taxonomy is honest
The GSAP reveal-strategy documentation SHALL describe the actual strategies the templates use. The hybrid pattern (CSS `.js-reveal` hiding + `gsap.set(autoAlpha: 1)` + `.from()`) SHALL be recognized as an explicit third approach rather than being presented as one of two mutually exclusive options.

#### Scenario: Hybrid is a documented approach
- **WHEN** `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` lists the SEO-safe reveal strategies
- **THEN** the hybrid approach is listed alongside `fromTo` + `clearProps` and the CSS `.js-reveal` fallback, and the template in `03-section-reveal-pattern.md` is labeled as using the hybrid

### Requirement: Optional helper code carries a clear disclaimer
Convenience helpers that are not part of the reference implementation SHALL be labeled as such where their full code is provided, so readers know the reference implementation duplicates the per-component pattern by design.

#### Scenario: Helper disclaimer present
- **WHEN** `docs/gsap-scrolltrigger/03` or `04` provides the full implementation of an optional helper (e.g. `reveal-helper.ts`, `animate-counters.ts`)
- **THEN** the code is preceded or followed by a disclaimer stating it is convenience-only and not the reference implementation

### Requirement: i18n doc documents scalability and cross-links
`docs/astro-i18n.md` SHALL state that the pattern scales beyond the two example languages and SHALL cross-reference the Client Router integration documented in `docs/astro-client-side-page-transitions.md`.

#### Scenario: i18n scaling note present
- **WHEN** `docs/astro-i18n.md` is read
- **THEN** it notes that additional languages follow the same pattern (add to `ui.ts`, `routes.ts`, and the validation script)

#### Scenario: Client Router cross-reference present
- **WHEN** `docs/astro-i18n.md` §12 (Connection to Other Patterns) is read
- **THEN** it links to `docs/astro-client-side-page-transitions.md` for i18n + View Transitions behavior

### Requirement: tsx install step is explicit
The build-time validation section of `docs/astro-i18n.md` SHALL state explicitly that `tsx` must be installed (`pnpm add -D tsx`) as part of setting up the validation script, not only in the setup checklist.

#### Scenario: tsx dependency stated in validation section
- **WHEN** the i18n build-time validation section is read
- **THEN** it includes the `pnpm add -D tsx` install step alongside the script wiring

### Requirement: PWA-conditional documentation
When a doc describes a feature that is optional and not present in the current project, the feature's documentation SHALL either be in a separate dedicated file (removed if unused) or SHALL be explicitly marked as optional with removal instructions for non-PWA projects.

#### Scenario: PWA-only nginx blocks are removable
- **WHEN** a reader copies the nginx template from the deployment doc
- **THEN** they can remove all PWA-only blocks by deleting sections between clearly marked comment boundaries

#### Scenario: Unused optional doc is removed
- **WHEN** a documented feature is not implemented and has no implementation plan
- **THEN** its dedicated doc file is deleted rather than kept as aspirational documentation

### Requirement: Build pipeline completeness
The build pipeline documentation SHALL include every validation step that actually runs during the build. No step in the package.json `build` script SHALL be undocumented.

#### Scenario: All validation steps documented
- **WHEN** the build pipeline section of the i18n doc is read
- **THEN** every validation command in the `build` script is listed and explained

### Requirement: Environment variable type correctness
Documented `ImportMetaEnv` type declarations SHALL distinguish between server-only env vars (accessed via `process.env`) and client-accessible vars (accessed via `import.meta.env`). Server-only vars SHALL NOT appear in `ImportMetaEnv`.

#### Scenario: Server-only vars excluded from ImportMetaEnv
- **WHEN** the env.d.ts example is shown in documentation
- **THEN** only `PUBLIC_*` prefixed variables appear in `ImportMetaEnv`

### Requirement: Doc code conventions match codebase
When docs specify code conventions (formatting, semicolons, quotes), the actual codebase SHALL follow those conventions. A convention documented as the project standard SHALL be enforced across all source files.

#### Scenario: Semicolons convention consistent
- **WHEN** the React Islands doc states "No semicolons" as a convention
- **THEN** all source files in `src/` comply with this convention
