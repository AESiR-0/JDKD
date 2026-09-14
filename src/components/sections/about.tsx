import Image from "next/image";
import { Counter } from "@/components/motion/counter";
import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { ABOUT, CLIENT_LOGOS, CLIENT_MORE, SECTIONS } from "@/lib/content";

/**
 * 02 - ABOUT. The worked reference section.
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
 *                   image sits. Here that is the portrait at 38%-72%.
 *
 * Consistency comes from VERTICAL RHYTHM, not from alignment - `pt-beat` /
 * `lg:pt-beat-lg`, paid once on top by every section - and nothing else lining
 * up on purpose.
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
 * axis, so a block may still overhang vertically - which the heading does -
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
 * The four figures are deliberately NOT aligned to one another - different
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

const HEADING_ID = "about-heading";

export function About() {
  return (
    <section
      id={SECTIONS.about.id}
      aria-labelledby={HEADING_ID}
      // Pays the beat above it, on top, once - no `pb-`. ONE OWNER PER GAP;
      // see `app/page.tsx`. The hero's bottom-anchored wordmark already leaves
      // empty photograph below itself, so this seam needs no break token.
      className="relative overflow-x-clip pt-beat lg:pt-beat-lg"
    >
      {/* THE FRAME - unpadded coordinate space, capped at the shell. */}
      <div className="relative mx-auto w-full max-w-shell">
        {/* LEFT EDGE - the section label, top of the frame. */}
        <p className="px-gutter font-display text-label uppercase italic tracking-label text-muted md:px-gutter-lg">
          {ABOUT.label}
        </p>

        {/* ── BAND ONE ───────────────────────────────────────────────────
            Portrait, rail and heading share one positioning context. The
            portrait is the only child left in flow at `lg`, so it alone sets
            the band's height - which is what lets the heading hang off the
            band's foot and land 40px below the image. */}
        <div className="relative mt-band lg:mt-band-lg">
          {/* RIGHT RAIL - ~30ch, flush right, top-aligned to the portrait.
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

          {/* OPTICAL BAND - the portrait. Full-bleed on mobile, a centred
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

          {/* LEFT EDGE - the five-line heading, bottom-anchored so its last
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
                  trimmed the final glyph. `text-headline-fluid` (min(12vw,3.5rem)) keeps the 56px
                  ceiling everywhere it fits and shrinks only on the narrow
                  widths that cannot hold it - the contract's remedy, chosen
                  over a new breakpoint. The arbitrary step carries no line
                  height of its own, so `leading-[1.02]` restores what
                  `text-headline` set and `md:leading-[0.98]` matches
                  `md:text-h1` explicitly rather than by cascade order. */}
              <Reveal
                as="span"
                stagger={0.08}
                duration={1}
                className="block font-display text-headline-fluid uppercase text-ink md:text-h1 lg:text-display-section"
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

        {/* ── STATS BAND (Single horizontal line, refined scale) ───────── */}
        <div className="relative mt-20 px-gutter md:px-gutter-lg lg:mt-32">
          <div className="border-t border-line/40 pt-10 pb-14">
            <ul
              role="list"
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
            >
              {ABOUT.figures.map((figure) => (
                <li key={figure.id} className="flex flex-col">
                  <div className="flex items-baseline">
                    <Counter
                      value={figure.value}
                      unit={figure.unit}
                      className="whitespace-nowrap font-display font-light text-2xl sm:text-3xl lg:text-[2.5rem] leading-none text-ink tracking-tight"
                      unitClassName="font-sans text-xs sm:text-sm text-muted font-normal ml-1.5"
                    />
                  </div>

                  <p className="mt-3 font-sans text-micro tracking-wider uppercase text-muted leading-relaxed max-w-[24ch]">
                    {figure.descriptor}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ── CLIENTS SECTION (Directly below stats) ───────────────────── */}
          <div className="border-t border-line/30 pt-12 pb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" aria-hidden="true" />
              <h3 className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted">
                OUR CLIENTS
              </h3>
            </div>

            {/* Logo grid: even rows at every width (14 logos = two rows of 7 on desktop). */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 items-center justify-items-center gap-x-6 gap-y-10 sm:gap-x-10 py-10 border-y border-line/20 px-2">
              {CLIENT_LOGOS.map((client) => (
                <div
                  key={client.name}
                  className="flex h-14 w-full items-center justify-center transition-[opacity,transform] duration-300 opacity-80 hover:opacity-100 hover:scale-105"
                  title={client.name}
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={client.width}
                    height={client.height}
                    className={`max-w-full object-contain ${client.className}`}
                  />
                </div>
              ))}
            </div>

            {/* Below the flex of logos: "...& many more" */}
            <div className="mt-6 flex justify-center sm:justify-end">
              <span className="font-display italic text-muted/80 text-base sm:text-lg tracking-wide">
                {CLIENT_MORE}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
