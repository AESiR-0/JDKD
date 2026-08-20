"use client";

import { useId, useState } from "react";

import { FAQ } from "@/lib/content";

/**
 * FaqRows — the interactive half of section 07.
 *
 * CLIENT LEAF, and it must stay a leaf. `sections/faq.tsx` is a Server
 * Component; only the rows need state, so only the rows cross the boundary.
 * Same arrangement as `ui/enquiry-form.tsx` — never lift `"use client"` up onto
 * a section.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO BOXES. The rows are 1px hairlines and nothing else: no card, no border
 * radius, no chevron in a circle. The structure is the rule between rows and
 * the empty middle of each row, which is where the answer opens.
 *
 *   ├──────────────────────────────────────────────────────────────────┤
 *   │  +                                          Where is the building? │
 *   │             A-11, Mohan Cooperative Industrial Estate…             │
 *   ├──────────────────────────────────────────────────────────────────┤
 *
 * The question is right-aligned italic serif against the right gutter; the
 * indicator hangs off the left edge; the answer opens in the centre band at
 * 28%. That left-to-right disagreement between question and answer is the
 * composition — do not align them.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR. One answer open at a time, and the open one can be closed again.
 * The first row is open on first paint, so the section is never a stack of
 * five closed rules — and so a visitor whose JavaScript never arrives still
 * reads an answer.
 *
 * ACCESSIBILITY follows the APG disclosure pattern: a real `<button>` inside an
 * `<h3>`, `aria-expanded` on the button, `aria-controls` pointing at a panel
 * that is a labelled `region`. A collapsed panel carries `inert`, which takes
 * its text out of the accessibility tree and out of the tab order — clipping it
 * visually is not enough on its own.
 *
 * THE HEIGHT ANIMATION is the `grid-template-rows: 0fr → 1fr` transition on a
 * single-row grid whose child is `overflow-hidden`. It animates a layout
 * property, which the site's motion rules otherwise forbid — the exception is
 * deliberate and confined to this file, because an accordion that snaps open is
 * not the specified behaviour. No `filter`, no animated `box-shadow`, and the
 * global reduced-motion rule in `globals.css` zeroes the duration.
 *
 * NO `<Reveal>` ANYWHERE BELOW. Its mask keeps `overflow: hidden` after it
 * finishes, which would clip the focus ring on every one of these buttons.
 */

export type FaqRowsProps = {
  /** Placement classes from the section. The rows own no vertical rhythm. */
  className?: string;
};

export function FaqRows({ className }: FaqRowsProps) {
  const uid = useId();
  // Open on first paint, and therefore open in the server-rendered HTML.
  const [openId, setOpenId] = useState<string | null>(FAQ.items[0].id);

  return (
    <ul
      // `list-none` from preflight strips list semantics in Safari.
      role="list"
      className={`border-t border-line ${className ?? ""}`}
    >
      {FAQ.items.map((item) => {
        const isOpen = item.id === openId;
        const buttonId = `${uid}-${item.id}-question`;
        const panelId = `${uid}-${item.id}-answer`;

        return (
          <li key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="group flex w-full cursor-pointer items-start gap-8 px-gutter py-7 text-left md:px-gutter-lg lg:gap-20 lg:py-10"
              >
                {/* LEFT EDGE — a plus that lies down into a minus. Two 1px
                    rules and a rotation: transform only, no glyph, no icon. */}
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 block size-5 shrink-0 lg:mt-2.5 lg:size-6"
                >
                  <span className="absolute left-0 top-1/2 block h-hair w-full -translate-y-1/2 bg-line-strong transition-colors duration-300 ease-editorial group-hover:bg-red" />
                  <span
                    className={`absolute left-1/2 top-0 block h-full w-hair -translate-x-1/2 bg-line-strong transition-[transform,background-color] duration-500 ease-editorial group-hover:bg-red ${
                      isOpen ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </span>

                {/* Right-aligned, flush to the right gutter. Sentence case:
                    these are questions, not labels, and the display serif is
                    uppercased only where it is set as display type. */}
                <span className="grow text-right font-display text-h3 italic tracking-tight text-ink transition-colors duration-300 ease-editorial group-hover:text-pure">
                  {item.question}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-500 ease-editorial ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              {/* `overflow-hidden` is what lets the 0fr row collapse: without
                  it the child's min-content height keeps the row open. */}
              <div className="overflow-hidden">
                <p className="px-gutter pb-9 text-small text-muted md:px-gutter-lg lg:ml-[28%] lg:max-w-[54ch] lg:px-0 lg:pb-14">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
