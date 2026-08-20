import { Reveal } from "@/components/motion/reveal";
import type { DisplayLine } from "@/lib/content";

/**
 * Shared treatments for the project detail route.
 *
 * `app/about/page.tsx` is the worked reference and it declares these same
 * literals at the top of its own file, because it is one file. The detail page
 * is eight sections across eight files, so the identical literals live here and
 * are shared by reference — that is the only difference between the two.
 *
 * NEVER BUILD A TAILWIND CLASS BY CONCATENATION OR INTERPOLATION. The v4
 * scanner reads source text, so a class assembled at runtime is never
 * generated. Every string below is written out whole; joining two COMPLETE
 * literals (as every section here does) is fine, splicing a value into one is
 * not.
 *
 * SERVER MODULE. `Reveal` is a client leaf and stays one — nothing in this file
 * may carry `"use client"`.
 */

/**
 * The section shell.
 *
 * Full-bleed, owns the vertical rhythm, and clips the horizontal axis only —
 * `overflow-x-clip` rather than `overflow-hidden` because clip creates no
 * scroll container and therefore cannot break the sticky sub-nav that rides
 * above these sections for the whole page.
 *
 * `scroll-mt-*` IS NOT OPTIONAL HERE. `globals.css` reserves 3.5rem / 4rem of
 * scroll margin for the fixed header alone; on this route a sticky sub-nav sits
 * directly beneath it, so an anchor jump would land a section heading behind
 * the bar. These two values are the header plus that bar plus air.
 */
export const SECTION =
  "relative overflow-x-clip py-section scroll-mt-[7.5rem] lg:py-section-lg lg:scroll-mt-[8.5rem]";

/**
 * The unpadded coordinate space every percentage anchor is measured against.
 * It carries no padding on purpose: an absolutely positioned child resolves
 * `right: 3.5rem` against its containing block's PADDING box, so a padded frame
 * would put percentage anchors and flow children one gutter out of agreement.
 * Reading children apply their own edge anchor.
 */
export const FRAME = "relative mx-auto w-full max-w-shell";

/** The left-edge anchor, for any child that is in flow. */
export const EDGE = "px-gutter md:px-gutter-lg";

/** Parenthetical section marker. There are NO numerals in this vocabulary. */
export const LABEL =
  "font-display text-label uppercase italic tracking-label text-muted";

/**
 * Display heading. SIZE IS CAPPED, NOT FLAT: `min(12vw, 3.5rem)` holds the 56px
 * unprefixed ceiling everywhere it fits and shrinks only on the narrow widths
 * that cannot hold it. The arbitrary steps carry no line height of their own,
 * so each restores one explicitly rather than relying on cascade order.
 */
export const DISPLAY =
  "block font-display text-[min(12vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-ink md:text-h1 md:leading-[0.98] lg:text-[min(5vw,5rem)] lg:leading-[0.94]";

/** Right-rail copy. `text-small` sits on the rail so `30ch` measures the copy. */
export const RAIL_COPY = "text-small text-muted";

/** A block heading inside a section — one step under the display heading. */
export const BLOCK_TITLE =
  "font-display text-h3 uppercase tracking-tight text-ink";

/** The one hairline a band is allowed. Sparingly means once. */
export const HAIRLINE = "block h-px w-24 bg-line-strong";

/* ==========================================================================
   DISPLAY HEADING

   Display type is broken for COMPOSITION, not for reading. The visible stack is
   hidden from assistive technology and `spoken` carries the readable sentence
   `sr-only`, because otherwise a screen reader announces every line break as a
   sentence break. Identical to the component `about/page.tsx` declares.
   ========================================================================== */

export type DisplayHeadingProps = {
  readonly id: string;
  readonly lines: readonly DisplayLine[];
  readonly spoken: string;
  /** Placement classes on the `<h2>` itself. */
  readonly className?: string;
  /** Type classes on the revealed stack. @default DISPLAY */
  readonly typeClassName?: string;
};

export function DisplayHeading({
  id,
  lines,
  spoken,
  className,
  typeClassName = DISPLAY,
}: DisplayHeadingProps) {
  return (
    <h2 id={id} className={className}>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true" className="block">
        <Reveal as="span" stagger={0.08} duration={1} className={typeClassName}>
          {lines.map((line) => (
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
  );
}
