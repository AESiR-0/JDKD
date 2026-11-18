import type { MetadataRoute } from "next";

import { PROJECTS, ROUTES, SITE, projectPath } from "@/lib/content";

/**
 * /sitemap.xml
 *
 * Every indexable route: the four top-level pages and one detail page per
 * project. Built from the same route table and project list the pages read,
 * so a new project lands here without being retyped.
 *
 * No `lastModified`, `changeFrequency` or `priority`. The site has no
 * per-page edit dates to report, a build timestamp would claim every page
 * changed on every deploy, and Google ignores the other two.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ROUTES.home.path,
    ROUTES.about.path,
    ROUTES.projects.path,
    ...PROJECTS.map(projectPath),
    ROUTES.contact.path,
  ];

  return paths.map((path) => ({
    url: path === "/" ? SITE.origin : `${SITE.origin}${path}`,
  }));
}
