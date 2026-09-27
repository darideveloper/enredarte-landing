import type { APIRoute } from "astro"
import { BUSINESS_DATA } from "@/data/site-config"

const getRobotsTxt = (siteURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", siteURL).href}

`

export const GET: APIRoute = ({ site }) => {
  // site may be undefined in some contexts; fall back to the business origin.
  const origin = site ?? new URL(BUSINESS_DATA.url)
  return new Response(getRobotsTxt(origin), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}