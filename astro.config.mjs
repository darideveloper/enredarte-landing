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
  if (route.es === "") {
    acc["/es"] = "/"
  } else {
    acc[`/es/${route.es}`] = `/${route.es}`
  }
  return acc
}, /** @type {Record<string, string>} */ ({}))

// ponytail: config files can't use import.meta.env for .env values, and bare
// process.env can't see .env either — Node 22 loadEnvFile fills CLI-unset
// vars from .env (no new dependency; CLI env wins). Missing .env (e.g.
// Docker, where the value arrives as ENV) falls through to the fallback.
try {
  if (typeof process.loadEnvFile === 'function') process.loadEnvFile('.env');
} catch {
  // No .env — process.env / fallback below apply.
}
// Remote image hosts allowed through astro:assets (optimize-ssg-images).
// Dashboard/API host is derived from API_BASE_URL so dev (.localhost),
// Docker, and prod each allowlist their own backend without code changes;
// the DigitalOcean Spaces CDN host is static (artwork/blog media).
function remoteImagePatterns() {
  const patterns = [
    { protocol: "https", hostname: "daridev-django.sfo3.cdn.digitaloceanspaces.com" },
  ]
  const apiBase = process.env.API_BASE_URL ?? ""
  try {
    const host = new URL(apiBase).hostname
    if (host) {
      patterns.push({ protocol: "https", hostname: host })
      patterns.push({ protocol: "http", hostname: host })
    }
  } catch {
    // No/invalid API_BASE_URL — CDN host above still applies.
  }
  return patterns
}
export default defineConfig({
  image: {
    remotePatterns: remoteImagePatterns(),
  },
  // Origin chain: per-checkout Portless URL wins in dev (each worktree gets
  // its own branch-subdomain URL), explicit SITE_URL covers Docker/CI builds.
  // Fallback is the prod domain (documented in docs/astro-worktrees.md,
  // docs/astro-portless.md, docs/astro-site-config.md): dev never reaches it
  // since Portless always injects PORTLESS_URL, and a build without env must
  // emit prod — never localhost — into sitemap/canonicals.
  site: process.env.PORTLESS_URL ?? process.env.SITE_URL ?? "https://enredarte.mx",
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
    strictPort: true,
  },
  integrations: [react(), sitemap()],
})
