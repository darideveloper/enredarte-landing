## ADDED Requirements

### Requirement: Centralized business data
All business identity data SHALL be defined in `src/data/site-config.ts` as typed constants with `as const`. This SHALL be the single source of truth for phone, email, address, social links, Google Maps data, and the combined `BUSINESS_DATA` object.

#### Scenario: Business data is importable
- **WHEN** a component imports `BUSINESS_DATA` from `@/data/site-config`
- **THEN** the imported object SHALL contain `name`, `url`, `logo`, `contact`, and `social` fields

### Requirement: Global constants
The project SHALL define `SITE_TITLE` and `SITE_DESCRIPTION` in `src/consts.ts`. These serve as the final fallback in the SEO resolution chain.

#### Scenario: Constants are importable
- **WHEN** a component imports `SITE_TITLE` from `@/consts`
- **THEN** the imported value SHALL be a string

### Requirement: Locale mapping
The project SHALL define a `LOCALE_MAP` in `src/consts.ts` that maps language codes to locale strings (e.g., `en: "en_US"`, `es: "es_ES"`). This SHALL be used for Open Graph `og:locale` tags.

#### Scenario: Locale map is available
- **WHEN** the SEO component needs the locale for `og:locale`
- **THEN** `LOCALE_MAP["en"]` SHALL return `"en_US"`

### Requirement: Typed environment variables
The project SHALL declare typed environment variables in `env.d.ts` at the project root. All `PUBLIC_*` env vars SHALL have declared types in `ImportMetaEnv`.

#### Scenario: Env var has type
- **WHEN** code accesses `import.meta.env.SITE_URL`
- **THEN** TypeScript SHALL infer the declared type from `ImportMetaEnv` instead of `any`

### Requirement: No hardcoded business data in components
Components SHALL NOT hardcode business data (phone numbers, addresses, social URLs, etc.). All such data SHALL be imported from `src/data/site-config.ts` or `src/consts.ts`.

#### Scenario: Component imports config
- **WHEN** a component needs to display a phone number
- **THEN** it SHALL import from `@/data/site-config` rather than hardcoding the value
