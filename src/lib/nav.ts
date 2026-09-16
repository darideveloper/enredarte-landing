import { getLocalizedBlogPath, getLocalizedPath, getTranslations } from "@/lib/i18n/utils"
import { ui } from "@/lib/i18n/ui"

export function getNavLinks(lang: keyof typeof ui) {
  const t = getTranslations(lang)
  return [
    { label: t("global.nav.obras"), href: getLocalizedPath("obras", lang) },
    { label: t("global.nav.salas"), href: getLocalizedPath("salas", lang) },
    { label: t("global.nav.blog"), href: getLocalizedBlogPath(lang) },
    { label: t("global.nav.artistas"), href: getLocalizedPath("artistas", lang) },
    { label: t("global.nav.curadores"), href: getLocalizedPath("curadores", lang) },
  ]
}
