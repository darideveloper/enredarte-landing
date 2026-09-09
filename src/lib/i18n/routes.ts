export const routes = {
  home: {
    en: "en",
    es: "",
  },
  "aviso-de-privacidad": {
    en: "en/aviso-de-privacidad",
    es: "aviso-de-privacidad",
  },
  "terminos-y-condiciones": {
    en: "en/terminos-y-condiciones",
    es: "terminos-y-condiciones",
  },
  "politica-de-cookies": {
    en: "en/politica-de-cookies",
    es: "politica-de-cookies",
  },
} as const

export type PageKey = keyof typeof routes
