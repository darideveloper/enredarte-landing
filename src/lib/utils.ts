export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

export function stripUrlScheme(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}
