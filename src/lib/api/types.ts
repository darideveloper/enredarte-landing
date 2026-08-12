// Shared API response types — populate per endpoint

export type Lang = "es" | "en"

export interface LocalizedText {
  es: string
  en: string
}

// Translation record types (backend-faithful: one record per language)
export interface GalleryTranslation {
  language: Lang
  name: string
  description: string
}

export interface ArtCuratorTranslation {
  language: Lang
  bio: string
}

// Join record: artwork ↔ gallery with sort order
export interface ArtworkGallery {
  artwork_slug: string
  gallery_slug: string
  sort_order: number
}

// Composite response types consumed by pages/components
export interface ArtCurator {
  slug: string
  name: string
  email: string
  website: string
  photo: string
  bio: LocalizedText
  translations: ArtCuratorTranslation[]
}

export interface Gallery {
  slug: string
  logo: string
  sortOrder: number
  status: "active" | "upcoming"
  name: LocalizedText
  description: LocalizedText
  curator: ArtCurator
}
