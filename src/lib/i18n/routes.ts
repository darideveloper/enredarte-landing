export const routes = {
  home: {
    en: "",
    es: "es",
  },
} as const

export type PageKey = keyof typeof routes
