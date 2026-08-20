import { Reveal } from "@/components/motion/reveal";
import {
  BLOCK_TITLE,
  EDGE,
  FRAME,
  LABEL,
  RAIL_COPY,
  SECTION,
} from "@/components/project/chrome";
import type { RealProject } from "@/lib/content";

/**
 * KEY HIGHLIGHTS — the deck's verbatim trio.
 *
 * Location Advantage / Future-Ready Infrastructure / Asset Differentiators.
 * Those three titles are the client's own words and are NOT to be reworded,
 * re-ordered or merged; the content module carries them verbatim and this file
 * only places them.
 *
 * NO DISPLAY HEADING. This group has a marker and nothing else to say at
 * section level, so the parenthetical marker IS the `<h2>` — the same device
 * `site-footer.tsx` uses for its columns and `about/page.tsx` uses for its
 * numbers band. A section must always be named by a real heading; inventing a
 * sentence to head it would be inventing copy.
 *
 *      ▓                                                            ▓
 *      │  (KEY HIGHLIGHTS)                                          │
 *      ├────────────────────────────────────────────────────────────┤
 *      │  LOCATION ADVANTAGE          ── 350 m from Sarita Vihar ──  │
 *      │  body, ~34ch                 ── 500 m from Apollo ───────   │
 *      ├────────────────────────────────────────────────────────────┤
 *      │  FUTURE-READY                ── LEED certified ──────────   │
 *
 * NOT A CARD GRID and not a `grid-cols-12`: three flex rows, two children each,
 * and the second is pushed right with `ml-auto` rather than assigned a column
 * span. The points are a ledger of hairline rows on the site-wide right
 * measure — the same measure the rail uses everywhere else on this page, which
 * is what ties eight differently-composed sections together.
 */

const HIGHLIGHTS_ID = "highlights-heading";

export type ProjectHighlightsProps = {
  readonly highlights: RealProject["highlights"];
};

export function ProjectHighlights({ highlights }: ProjectHighlightsProps) {
  return (
    <section id="highlights" aria-labelledby={HIGHLIGHTS_ID} className={SECTION}>
      <div className={FRAME}>
        <h2 id={HIGHLIGHTS_ID} className={`${EDGE} ${LABEL}`}>
          {highlights.label}
        </h2>

        <ol role="list" className={`${EDGE} mt-12 lg:mt-20`}>
          {highlights.items.map((item) => (
            <li
              key={item.id}
              className="border-t border-line-strong py-10 last:border-b last:border-line-strong lg:flex lg:items-start lg:gap-16 lg:py-14"
            >
              {/* LEFT — the verbatim title and its one-line reading. */}
              <div className="lg:w-[42%]">
                <Reveal as="h3" className={`${BLOCK_TITLE} lg:text-h2`}>
                  {item.title}
                </Reveal>
                <Reveal
                  as="p"
                  delay={0.06}
                  className={`mt-5 max-w-[34ch] ${RAIL_COPY}`}
                >
                  {item.body}
                </Reveal>
              </div>

              {/* RIGHT — the facts, one hairline row each, on the ~32ch
                  measure. Pushed right with `ml-auto`; no column span. */}
              <ul
                role="list"
                className="mt-8 lg:mt-0 lg:ml-auto lg:w-[32ch]"
              >
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="border-t border-line py-3 text-small text-ink first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-3"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
