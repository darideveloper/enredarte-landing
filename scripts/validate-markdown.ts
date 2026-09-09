import fs from "node:fs"
import path from "node:path"

// Flags leftover literal `**` markers in built HTML (unmatched markdown that
// GFM renders verbatim). CMS content is not repo-controlled, so this check
// WARNS (exit 0) instead of failing — it exists to flag typos to editors,
// never to block a deploy on a content issue.
const distDir = path.resolve("dist")

function listHtml(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listHtml(full)
    return full.endsWith(".html") ? [full] : []
  })
}

function stripBlocks(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<pre[\s\S]*?<\/pre>/gi, "")
    .replace(/<code[\s\S]*?<\/code>/gi, "")
}

function snippets(text: string, index: number): string {
  const start = Math.max(0, index - 60)
  const end = Math.min(text.length, index + 60)
  return text.slice(start, end).replace(/\s+/g, " ").trim()
}

const flagged: string[] = []

for (const file of listHtml(distDir)) {
  const raw = fs.readFileSync(file, "utf-8")
  const text = stripBlocks(raw)
  const rel = path.relative(process.cwd(), file)
  const seen = new Set<string>()
  for (const m of text.matchAll(/\*\*/g)) {
    const snip = snippets(text, m.index ?? 0)
    if (!seen.has(snip)) {
      seen.add(snip)
      flagged.push(`${rel}  …${snip}…`)
      if (seen.size >= 3) break
    }
  }
}

if (flagged.length > 0) {
  console.warn("⚠️  Leftover literal `**` markers found in built HTML (unmatched markdown renders verbatim per GFM):")
  flagged.forEach((line) => console.warn(`  - ${line}`))
  console.warn("\nFix the CMS source text (stray `**`), not the renderer. This warning does not fail the build.")
} else {
  console.log("✅ Markdown validation passed! No leftover `**` markers in built HTML.")
}
