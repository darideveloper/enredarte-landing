// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
// Astro loads this file directly (not through Vite aliases), so the @/ alias
// does not resolve here — use a relative import for project modules.
import { routes } from "./src/lib/i18n/routes.ts"

/** @type {Record<string, string>} */
const legacyRedirects = Object.values(routes).reduce((acc, route) => {
  if (route.en === "") {
    acc["/en"] = "/"
  } else {
    acc[`/en/${route.en}`] = `/${route.en}`
  }
  return acc
}, {})

export default defineConfig({
  site: "https://enredarte.com",
  build: {
    inlineStylesheets: "always",
  },
  redirects: { ...legacyRedirects },
  vite: {
    plugins: [tailwindcss()],
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
      strictPort: true,
    },
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
  },
  integrations: [react(), sitemap()],
})
