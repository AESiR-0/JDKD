import { Reveal } from "@/components/motion/reveal";
import {
  DisplayHeading,
  EDGE,
  FRAME,
  LABEL,
  RAIL_COPY,
  SECTION,
} from "@/components/project/chrome";
import type { RealProject } from "@/lib/content";

/**
 * OVERVIEW — the page's first reading section.
 *
 * TYPE ONLY. No picture at all, which is deliberate: the hero plate sits
 * immediately above it and a second photograph this early would leave the
 * building described twice and read once.
 *
 *      ▓                                                            ▓
 *      │  (OVERVIEW)                                                │
 *      │                                                            │
 *      │  A CORNER                          ┌───────────────────┐   │
 *      │  PLOT, OPEN                        │  two paragraphs   │   │
 *      │  ON TWO SIDES.                     │  on ~30ch         │   │
 *      │                                    └───────────────────┘   │
 *      │  ── Asset class ─────────  ── Terrace parapet ───────────  │
 *      │  ── Availability ────────  ── Orientation ───────────────  │
 *
 * Because nothing here is a picture, the header band uses the SIMPLER of the
 * two right-rail idioms — a padded flex row rather than an absolutely
 * positioned rail. Nothing is measured against a photograph's height, so
 * nothing has to leave the flow, and a flex rail cannot overflow the band it
 * sits in.
 *
 * THE SPEC TABLE IS THE ONE PLACE ON THIS PAGE A REAL GRID IS EARNED. Ten
 * term/value pairs ARE tabular data; the design system bans a uniform
 * twelve-column grid applied as a layout system, not `grid` itself where the
 * content genuinely is one. It is a `<dl>` of two columns — never `grid-cols-12`
 * and never a `col-span-*`.
 */

const OVERVIEW_ID = "overview-heading";

export type ProjectOverviewProps = {
  readonly overview: RealProject["overview"];
};

export function ProjectOverview({ overview }: ProjectOverviewProps) {
  return (
    <section id="overview" aria-labelledby={OVERVIEW_ID} className={SECTION}>
      <div className={FRAME}>
        <p className={`${EDGE} ${LABEL}`}>{overview.label}</p>

        {/* HEADER BAND — flex rail idiom (B): heading at the left edge, copy
            flush right on the site-wide ~30ch measure. */}
        <div
          className={`${EDGE} mt-10 lg:mt-14 lg:flex lg:items-start lg:justify-between lg:gap-16`}
        >
          <DisplayHeading
            id={OVERVIEW_ID}
            lines={overview.headingLines}
            spoken={overview.spokenHeading}
            className="lg:w-[52%]"
          />

          <div className={`mt-10 ${RAIL_COPY} lg:mt-0 lg:w-[30ch]`}>
            <Reveal as="div" stagger={0.09} delay={0.1}>
              {overview.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-5 first:mt-0">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </div>

        {/* THE SPECIFICATION. A `<dl>` whose rows are `<div>` wrappers — valid
            HTML5, and what lets each pair stay a single grid cell. The bottom
            rule closes the table off; every row supplies its own top rule, so
            the two columns end on the same line whatever the row heights. */}
        <dl
          className={`${EDGE} mt-16 border-b border-line lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-x-16`}
        >
          {overview.specs.map((row) => (
            <div key={row.id} className="border-t border-line py-5 lg:py-6">
              <dt className="text-micro uppercase tracking-label text-muted">
                {row.term}
              </dt>
              <dd className="mt-2 text-body text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
