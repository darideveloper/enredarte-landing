## MODIFIED Requirements

### Requirement: Render image with standard properties
The `Image` component SHALL render an optimized image via `astro:assets` with AVIF/WebP variants, responsive `srcset/sizes`, explicit dimensions for CLS safety, and accessibility enforcement.

#### Scenario: Image properties are mapped correctly
- **WHEN** the `Image` component is passed `src` and `alt` properties
- **THEN** it renders an optimized `<img>` with corresponding `srcset`, `sizes`, `width`, `height`, `alt` attributes
- **AND** by default it applies the `object-cover` and `w-full h-full` classes to ensure the image fills its container without distortion.

#### Scenario: Height mode is `auto`
- **WHEN** the `Image` component is passed `height="auto"`
- **THEN** it applies `w-full h-auto` instead of `w-full h-full`, so the rendered image keeps its natural aspect ratio and is not cropped to fill a fixed container.

### Requirement: Support configurable height mode
The `Image` component SHALL support an optional `height` property with values `full` (default) or `auto`, controlling whether the image fills its container (`h-full`) or preserves its natural aspect ratio (`h-auto`).

#### Scenario: Default height mode
- **WHEN** the `height` property is omitted
- **THEN** the image uses `h-full` (fill mode), matching the current behavior.

#### Scenario: Explicit auto height mode
- **WHEN** the `height` property is set to `auto`
- **THEN** the image uses `h-auto`, preserving its natural aspect ratio.

### Requirement: Support aspect ratio constraints
The `Image` component SHALL support an optional `aspectRatio` property that wraps the image in a container enforcing the specified ratio (e.g., `4/5`, `video`, or `square`).

#### Scenario: Aspect ratio is provided
- **WHEN** the `aspectRatio` property is defined as `video`
- **THEN** the image is contained within a wrapper that enforces the `aspect-video` class.

#### Scenario: No aspect ratio is provided
- **WHEN** the `aspectRatio` property is omitted
- **THEN** the image applies the `aspect-auto` class, allowing it to conform to its parent's dimensions.

## ADDED Requirements

### Requirement: Responsive and priority props
The `Image` component SHALL accept `widths`, `sizes`, `formats`, `quality`, `width`, `height`, `loading`, `decoding`, and `fetchpriority` props with defaults `loading="lazy"`, `decoding="async"`, `fetchpriority="auto"`, `formats="['avif','webp']"`, and SHALL use `inferSize` for allowlisted remotes when explicit dimensions are absent.

#### Scenario: LCP override
- **WHEN** `loading="eager" fetchpriority="high"` is passed for a hero/first-viewer image
- **THEN** the rendered `<img>` carries both attributes and participates in the page's single responsive preload
