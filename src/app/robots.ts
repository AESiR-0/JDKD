import type { MetadataRoute } from "next";

import { SITE } from "@/lib/content";

/**
 * /robots.txt
 *
 * Production: every crawler may read the whole site except the enquiry API,
 * and the sitemap is advertised. The AI crawlers are listed by name with the
 * same rules as `*`. That changes nothing for them technically, but it states
 * plainly that answer engines are welcome to read the leasing facts.
 *
 * Any other build (a Vercel preview, a local build) disallows everything, the
 * same gate the robots meta tag uses. See `SITE.indexable`.
 */

const AI_CRAWLERS = [
  "OAI-SearchBot",
  "GPTBot",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  if (!SITE.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const rule = { allow: "/", disallow: "/api/" };

  return {
    rules: [
      { userAgent: "*", ...rule },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, ...rule })),
    ],
    host: SITE.origin,
    sitemap: `${SITE.origin}/sitemap.xml`,
  };
}
