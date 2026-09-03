import { ui, defaultLang } from "@/lib/i18n/ui"
import { routes, type PageKey } from "@/lib/i18n/routes"
import type { Lang, Translations } from "@/lib/api/types"

export function getLangFromUrl(url: URL) {
  const [, firstSegment] = url.pathname.split("/")
  if (firstSegment === "en") return "en"
  return "es"
}

export function getLocalizedPath(pageKey: string, lang: keyof typeof ui) {
  const path = routes[pageKey as keyof typeof routes]?.[lang]
  return path === undefined ? "/" : `/${path}`
}

export function getLocalizedSalaPath(slug: string, lang: keyof typeof ui) {
  return lang === "en" ? `/en/salas/${slug}` : `/salas/${slug}`
}

export function getLocalizedArtworkPath(slug: string, lang: keyof typeof ui) {
  return lang === "en" ? `/en/obras/${slug}` : `/obras/${slug}`
}

export function getLocalizedArtistPath(slug: string, lang: keyof typeof ui) {
  return lang === "en" ? `/en/artistas/${slug}` : `/artistas/${slug}`
}

export function getLocalizedBlogPath(lang: keyof typeof ui) {
  return lang === "en" ? "/en/blog" : "/blog"
}

export function getLocalizedBlogPagePath(page: number, lang: keyof typeof ui) {
  if (page <= 1) return getLocalizedBlogPath(lang)
  return lang === "en" ? `/en/blog/page/${page}` : `/blog/page/${page}`
}

export function getLocalizedPostPath(slug: string, lang: keyof typeof ui) {
  return lang === "en" ? `/en/blog/${slug}` : `/blog/${slug}`
}

export function pickTranslation<T extends Record<string, string>>(
  translations: Translations<T> | undefined,
  lang: Lang,
  field: keyof T,
): string {
  const direct = translations?.[lang]?.[field]
  if (direct != null && direct !== "") return direct
  const fallback = translations?.[lang === "es" ? "en" : "es"]?.[field]
  if (fallback != null && fallback !== "") return fallback
  return ""
}

export function getPageKeyFromUrl(url: URL): PageKey {
  const lang = getLangFromUrl(url)
  const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/$/, "") : url.pathname
  const keys = Object.keys(routes) as PageKey[]
  for (const key of keys) {
    if (getLocalizedPath(key, lang) === pathname) return key
  }
  return "home"
}

export function getTranslations(lang: keyof typeof ui) {
  return function t(key: string, vars?: Record<string, string>) {
    const keys = key.split(".")
    let value: any = ui[lang]
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
    if (value === undefined) {
      let fallbackValue: any = ui[defaultLang]
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k]
        if (fallbackValue === undefined) break
      }
      value = fallbackValue
      if (value === undefined && import.meta.env.DEV) {
        console.error(`[i18n] Missing translation key: "${key}"`)
        return `MISSING: ${key}`
      }
    }
    if (typeof value === "string" && vars) {
      Object.entries(vars).forEach(([k, v]) => {
        value = value!.replace(new RegExp(`{${k}}`, "g"), v)
      })
    }
    return value
  }
}
