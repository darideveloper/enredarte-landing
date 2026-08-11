## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Non-portable notes marked with a local callout
Any note that describes the current `enredarte-landing` project rather than a reusable pattern SHALL be wrapped in a `🏠 Local note (enredarte-landing)` callout so readers can distinguish portable guidance from project context. Additionally, example-only data files in architecture diagrams SHALL be marked with `(example)` to distinguish them from actual project files.

#### Scenario: Project-specific note is flagged
- **WHEN** a doc contains a statement about the current repository (e.g. orphaned `src/lib/api/`, the vanilla-only component approach, `GlobalLoader.tsx`)
- **THEN** the statement is wrapped in `> **🏠 Local note (enredarte-landing):** ...`

#### Scenario: Example-only files in diagrams are marked
- **WHEN** an architecture diagram lists a file that does not exist in the current project but is shown as a reusable pattern
- **THEN** the file is suffixed with `(example)` and the surrounding text clarifies it is optional

### Requirement: Single source of truth per topic
The reusable docs in `docs/` SHALL own each piece of technical content in exactly one place. When two docs would need the same config, code block, or pattern, one doc SHALL be the canonical owner and the other SHALL reference it with a relative markdown link instead of duplicating the content.

#### Scenario: Nginx caching rules owned by the deployment doc
- **WHEN** the nginx service-worker, manifest, or `/_astro/` cache rules are described
- **THEN** they appear in full only in `docs/astro-docker-deployment.md`, with any PWA-only sections explicitly annotated as removable

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
