import { Reveal } from "@/components/motion/reveal";
import { FaqRows } from "@/components/ui/faq-rows";
import { FAQ, SECTIONS } from "@/lib/content";

/**
 * 07 — FAQ.
 *
 * Conventions are copied from `sections/about.tsx`, the worked reference: one
 * full-bleed `<section>` that owns the vertical rhythm and `overflow-x-clip`,
 * and inside it exactly one unpadded `max-w-shell` frame that every percentage
 * anchor is measured against.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE COMPOSITION, at `lg` and above.
 *
 *      0%              34%                              right gutter
 *      ├───────────────┼──────────────────────────────────────┤
 *      (QUESTIONS)                                                ← left edge
 *                      EVERYTHING
 *                      YOU NEED TO KNOW.
 *      ├────────────────────────────────────────────────────────┤  hairline
 *      +                                        Where is the building?
 *                 A-11, Mohan Cooperative Industrial Estate…
 *      ├────────────────────────────────────────────────────────┤
 *
 * The label hangs off the LEFT EDGE, the heading starts at 34% of the frame,
 * and the rows span the frame edge to edge as 1px rules. There is no card and
 * no rounded accordion anywhere in this section.
 *
 * THE ROWS ARE A REAL GRID in the sense the design system permits — they and
 * the Beliefs B bento are the only two places on the site allowed to be one.
 * Even so there is no `grid-cols-12` and no `col-span-*` below: the row is a
 * flex pair (indicator, question) and the answer is anchored at 28%.
 *
 * HEADING SIZE. The spec calls for `text-display-sm` (96px). Measured in Prata
 * at the shipped tracking, "YOU NEED TO KNOW." is 10.76em wide, so 96px needs
 * about 1030px — and the column from the 34% anchor to the right gutter is
 * 894px at the shell's full width. The fluid size is therefore capped rather
 * than the anchor moved: that is the documented remedy, cap the size and keep
 * the anchor. The unprefixed step is bounded by a different word — "EVERYTHING"
 * at 6.76em cannot break, so 12.2vw is what keeps it inside a 375px gutter.
 *
 * SERVER COMPONENT. `Reveal` and `FaqRows` are the only client boundaries and
 * both are leaves. The interactive rows live in `ui/faq-rows.tsx` precisely so
 * this file never needs `"use client"`.
 */

const HEADING_ID = "faq-heading";

export function Faq() {
  return (
    <section
      id={SECTIONS.faq.id}
      aria-labelledby={HEADING_ID}
      // Standard rhythm. The pacing break that precedes the CTA is carried on
      // the CTA's own `pt-`, the way About carries the break that follows the
      // hero — never as a `pb-` stacked on top of a `py-` here.
      className="relative overflow-x-clip py-section lg:py-section-lg"
    >
      {/* THE FRAME — unpadded coordinate space, capped at the shell. */}
      <div className="relative mx-auto w-full max-w-shell">
        {/* LEFT EDGE — the section label. */}
        <p className="px-gutter font-display text-label uppercase italic tracking-label text-muted md:px-gutter-lg">
          {FAQ.label}
        </p>

        {/* The heading is broken for composition, not for reading: the
            readable sentence is `sr-only` and the visible stack is hidden from
            assistive technology. */}
        <h2
          id={HEADING_ID}
          className="mt-12 px-gutter md:px-gutter-lg lg:mt-24 lg:ml-[34%] lg:mr-gutter-lg lg:px-0"
        >
          <span className="sr-only">{FAQ.spokenHeading}</span>
          <span aria-hidden="true" className="block">
            <Reveal
              as="span"
              stagger={0.09}
              duration={1}
              className="block font-display text-[min(12.2vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-ink lg:text-[min(5.4vw,5rem)] lg:leading-[0.95]"
            >
              {FAQ.headingLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </Reveal>
          </span>
        </h2>

        {/* The rows span the frame. They are never wrapped in a Reveal — the
            mask keeps `overflow: hidden` and would clip each button's focus
            ring. */}
        <FaqRows className="mt-16 lg:mt-28" />
      </div>
    </section>
  );
}
