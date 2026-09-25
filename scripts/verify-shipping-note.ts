import fs from "node:fs"
import path from "node:path"

// Guards the shipping-excluded-note change: the sale price excludes delivery
// (agreed after the sale), so a quiet microcopy line must sit between the
// price and the status label in the purchase zone, plus once next to the
// charged amount in the ready phase of compra-exitosa.
//
// Source assertions pin the contract; dist assertions pin the rendered
// outcome (available+priced shows it, badge states hide it). Run after
// `pnpm run build` so dist/ reflects current sources:
//   npx tsx scripts/verify-shipping-note.ts
const failures: string[] = []
const fail = (msg: string) => failures.push(msg)
const read = (rel: string) => fs.readFileSync(path.resolve(rel), "utf-8")

// --- 1. Dictionary keys (exact copy, both languages) ---
const es = JSON.parse(read("src/messages/es.json"))
const en = JSON.parse(read("src/messages/en.json"))
if (es?.pages?.purchase?.shippingNote !== "+ Gastos de envío") {
  fail(`es pages.purchase.shippingNote is not "+ Gastos de envío"`)
}
if (en?.pages?.purchase?.shippingNote !== "+ Shipping costs") {
  fail(`en pages.purchase.shippingNote is not "+ Shipping costs"`)
}

// --- 2. Purchase zone: prop, guard, order, tone ---
const purchase = read("src/components/organisms/ArtworkPurchase.tsx")
if (!purchase.includes("shippingNote: string")) fail("ArtworkPurchaseProps lacks `shippingNote: string`")
if (!purchase.includes('price && status === "available"')) {
  fail("ArtworkPurchase lacks the `price && status === \"available\"` visibility guard")
}
const priceIdx = purchase.indexOf("text-sm text-ink font-sans font-medium")
const noteIdx = purchase.indexOf("{shippingNote}")
const statusIdx = purchase.indexOf("{statusLabels[status]}")
if (priceIdx === -1 || noteIdx === -1 || statusIdx === -1 || !(priceIdx < noteIdx && noteIdx < statusIdx)) {
  fail("shipping note is not ordered price → note → status in ArtworkPurchase")
}
const noteBlock = purchase.slice(noteIdx - 200, noteIdx + 50)
if (!noteBlock.includes("text-muted")) fail("shipping note block lacks the muted treatment")
if (/crimson|alert|rounded|border/.test(noteBlock)) {
  fail("shipping note block uses accent/box styling (must stay quiet metadata)")
}

const panel = read("src/components/molecules/ArtworkInfoPanel.astro")
if (!panel.includes('t("pages.purchase.shippingNote")')) fail("ArtworkInfoPanel does not resolve pages.purchase.shippingNote")
if (!panel.includes("shippingNote={shippingNote}")) fail("ArtworkInfoPanel does not pass shippingNote to ArtworkPurchase")

// --- 3. Success flow: ready phase only, complete untouched ---
const flow = read("src/components/organisms/OrderFlow.tsx")
if (!flow.includes("shippingNote: string")) fail("OrderFlowCopy lacks `shippingNote: string`")
if (!flow.includes("<OrderSummaryCard summary={phase.summary} note={copy.shippingNote}")) {
  fail("OrderFlow ready branch does not pass copy.shippingNote to OrderSummaryCard")
}
if (!flow.includes("<OrderSummaryCard summary={phase.summary} note={note}")) {
  fail("OrderFlow complete branch no longer uses its receipt/shipping-status note")
}

const success = read("src/components/pages/compra/SuccessPage.astro")
if (!success.includes('shippingNote: t("pages.purchase.shippingNote")')) {
  fail("SuccessPage does not resolve pages.purchase.shippingNote into OrderFlow copy")
}

// --- 4. Rendered outcome in dist/ (needs a fresh build) ---
const renderedNote = (html: string, copy: string) =>
  html.includes(`font-sans text-muted">\n${copy}</p>`) || html.includes(`font-sans text-muted">${copy}</p>`)
const artworkPages = (lang: string) => {
  const dir = path.resolve(lang === "en" ? "dist/en/obras" : "dist/obras")
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .map((slug) => path.join(dir, slug, "index.html"))
    .filter((f) => fs.existsSync(f))
};
const pages = [...artworkPages("es"), ...artworkPages("en")]
if (pages.length === 0) {
  fail("no built artwork pages found — run `pnpm run build` first")
} else {
  // Available + priced pages must render the note between price and status.
  const withForm = pages.filter((f) => {
    const html = fs.readFileSync(f, "utf-8")
    return html.includes('<form class="flex flex-col gap-4"') && html.includes("text-sm text-ink font-sans font-medium")
  })
  if (withForm.length === 0) fail("no available+priced artwork page found in dist")
  for (const f of withForm) {
    const html = fs.readFileSync(f, "utf-8")
    const copy = f.includes("/en/") ? "+ Shipping costs" : "+ Gastos de envío"
    if (!renderedNote(html, copy)) fail(`available page renders no shipping note: ${path.relative(process.cwd(), f)}`)
  }
  // Badge pages (reserved/sold/…) must NOT render the note visibly.
  // Serialized island props legitimately contain the string (escaped as
  // &quot;), so only the unescaped rendered <p> counts.
  const withBadge = pages.filter((f) =>
    fs.readFileSync(f, "utf-8").includes("self-start border border-border-theme"),
  )
  if (withBadge.length === 0) fail("no badge-state artwork page found in dist")
  for (const f of withBadge) {
    const html = fs.readFileSync(f, "utf-8")
    const copy = f.includes("/en/") ? "+ Shipping costs" : "+ Gastos de envío"
    if (renderedNote(html, copy)) fail(`badge-state page leaks the shipping note: ${path.relative(process.cwd(), f)}`)
  }
  // Ready-phase plumbing: the note string must reach the OrderFlow island.
  for (const rel of ["dist/compra-exitosa/index.html", "dist/en/compra-exitosa/index.html"]) {
    if (!fs.existsSync(path.resolve(rel))) {
      fail(`missing built shell: ${rel}`)
      continue
    }
    const html = fs.readFileSync(path.resolve(rel), "utf-8")
    const copy = rel.includes("/en/") ? "+ Shipping costs" : "+ Gastos de envío"
    if (!html.includes(copy)) fail(`${rel} does not carry the shipping note to OrderFlow`)
  }
}

if (failures.length > 0) {
  console.error("❌ shipping-note verification failed:")
  failures.forEach((line) => console.error(`  - ${line}`))
  process.exit(1)
}
console.log("✅ shipping-note verification passed! All 6 spec scenarios hold.")
