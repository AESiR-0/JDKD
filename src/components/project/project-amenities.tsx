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
 * AMENITIES & BUILDING SYSTEMS — five groups, thirty-odd lines of plant.
 *
 * COLUMN FLOW, NOT A GRID. This is a specification index: five headed groups of
 * short lines, read down rather than across. Multi-column text flow is what
 * that content is, so the groups are set in two columns at `md` and three at
 * `lg` with `break-inside-avoid` keeping a group whole. No `grid-cols-12`, no
 * `col-span-*`, and no cards — a bento of five tiles would give equal weight to
 * "Two service elevators" and "LEED certified green building" and turn a
 * technical list into marketing.
 *
 *      ▓                                                            ▓
 *      │  (AMENITIES & SYSTEMS)                                     │
 *      │  WHAT RUNS                          ┌──────────────────┐   │
 *      │  BEHIND THE WALLS.                  │  body, ~30ch     │   │
 *      │                                     └──────────────────┘   │
 *      │  ──────────────  ──────────────  ──────────────            │
 *      │  (MOVEMENT &     (POWER)         (CLIMATE & AIR)           │
 *      │   LIFE SAFETY)   Power grid…     Air conditioning          │
 *      │  Two passenger…  Switch gear…    Fresh air system          │
 *
 * GROUP HEADINGS ARE PARENTHETICAL, like every marker on this site, but they
 * are real `<h3>`s and they take `text-ink` rather than `text-muted` — a
 * heading inside a section is not the same object as the section's own marker,
 * and the colour is what keeps the two readable as different things.
 */

const AMENITIES_ID = "amenities-heading";

export type ProjectAmenitiesProps = {
  readonly amenities: RealProject["amenities"];
};

export function ProjectAmenities({ amenities }: ProjectAmenitiesProps) {
  return (
    <section id="amenities" aria-labelledby={AMENITIES_ID} className={SECTION}>
      <div className={FRAME}>
        {/* HEADER BAND — heading in flow sets the height, rail hangs off the
            right gutter from `lg`. */}
        <div className="relative">
          <p className={`${EDGE} ${LABEL}`}>{amenities.label}</p>

          <DisplayHeading
            id={AMENITIES_ID}
            lines={amenities.headingLines}
            spoken={amenities.spokenHeading}
            className={`${EDGE} mt-10 lg:mt-14 lg:w-[56%]`}
          />

          <div
            className={`${EDGE} mt-10 ${RAIL_COPY} lg:absolute lg:right-gutter-lg lg:top-0 lg:mt-0 lg:w-[30ch] lg:px-0`}
          >
            <Reveal as="p" delay={0.1}>
              {amenities.body}
            </Reveal>
          </div>
        </div>

        {/* THE INDEX. `gap-x-12` is the column gap; `break-inside-avoid` keeps a
            group and its lines together when the flow wraps. */}
        <div
          className={`${EDGE} mt-16 gap-x-12 lg:mt-24 md:columns-2 lg:columns-3`}
        >
          {amenities.groups.map((group) => (
            <div
              key={group.id}
              className="mb-10 break-inside-avoid border-t border-line pt-6 lg:mb-12"
            >
              <Reveal
                as="h3"
                className="font-display text-label uppercase italic tracking-label text-ink"
              >
                {group.heading}
              </Reveal>

              <ul role="list" className="mt-4">
                {group.items.map((item) => (
                  <li key={item} className="mt-2.5 text-small text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
