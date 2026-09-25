// Shared build-time markdown rendering (markdown-everywhere).
// Trusted CMS content — no sanitization, raw HTML passes through.
import { marked } from "marked"

export interface MarkdownOptions {
  copyLabel?: string
  copiedLabel?: string
  videoTitle?: string
}

// Video embeds (blog-iframe-video): bare YouTube/Vimeo URL alone on its
// paragraph → hardened lazy iframe. Inline URLs and unknown hosts stay links.
const VIDEO_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "vimeo.com", "www.vimeo.com", "player.vimeo.com"])
const IFRAME_ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

function escAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** `t=1h2m3s` / `90s` / `90` → seconds; null when unparseable (param dropped). */
export function parseTimestampToSeconds(raw: string | null): number | null {
  if (raw == null || raw === "") return null
  if (/^\d+$/.test(raw)) return parseInt(raw, 10)
  const m = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!m || (!m[1] && !m[2] && !m[3])) return null
  return (m[1] ? parseInt(m[1], 10) * 3600 : 0) + (m[2] ? parseInt(m[2], 10) * 60 : 0) + (m[3] ? parseInt(m[3], 10) : 0)
}

export interface ParsedVideo {
  provider: "youtube" | "vimeo"
  embedUrl: string
}

/** Map accepted YouTube/Vimeo URL forms to canonical embed URLs; null otherwise. */
export function parseVideoUrl(href: string): ParsedVideo | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  const host = url.hostname.toLowerCase()
  if (!VIDEO_HOSTS.has(host)) return null

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0]
    if (!id) return null
    const start = parseTimestampToSeconds(url.searchParams.get("t") ?? url.searchParams.get("start"))
    return { provider: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${id}${start != null ? `?start=${start}` : ""}` }
  }
  if (host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com") {
    const segs = url.pathname.split("/").filter(Boolean)
    let id: string | undefined
    if (segs[0] === "watch") id = url.searchParams.get("v") ?? undefined
    else if ((segs[0] === "embed" || segs[0] === "shorts" || segs[0] === "live") && segs[1]) id = segs[1]
    if (!id) return null
    const start = parseTimestampToSeconds(url.searchParams.get("t") ?? url.searchParams.get("start"))
    return { provider: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${id}${start != null ? `?start=${start}` : ""}` }
  }
  // Vimeo: vimeo.com/<id>[/<hash>] or player.vimeo.com/video/<id>[/<hash>]
  const segs = url.pathname.split("/").filter(Boolean)
  const videoIdx = segs[0] === "video" ? 1 : 0
  const id = segs[videoIdx]
  if (!id || !/^\d+$/.test(id)) return null
  const hash = segs[videoIdx + 1] && !/^\d+$/.test(segs[videoIdx + 1]) ? `/${segs[videoIdx + 1]}` : ""
  return { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}${hash}` }
}

function buildRenderer(copyLabel: string, copiedLabel: string, videoTitle: string, enableVideo: boolean) {
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
  // Standalone video URL paragraph → player. Inline URLs keep link output.
  // `function` (not arrow) to keep marked's `this.parser` for the fallback.
  renderer.paragraph = function (token: any) {
    if (enableVideo && Array.isArray(token.tokens) && token.tokens.length === 1 && token.tokens[0].type === "link") {
      const link = token.tokens[0]
      const parsed = parseVideoUrl(link.href ?? "")
      if (parsed) {
        const title = escAttr((link.title ?? "").trim() || videoTitle || "Video")
        return `<figure class="video-embed"><div class="video-frame"><iframe src="${parsed.embedUrl}" loading="lazy" title="${title}" allow="${IFRAME_ALLOW}" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div></figure>\n`
      }
    }
    return `<p>${this.parser.parseInline(token.tokens)}</p>\n`
  }
  return renderer
}

/** Block markdown → HTML (GFM, single `\n` → `<br>`). */
export function renderMarkdown(md: string | null | undefined, opts: MarkdownOptions = {}): string {
  const { copyLabel = "Copy", copiedLabel = "Copied!", videoTitle = "" } = opts
  const renderer = buildRenderer(copyLabel, copiedLabel, videoTitle, true)
  return marked.parse(md ?? "", { renderer, gfm: true, breaks: true }) as string
}

/** Inline markdown → HTML without the outer `<p>`, for `<h1>`/`<span>`/card contexts. */
export function renderInline(md: string | null | undefined, opts: MarkdownOptions = {}): string {
  // Inline contexts never embed video — even a solo video URL stays a link.
  const { videoTitle: _ignored, ...rest } = opts
  const renderer = buildRenderer(rest.copyLabel ?? "Copy", rest.copiedLabel ?? "Copied!", "", false)
  const html = (marked.parse(md ?? "", { renderer, gfm: true, breaks: true }) as string).trim()
  const m = html.match(/^<p>([\s\S]*)<\/p>$/)
  return m ? m[1] : html
}

/** Markdown → plain text, for `<meta name="description">` so `**`/links never leak into SEO. */
export function stripMarkdown(md: string | null | undefined): string {
  return (md ?? "")
    .replace(/^[ \t]*https?:\/\/\S+[ \t]*$/gm, (line) => (parseVideoUrl(line.trim()) ? "" : line))
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
