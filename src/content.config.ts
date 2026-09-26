import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

// Legal page bodies (ES + EN). Both language files are required per slug —
// LegalPage throws at build time when one is missing (no silent fallback).
const legal = defineCollection({
  // Default ids are github-slugs (dots stripped: "aviso-de-privacidad.en" →
  // "aviso-de-privacidaden"), so pin explicit "<slug>.<lang>" ids instead.
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/legal",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.string(),
  }),
})

export const collections = { legal }
