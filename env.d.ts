/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL: string
  readonly API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
