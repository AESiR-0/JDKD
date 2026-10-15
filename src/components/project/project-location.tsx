import { Reveal } from "@/components/motion/reveal";
import {
  DisplayHeading,
  EDGE,
  FRAME,
  LABEL,
  RAIL_COPY,
  SECTION,
} from "@/components/project/chrome";
import type { PropertyMap, ProjectLocationContent } from "@/lib/content";

/**
 * LOCATION - the complete address, the map, and the proximity facts.
 *
 *      ▓                                                            ▓
 *      │  (LOCATION & CONNECTIVITY)                                 │
 *      │  ON THE                             ┌──────────────────┐   │
 *      │  VIOLET LINE                        │  body, ~30ch     │   │
 *      │  CORRIDOR.                          └──────────────────┘   │
 *      │                                                            │
 *      │  ADDRESS                      ┌──────────────────────────  │
 *      │  A-11, Mohan Co-operative …   │                            │
 *      │  OPEN IN GOOGLE MAPS →        │  live map of the address,  │
 *      │  ───────────────────────      │  full band height,         │
 *      │  350 m   Sarita Vihar Metro   │  bleeds off the RIGHT      │
 *      │  500 m   Apollo Hospital      │                            │
 *      │                               └──────────────────────────  │
 *
 * THE MAP REPLACED A PHOTOGRAPH. Every project used to share the Mathura Road
 * aerial here, which put Sarita Vihar Metro on the Greater Kailash pages; the
 * client also asked for each property's map and complete address (round of
 * 13.10.26). A map of the address cannot show the wrong place.
 *
 * WHICH CHILD SETS THE BAND'S HEIGHT - the LEFT COLUMN, not the map. The
 * column grows with its copy; an absolutely positioned column would overflow
 * the map it was measured against. So the column stays in flow and the map is
 * stretched to match it with `lg:inset-y-0`. A property with no proximity facts
 * has a short column, so the band itself carries a floor (`lg:min-h-[32rem]`)
 * - set on the band, never on the map, or the map would hang past the band's
 * foot into the next section.
 *
 * THE MAP is Google's keyless embed, lazy-loaded and centred on the exact pin -
 * the client's coordinates, or what their short link resolves to. The link
 * under the address opens THEIR link. The embed is
 * inverted to sit on the dark page - a static filter on a third-party frame,
 * not an animated one, so the site's motion rule does not apply.
 *
 * NOT EVERY POINT HAS A DISTANCE. `LocationPoint.distance` is null where the
 * deck states none, and nothing here invents one - that row simply leads with
 * the place.
 */

const LOCATION_ID = "location-heading";

/** Interface microcopy - chrome, not content. */
const UI = {
  address: "Address",
  open: "Open in Google Maps",
  newTab: "(opens in a new tab)",
} as const;

function embedSrc(map: PropertyMap): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(map.query)}&z=16&output=embed`;
}

export type ProjectLocationProps = {
  readonly connectivity: ProjectLocationContent;
};

export function ProjectLocation({ connectivity }: ProjectLocationProps) {
  return (
    <section id="location" aria-labelledby={LOCATION_ID} className={SECTION}>
      <div className={FRAME}>
        {/* HEADER BAND - heading in flow at the left edge sets the height; the
            rail hangs off the right gutter from `lg`. */}
        <div className="relative">
          <p className={`${EDGE} ${LABEL}`}>{connectivity.label}</p>

          <DisplayHeading
            id={LOCATION_ID}
            lines={connectivity.headingLines}
            spoken={connectivity.spokenHeading}
            className={`${EDGE} mt-10 lg:mt-14 lg:w-[56%]`}
          />

          {connectivity.body ? (
            <div
              className={`${EDGE} mt-10 ${RAIL_COPY} lg:absolute lg:right-gutter-lg lg:top-0 lg:mt-0 lg:w-[30ch] lg:px-0`}
            >
              <Reveal as="p" delay={0.1}>
                {connectivity.body}
              </Reveal>
            </div>
          ) : null}
        </div>

        {/* ADDRESS + MAP BAND - the column is the flow child and sets the
            height, over a floor so a short column still gets a usable map. */}
        <div className="relative mt-band lg:mt-band-lg lg:min-h-[32rem]">
          <div className={`${EDGE} lg:w-[46%]`}>
            <h3 className="text-micro uppercase tracking-label text-muted">
              {UI.address}
            </h3>
            <Reveal
              as="address"
              delay={0.05}
              className="mt-4 font-display text-h3 not-italic tracking-tight text-ink"
            >
              {connectivity.address}
            </Reveal>

            {connectivity.facts && connectivity.facts.length > 0 ? (
              <dl className="mt-8 border-t border-line">
                {connectivity.facts.map((fact) => (
                  <div
                    key={fact.id}
                    className="border-b border-line py-4 sm:flex sm:items-baseline sm:gap-8"
                  >
                    <dt className="text-micro uppercase tracking-label text-muted sm:w-32 sm:shrink-0">
                      {fact.term}
                    </dt>
                    <dd className="mt-1 text-body text-ink sm:mt-0">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/* NOT inside a Reveal: its mask keeps `overflow: hidden` and would
                clip this link's focus ring. */}
            <a
              data-press
              href={connectivity.map.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 border-b border-red pb-2 text-label uppercase tracking-label text-ink transition-colors duration-200 ease-editorial hover:text-pure"
            >
              {UI.open}
              <span className="sr-only"> {UI.newTab}</span>
              <span aria-hidden="true">&rarr;</span>
            </a>

            {connectivity.points.length > 0 ? (
              <ol role="list" className="mt-12 border-t border-line pt-7 lg:mt-14 lg:pt-9">
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
            ) : null}
          </div>

          {/* EDGE-BLEED-RIGHT, full band height from `lg`. `calc(50% - 50vw)`
              is exact: below 1440px the frame IS the viewport and it resolves
              to 0; above it, it is precisely the frame's own right inset. The
              section's `overflow-x-clip` absorbs the scrollbar delta. */}
          <div className="mt-12 aspect-[4/3] w-full overflow-hidden bg-surface md:ml-auto md:w-[72%] lg:absolute lg:inset-y-0 lg:right-[calc(50%-50vw)] lg:mt-0 lg:aspect-auto lg:h-full lg:w-[46vw]">
            <iframe
              title={`Map of ${connectivity.address}`}
              src={embedSrc(connectivity.map)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.75)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
