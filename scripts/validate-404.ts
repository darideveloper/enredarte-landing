import fs from "node:fs"
import path from "node:path"

// Guards the branded 404 contract (not-found-page change): dist/404.html must
// exist, carry noindex + the centered editorial block, resolve every
// pages.notFound.* key from both dictionaries, and link back into the site.
// Unlike validate-markdown (CMS content, warns only), this check FAILS the
// build — 404 output is fully repo-controlled, so any violation is our bug.
const failures: string[] = []
const fail = (msg: string) => failures.push(msg)

const dist404 = path.resolve("dist/404.html")
if (!fs.existsSync(dist404)) {
  console.error("❌ 404 validation failed: dist/404.html was not emitted.")
  process.exit(1)
}
const html = fs.readFileSync(dist404, "utf-8")
// Structural assertions must ignore the inlined stylesheet — only markup counts.
const body = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")
// Astro escapes quotes/apostrophes in text nodes — decode before matching copy.
const text = body
  .replace(/&#39;|&#x27;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, "&")

if (!html.includes("noindex")) fail("missing robots noindex directive")
for (const cls of ["min-h-[60svh]", "place-items-center", "text-center"]) {
  if (!body.includes(cls)) fail(`centered section missing class: ${cls}`)
}

// Every dictionary key must resolve into the built page (catches renames,
// deleted keys, and unused-key drift on either side of the contract).
for (const lang of ["es", "en"] as const) {
  const messages = JSON.parse(fs.readFileSync(path.resolve(`src/messages/${lang}.json`), "utf-8"))
  const notFound = messages?.pages?.notFound
  if (!notFound || typeof notFound !== "object") {
    fail(`src/messages/${lang}.json is missing pages.notFound`)
    continue
  }
  for (const [key, value] of Object.entries(notFound)) {
    if (typeof value !== "string" || value.length === 0) fail(`pages.notFound.${key} (${lang}) is empty`)
    else if (!text.includes(value)) fail(`pages.notFound.${key} (${lang}) not rendered in 404.html`)
  }
}

for (const href of ['href="/"', 'href="/obras"']) {
  if (!body.includes(href)) fail(`recovery CTA missing: ${href}`)
}

// Sharp-cornered geometry: rounded-full is allowed (footer logo per DESIGN.md),
// any other radius on an element is a brand violation.
const roundedUses = new Set<string>()
for (const m of body.matchAll(/class="[^"]*"/g)) {
  for (const r of m[0].matchAll(/rounded-(?!full\b)([^\s"]+)/g)) roundedUses.add(r[0])
}
if (roundedUses.size > 0) fail(`non-full rounded-* on 404 elements: ${[...roundedUses].join(", ")}`)

if (failures.length > 0) {
  console.error("❌ 404 validation failed:")
  failures.forEach((line) => console.error(`  - ${line}`))
  process.exit(1)
}
console.log("✅ 404 validation passed! dist/404.html meets the not-found-page contract.")
