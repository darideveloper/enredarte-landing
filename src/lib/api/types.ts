export type Lang = "es" | "en"

export interface Base {
  id: number
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Relation reference — mirrors the backend RefSerializer ({id, slug})
export interface Ref {
  id: number
  slug: string
}

// Language-keyed translation dictionary — mirrors _build_translation_dict
export type Translations<T> = Partial<Record<Lang, T>>

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  page: number
  page_size: number
  total_pages: number
  results: T[]
}

export interface ApiError {
  status: string
  message: string
  data: Record<string, unknown>
}

export interface ListParams {
  page?: number
  page_size?: number
}

export interface SocialLink {
  id: number
  platform: string
  url: string
}

export interface Artist extends Base {
  name: string
  email: string | null
  website: string | null
  photo: string | null
  birth_year: number | null
  death_year: number | null
  location: Ref | null
  translations: Translations<{ bio: string }>
  social_links: SocialLink[]
}

export interface ArtCurator extends Base {
  name: string
  email: string | null
  website: string | null
  photo: string | null
  translations: Translations<{ bio: string }>
}

export interface Location extends Base {
  translations: Translations<{ name: string }>
}

export interface ArtworkLink {
  id: number
  artwork: Ref
  sort_order: number
}

export interface Gallery extends Base {
  logo: string | null
  curator: Ref | null
  is_primary: boolean
  translations: Translations<{ name: string; description: string }>
  artwork_links: ArtworkLink[]
}

export interface Discipline extends Base {
  translations: Translations<{ name: string }>
}

export interface Technique extends Base {
  translations: Translations<{ name: string }>
}

export interface Theme extends Base {
  translations: Translations<{ name: string }>
}

export interface Format extends Base {
  translations: Translations<{ name: string }>
}

export interface Scale extends Base {
  translations: Translations<{ name: string }>
}

export type ArtworkStatus = "available" | "reserved" | "sold"

export interface ArtworkImage {
  id: number
  image: string
  alt_es: string
  alt_en: string
  is_primary: boolean
  sort_order: number
}

export interface GalleryLink {
  id: number
  gallery: Ref
  sort_order: number
}

export interface Artwork extends Base {
  artist: Ref
  year: number | null
  dimensions: string | null
  disciplines: Ref[]
  techniques: Ref[]
  themes: Ref[]
  formats: Ref[]
  scales: Ref[]
  price_mxn: number
  price_usd: number
  status: ArtworkStatus
  is_highlighted: boolean
  views_count: number
  translations: Translations<{ title: string; description: string }>
  images: ArtworkImage[]
  gallery_links: GalleryLink[]
}

export interface PostSummary {
  id: number
  slug: string
  author: string
  banner_image: string | null
  published_at: string | null
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  keywords_es: string
  keywords_en: string
}

export interface Post extends PostSummary {
  content_es: string
  content_en: string
}
