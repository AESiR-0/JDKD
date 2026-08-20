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
 * DOWNLOADS — the three plan sheets, and an honest hole where the brochure is.
 *
 * EVERY FILE LISTED HERE EXISTS IN `/public`. The content module builds each
 * `href` from the same `IMAGES` entry the viewer renders, so a listing cannot
 * drift from a file. Nothing else is offered: there is no brochure PDF, and
 * `downloads.unresolved` is how that gets said out loud rather than quietly
 * omitted. An absent slot reads as "there is nothing else"; a labelled empty
 * one reads as "not yet supplied", which is the truth.
 *
 * THE WHOLE ROW IS THE LINK. One `<a download>` per sheet carrying its name,
 * its weight and format, and what the drawing shows — so the accessible name is
 * a full sentence rather than three identical "Download" links in a row.
 *
 * NOT WRAPPED IN `<Reveal>`. The mask keeps `overflow: hidden` after it
 * finishes and would clip the focus ring off every row. The heading and the
 * rail above are safe to reveal; the list is not.
 *
 * The `download` attribute is honoured because these are same-origin paths. Red
 * appears here as a 2px underline decoration and nowhere else — a rule, never a
 * fill.
 */

const DOWNLOADS_ID = "downloads-heading";

/** The row link. `group` drives the hover state on the affordance word. */
const ROW_LINK =
  "group flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-12 lg:py-10";

export type ProjectDownloadsProps = {
  readonly downloads: RealProject["downloads"];
};

export function ProjectDownloads({ downloads }: ProjectDownloadsProps) {
  return (
    <section id="downloads" aria-labelledby={DOWNLOADS_ID} className={SECTION}>
      <div className={FRAME}>
        <p className={`${EDGE} ${LABEL}`}>{downloads.label}</p>

        <div
          className={`${EDGE} mt-10 lg:mt-14 lg:flex lg:items-start lg:justify-between lg:gap-16`}
        >
          <DisplayHeading
            id={DOWNLOADS_ID}
            lines={downloads.headingLines}
            spoken={downloads.spokenHeading}
            className="lg:w-[52%]"
          />

          <div className={`mt-10 ${RAIL_COPY} lg:mt-0 lg:w-[30ch]`}>
            <Reveal as="p" delay={0.1}>
              {downloads.body}
            </Reveal>
          </div>
        </div>

        <ul role="list" className={`${EDGE} mt-14 lg:mt-20`}>
          {downloads.files.map((file) => (
            <li
              key={file.id}
              className="border-t border-line last:border-b last:border-line"
            >
              <a href={file.href} download={file.filename} className={ROW_LINK}>
                <span className="md:w-[38%]">
                  <span className="block font-display text-h3 uppercase tracking-tight text-ink">
                    {file.label}
                  </span>
                  <span className="mt-2 block text-micro text-muted">
                    {file.meta}
                  </span>
                </span>

                <span className="text-small text-muted md:w-[34ch]">
                  {file.description}
                </span>

                <span className="text-micro uppercase tracking-label text-muted underline decoration-red decoration-2 underline-offset-4 transition-colors duration-200 ease-editorial group-hover:text-ink md:ml-auto">
                  Download
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* THE BROCHURE THAT DOES NOT EXIST YET. Labelled, visibly empty. */}
        <div className={`${EDGE} mt-14 lg:mt-20`}>
          <p className="text-micro uppercase tracking-label text-muted">
            {downloads.unresolved.label}
          </p>
          <span
            aria-hidden="true"
            className="mt-4 block h-px w-full max-w-[240px] bg-line-strong"
          />
          <p className="mt-4 max-w-[38ch] text-small text-muted">
            {downloads.unresolved.placeholder}
          </p>
        </div>
      </div>
    </section>
  );
}
