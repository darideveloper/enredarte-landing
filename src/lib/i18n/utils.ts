import { ui, defaultLang } from "./ui"
import { routes } from "./routes"

export function getLangFromUrl(url: URL) {
  const [, firstSegment] = url.pathname.split("/")
  if (firstSegment === "es") return "es"
  return "en"
}

export function getLocalizedPath(pageKey: string, lang: keyof typeof ui) {
  const path = routes[pageKey as keyof typeof routes]?.[lang]
  return path === undefined ? "/" : `/${path}`
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
