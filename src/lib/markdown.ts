// Shared build-time markdown rendering (markdown-everywhere).
// Trusted CMS content — no sanitization, raw HTML passes through.
import { marked } from "marked"

export interface MarkdownOptions {
  copyLabel?: string
  copiedLabel?: string
}

function buildRenderer(copyLabel: string, copiedLabel: string) {
  // Custom renderer — ids, lazy images, external link affordance, code lang badge (marked 15 token API)
  const renderer = new marked.Renderer() as any
  renderer.heading = (token: any) => {
    const text: string = token.text ?? ""
    const raw: string = token.raw ?? text
    const depth: number = token.depth ?? 1
    const lvl = depth === 1 ? 2 : depth
    const slug = String(raw).toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || `h-${lvl}`
    return `<h${lvl} id="${slug}" class="scroll-mt-24"><a href="#${slug}" class="no-underline hover:text-crimson transition-colors">${text}</a></h${lvl}>\n`
  }
  renderer.image = (token: any) => {
    const href: string = token.href ?? ""
    const text: string = token.text ?? ""
    const titleAttr: string | null = token.title ?? null
    const titlePart = titleAttr ? ` title="${titleAttr}"` : ""
    const img = `<img src="${href}" alt="${text}"${titlePart} loading="lazy" decoding="async" />`
    if (text && text.length > 12) {
      return `<figure>${img}<figcaption>${text}</figcaption></figure>`
    }
    return img
  }
  renderer.link = (token: any) => {
    const href: string | null = token.href ?? null
    const titleAttr: string | null = token.title ?? null
    const text: string = token.text ?? ""
    const isExternal = href?.startsWith("http")
    const attrs = isExternal ? ` target="_blank" rel="noopener noreferrer"` : ""
    const titlePart = titleAttr ? ` title="${titleAttr}"` : ""
    const ext = isExternal ? ` <span aria-hidden="true" class="text-[11px]">↗</span>` : ""
    return `<a href="${href ?? "#"}"${titlePart}${attrs}>${text}${ext}</a>`
  }
  renderer.code = (token: any) => {
    const code: string = token.text ?? ""
    const langCode: string = (token.lang ?? "").trim().split(/\s+/)[0] ?? ""
    const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    const badge = langCode ? `<span class="code-lang">${langCode}</span>` : ""
    return `<div class="code-block"><pre><code class="language-${langCode}">${escaped}</code></pre>${badge}<button type="button" class="code-copy" data-copy data-copy-label="${copyLabel}" data-copied-label="${copiedLabel}" aria-label="${copyLabel}">${copyLabel}</button></div>`
  }
  return renderer
}

/** Block markdown → HTML (GFM, single `\n` → `<br>`). */
export function renderMarkdown(md: string | null | undefined, opts: MarkdownOptions = {}): string {
  const { copyLabel = "Copy", copiedLabel = "Copied!" } = opts
  const renderer = buildRenderer(copyLabel, copiedLabel)
  return marked.parse(md ?? "", { renderer, gfm: true, breaks: true }) as string
}

/** Inline markdown → HTML without the outer `<p>`, for `<h1>`/`<span>`/card contexts. */
export function renderInline(md: string | null | undefined, opts: MarkdownOptions = {}): string {
  const html = renderMarkdown(md, opts).trim()
  const m = html.match(/^<p>([\s\S]*)<\/p>$/)
  return m ? m[1] : html
}

/** Markdown → plain text, for `<meta name="description">` so `**`/links never leak into SEO. */
export function stripMarkdown(md: string | null | undefined): string {
  return (md ?? "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/`([^`]*?)`/g, "$1")
    .replace(/(^|\s)[*_]([^*_]+?)[*_](?=\s|$)/g, "$1$2")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^(\s*)[-*+]\s+/gm, "$1")
    .replace(/\s+/g, " ")
    .trim()
}
