import { getLocalizedPath, getTranslations } from "@/lib/i18n/utils"
import { ui } from "@/lib/i18n/ui"

export function getNavLinks(lang: keyof typeof ui) {
  const t = getTranslations(lang)
  return [
    { label: t("global.nav.home"), href: getLocalizedPath("home", lang) },
    { label: t("global.nav.obras"), href: "#artworks-collection" },
    { label: t("global.nav.salas"), href: "#salas-gallery" },
    { label: t("global.nav.artistas"), href: "#artworks-collection" },
  ]
}
