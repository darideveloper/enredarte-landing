---
created: 2026-07-26
updated: 2026-07-26
tags:
  - astro
  - configuration
  - architecture
  - data
  - documentation
type: resource
status: active
---

# All Config in One Place

Centralized data files for business information, pricing, and content. One file per domain, imported everywhere — never scatter the same phone number or price across components.

## Architecture

```
src/data/
├── site-config.ts       # PHONES, EMAIL, ADDRESS, SOCIAL_LINKS, GOOGLE_MAPS, BUSINESS_HOURS, BUSINESS_DATA
├── prices.ts (example)  # BASE_PRICES (typed), PAGE_DESTINATION_MAP, helper functions
├── vehicle-features.ts (example)  # Bilingual vehicle features keyed by vehicle ID
└── faq.ts (example)     # Frequently asked questions
```

Files suffixed with `(example)` are reusable patterns, not files in the current project. The current project only ships `site-config.ts` (and any project-specific data files); copy the example patterns only if your project needs them.

Each file is the **single source of truth** for its domain. Components import from these files directly — no prop drilling, no context wrappers, no duplication.

## 1. Site Config (`src/data/site-config.ts`)

Holds all business identity data consumed by Layout, SEO, Header, Footer, and JSON-LD.

```ts
// src/data/site-config.ts
export const PHONES = {
    main: {
        raw: '+12345678901',
        formatted: '+1 (234) 567-8901',
        href: 'tel:+12345678901',
    },
    international: {
        raw: '+19876543210',
        formatted: '+1 (987) 654-3210',
        href: 'tel:+19876543210',
    },
} as const;

export const EMAIL = {
    address: 'bookings@example.com',
    href: 'mailto:bookings@example.com',
} as const;

export const ADDRESS = {
    full: '123 Main St, Downtown, 12345 City, ST',
    street: '123 Main St',
    zone: 'Downtown',
    city: 'City',
    state: 'State',
    postalCode: '12345',
    country: 'Country',
    countryCode: 'XX',
} as const;

export const SOCIAL_LINKS = {
    facebook: 'https://www.facebook.com/example',
    instagram: 'https://www.instagram.com/example/',
    tripadvisor: 'https://www.tripadvisor.com/',
} as const;

export const GOOGLE_MAPS = {
    embedUrl: 'https://www.google.com/maps/embed?pb=...',
    placeId: '...',
    coordinates: { lat: 0.0, lng: 0.0 },
} as const;

export const BUSINESS_HOURS = {
    start: '09:00',
    end: '17:00',
    timezone: 'America/New_York',
    display: '9:00 AM to 5:00 PM',
} as const;

export const BUSINESS_DATA = {
    name: "Business Name",
    legalName: "Business Name by Subbrand",
    url: "https://example.com",
    logo: "/assets/img/logo.png",
    ogImage: "/og-image.jpg",
    contact: {
        phone: PHONES.main.formatted,
        email: EMAIL.address,
        address: {
            street: ADDRESS.street,
            city: ADDRESS.city,
            region: ADDRESS.state,
            postalCode: ADDRESS.postalCode,
            country: ADDRESS.countryCode,
        },
        geo: GOOGLE_MAPS.coordinates,
    },
    social: SOCIAL_LINKS,
};
```

### Why `BUSINESS_DATA` exists
All SEO metadata and JSON-LD generation consumes `BUSINESS_DATA` — it bundles the individual constants into a shape ready for `BaseSEO.astro`.

## 2. Other Data Files

The same one-file-per-domain pattern extends to any domain-specific data your project needs:

- `prices.ts` — pricing tables, tiers, and helper functions
- `vehicle-features.ts` — product features, service descriptions, content data
- `faq.ts` — frequently asked questions

These are **optional example patterns**, not files in the current project — the architecture diagram marks them `(example)`. Create them only if your project has that data domain. Each follows the same structure: typed constants, `as const`, exported for import from any component. See `src/data/` in the architecture diagram above for the full layout.

## 3. Typed Environment Variables (`env.d.ts`)

Astro projects handle env vars natively via Vite, but they're untyped by default. Add a type declaration file:

```ts
// env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly API_BASE_URL: string;
  readonly API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

All env vars (with or without `PUBLIC_` prefix) can be declared in `ImportMetaEnv` for type safety. Vite statically replaces `import.meta.env.*` at build time. `PUBLIC_*` vars are also available in client-side code; server-only vars (no prefix) are not exposed to client bundles. Without these declarations, `import.meta.env.*` returns `any`. With them, you get autocomplete and type safety.

## 4. Constants (`src/consts.ts`)

Global constants used across the app — site identity, locale mapping, etc.

```ts
export const SITE_TITLE = "Business Name";
export const SITE_DESCRIPTION = "Official business services.";

export const LOCALE_MAP: Record<string, string> = {
    en: "en_US",
    es: "es_ES",
};
```

`SITE_TITLE` and `SITE_DESCRIPTION` serve as the **final fallback** in the SEO resolution chain (prop → i18n → constant).

## 5. How Components Consume Config

### Layout.astro
```astro
---
import { BUSINESS_DATA } from '@/data/site-config'
import { SITE_TITLE } from '@/consts'
---
<html lang={lang}>
  <head>
    <link rel="canonical" href={BUSINESS_DATA.url} />
    <title>{SITE_TITLE}</title>
  </head>
```

### BaseSEO.astro (JSON-LD generation)
```astro
---
import { BUSINESS_DATA } from '@/data/site-config'
---
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": BUSINESS_DATA.name,
  "url": BUSINESS_DATA.url,
  "telephone": BUSINESS_DATA.contact.phone,
  "address": BUSINESS_DATA.contact.address,
  "geo": BUSINESS_DATA.contact.geo,
})} />
```

### Header / Footer
```astro
---
import { PHONES } from '@/data/site-config'
---
<a href={PHONES.main.href}>{PHONES.main.formatted}</a>
```

## 6. New Project Setup

```bash
# Create data directory
mkdir -p src/data

# Create files
touch src/data/site-config.ts
touch src/data/prices.ts      # if your project has pricing
touch src/consts.ts
touch env.d.ts                # at project root
```

Then:
1. Populate `site-config.ts` with your business data (section 1)
2. Add `consts.ts` with `SITE_TITLE`, `SITE_DESCRIPTION`, `LOCALE_MAP` (section 4)
3. Add `PUBLIC_*` type declarations to `env.d.ts` (section 3)
4. Import `BUSINESS_DATA` in `BaseSEO.astro`, `Layout.astro`, `Header.astro`, `Footer.astro`
5. For projects with variable data (prices, features), follow the same file-per-domain pattern

## 7. Key Rules

- Every constant uses `as const` — TypeScript infers literal types, not just `string`
- `BUSINESS_DATA` is the **SEO bundle**; individual constants (`PHONES`, `EMAIL`) are for UI
- One file per data domain — site-config, prices, features, etc.
- Never hardcode business data in components — always import
- `as const` + `export` means components import what they actually need, not the whole file
- Typed `env.d.ts` prevents `process.env` style bugs and gives autocomplete

## 8. Connection to Other Patterns

- `BUSINESS_DATA` is consumed by `BaseSEO.astro` for JSON-LD → see [[astro-seo]]
- `API_BASE_URL` env var is passed through Docker build args → see [[astro-docker-deployment]]
