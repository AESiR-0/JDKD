import type { ReactNode } from "react";

import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import type { DisplayLine, ImageAsset } from "@/lib/content";

/**
 * PageHero — the opener for every internal route.
 *
 * SERVER COMPONENT. `Reveal` and `ImageCard` are the only client boundaries and
 * both are leaves. Never put `"use client"` on this file or on a page that uses
 * it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IT IS NOT THE HOMEPAGE HERO, AND THAT IS THE POINT.
 *
 * The homepage's hero is `min-h-svh` full-bleed art with the bar riding
 * transparently over it. That treatment is homepage-only: `SiteHeader` compares
 * the pathname against `HERO_ROUTE`, which is `ROUTES.home.path` and nothing
 * else, so on every other route the bar is SOLID `bg-canvas` from the first
 * pixel. A hero that started at the top of the document would therefore open
 * underneath an opaque bar.
 *
 * So this component's top padding is CLEARANCE, not taste. The bar is `h-14`
 * (56px) and `md:h-16` (64px); `pt-32 md:pt-40 lg:pt-48` leaves 72 / 96 / 128px
 * of air beneath it. Do not reduce it, and do not widen `HERO_ROUTE` into a set
 * because a page uses this component — the two are alternatives, not partners.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A GRID. No `grid-cols-12`, no `col-span-*`. Three anchors:
 *
 *   0%                                                        right gutter
 *   ├──────────────────────────────────────────────────────────────┤
 *   Home / About                                                        ← breadcrumbs
 *   (ABOUT)                                                             ← left edge
 *
 *   THE PRACTICE
 *   BEHIND THE                                    ┌──────────────────┐
 *   BUILDING.                                     │  lede, ~30ch     │  ← RIGHT RAIL,
 *                                                 └──────────────────┘    foot-aligned
 *   ┌─────────────────── optional image, FULL BLEED ──────────────────┐
 *   └──────────────────────────────────────────────────────────────────┘
 *
 * The h1 is the only child left in flow inside the type band, so IT sets that
 * band's height — which is what makes `lg:bottom-0` on the rail mean "aligned to
 * the foot of the title" rather than "aligned to nothing". Same mechanism as
 * `sections/about.tsx`; read that file for the full statement of the system.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ONE H1 PER PAGE. This component renders it. A page that uses `PageHero` must
 * not render a second `<h1>` anywhere; every section below opens at `<h2>`.
 * `headingId` exists so the page can point `aria-labelledby` at it.
 *
 * DISPLAY LINES ARE BROKEN FOR COMPOSITION, NOT FOR READING. The visible stack
 * is `aria-hidden` and `spokenTitle` carries the readable sentence `sr-only` —
 * otherwise a screen reader announces the line breaks as sentence breaks.
 *
 * BREADCRUMBS ARE NOT WRAPPED IN A `Reveal`. The mask keeps `overflow: hidden`
 * after it finishes and would clip the focus ring off the crumb links.
 *
 * MOBILE. Every anchor below is `lg:`-prefixed. What is left at 375px is one
 * gutter-padded column in DOM order — crumbs, label, title, lede, image — which
 * is the layout, not a fallback for it.
 */

export type PageHeroProps = {
  /**
   * Parenthetical section marker, brackets included — "(ABOUT)". Pass null to
   * render none. There are NO numerals in this vocabulary; "02 /" was removed
   * from the system deliberately.
   */
  readonly label?: string | null;
  /**
   * Display type, one entry per rendered line. The italic/roman alternation is
   * authored in `@/lib/content` because it belongs to the writing.
   */
  readonly titleLines: readonly DisplayLine[];
  /** The title as a human reads it aloud. Rendered `sr-only`. Required. */
  readonly spokenTitle: string;
  /** Right-rail lede, ~30ch. Pass null for a title-only opener. */
  readonly lede?: string | null;
  /** Optional full-bleed plate beneath the type. */
  readonly image?: ImageAsset | null;
  /**
   * Responsive `sizes` for that plate. The default is correct for the
   * full-bleed frame this component draws; override only if you also override
   * `imageClassName`.
   * @default "100vw"
   */
  readonly imageSizes?: string;
  /**
   * Aspect and placement for the plate. The default bleeds to both viewport
   * edges and steps 4:3 → 16:9 → 21:9.
   */
  readonly imageClassName?: string;
  /**
   * Marks the plate as the LCP image. At most ONE preloaded image per page, so
   * leave this true only while `PageHero` owns the largest image on the route.
   * @default true
   */
  readonly imagePreload?: boolean;
  /**
   * Rendered above the label, at the left edge. Normally `<Breadcrumbs />`.
   * Kept as a slot rather than a `trail` prop so this component never has to
   * know the route table.
   */
  readonly breadcrumbs?: ReactNode;
  /** Id on the `<h1>`, for `aria-labelledby`. @default "page-title" */
  readonly headingId?: string;
  /** Extra classes on the `<header>`. Vertical rhythm only. */
  readonly className?: string;
};

/**
 * Written out whole. NEVER build a Tailwind class by concatenation or
 * interpolation — the v4 scanner reads source text, so a class assembled at
 * runtime is never generated.
 *
 * SIZE IS CAPPED, NOT FLAT. `min(13vw, 3.5rem)` holds the 56px unprefixed
 * ceiling everywhere it fits and shrinks only on widths that cannot hold it —
 * the same remedy `sections/about.tsx` uses, chosen over inventing a
 * breakpoint. The arbitrary steps carry no line height of their own, so each
 * one restores it explicitly rather than relying on cascade order.
 */
const TITLE =
  "block font-display text-[min(13vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-ink md:text-h1 md:leading-[0.98] lg:text-[min(6.4vw,7.5rem)] lg:leading-[0.92]";

/**
 * Full bleed both edges. `calc(50% - 50vw)` on each margin resolves to exactly
 * one viewport width: below 1440px the frame IS the viewport and it computes to
 * 0; above it, it is precisely the frame's own inset.
 *
 * NO `w-screen` HERE. The element is a block with `width: auto`, so the two
 * margins already resolve its width to 100vw. `w-screen` would additionally
 * count the scrollbar and push the page into horizontal overflow.
 */
const IMAGE_FRAME =
  "mt-14 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] aspect-[4/3] md:aspect-[16/9] lg:mt-20 lg:aspect-[21/9]";

export function PageHero({
  label = null,
  titleLines,
  spokenTitle,
  lede = null,
  image = null,
  imageSizes = "100vw",
  imageClassName = IMAGE_FRAME,
  imagePreload = true,
  breadcrumbs,
  headingId = "page-title",
  className,
}: PageHeroProps) {
  return (
    <header
      // CLEARANCE, not taste — see the note above. `overflow-x-clip` clips only
      // the horizontal axis, so it creates no scroll container and cannot break
      // a `position: sticky` sub-nav further down the page.
      //
      // NO BOTTOM PADDING. Like the homepage hero, this contributes no rhythm of
      // its own: the first `<section>` beneath it owns `py-section
      // lg:py-section-lg` and that is the whole of the gap. Adding a `pb-` here
      // doubles it.
      className={`relative overflow-x-clip pt-32 md:pt-40 lg:pt-48 ${className ?? ""}`}
    >
      {/* THE FRAME — an unpadded coordinate space capped at the shell. It
          carries no padding on purpose: an absolutely positioned child resolves
          `right: 3.5rem` against its containing block's PADDING box, so a padded
          frame would put percentage anchors and flow children one gutter out of
          agreement. Reading children apply their own edge anchor. */}
      <div className="relative mx-auto w-full max-w-shell">
        {breadcrumbs ? (
          <div className="px-gutter md:px-gutter-lg">{breadcrumbs}</div>
        ) : null}

        {label ? (
          <p
            className={`px-gutter font-display text-label uppercase italic tracking-label text-muted md:px-gutter-lg ${
              breadcrumbs ? "mt-8" : ""
            }`}
          >
            {label}
          </p>
        ) : null}

        {/* ── THE TYPE BAND ──────────────────────────────────────────────
            The h1 stays in flow at every width and alone sets this band's
            height; the rail is absolute from `lg` and hangs off its foot. */}
        <div className="relative mt-8 lg:mt-14">
          {/* LEFT EDGE. The h1 stays in FLOW at every width, so the page gutter
              is what anchors it — no absolute positioning and therefore no
              `px-0` / `pl-*` pair whose winner would depend on the order
              Tailwind happens to emit them in. `w-[62%]` keeps the longest line
              clear of the rail. */}
          <h1
            id={headingId}
            className="px-gutter md:px-gutter-lg lg:w-[62%]"
          >
            <span className="sr-only">{spokenTitle}</span>
            <span aria-hidden="true" className="block">
              <Reveal as="span" stagger={0.08} duration={1} className={TITLE}>
                {titleLines.map((line) => (
                  <span
                    key={line.text}
                    className={line.style === "italic" ? "italic" : "not-italic"}
                  >
                    {line.text}
                  </span>
                ))}
              </Reveal>
            </span>
          </h1>

          {/* RIGHT RAIL — the ~30ch measure flush to the right gutter. ALL
              small sans copy on this site lives here; that single repetition is
              what ties differently-composed pages into one system. Do not
              centre it and do not widen it. `text-small` is set on the rail
              itself so the `ch` measure resolves against the copy it measures. */}
          {lede ? (
            <div className="mt-10 w-full px-gutter text-small text-muted md:px-gutter-lg lg:absolute lg:right-gutter-lg lg:bottom-0 lg:mt-0 lg:w-[30ch] lg:px-0">
              <Reveal as="p" delay={0.12}>
                {lede}
              </Reveal>
            </div>
          ) : null}
        </div>

        {/* OPTIONAL PLATE — full bleed. The section's `overflow-x-clip`
            absorbs the scrollbar delta that `w-screen` introduces. */}
        {image ? (
          <ImageCard
            src={image.src}
            alt={image.alt}
            sizes={imageSizes}
            surface="ink"
            shift={5}
            scale={1.05}
            delay={0.08}
            preload={imagePreload}
            className={
              image.placeholder
                ? `${imageClassName} border border-line`
                : imageClassName
            }
          />
        ) : null}
      </div>
    </header>
  );
}
