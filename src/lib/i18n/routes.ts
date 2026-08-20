export const routes = {
  home: {
    en: "en",
    es: "",
  },
} as const

export type PageKey = keyof typeof routes
