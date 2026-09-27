/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL: string
  readonly API_TOKEN: string
  readonly PUBLIC_GTM_ID?: string
  readonly PUBLIC_GA4_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
