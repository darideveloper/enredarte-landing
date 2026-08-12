import type { Artwork } from "@/data/catalog"
import { artworks } from "@/data/catalog"
import type { ArtCurator, Gallery, Lang, LocalizedText } from "@/lib/api/types"
import { getLocalizedSalaPath, getTranslations } from "@/lib/i18n/utils"

export interface GalleryData extends Gallery {
  artworks: Artwork[]
  meta: LocalizedText
}

const alvaroMacias: ArtCurator = {
  slug: "alvaro-macias",
  name: "Álvaro Macias",
  email: "alvaro@enredarte.com",
  website: "https://alvaromacias.example",
  photo: "/images/artist-working-studio-01.jpg",
  bio: {
    es: "Artista y curador mexicano. Su práctica explora la memoria del paisaje entre Los Cabos y Guadalajara.",
    en: "Mexican artist and curator whose practice explores the memory of landscape between Los Cabos and Guadalajara.",
  },
  translations: [
    {
      language: "es",
      bio: "Artista y curador mexicano. Su práctica explora la memoria del paisaje entre Los Cabos y Guadalajara.",
    },
    {
      language: "en",
      bio: "Mexican artist and curator whose practice explores the memory of landscape between Los Cabos and Guadalajara.",
    },
  ],
}

const reginaIbarra: ArtCurator = {
  slug: "regina-ibarra",
  name: "Regina Ibarra",
  email: "regina@enredarte.com",
  website: "https://reginaibarra.example",
  photo: "/images/portrait-woman-silhouette-hat.jpg",
  bio: {
    es: "Curadora independiente enfocada en arte urbano y nuevas narrativas de la ciudad.",
    en: "Independent curator focused on urban art and new narratives of the city.",
  },
  translations: [
    { language: "es", bio: "Curadora independiente enfocada en arte urbano y nuevas narrativas de la ciudad." },
    { language: "en", bio: "Independent curator focused on urban art and new narratives of the city." },
  ],
}

const danielOrtega: ArtCurator = {
  slug: "daniel-ortega",
  name: "Daniel Ortega",
  email: "daniel@enredarte.com",
  website: "https://danielortega.example",
  photo: "/images/artist-working-studio-02.jpg",
  bio: {
    es: "Artista y curador cuya obra dialoga entre la abstracción y la naturaleza.",
    en: "Artist and curator whose work dialogues between abstraction and nature.",
  },
  translations: [
    { language: "es", bio: "Artista y curador cuya obra dialoga entre la abstracción y la naturaleza." },
    { language: "en", bio: "Artist and curator whose work dialogues between abstraction and nature." },
  ],
}

const marianaSolis: ArtCurator = {
  slug: "mariana-solis",
  name: "Mariana Solís",
  email: "mariana@enredarte.com",
  website: "https://marianasolis.example",
  photo: "/images/portrait-female-face-paint.jpg",
  bio: {
    es: "Curadora y gestora cultural con foco en la plástica contemporánea oaxaqueña.",
    en: "Curator and cultural manager focused on contemporary Oaxacan visual arts.",
  },
  translations: [
    { language: "es", bio: "Curadora y gestora cultural con foco en la plástica contemporánea oaxaqueña." },
    { language: "en", bio: "Curator and cultural manager focused on contemporary Oaxacan visual arts." },
  ],
}

const bySlug = new Map(artworks.map((a) => [a.slug, a]))

function resolveArtworks(slugs: string[]): Artwork[] {
  return slugs.map((s) => bySlug.get(s)).filter((a): a is Artwork => a != null)
}

export const galleries: GalleryData[] = [
  {
    slug: "tierra-mundo-y-memoria",
    logo: "/images/abstract-landscape-oil.jpg",
    sortOrder: 1,
    status: "active",
    name: { es: "Tierra, Mundo y Memoria", en: "Earth, World and Memory" },
    description: {
      es: "Seis artistas contemporáneos exploran el paisaje mexicano como archivo emocional — de los murales urbanos de Guadalajara a la abstracción costera de Los Cabos.",
      en: "Six contemporary artists explore the Mexican landscape as an emotional archive — from the urban murals of Guadalajara to the coastal abstraction of Los Cabos.",
    },
    curator: alvaroMacias,
    meta: { es: "6 Artistas · Los Cabos / GDL", en: "6 Artists · Los Cabos / GDL" },
    artworks: resolveArtworks([
      "horizonte-en-tres-tiempos",
      "costa-interior",
      "rio-interior",
      "naturaleza-viva",
    ]),
  },
  {
    slug: "plastica-oaxaquena",
    logo: "/images/painting-abstract-details.jpg",
    sortOrder: 2,
    status: "active",
    name: { es: "Plástica Oaxaqueña", en: "Oaxacan Visual Arts" },
    description: {
      es: "Una mirada a la plástica contemporánea de Oaxaca, donde la técnica y la materia dialogan con la tradición.",
      en: "A look at the contemporary visual arts of Oaxaca, where technique and material dialogue with tradition.",
    },
    curator: marianaSolis,
    meta: { es: "4 Artistas · Oaxaca", en: "4 Artists · Oaxaca" },
    artworks: resolveArtworks(["raiz", "cempasuchil", "mirada"]),
  },
  {
    slug: "nuevas-voces-cdmx",
    logo: "/images/cityscape-madrid-gran-via.jpg",
    sortOrder: 3,
    status: "active",
    name: { es: "Nuevas Voces CDMX", en: "New Voices CDMX" },
    description: {
      es: "Nuevas voces de la Ciudad de México que retratan lo urbano, la identidad y la memoria a través de la fotografía y la pintura.",
      en: "New voices from Mexico City portraying the urban, identity and memory through photography and painting.",
    },
    curator: danielOrtega,
    meta: { es: "5 Artistas · Ciudad de México", en: "5 Artists · Mexico City" },
    artworks: resolveArtworks(["concreto-y-memoria", "trazo-urbano", "noche-urbana"]),
  },
  {
    slug: "san-miguel-de-allende",
    logo: "/images/artist-street-exhibition.jpg",
    sortOrder: 4,
    status: "upcoming",
    name: { es: "San Miguel de Allende", en: "San Miguel de Allende" },
    description: {
      es: "Territorios, identidad y surrealismo desde el altiplano guanajuatense. Próximamente.",
      en: "Territories, identity and surrealism from the highlands of Guanajuato. Coming soon.",
    },
    curator: reginaIbarra,
    meta: { es: "Territorios · Guanajuato", en: "Territories · Guanajuato" },
    artworks: resolveArtworks(["sin-titulo-04", "sueno-surreal", "acuarela-del-mar"]),
  },
  {
    slug: "puerto-vallarta",
    logo: "/images/abstract-mosaic-woman.jpg",
    sortOrder: 5,
    status: "upcoming",
    name: { es: "Puerto Vallarta", en: "Puerto Vallarta" },
    description: {
      es: "Una sala dedicada al territorio de Álvaro Macias en la costa del Pacífico. Próximamente.",
      en: "A room dedicated to Álvaro Macias' territory on the Pacific coast. Coming soon.",
    },
    curator: alvaroMacias,
    meta: { es: "Territorio de Álvaro", en: "Álvaro's Territory" },
    artworks: resolveArtworks(["rostros-del-silencio", "memoria-en-capas", "neon-interior"]),
  },
]

export function getSalasData(lang: Lang) {
  const t = getTranslations(lang)
  return galleries.map((gallery) => ({
    src: gallery.logo,
    alt: gallery.name[lang],
    title: gallery.name[lang],
    href: getLocalizedSalaPath(gallery.slug, lang),
    isLarge: gallery.sortOrder === 1,
    subtitle: `${t("global.gallery.sala")} ${String(gallery.sortOrder).padStart(2, "0")} · ${t(
      gallery.status === "active" ? "global.gallery.active" : "global.gallery.upcoming"
    )}`,
    meta: gallery.meta[lang],
    curator: `${t("global.gallery.curatorship")}: ${gallery.curator.name}`,
  }))
}
