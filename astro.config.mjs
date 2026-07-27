// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  site: "https://enredarte.com",
  build: {
    inlineStylesheets: "always",
  },
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
