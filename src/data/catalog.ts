export type GroupKey =
  | "artist"
  | "discipline"
  | "technique"
  | "theme"
  | "format"
  | "scale"

export interface FilterOption {
  slug: string
  es: string
  en: string
}

export interface FilterGroup {
  key: GroupKey
  es: string
  en: string
  options: FilterOption[]
}

export interface Artwork {
  src: string
  alt: string
  title: string
  href: string
  meta?: string
  curator?: string
  artist: string
  discipline: string
  technique: string
  theme: string
  format: string
  scale: string
}

export const filterGroups: FilterGroup[] = [
  {
    key: "artist",
    es: "Por artista",
    en: "By artist",
    options: [
      { slug: "alvaro-macias", es: "Álvaro Macias", en: "Álvaro Macias" },
      { slug: "daniel-ortega", es: "Daniel Ortega", en: "Daniel Ortega" },
      { slug: "regina-ibarra", es: "Regina Ibarra", en: "Regina Ibarra" },
      { slug: "mariana-solis", es: "Mariana Solís", en: "Mariana Solís" },
      { slug: "artista-invitado", es: "Artista invitado", en: "Guest artist" },
    ],
  },
  {
    key: "discipline",
    es: "Por disciplina",
    en: "By discipline",
    options: [
      { slug: "pintura", es: "Pintura", en: "Painting" },
      { slug: "collage", es: "Collage", en: "Collage" },
      { slug: "ilustracion", es: "Ilustración", en: "Illustration" },
      { slug: "fotografia", es: "Fotografía", en: "Photography" },
      { slug: "escultura", es: "Escultura", en: "Sculpture" },
      { slug: "street-art", es: "Street Art", en: "Street Art" },
    ],
  },
  {
    key: "technique",
    es: "Por técnica",
    en: "By technique",
    options: [
      { slug: "acrilico", es: "Acrílico", en: "Acrylic" },
      { slug: "oleo", es: "Óleo", en: "Oil" },
      { slug: "acuarela", es: "Acuarela", en: "Watercolor" },
      { slug: "mixta", es: "Mixta", en: "Mixed media" },
      { slug: "tinta", es: "Tinta", en: "Ink" },
      { slug: "lapiz", es: "Lápiz", en: "Pencil" },
      { slug: "carboncillo", es: "Carboncillo", en: "Charcoal" },
    ],
  },
  {
    key: "theme",
    es: "Por temática",
    en: "By theme",
    options: [
      { slug: "naturaleza", es: "Naturaleza", en: "Nature" },
      { slug: "retrato", es: "Retrato", en: "Portrait" },
      { slug: "paisaje", es: "Paisaje", en: "Landscape" },
      { slug: "abstracto", es: "Abstracto", en: "Abstract" },
      { slug: "surrealismo", es: "Surrealismo", en: "Surrealism" },
      { slug: "urbano", es: "Urbano", en: "Urban" },
      { slug: "musica", es: "Música", en: "Music" },
      { slug: "cultura-popular", es: "Cultura popular", en: "Popular culture" },
      { slug: "identidad", es: "Identidad", en: "Identity" },
      { slug: "memoria", es: "Memoria", en: "Memory" },
      { slug: "nostalgia", es: "Nostalgia", en: "Nostalgia" },
      { slug: "feminismo", es: "Feminismo", en: "Feminism" },
      { slug: "ciencia-ficcion", es: "Ciencia ficción", en: "Science fiction" },
      { slug: "fantasia", es: "Fantasía", en: "Fantasy" },
      { slug: "minimalismo", es: "Minimalismo", en: "Minimalism" },
    ],
  },
  {
    key: "format",
    es: "Por tipo de pieza",
    en: "By piece type",
    options: [
      { slug: "obra-original", es: "Obra original", en: "Original work" },
      { slug: "edicion-limitada", es: "Edición limitada", en: "Limited edition" },
      { slug: "prints", es: "Prints", en: "Prints" },
      { slug: "series", es: "Series", en: "Series" },
      { slug: "esculturas", es: "Esculturas", en: "Sculptures" },
      { slug: "objetos", es: "Objetos", en: "Objects" },
    ],
  },
  {
    key: "scale",
    es: "Por tamaño",
    en: "By scale",
    options: [
      { slug: "mini-obras", es: "Mini obras", en: "Mini works" },
      { slug: "gran-formato", es: "Gran formato", en: "Large format" },
    ],
  },
]

export const artworks: Artwork[] = [
  {
    src: "/images/abstract-landscape-oil.jpg",
    alt: "Horizonte en tres tiempos",
    title: "Horizonte en tres tiempos",
    href: "#",
    meta: "Álvaro Macias",
    curator: "Consultar",
    artist: "alvaro-macias",
    discipline: "pintura",
    technique: "oleo",
    theme: "paisaje",
    format: "obra-original",
    scale: "gran-formato",
  },
  {
    src: "/images/painting-abstract-details.jpg",
    alt: "Raíz",
    title: "Raíz",
    href: "#",
    meta: "Daniel Ortega",
    curator: "Consultar",
    artist: "daniel-ortega",
    discipline: "pintura",
    technique: "acrilico",
    theme: "abstracto",
    format: "obra-original",
    scale: "mini-obras",
  },
  {
    src: "/images/cityscape-madrid-gran-via.jpg",
    alt: "Concreto y Memoria",
    title: "Concreto y Memoria",
    href: "#",
    meta: "Regina Ibarra",
    curator: "Consultar",
    artist: "regina-ibarra",
    discipline: "pintura",
    technique: "mixta",
    theme: "urbano",
    format: "obra-original",
    scale: "gran-formato",
  },
  {
    src: "/images/artist-street-exhibition.jpg",
    alt: "Costa Interior",
    title: "Costa Interior",
    href: "#",
    meta: "Mariana Solís",
    curator: "Consultar",
    artist: "mariana-solis",
    discipline: "pintura",
    technique: "oleo",
    theme: "paisaje",
    format: "obra-original",
    scale: "gran-formato",
  },
  {
    src: "/images/abstract-mosaic-woman.jpg",
    alt: "Sin título 04",
    title: "Sin título 04",
    href: "#",
    meta: "Artista invitado",
    curator: "Consultar",
    artist: "artista-invitado",
    discipline: "collage",
    technique: "mixta",
    theme: "abstracto",
    format: "obra-original",
    scale: "mini-obras",
  },
  {
    src: "/images/painting-cityline-reflections.jpg",
    alt: "Cempasúchil",
    title: "Cempasúchil",
    href: "#",
    meta: "Daniel Ortega",
    curator: "Consultar",
    artist: "daniel-ortega",
    discipline: "pintura",
    technique: "acrilico",
    theme: "naturaleza",
    format: "edicion-limitada",
    scale: "mini-obras",
  },
  {
    src: "/images/abstract-blue-acrylic-texture.jpg",
    alt: "Río Interior",
    title: "Río Interior",
    href: "#",
    meta: "Álvaro Macias",
    curator: "Consultar",
    artist: "alvaro-macias",
    discipline: "pintura",
    technique: "acrilico",
    theme: "abstracto",
    format: "obra-original",
    scale: "gran-formato",
  },
  {
    src: "/images/architecture-spiral-staircase.jpg",
    alt: "Trazo Urbano",
    title: "Trazo Urbano",
    href: "#",
    meta: "Regina Ibarra",
    curator: "Consultar",
    artist: "regina-ibarra",
    discipline: "fotografia",
    technique: "tinta",
    theme: "urbano",
    format: "prints",
    scale: "gran-formato",
  },
  {
    src: "/images/portrait-female-face-paint.jpg",
    alt: "Mirada",
    title: "Mirada",
    href: "#",
    meta: "Mariana Solís",
    curator: "Consultar",
    artist: "mariana-solis",
    discipline: "pintura",
    technique: "oleo",
    theme: "retrato",
    format: "obra-original",
    scale: "mini-obras",
  },
  {
    src: "/images/sculpture-female-face-plaster.jpg",
    alt: "Rostros del silencio",
    title: "Rostros del silencio",
    href: "#",
    meta: "Artista invitado",
    curator: "Consultar",
    artist: "artista-invitado",
    discipline: "escultura",
    technique: "mixta",
    theme: "identidad",
    format: "esculturas",
    scale: "gran-formato",
  },
  {
    src: "/images/street-dark-person-walking.jpg",
    alt: "Noche urbana",
    title: "Noche urbana",
    href: "#",
    meta: "Daniel Ortega",
    curator: "Consultar",
    artist: "daniel-ortega",
    discipline: "fotografia",
    technique: "tinta",
    theme: "urbano",
    format: "prints",
    scale: "mini-obras",
  },
  {
    src: "/images/abstract-colorful-canvas.jpg",
    alt: "Naturaleza viva",
    title: "Naturaleza viva",
    href: "#",
    meta: "Álvaro Macias",
    curator: "Consultar",
    artist: "alvaro-macias",
    discipline: "pintura",
    technique: "acrilico",
    theme: "naturaleza",
    format: "obra-original",
    scale: "gran-formato",
  },
  {
    src: "/images/abstract-watercolor-beige.jpg",
    alt: "Acuarela del mar",
    title: "Acuarela del mar",
    href: "#",
    meta: "Regina Ibarra",
    curator: "Consultar",
    artist: "regina-ibarra",
    discipline: "pintura",
    technique: "acuarela",
    theme: "paisaje",
    format: "obra-original",
    scale: "mini-obras",
  },
  {
    src: "/images/collage-lips-silence.jpg",
    alt: "Memoria en capas",
    title: "Memoria en capas",
    href: "#",
    meta: "Mariana Solís",
    curator: "Consultar",
    artist: "mariana-solis",
    discipline: "collage",
    technique: "mixta",
    theme: "memoria",
    format: "obra-original",
    scale: "mini-obras",
  },
  {
    src: "/images/surreal-woman-binoculars.jpg",
    alt: "Sueño surreal",
    title: "Sueño surreal",
    href: "#",
    meta: "Artista invitado",
    curator: "Consultar",
    artist: "artista-invitado",
    discipline: "pintura",
    technique: "oleo",
    theme: "surrealismo",
    format: "obra-original",
    scale: "gran-formato",
  },
  {
    src: "/images/vibrant-neon-abstract.jpg",
    alt: "Neón interior",
    title: "Neón interior",
    href: "#",
    meta: "Daniel Ortega",
    curator: "Consultar",
    artist: "daniel-ortega",
    discipline: "pintura",
    technique: "acrilico",
    theme: "abstracto",
    format: "edicion-limitada",
    scale: "mini-obras",
  },
]
