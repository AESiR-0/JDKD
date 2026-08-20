import { Counter } from "@/components/motion/counter";
import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { ABOUT, SECTIONS, type AboutFigureId } from "@/lib/content";

/**
 * 02 — ABOUT. The worked reference section.
 *
 * Every other section on this page copies its conventions from here, so read
 * this file before writing a new one.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A GRID.
 *
 * There is no `grid-cols-12` and no `col-span-*` below, and there must not be
 * one in any section except the bento and the FAQ rows. A uniform twelve-column
 * grid applied site-wide is what made the previous build read as a corporate
 * brochure. Layout here is ANCHOR-BASED: three things repeat across the whole
 * site and everything else is composed per section.
 *
 *   1. LEFT EDGE    the page gutter. Display type and section labels hang off
 *                   it: `px-gutter md:px-gutter-lg` in flow,
 *                   `left-gutter md:left-gutter-lg` out of flow.
 *   2. RIGHT RAIL   a ~30ch measure flush to the right gutter. ALL small sans
 *                   copy lives here, in every section. This one repetition is
 *                   what makes nine differently-composed sections read as a
 *                   single system.
 *   3. OPTICAL BAND roughly the middle 40% of the frame, where the dominant
 *                   image sits. Here that is the portrait at 38%–72%.
 *
 * Consistency comes from VERTICAL RHYTHM, not from alignment — `py-section` /
 * `lg:py-section-lg` between sections, and nothing else lining up on purpose.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE FRAME.
 *
 * The `<section>` is full-bleed and owns the vertical rhythm plus
 * `overflow-x-clip`. Inside it, ONE unpadded `max-w-shell` element is the frame
 * every anchor is measured against. It carries no padding on purpose: an
 * absolutely positioned child resolves `left: 38%` against its containing
 * block's PADDING box, so a padded frame would make percentage anchors and flow
 * children disagree by one gutter. Reading children apply their own edge
 * anchor; the frame stays a clean coordinate space from 0% to 100%.
 *
 * `overflow-x-clip` rather than `overflow-hidden`: it clips only the horizontal
 * axis, so a block may still overhang vertically — which the heading does —
 * and it creates no scroll container, so it cannot break a `position: sticky`
 * or a ScrollTrigger pin further down the page.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE COMPOSITION, at `lg` and above.
 *
 *      0%        38%          72%              right gutter
 *      ├─────────┼─────────────┼───────────────────┤
 *      (ABOUT)                                                  ← left edge
 *                ┌─────────────┐         ┌─────────┐
 *                │  portrait   │         │  rail   │            ← top-aligned
 *      TIMELESS  │  lobby.jpg  │         │  two    │
 *      STRUCTURE │  3:4        │         │  short  │
 *      WORK-     │             │         │  paras  │
 *      FOCUSED   │             │         └─────────┘
 *      SPACES    └─────────────┘  ← heading foot clears it by 40px
 *
 *                       23,456          7
 *      14'9"      2
 *
 * The four figures are deliberately NOT aligned to one another — different
 * left offsets, different baselines, one set larger than the rest. That
 * asymmetry IS the section. Do not tidy it into a row.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * MOBILE. Everything collapses to one gutter-padded column in DOM order:
 * label, rail copy, portrait, heading, figures as a hairline-separated list.
 * Every anchor above is `lg:`-prefixed, so the mobile layout is what is left
 * when the art direction is switched off, not a second layout maintained in
 * parallel.
 *
 * SERVER COMPONENT. `Reveal`, `ImageCard` and `Counter` are the only client
 * boundaries, and they are leaves. Never put `"use client"` on a section.
 */

/* --------------------------------------------------------------------------
   PLACEMENT

   Where each figure sits. Separated from `@/lib/content` on purpose: content
   owns what a figure says, the section owns where it goes.

   Keyed by `AboutFigureId`, so adding a fifth figure to the content model is a
   compile error here rather than a figure that silently fails to appear.

   Class strings are written out whole. NEVER build a Tailwind class by
   concatenation or interpolation — the v4 scanner reads source text, and a
   class assembled at runtime is never generated.
-------------------------------------------------------------------------- */

type FigurePlacement = {
  /** `lg`-only absolute placement inside the figures band. */
  readonly position: string;
  /** Size of the numeral. Unprefixed steps stay at or below `text-headline`. */
  readonly numeral: string;
  /** Whether this figure carries the band's single hairline. */
  readonly rule: boolean;
};

const FIGURE_PLACEMENT: Readonly<Record<AboutFigureId, FigurePlacement>> = {
  // First below the portrait, just right of centre.
  "plot-area": {
    position: "lg:absolute lg:left-[50%] lg:top-10 lg:w-[15rem]",
    numeral: "font-sans font-light text-headline lg:text-numeral",
    rule: false,
  },
  // Far right and a baseline HIGHER than its neighbour — the deliberate break.
  "office-floors": {
    position: "lg:absolute lg:left-[76%] lg:top-0 lg:w-[12rem]",
    numeral: "font-sans font-light text-headline lg:text-numeral",
    rule: false,
  },
  // Flush to the left edge, largest of the four, lowest on the left.
  "building-height": {
    position: "lg:absolute lg:left-gutter-lg lg:top-[13rem] lg:w-[20rem]",
    numeral: "font-sans font-light text-headline lg:text-display",
    rule: true,
  },
  // Lowest of the four, a third of the way across.
  certification: {
    position: "lg:absolute lg:left-[34%] lg:top-[15.5rem] lg:w-[12rem]",
    numeral: "font-sans font-light text-headline lg:text-numeral",
    rule: false,
  },
};

/** Mobile list behaviour, switched off wholesale at `lg`. */
const FIGURE_BASE =
  "mt-7 border-t border-line pt-7 first:mt-0 lg:mt-0 lg:border-t-0 lg:pt-0";

const HEADING_ID = "about-heading";

export function About() {
  return (
    <section
      id={SECTIONS.about.id}
      aria-labelledby={HEADING_ID}
      // PACING BREAK. The standard wrapper is
      // `py-section lg:py-section-lg`. This section follows the hero, which is
      // one of the three points in the scroll that gets ~280px instead — so
      // the rhythm is split into explicit `pt-` and `pb-` rather than left as
      // a `py-` that a second utility has to fight.
      className="relative overflow-x-clip pt-[11rem] pb-section lg:pt-[17.5rem] lg:pb-section-lg"
    >
      {/* THE FRAME — unpadded coordinate space, capped at the shell. */}
      <div className="relative mx-auto w-full max-w-shell">
        {/* LEFT EDGE — the section label, top of the frame. */}
        <p className="px-gutter font-display text-label uppercase italic tracking-label text-muted md:px-gutter-lg">
          {ABOUT.label}
        </p>

        {/* ── BAND ONE ───────────────────────────────────────────────────
            Portrait, rail and heading share one positioning context. The
            portrait is the only child left in flow at `lg`, so it alone sets
            the band's height — which is what lets the heading hang off the
            band's foot and land 40px below the image. */}
        <div className="relative mt-12 lg:mt-28">
          {/* RIGHT RAIL — ~30ch, flush right, top-aligned to the portrait.
              The measure is set in `ch` on an element that carries the copy's
              own `text-micro`, so 30ch really is thirty characters. */}
          <div className="w-full px-gutter text-micro text-muted md:px-gutter-lg lg:absolute lg:right-gutter-lg lg:top-0 lg:w-[30ch] lg:px-0">
            <Reveal as="div" stagger={0.09} delay={0.05}>
              {ABOUT.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-5 first:mt-0">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>

          {/* OPTICAL BAND — the portrait. Full-bleed on mobile, a centred
              plate on tablet, and the anchored 34% column from `lg`. */}
          <div className="mt-10 lg:mt-0">
            <ImageCard
              src={ABOUT.image.src}
              alt={ABOUT.image.alt}
              sizes="(min-width: 1024px) 34vw, (min-width: 768px) 62vw, 100vw"
              surface="ink"
              shift={5}
              scale={1.06}
              delay={0.08}
              className="aspect-[4/5] w-full md:mx-auto md:w-[62%] lg:mx-0 lg:ml-[38%] lg:mr-0 lg:aspect-[3/4] lg:w-[34%]"
            />
          </div>

          {/* LEFT EDGE — the five-line heading, bottom-anchored so its last
              line clears the portrait's foot by 40px (`-bottom-10`).
              The lines are broken for composition, not for reading: the
              readable sentence is `sr-only` and the visible stack is hidden
              from assistive technology. Adopt this pattern wherever display
              type is split mid-word. */}
          <h2
            id={HEADING_ID}
            className="mt-14 px-gutter md:px-gutter-lg lg:absolute lg:-bottom-10 lg:left-gutter-lg lg:mt-0 lg:w-[36%] lg:px-0"
          >
            <span className="sr-only">{ABOUT.spokenHeading}</span>
            <span aria-hidden="true" className="block">
              {/* MOBILE SIZE IS CAPPED, NOT FLAT. Measured on the composed
                  page at 375px, a flat `text-headline` set "STRUCTURE" 3px
                  past the viewport, where the section's `overflow-x-clip`
                  trimmed the final glyph. `min(13vw,3.5rem)` keeps the 56px
                  ceiling everywhere it fits and shrinks only on the narrow
                  widths that cannot hold it — the contract's remedy, chosen
                  over a new breakpoint. The arbitrary step carries no line
                  height of its own, so `leading-[1.02]` restores what
                  `text-headline` set and `md:leading-[0.98]` matches
                  `md:text-h1` explicitly rather than by cascade order. */}
              <Reveal
                as="span"
                stagger={0.08}
                duration={1}
                className="block font-display text-[min(13vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-ink md:text-h1 md:leading-[0.98] lg:text-[min(5.2vw,5rem)] lg:leading-[0.95]"
              >
                {ABOUT.headingLines.map((line) => (
                  <span
                    key={line.text}
                    className={line.style === "italic" ? "italic" : "not-italic"}
                  >
                    {line.text}
                  </span>
                ))}
              </Reveal>
            </span>
          </h2>
        </div>

        {/* ── BAND TWO ───────────────────────────────────────────────────
            The four figures. A fixed-height positioning context at `lg`, a
            plain hairline-separated list below it. */}
        <ul
          // `list-none` strips list semantics in Safari; the role puts them back.
          role="list"
          className="relative mt-16 px-gutter md:px-gutter-lg lg:mt-40 lg:h-[27rem] lg:px-0"
        >
          {ABOUT.figures.map((figure) => {
            const placement = FIGURE_PLACEMENT[figure.id];

            return (
              <li
                key={figure.id}
                className={`${FIGURE_BASE} ${placement.position}`}
              >
                {/* The band's single hairline. Sparingly means once. */}
                {placement.rule ? (
                  <span
                    aria-hidden="true"
                    className="hidden lg:mb-6 lg:block lg:h-px lg:w-36 lg:bg-line-strong"
                  />
                ) : null}

                <Counter
                  value={figure.value}
                  unit={figure.unit}
                  className={`whitespace-nowrap font-display text-ink ${placement.numeral}`}
                  unitClassName="text-small text-muted lg:text-body-lg"
                />

                <p className="mt-4 max-w-[24ch] text-micro text-muted">
                  {figure.descriptor}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
