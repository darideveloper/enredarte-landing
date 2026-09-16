export const routes = {
  home: {
    en: "en",
    es: "",
  },
  obras: {
    en: "en/obras",
    es: "obras",
  },
  salas: {
    en: "en/salas",
    es: "salas",
  },
  artistas: {
    en: "en/artistas",
    es: "artistas",
  },
  curadores: {
    en: "en/curadores",
    es: "curadores",
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
