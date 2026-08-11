import fs from "node:fs"
import path from "node:path"

const srcDir = path.resolve("src")
const extRe = /\.(astro|ts|tsx)$/

function listFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(full)
    return extRe.test(entry.name) ? [full] : []
  })
}

const fromRe = /from\s+["']\.{1,}\//g
const dynamicRe = /import\(\s*["']\.{1,}\//g
const bareRe = /^import\s+["']\.{1,}\//g

const offenders: string[] = []

for (const file of listFiles(srcDir)) {
  const content = fs.readFileSync(file, "utf-8")
  const rel = path.relative(process.cwd(), file)
  for (const m of content.matchAll(fromRe)) {
    offenders.push(`${rel}:${countLines(content, m.index)}  ${extractLine(content, m.index)}`)
  }
  for (const m of content.matchAll(dynamicRe)) {
    offenders.push(`${rel}:${countLines(content, m.index)}  ${extractLine(content, m.index)}`)
  }
  for (const m of content.matchAll(bareRe)) {
    offenders.push(`${rel}:${countLines(content, m.index)}  ${extractLine(content, m.index)}`)
  }
}

if (offenders.length > 0) {
  console.error("❌ Import validation failed! Relative project imports (./ or ../) found:")
  offenders.forEach((line) => console.error(`  - ${line}`))
  console.error("\nUse the @/ alias for all project imports (e.g. '@/lib/utils').")
  process.exit(1)
}

console.log("✅ Import validation passed!")

function countLines(content: string, index: number): number {
  return content.slice(0, index).split("\n").length
}

function extractLine(content: string, index: number): string {
  const start = content.lastIndexOf("\n", index) + 1
  const end = content.indexOf("\n", index)
  return content.slice(start, end === -1 ? undefined : end).trim()
}
