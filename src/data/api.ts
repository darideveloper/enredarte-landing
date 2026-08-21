import { fetchAll } from "@/lib/api/pagination"
import { list as listArtCurators } from "@/lib/api/art-curators"
import { list as listArtists } from "@/lib/api/artists"
import { list as listDisciplines } from "@/lib/api/disciplines"
import { list as listFormats } from "@/lib/api/formats"
import { list as listGalleries } from "@/lib/api/galleries"
import { list as listScales } from "@/lib/api/scales"
import { list as listTechniques } from "@/lib/api/techniques"
import { list as listThemes } from "@/lib/api/themes"
import { list as listArtworks } from "@/lib/api/artworks"
import { getLocalizedSalaPath, getTranslations, pickTranslation } from "@/lib/i18n/utils"
import type { Lang } from "@/lib/api/types"
import type {
  Artwork,
  ArtCurator,
  Artist,
  Discipline,
  Format,
  Gallery,
  Ref,
  Scale,
  Technique,
  Theme,
} from "@/lib/api/types"
import type { GroupKey } from "@/store/catalog"

export interface FilterOption {
  value: string
  label: { es: string; en: string }
}

export interface FilterGroup {
  key: GroupKey
  label: { es: string; en: string }
  options: FilterOption[]
}

export interface SiteData {
  galleries: Gallery[]
  artists: Artist[]
  curators: ArtCurator[]
  artworks: Artwork[]
  filterGroups: FilterGroup[]
}

const GROUP_LABELS: Record<GroupKey, { es: string; en: string }> = {
  artist: { es: "Por artista", en: "By artist" },
  discipline: { es: "Por disciplina", en: "By discipline" },
  technique: { es: "Por técnica", en: "By technique" },
  theme: { es: "Por temática", en: "By theme" },
  format: { es: "Por tipo de pieza", en: "By piece type" },
  scale: { es: "Por tamaño", en: "By scale" },
}

function taxonomyLabel(
  translations: Partial<Record<Lang, { name: string }>>,
  slug: string,
): { es: string; en: string } {
  return {
    es: pickTranslation(translations, "es", "name") || slug,
    en: pickTranslation(translations, "en", "name") || slug,
  }
}

interface BuildFilterGroupsInput {
  artists: Artist[]
  disciplines: Discipline[]
  techniques: Technique[]
  themes: Theme[]
  formats: Format[]
  scales: Scale[]
}

function buildFilterGroups({
  artists,
  disciplines,
  techniques,
  themes,
  formats,
  scales,
}: BuildFilterGroupsInput): FilterGroup[] {
  return [
    {
      key: "artist",
      label: GROUP_LABELS.artist,
      options: artists.map((artist) => ({
        value: artist.slug,
        label: { es: artist.name, en: artist.name },
      })),
    },
    {
      key: "discipline",
      label: GROUP_LABELS.discipline,
      options: disciplines.map((d) => ({ value: d.slug, label: taxonomyLabel(d.translations, d.slug) })),
    },
    {
      key: "technique",
      label: GROUP_LABELS.technique,
      options: techniques.map((t) => ({ value: t.slug, label: taxonomyLabel(t.translations, t.slug) })),
    },
    {
      key: "theme",
      label: GROUP_LABELS.theme,
      options: themes.map((t) => ({ value: t.slug, label: taxonomyLabel(t.translations, t.slug) })),
    },
    {
      key: "format",
      label: GROUP_LABELS.format,
      options: formats.map((f) => ({ value: f.slug, label: taxonomyLabel(f.translations, f.slug) })),
    },
    {
      key: "scale",
      label: GROUP_LABELS.scale,
      options: scales.map((s) => ({ value: s.slug, label: taxonomyLabel(s.translations, s.slug) })),
    },
  ]
}

export async function buildSiteData(): Promise<SiteData> {
  const [galleries, artists, curators, artworks, disciplines, techniques, themes, formats, scales] =
    await Promise.all([
      fetchAll(listGalleries),
      fetchAll(listArtists),
      fetchAll(listArtCurators),
      fetchAll(listArtworks),
      fetchAll(listDisciplines),
      fetchAll(listTechniques),
      fetchAll(listThemes),
      fetchAll(listFormats),
      fetchAll(listScales),
    ])

  return {
    galleries,
    artists,
    curators,
    artworks,
    filterGroups: buildFilterGroups({ artists, disciplines, techniques, themes, formats, scales }),
  }
}

export function resolveArtistName(ref: Ref | null, artists: Artist[]): string {
  if (!ref) return ""
  return artists.find((artist) => artist.id === ref.id)?.name ?? ref.slug
}

export function resolveGalleryCurator(gallery: Gallery, curators: ArtCurator[]): ArtCurator | null {
  if (!gallery.curator) return null
  return curators.find((curator) => curator.id === gallery.curator!.id) ?? null
}

export function resolveGalleryArtworks(gallery: Gallery, artworks: Artwork[]): Artwork[] {
  const bySlug = new Map(artworks.map((artwork) => [artwork.slug, artwork]))
  return gallery.artwork_links
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((link) => bySlug.get(link.artwork.slug))
    .filter((artwork): artwork is Artwork => artwork != null)
}

function primaryImage(artwork: Artwork | undefined): string {
  if (!artwork) return ""
  const image = artwork.images.find((img) => img.is_primary) ?? artwork.images[0]
  return image?.image ?? ""
}

export interface ArtworkView {
  slug: string
  src: string
  alt: string
  title: string
  href: string
  meta: string
  price?: string
  artist: string[]
  discipline: string[]
  technique: string[]
  theme: string[]
  format: string[]
  scale: string[]
}

export function toArtworkView(
  artwork: Artwork,
  artistName: string,
  lang: Lang,
  filterGroups: FilterGroup[],
): ArtworkView {
  const slugs = (refs: Ref[]) => refs.map((ref) => ref.slug)
  const title = pickTranslation(artwork.translations, lang, "title") || artwork.slug
  const image = artwork.images.find((img) => img.is_primary) ?? artwork.images[0]
  const alt = image ? (lang === "es" ? image.alt_es : image.alt_en) || title : title
  const price =
    artwork.price_usd > 0 ? `$${artwork.price_usd.toLocaleString("en-US")} USD` : undefined

  return {
    slug: artwork.slug,
    src: image?.image ?? "",
    alt,
    title,
    href: "#",
    meta: artistName,
    price,
    artist: [artwork.artist.slug],
    discipline: slugs(artwork.disciplines),
    technique: slugs(artwork.techniques),
    theme: slugs(artwork.themes),
    format: slugs(artwork.formats),
    scale: slugs(artwork.scales),
  }
}

export function getFacetLabel(
  key: GroupKey,
  slug: string,
  lang: Lang,
  groups: FilterGroup[],
): string {
  const group = groups.find((g) => g.key === key)
  return group?.options.find((option) => option.value === slug)?.label[lang] ?? slug
}

export interface SalaView {
  src: string
  alt: string
  title: string
  href: string
  isLarge: boolean
  subtitle: string
  meta: string
  curator?: string
}

export interface HeroArtworkView {
  src: string
  alt: string
  title: string
  artist: string
  price?: string
  href: string
}

export interface HeroView {
  salaNumber: string
  title: string
  description: string
  curator: string
  galleryHref: string
  artwork: HeroArtworkView
}

export function toSalaView(
  gallery: Gallery,
  curators: ArtCurator[],
  artworks: Artwork[],
  lang: Lang,
  index: number,
): SalaView {
  const t = getTranslations(lang)
  const name = pickTranslation(gallery.translations, lang, "name") || gallery.slug
  const curator = resolveGalleryCurator(gallery, curators)
  const galleryArtworks = resolveGalleryArtworks(gallery, artworks)
  const src = gallery.logo ?? primaryImage(galleryArtworks[0])

  return {
    src,
    alt: name,
    title: name,
    href: getLocalizedSalaPath(gallery.slug, lang),
    isLarge: index === 0,
    subtitle: `${t("global.gallery.sala")} ${String(index + 1).padStart(2, "0")}`,
    meta: t(
      galleryArtworks.length === 1 ? "global.gallery.workCount" : "global.gallery.worksCount",
      { count: String(galleryArtworks.length) },
    ),
    curator: curator ? `${t("global.gallery.curatorship")}: ${curator.name}` : undefined,
  }
}

function resolvePrimaryGallery(galleries: Gallery[]): { gallery: Gallery; index: number } {
  const primaryIndex = galleries.findIndex((g) => g.is_primary)
  const index = primaryIndex >= 0 ? primaryIndex : 0
  return { gallery: galleries[index], index }
}

export function toHeroView(
  galleries: Gallery[],
  curators: ArtCurator[],
  artworks: Artwork[],
  artists: Artist[],
  lang: Lang,
): HeroView {
  const { gallery, index } = resolvePrimaryGallery(galleries)
  const title = pickTranslation(gallery.translations, lang, "name") || gallery.slug
  const description = pickTranslation(gallery.translations, lang, "description") || ""

  const curator = resolveGalleryCurator(gallery, curators)
  const curatorName = curator ? curator.name : ""

  const galleryArtworks = resolveGalleryArtworks(gallery, artworks)
  const artwork = galleryArtworks[0]
  const artworkImage = artwork?.images.find((img) => img.is_primary) ?? artwork?.images[0]
  const artworkAlt = artworkImage
    ? (lang === "es" ? artworkImage.alt_es : artworkImage.alt_en) || title
    : title
  const artworkTitle = artwork ? pickTranslation(artwork.translations, lang, "title") || artwork.slug : ""
  const artworkArtist = artwork ? resolveArtistName(artwork.artist, artists) : ""

  return {
    salaNumber: String(index + 1).padStart(2, "0"),
    title,
    description,
    curator: curatorName,
    galleryHref: getLocalizedSalaPath(gallery.slug, lang),
    artwork: {
      src: primaryImage(artwork),
      alt: artworkAlt,
      title: artworkTitle,
      artist: artworkArtist,
      price:
        artwork && artwork.price_usd > 0
          ? `$${artwork.price_usd.toLocaleString("en-US")} USD`
          : undefined,
      href: getLocalizedSalaPath(gallery.slug, lang),
    },
  }
}
