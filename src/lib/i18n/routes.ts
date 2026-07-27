export const routes = {
  home: {
    en: "",
    es: "es",
  },
  services: {
    en: "services",
    es: "es/servicios",
  },
  about: {
    en: "about",
    es: "es/sobre-nosotros",
  },
} as const

export type PageKey = keyof typeof routes
