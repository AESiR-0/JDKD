import type { Metadata } from "next";
import Link from "next/link";

import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageHero } from "@/components/ui/page-hero";
import {
  PROJECTS_PAGE,
  PROJECT_PLACEHOLDERS,
  PROJECT_TOWER,
  ROUTES,
  projectPath,
  type PlaceholderProject,
  type RealProject,
} from "@/lib/content";

/**
 * /projects — THE EDITORIAL INDEX.
 *
 * Conventions are inherited wholesale from `app/about/page.tsx`, the worked
 * reference route; read that file first. This one adds nothing to the system,
 * it only composes it three more ways.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A CARD GRID, AND THAT IS THE WHOLE BRIEF.
 *
 * No `grid-cols-12`, no `col-span-*`, and no repeated card either. Each entry
 * is a CHAPTER — one flow child (the image, which alone sets the band's height)
 * with a type column anchored absolutely over it — and dominance flips from
 * chapter to chapter, exactly as `sections/buildings.tsx` does on the homepage.
 * Nothing lines up between chapters on purpose; the only things they share are
 * the ~30ch measure their copy is set on and the vertical rhythm between them.
 *
 * THE THREE COMPOSITIONS, at `lg` and above. `▓` is the viewport edge.
 *
 *   ONE — THE TOWER. Dominance RIGHT, and the tallest plate on the page: a
 *   4:5 portrait bleeding off the right edge, type at the LEFT EDGE, top-
 *   anchored. This is the only entry with facts, a red hairline and a link.
 *
 *      ▓                                                            ▓
 *      │  ──── (red hairline)                                        │
 *      │  NOW AVAILABLE FOR LEASING          ┌────────────────────────
 *      │  JDKD CORPORATE                     │                        │
 *      │  TOWER                              │  tower-exterior 4:5    │
 *      │  ────                               │                 46vw   │
 *      │  summary, 30ch                      │                        │
 *      │  facts ─ ─ ─                        │                        │
 *      │  VIEW PROJECT →                     └────────────────────────
 *
 *   TWO — RESERVED. Dominance flips LEFT: a 4:3 frame bleeding off the left
 *   edge, type in the RIGHT RAIL and set right-ragged so title, rule and copy
 *   all hang off the same edge.
 *
 *      ▓                                                            ▓
 *      ────────────────────────────────┐                (RESERVED)  │
 *      │                               │                  RESERVED  │
 *      │   park-01.jpg  4:3            │                      ────  │
 *      │             46vw              │                summary 30ch│
 *      ────────────────────────────────┘                            │
 *
 *   THREE — RESERVED. Dominance swings back RIGHT but the plate is smaller
 *   (38vw) and the type column is anchored to the band's FOOT rather than its
 *   head, so the chapter reads as a diminuendo rather than a repeat of one.
 *
 *      ▓                                                            ▓
 *      │                                        ┌─────────────────────
 *      │  (RESERVED)                            │  park-02.jpg 4:3    │
 *      │  RESERVED                              │             38vw    │
 *      │  ────                                  └─────────────────────
 *      │  summary 30ch  ← foot-aligned
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TWO OF THE THREE ENTRIES ASSERT NOTHING, AND MUST LOOK LIKE IT.
 *
 * JDKD's wider project record has not been supplied. `PlaceholderProject`
 * carries `slug: null` — the contract that there is no page behind it — and
 * three devices keep its provisional status visible rather than implied: the
 * labelled `UNRESOLVED.portfolio` slot in the header rail, the `(RESERVED)`
 * marker above each reserved title, and the hairline frame drawn around any
 * image whose asset carries `placeholder: true`. NOTHING here links to a
 * detail route except the tower. A stand-in dressed as finished work is the
 * failure mode this page exists to avoid.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * MOBILE. Every anchor below is `lg:`-prefixed. What is left at 375px is one
 * gutter-padded column in DOM order — per chapter: marker, title, copy, image
 * — which is the layout, not a fallback for it.
 *
 * ONE H1. `PageHero` renders it. The three chapter titles are the `<h2>`s.
 *
 * SERVER COMPONENT, and it must stay one. `Reveal` and `ImageCard` are the
 * only client boundaries and both are leaves. `next/link` is not a boundary.
 */

/* ==========================================================================
   METADATA
   Copied verbatim from the worked reference. `ROUTES[key].title` is the SHORT
   form because `app/layout.tsx` sets a "%s | JDKD" template; `ogTitle` is the
   standalone sentence, because that template is not applied to openGraph.
   ========================================================================== */

const ROUTE = ROUTES.projects;

export const metadata: Metadata = {
  title: ROUTE.title,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
  openGraph: {
    type: "website",
    url: ROUTE.path,
    title: ROUTE.ogTitle,
    description: ROUTE.description,
    images: [
      {
        url: ROUTE.ogImage.src,
        width: ROUTE.ogImage.width,
        height: ROUTE.ogImage.height,
        alt: ROUTE.ogImage.alt,
      },
    ],
  },
};

/* ==========================================================================
   INTERFACE MICROCOPY

   Chrome, not content: these strings assert no fact about the asset, the
   entity or the address, so they live here rather than in `@/lib/content` —
   the same split `site-header.tsx` makes for its own `UI` block.
   ========================================================================== */

const UI = {
  /** Accessible name for the index section, whose headings are the chapters. */
  index: ROUTES.projects.title,
  /** Visible label on the one link this page carries. */
  view: "View project",
} as const;

/* ==========================================================================
   SHARED TREATMENTS

   Written out whole and shared by reference. NEVER build a Tailwind class by
   concatenation or interpolation — the v4 scanner reads source text, so a
   class assembled at runtime is never generated. Joining two COMPLETE literals
   (as the chapters below do) is fine; splicing a value into one is not.
   ========================================================================== */

/**
 * The index shell. `PageHero` on this route renders NO plate, so the page
 * opens type-only and the gap beneath it is doing all the pacing work — hence
 * the documented ~280px pacing break on the top edge rather than the default
 * `py-section`. The bottom edge keeps the standard rhythm.
 */
const SECTION =
  "relative overflow-x-clip pt-[11rem] pb-section lg:pt-[17.5rem] lg:pb-section-lg";

/** The unpadded coordinate space every percentage anchor is measured against. */
const FRAME = "relative mx-auto w-full max-w-shell";

/** The left-edge anchor, for any child that is in flow. */
const EDGE = "px-gutter md:px-gutter-lg";

/** Parenthetical marker. There are NO numerals in this vocabulary. */
const LABEL =
  "font-display text-label uppercase italic tracking-label text-muted";

/**
 * Chapter title. `text-h2` is the homepage's chapter step.
 *
 * The tower alone grows at `lg`, because it is the one entry that is a building
 * rather than a reserved frame — and it grows on a CAP, not a flat step:
 * `min(4.2vw, 3.5rem)` reaches the 56px ceiling from 1440px up and shrinks
 * below it, which is the remedy this system prefers over inventing a breakpoint.
 * It also keeps the title from pushing the type column past the foot of its
 * plate at 1024px, where the band is at its shortest. The arbitrary step
 * carries no line height of its own, so it restores one explicitly.
 */
const TITLE = "font-display text-h2 uppercase tracking-tight text-ink";
const TITLE_LEAD =
  "block font-display text-h2 uppercase tracking-tight text-ink lg:text-[min(4.2vw,3.5rem)] lg:leading-[1]";

/** Chapter copy. `text-small` on the site-wide ~30ch measure. */
const BODY = "max-w-[30ch] text-small text-muted";

/** The one hairline a chapter is allowed. Sparingly means once. */
const HAIRLINE = "my-6 block h-px w-24 bg-line-strong";

/**
 * Drawn around every frame whose asset is a client stand-in. It is the visible
 * difference between "photograph" and "reserved space".
 */
const PROVISIONAL_FRAME = "border border-line";

/** Placement of each chapter's plate. Aspect ratios follow the assets on disk. */
const FRAME_ONE = "aspect-[4/5] w-full md:w-[78%] lg:ml-auto lg:mr-[calc(50%-50vw)] lg:w-[46vw]";
const FRAME_TWO = "aspect-[4/3] w-full lg:ml-[calc(50%-50vw)] lg:w-[46vw]";
const FRAME_THREE = "aspect-[4/3] w-full md:ml-auto md:w-[78%] lg:ml-auto lg:mr-[calc(50%-50vw)] lg:w-[38vw]";

/** Stable, page-scoped heading id — project ids are generic on their own. */
function headingId(id: string): string {
  return `projects-${id}-title`;
}

/* ==========================================================================
   CHAPTER ONE — JDKD CORPORATE TOWER

   Dominance RIGHT, type at the LEFT EDGE. The plate is the only child left in
   flow at `lg`, so it alone sets the band's height and the type column is
   measured against it.

   This is the one entry that is a building, so it is the only one that carries
   facts, the page's single red hairline, and a link. The link is OUTSIDE every
   `Reveal`: the mask keeps `overflow: hidden` after it finishes and would clip
   the focus ring off it.
   ========================================================================== */

function ChapterTower({ project }: { readonly project: RealProject }) {
  const id = headingId(project.id);

  /* The facts strip. Values only, no invented term labels — each line is a
     verbatim field off the project record. */
  const facts: readonly string[] = [
    project.assetClass,
    project.certification,
    project.place,
  ];

  return (
    <article aria-labelledby={id} className="relative">
      {/* LEFT EDGE — the type column. Absolute from `lg` so the plate alone
          stays in flow and sets the band's height.
          `top-[6%]` is as low as this column can hang: it carries more than the
          reserved ones do — status, title, rule, summary, facts and a link —
          and the band is at its shortest at exactly 1024px, where 6% of the
          plate still leaves the column's foot ~55px clear of the plate's. */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:top-[6%] lg:left-gutter-lg lg:z-10 lg:w-[40%] lg:px-0">
        {/* The page's single red rule. Red is a HAIRLINE colour on this site,
            never a fill — it marks the one entry that is genuinely available. */}
        <span aria-hidden="true" className="block h-hair w-rule-sm bg-red" />

        <p className="mt-5 text-micro uppercase tracking-label text-ink">
          {project.status}
        </p>

        <Reveal as="h2" id={id} className={`mt-6 ${TITLE_LEAD}`}>
          {project.name}
        </Reveal>

        <span aria-hidden="true" className={HAIRLINE} />

        <Reveal as="p" className={BODY} delay={0.06}>
          {project.summary}
        </Reveal>

        {/* A LIST, not a grid: three values on one measure, under a single
            hairline. `list-none` strips list semantics in Safari; the role puts
            them back. */}
        <ul role="list" className="mt-8 max-w-[30ch] border-t border-line pt-4">
          {facts.map((fact) => (
            <li key={fact} className="mt-2 text-micro text-muted first:mt-0">
              {fact}
            </li>
          ))}
        </ul>

        {/* NOT wrapped in a Reveal — see the note above. */}
        <Link
          href={projectPath(project)}
          className="mt-9 inline-flex items-center gap-3 border-b border-red pb-2 text-label uppercase tracking-label text-ink transition-colors duration-200 ease-editorial hover:text-pure"
        >
          {UI.view}
          <span className="sr-only"> — {project.name}</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* EDGE-BLEED-RIGHT — off the right viewport edge from `lg`; a plain
          plate below it. `preload` marks the LCP image: `PageHero` renders no
          plate on this route, so this is the largest image on the page and the
          only one that may carry it. */}
      <ImageCard
        src={project.image.src}
        alt={project.image.alt}
        sizes="(min-width: 1024px) 46vw, (min-width: 768px) 78vw, 100vw"
        surface="ink"
        shift={6}
        scale={1.05}
        delay={0.05}
        preload
        className={`mt-12 lg:mt-0 ${FRAME_ONE}`}
      />
    </article>
  );
}

/* ==========================================================================
   CHAPTER TWO — RESERVED

   Dominance flips LEFT and the type moves to the RIGHT RAIL, set right-ragged
   so the marker, title, rule and copy all hang off the same edge.

   It asserts nothing and it links nowhere: `PlaceholderProject.slug` is null,
   so there is no `href` to build even if one were wanted.
   ========================================================================== */

function ChapterReservedLeft({
  project,
}: {
  readonly project: PlaceholderProject;
}) {
  const id = headingId(project.id);

  return (
    <article aria-labelledby={id} className="relative mt-24 lg:mt-44">
      {/* RIGHT RAIL — flush to the right gutter, right-ragged from `lg`. */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:top-[22%] lg:right-gutter-lg lg:z-10 lg:w-[34%] lg:px-0 lg:text-right">
        <p className={LABEL}>{project.marker}</p>

        <Reveal as="h2" id={id} className={`mt-5 ${TITLE}`}>
          {project.name}
        </Reveal>

        <span aria-hidden="true" className={`${HAIRLINE} lg:ml-auto`} />

        <Reveal as="p" className={`${BODY} lg:ml-auto`} delay={0.06}>
          {project.summary}
        </Reveal>
      </div>

      {/* EDGE-BLEED-LEFT, with the provisional frame drawn around it. */}
      <ImageCard
        src={project.image.src}
        alt={project.image.alt}
        sizes="(min-width: 1024px) 46vw, 100vw"
        surface="ink"
        shift={5}
        scale={1.06}
        delay={0.08}
        className={
          project.image.placeholder
            ? `mt-10 lg:mt-0 ${FRAME_TWO} ${PROVISIONAL_FRAME}`
            : `mt-10 lg:mt-0 ${FRAME_TWO}`
        }
      />
    </article>
  );
}

/* ==========================================================================
   CHAPTER THREE — RESERVED

   Dominance swings back RIGHT, but this is not chapter one again: the plate is
   smaller (38vw against 46vw), it is landscape rather than portrait, and the
   type column is anchored to the band's FOOT with `lg:bottom-0` instead of its
   head. The page closes quieter than it opened, which is the honest shape for
   a frame that holds space rather than a building.
   ========================================================================== */

function ChapterReservedRight({
  project,
}: {
  readonly project: PlaceholderProject;
}) {
  const id = headingId(project.id);

  return (
    <article aria-labelledby={id} className="relative mt-24 lg:mt-44">
      {/* LEFT EDGE, foot-aligned. The plate is the flow child, so `bottom-0`
          means "level with the foot of the picture". */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:bottom-0 lg:left-gutter-lg lg:z-10 lg:w-[34%] lg:px-0">
        <p className={LABEL}>{project.marker}</p>

        <Reveal as="h2" id={id} className={`mt-5 ${TITLE}`}>
          {project.name}
        </Reveal>

        <span aria-hidden="true" className={HAIRLINE} />

        <Reveal as="p" className={BODY} delay={0.06}>
          {project.summary}
        </Reveal>
      </div>

      {/* EDGE-BLEED-RIGHT, narrower than chapter one, provisional frame drawn. */}
      <ImageCard
        src={project.image.src}
        alt={project.image.alt}
        sizes="(min-width: 1024px) 38vw, (min-width: 768px) 78vw, 100vw"
        surface="ink"
        shift={5}
        scale={1.06}
        delay={0.08}
        className={
          project.image.placeholder
            ? `mt-10 lg:mt-0 ${FRAME_THREE} ${PROVISIONAL_FRAME}`
            : `mt-10 lg:mt-0 ${FRAME_THREE}`
        }
      />
    </article>
  );
}

/* ==========================================================================
   THE INDEX

   ONE section holding the header band and the three chapters. Its accessible
   name comes from the route table rather than a visible heading, because the
   chapter titles ARE this section's headings — the same arrangement
   `sections/buildings.tsx` uses on the homepage.

   Header band: the intro at the LEFT EDGE, set one step up at `text-body-lg`
   so it reads as pacing rather than as rail copy, and the labelled
   `UNRESOLVED.portfolio` slot in the right rail. No picture sets this band's
   height, so the rail is absolute against a plain relative box.

   The three entries are destructured rather than mapped, for the same reason
   the homepage's chapters are: each is a different composition, not a repeated
   card. `PROJECT_PLACEHOLDERS` is a two-tuple, so both reserved frames are
   guaranteed to exist without an index check.
   ========================================================================== */

const [reservedOne, reservedTwo] = PROJECT_PLACEHOLDERS;

function Index() {
  return (
    <section id="index" aria-label={UI.index} className={SECTION}>
      <div className={FRAME}>
        {/* HEADER BAND */}
        <div className="relative">
          <div className={`${EDGE} lg:w-[52%]`}>
            <Reveal
              as="p"
              className="max-w-[42ch] text-body-lg text-ink"
              delay={0.06}
            >
              {PROJECTS_PAGE.intro}
            </Reveal>
          </div>

          {/* THE UNRESOLVED SLOT. Labelled and visibly empty: the client's
              wider project record is pending, and a rule with nothing above it
              is the honest rendering of that. Never a fabricated list. */}
          <div
            className={`${EDGE} mt-12 text-small lg:absolute lg:top-0 lg:right-gutter-lg lg:mt-0 lg:w-[30ch] lg:px-0`}
          >
            <p className="text-micro uppercase tracking-label text-muted">
              {PROJECTS_PAGE.unresolved.label}
            </p>
            <span
              aria-hidden="true"
              className="mt-4 block h-px w-full max-w-[240px] bg-line-strong"
            />
            <p className="mt-4 text-muted">
              {PROJECTS_PAGE.unresolved.placeholder}
            </p>
          </div>
        </div>

        {/* ── THE THREE CHAPTERS ─────────────────────────────────────────
            Dominance swings right, then left, then right again and smaller. */}
        <div className="mt-20 lg:mt-36">
          <ChapterTower project={PROJECT_TOWER} />
          <ChapterReservedLeft project={reservedOne} />
          <ChapterReservedRight project={reservedTwo} />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   THE PAGE

   No wrapper element and no `className` here on purpose: the section is
   full-bleed and owns its own frame, so anything this function wrapped it in
   would become a second, competing coordinate space. `app/layout.tsx` already
   provides `<main id="main">`, the skip link, the header and the footer — do
   not add a second `<main>`.

   `PageHero` renders NO plate on this route. The chapters below carry the
   page's photography and the tower's portrait is the largest image on it, so
   the hero deliberately opens on type alone and `ChapterTower` takes the one
   `preload` this page is allowed.
   ========================================================================== */

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            trail={[
              { label: "Home", href: ROUTES.home.path },
              { label: ROUTES.projects.title },
            ]}
          />
        }
        label={PROJECTS_PAGE.label}
        titleLines={PROJECTS_PAGE.titleLines}
        spokenTitle={PROJECTS_PAGE.spokenTitle}
        lede={PROJECTS_PAGE.lede}
      />
      <Index />
    </>
  );
}
