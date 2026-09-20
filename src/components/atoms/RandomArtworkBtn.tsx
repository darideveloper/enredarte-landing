import { getLocalizedArtworkPath } from "@/lib/i18n/utils"
import type { Lang } from "@/lib/api/types"

export interface RandomArtworkBtnProps {
  slugs: string[]
  lang: Lang
  label: string
  currentSlug?: string
}

/**
 * Uniform random pick from `slugs`, excluding `currentSlug` when known.
 * Returns undefined when no destination exists (exported for verification).
 */
export function pickRandom(slugs: string[], currentSlug?: string): string | undefined {
  const candidates =
    currentSlug != null ? slugs.filter((slug) => slug !== currentSlug) : slugs
  if (candidates.length === 0) return undefined
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function RandomArtworkBtn({ slugs, lang, label, currentSlug }: RandomArtworkBtnProps) {
  const candidates =
    currentSlug != null ? slugs.filter((slug) => slug !== currentSlug) : slugs
  if (candidates.length === 0) return null

  const handleClick = () => {
    const pick = pickRandom(slugs, currentSlug)
    if (pick) window.location.assign(getLocalizedArtworkPath(pick, lang))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="cursor-pointer border border-crimson bg-transparent px-[18px] py-[9px] text-[11px] uppercase tracking-[0.1em] text-paper transition-colors hover:bg-crimson"
    >
      {label}
    </button>
  )
}
