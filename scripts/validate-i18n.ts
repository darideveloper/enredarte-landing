import fs from "node:fs"
import path from "node:path"

const messagesDir = path.resolve("src/messages")

function readMessages(lang: string) {
  const filePath = path.join(messagesDir, `${lang}.json`)
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Message file not found: ${filePath}`)
    process.exit(1)
  }
  const content = fs.readFileSync(filePath, "utf-8")
  try {
    return JSON.parse(content)
  } catch {
    console.error(`❌ Invalid JSON in ${filePath}`)
    process.exit(1)
  }
}

function flattenKeys(obj: any, prefix = ""): string[] {
  return Object.keys(obj).reduce((acc: string[], key: string) => {
    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === "object" && value !== null) {
      return [...acc, ...flattenKeys(value, newKey)]
    }
    return [...acc, newKey]
  }, [])
}

const en = readMessages("en")
const es = readMessages("es")

const enKeys = new Set(flattenKeys(en))
const esKeys = new Set(flattenKeys(es))

const missingInEs = [...enKeys].filter((k) => !esKeys.has(k))
const missingInEn = [...esKeys].filter((k) => !enKeys.has(k))

if (missingInEs.length > 0 || missingInEn.length > 0) {
  console.error("❌ i18n validation failed! Translation files are out of sync.")
  if (missingInEs.length > 0) {
    console.error("\nMissing in es.json:")
    missingInEs.forEach((k) => console.error(`  - ${k}`))
  }
  if (missingInEn.length > 0) {
    console.error("\nMissing in en.json:")
    missingInEn.forEach((k) => console.error(`  - ${k}`))
  }
  process.exit(1)
}

console.log("✅ i18n validation passed!")
