import { getImage } from "astro:assets"

// Shared responsive-image slots (optimize-ssg-images).
// `sizes` MUST match the rendered CSS slot or the browser picks wrong bytes:
// small cards 25-33vw, half rows 50vw, full-bleed heroes 100vw.
// Quality floor per user decision: max compression (AVIF ~55 / WebP ~78)
// with curator QA on fine-art detail.

export const AVIF_QUALITY = 55
export const WEBP_QUALITY = 78

export interface ImageSlot {
  widths: number[]
  sizes: string
}

export const IMAGE_SLOTS = {
  /** 4-col card grid (home): 100vw → 50vw → 25vw */
  grid: { widths: [400, 800, 1200], sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" },
  /** 3-col card grid (indexes, curator salas): 100vw → 50vw → 33vw */
  grid3: { widths: [400, 800, 1200], sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" },
  /** Large/featured card (gallery isLarge, featured post): ~60-66vw on md/lg */
  gridLarge: { widths: [640, 1080, 1600], sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw" },
  /** Featured card spanning 2 of 3 cols (blog featured post) */
  featured: { widths: [640, 1080, 1600], sizes: "(max-width: 1024px) 100vw, 66vw" },
  /** Half-width row (ImageRowCard immersive): stacks → 50vw */
  row: { widths: [640, 1080, 1600], sizes: "(max-width: 768px) 100vw, 50vw" },
  /** Home hero banner (~51vw on lg, full-bleed below) */
  hero: { widths: [960, 1600, 2400], sizes: "(max-width: 1024px) 100vw, 51vw" },
  /** Full-bleed hero (gallery page, blog post): always 100vw */
  heroFull: { widths: [960, 1600, 2400], sizes: "100vw" },
  /** Artwork viewer (info panel 380-420px on lg, full-bleed below) */
  viewer: { widths: [960, 1600, 2400], sizes: "(max-width: 1024px) 100vw, calc(100vw - 400px)" },
  /** Fixed portrait column (artist/curator ~360px, full-bleed stacked) */
  portrait: { widths: [360, 720, 1080], sizes: "(max-width: 1024px) 100vw, 360px" },
  /** Header logo (h-14 ≈ 56px tall, ~180px wide) at 1x/2x/3x */
  logo: { widths: [180, 360, 540], sizes: "180px" },
} satisfies Record<string, ImageSlot>

export type ImageSlotName = keyof typeof IMAGE_SLOTS

export interface LcpPreload {
  srcSet: string
  sizes: string
}

/**
 * Build a responsive preload set for an LCP URL with the same transform
 * the Image atom applies, so the preloaded bytes match the rendered variant
 * (no double-download). Returns null when the remote cannot be transformed —
 * callers fall back to a plain `href` preload of the verbatim URL.
 */
export async function lcpPreload(src: string, slot: ImageSlot): Promise<LcpPreload | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const img = await getImage({
        src,
        inferSize: true,
        widths: slot.widths,
        format: "avif",
        quality: AVIF_QUALITY,
      })
      const srcSet = img.srcSet.attribute
      if (!srcSet) return null
      return { srcSet, sizes: slot.sizes }
    } catch {
      // Transient remote-fetch flake under build concurrency — retry with
      // backoff, then fall back to the plain `href` preload in Layout.
      if (attempt < 3) await new Promise((r) => setTimeout(r, 250 * (attempt + 1)))
    }
  }
  return null
}
