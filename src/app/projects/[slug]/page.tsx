import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectAmenities } from "@/components/project/project-amenities";
import { ProjectDownloads } from "@/components/project/project-downloads";
import { ProjectEnquiry } from "@/components/project/project-enquiry";
import { ProjectGallery } from "@/components/project/project-gallery";
import { ProjectHighlights } from "@/components/project/project-highlights";
import { ProjectLocation } from "@/components/project/project-location";
import { ProjectNav } from "@/components/project/project-nav";
import { ProjectOverview } from "@/components/project/project-overview";
import { ProjectPlans } from "@/components/project/project-plans";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageHero } from "@/components/ui/page-hero";
import { PROJECT_SLUGS, ROUTES, getProject, projectPath } from "@/lib/content";

/**
 * /projects/[slug] — ONE LONG PAGE PER PROJECT. There are no sub-routes.
 *
 * Overview, key highlights, location and connectivity, floor plans, amenities
 * and building systems, gallery, downloads, enquiry: eight sections in one
 * document, reached by a sticky sub-nav rather than by eight URLs. A leasing
 * enquiry is one decision, and splitting the evidence for it across a folder of
 * pages makes a visitor navigate instead of read.
 *
 * Conventions are copied from `app/about/page.tsx`, the worked reference — read
 * that file first. This page adds exactly three things to the system:
 *
 *   1. THE STICKY SUB-NAV, which is why every section on this route carries
 *      `scroll-mt-[7.5rem] lg:scroll-mt-[8.5rem]` on top of the header
 *      clearance `globals.css` already reserves. That override lives in
 *      `components/project/chrome.tsx`'s `SECTION` literal, so no section can
 *      forget it.
 *   2. `generateStaticParams`, from `PROJECT_SLUGS` — which is derived from the
 *      REAL projects only. A `PlaceholderProject` carries `slug: null` and
 *      therefore cannot grow a detail route by accident. `dynamicParams = false`
 *      closes the other half of that door: an unknown slug 404s instead of
 *      being rendered on demand.
 *   3. `generateMetadata`, because the page is one route serving many entities.
 *
 * THIS IS NOT A GRID. No `grid-cols-12` and no `col-span-*` anywhere on the
 * route. Two sections use a real `grid` — the specification table and the
 * gallery — because that content genuinely IS one. Everything else is anchored:
 * left edge, right rail, optical band.
 *
 * ONE H1: `PageHero` renders it. Every section opens at `<h2>`, blocks inside
 * them at `<h3>`, and the plan viewer's sub-blocks at `<h4>`.
 *
 * SERVER COMPONENT, and it must stay one. `Reveal`, `ImageCard`, `EnquiryForm`
 * and `PlanViewer` are the client leaves.
 */

const ROUTE = ROUTES.projectDetail;

/**
 * Real projects only. `PROJECT_SLUGS` is derived from `REAL_PROJECTS`, so a
 * reserved frame on the index cannot reach this route.
 */
export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

/** Anything not in `generateStaticParams` is a 404, not a render-on-demand. */
export const dynamicParams = false;

/**
 * Per-entity metadata. The route table supplies what belongs to the ROUTE — the
 * path it is canonicalised against, and the fallback for an unknown slug; the
 * project supplies what belongs to the PROJECT. `title` is the short form
 * because `app/layout.tsx` sets a "%s | JDKD" template; `openGraph.title` is
 * the standalone sentence, because that template is not applied to openGraph.
 */
export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: ROUTE.title,
      description: ROUTE.description,
    };
  }

  const path = projectPath(project);

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: project.name,
      description: project.summary,
      images: [
        {
          url: project.heroImage.src,
          width: project.heroImage.width,
          height: project.heroImage.height,
          alt: project.heroImage.alt,
        },
      ],
    },
  };
}

/* ==========================================================================
   THE PAGE

   No wrapper element and no `className` on purpose: every section is full-bleed
   and owns its own frame, so anything this function wrapped them in would
   become a second, competing coordinate space — and would also cap the sticky
   sub-nav's travel to the height of that wrapper. `app/layout.tsx` already
   provides `<main id="main">`, the skip link, the header and the footer.

   The running order IS `project.nav`'s order; the sub-nav and the document
   cannot drift because both read the same array.
   ========================================================================== */

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            trail={[
              { label: "Home", href: ROUTES.home.path },
              { label: ROUTES.projects.title, href: ROUTES.projects.path },
              { label: project.name },
            ]}
          />
        }
        label={project.label}
        titleLines={project.titleLines}
        spokenTitle={project.spokenTitle}
        lede={project.lede}
        image={project.heroImage}
      />

      <ProjectNav items={project.nav} />

      <ProjectOverview overview={project.overview} />
      <ProjectHighlights highlights={project.highlights} />
      <ProjectLocation connectivity={project.connectivity} />
      <ProjectPlans plans={project.plans} />
      <ProjectAmenities amenities={project.amenities} />
      <ProjectGallery gallery={project.gallery} />
      <ProjectDownloads downloads={project.downloads} />
      <ProjectEnquiry enquiry={project.enquiry} contact={project.contact} />
    </>
  );
}
