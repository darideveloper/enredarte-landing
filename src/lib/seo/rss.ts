import { fetchAll } from "@/lib/api/pagination"
import { list as listPosts, pickPostField } from "@/lib/api/posts"
import { getLocalizedPostPath } from "@/lib/i18n/utils"
import type { Lang } from "@/lib/api/types"

const feedCopy: Record<Lang, { title: string; description: string }> = {
  es: {
    title: "Revista EnredArte",
    description: "Novedades, salas, artistas y obra del universo EnredArte.",
  },
  en: {
    title: "EnredArte Journal",
    description: "News, galleries, artists and artworks from the EnredArte universe.",
  },
}

export interface BuiltFeed {
  title: string
  description: string
  items: {
    title: string
    description: string
    link: string
    pubDate: Date
    author: string
  }[]
}

// Build a localized RSS feed of published posts. Reuses the blog fetch; a
// FetchError propagates and fails the build loudly (consistent with the blog
// build contract, no silent fallback).
export async function buildRssFeed(lang: Lang): Promise<BuiltFeed> {
  const allPosts = await fetchAll(listPosts)
  const published = allPosts.filter((p) => p.published_at != null)
  const items = published.map((post) => ({
    title: pickPostField(post, lang, "title"),
    description: pickPostField(post, lang, "description"),
    link: getLocalizedPostPath(post.slug, lang),
    pubDate: new Date(post.published_at!),
    author: post.author,
  }))
  const copy = feedCopy[lang]
  return { title: copy.title, description: copy.description, items }
}