import rss from "@astrojs/rss"
import type { APIRoute } from "astro"
import { buildRssFeed } from "@/lib/seo/rss"
import { BUSINESS_DATA } from "@/data/site-config"

export const GET: APIRoute = async (context) => {
  const feed = await buildRssFeed("es")
  // site may be undefined in some contexts; fall back to the business origin.
  const site = context.site ?? new URL(BUSINESS_DATA.url)
  return rss({
    title: feed.title,
    description: feed.description,
    site,
    items: feed.items,
  })
}