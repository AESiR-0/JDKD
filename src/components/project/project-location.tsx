import { ImageCard } from "@/components/motion/image-card";
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
 * LOCATION & CONNECTIVITY — the first band on this page with a photograph, and
 * the home `location-aerial.jpg` never had.
 *
 *      ▓                                                            ▓
 *      │  (LOCATION & CONNECTIVITY)                                 │
 *      │  ON THE                             ┌──────────────────┐   │
 *      │  VIOLET LINE                        │  body, ~30ch     │   │
 *      │  CORRIDOR.                          └──────────────────┘   │
 *      │                                                            │
 *      │  350 m   Sarita Vihar Metro   ┌──────────────────────────  │
 *      │  500 m   Apollo Hospital      │  location-aerial.jpg      │
 *      │  ——      Main Mathura Road    │  full band height,        │
 *      │  5 km    NOIDA business hub   │  bleeds off the RIGHT     │
 *      │                               └──────────────────────────  │
 *
 * WHICH CHILD SETS THE BAND'S HEIGHT — the DISTANCE LIST, not the picture, and
 * that inversion is deliberate. A list of proximity facts grows with its copy;
 * an absolutely positioned list would overflow the photograph it was measured
 * against. So the list stays in flow and the picture is stretched to match it
 * with `lg:inset-y-0` plus `lg:aspect-auto lg:h-full` — the `aspect-auto` is
 * required, it cancels the mobile aspect ratio so `h-full` can take over.
 *
 * `aspect-square` on mobile because the asset is 864 × 900 on disk; a 4:3 frame
 * would crop the metro corridor out of the top of the picture, which is the one
 * thing the aerial is here to show.
 *
 * NOT EVERY POINT HAS A DISTANCE. `LocationPoint.distance` is null for Mathura
 * Road because the deck states none, and nothing here invents one — that row
 * simply leads with the place. A dash in the numeral slot would read as a
 * measured value of zero.
 */

const LOCATION_ID = "location-heading";

export type ProjectLocationProps = {
  readonly connectivity: RealProject["connectivity"];
};

export function ProjectLocation({ connectivity }: ProjectLocationProps) {
  return (
    <section id="location" aria-labelledby={LOCATION_ID} className={SECTION}>
      <div className={FRAME}>
        {/* HEADER BAND — heading in flow at the left edge sets the height; the
            rail hangs off the right gutter from `lg`. No picture in this band,
            so the rail behaves normally. */}
        <div className="relative">
          <p className={`${EDGE} ${LABEL}`}>{connectivity.label}</p>

          <DisplayHeading
            id={LOCATION_ID}
            lines={connectivity.headingLines}
            spoken={connectivity.spokenHeading}
            className={`${EDGE} mt-10 lg:mt-14 lg:w-[56%]`}
          />

          <div
            className={`${EDGE} mt-10 ${RAIL_COPY} lg:absolute lg:right-gutter-lg lg:top-0 lg:mt-0 lg:w-[30ch] lg:px-0`}
          >
            <Reveal as="p" delay={0.1}>
              {connectivity.body}
            </Reveal>
          </div>
        </div>

        {/* DISTANCES BAND — the list is the flow child and sets the height. */}
        <div className="relative mt-16 lg:mt-28">
          <ol role="list" className={`${EDGE} lg:w-[46%]`}>
            {connectivity.points.map((point) => (
              <li
                key={point.id}
                className="border-t border-line py-7 first:border-t-0 first:pt-0 last:pb-0 lg:py-9 lg:first:pt-0"
              >
                {point.distance ? (
                  <Reveal
                    as="p"
                    className="font-display text-h3 tracking-tight text-ink lg:text-h2"
                  >
                    {point.distance}
                  </Reveal>
                ) : null}

                <Reveal
                  as="p"
                  delay={0.05}
                  className={
                    point.distance
                      ? "mt-3 text-body-lg text-ink"
                      : "font-display text-h3 uppercase tracking-tight text-ink lg:text-h2"
                  }
                >
                  {point.place}
                </Reveal>

                <Reveal as="p" delay={0.08} className="mt-2 text-micro text-muted">
                  {point.detail}
                </Reveal>
              </li>
            ))}
          </ol>

          {/* EDGE-BLEED-RIGHT, full band height from `lg`. `calc(50% - 50vw)`
              is exact: below 1440px the frame IS the viewport and it resolves
              to 0; above it, it is precisely the frame's own right inset. The
              section's `overflow-x-clip` absorbs the scrollbar delta. */}
          <ImageCard
            src={connectivity.image.src}
            alt={connectivity.image.alt}
            sizes="(min-width: 1024px) 46vw, (min-width: 768px) 72vw, 100vw"
            surface="ink"
            shift={5}
            scale={1.05}
            delay={0.08}
            className="mt-12 aspect-square w-full md:ml-auto md:w-[72%] lg:absolute lg:inset-y-0 lg:right-[calc(50%-50vw)] lg:mt-0 lg:aspect-auto lg:h-full lg:w-[46vw]"
          />
        </div>
      </div>
    </section>
  );
}
