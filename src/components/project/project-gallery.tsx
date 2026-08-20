import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { EDGE, FRAME, LABEL, RAIL_COPY, SECTION } from "@/components/project/chrome";
import type { RealProject } from "@/lib/content";

/**
 * GALLERY — five renders, and the home `facade-detail.jpg` never had.
 *
 * TWO BANDS, not one wall of thumbnails.
 *
 *   BAND ONE — the curtain-wall detail bleeds off the LEFT viewport edge and is
 *   the only child left in flow at `lg`, so it alone sets the band's height.
 *   The marker and the caption travel together as ONE absolutely positioned
 *   column flush to the right gutter, vertically centred against the picture.
 *
 *        ▓ viewport edge
 *        ┌──────────────────────┐
 *        │  facade-detail.jpg   │        (GALLERY)
 *        │  bleeds off the      │        ┌────────────┐
 *        │  LEFT edge, 42vw     │        │ body, 30ch │
 *        └──────────────────────┘        └────────────┘
 *
 *   BAND TWO — the four remaining renders in a real two-column gallery. This is
 *   the second and last place on the page where `grid` is earned: a gallery
 *   genuinely IS a grid. It is `grid-cols-2`, never `grid-cols-12`, and no
 *   child carries a `col-span-*`. Every second frame is dropped by `md:mt-16`
 *   so the pairs do not march in lockstep — the offset is a complete literal
 *   chosen by index parity, never a class assembled from a value.
 *
 * NO DISPLAY HEADING — the content module gives this section a marker and a
 * caption and nothing else, so the marker IS the `<h2>`. Inventing a sentence
 * to head it would be inventing copy.
 *
 * ALT TEXT travels with each asset in `@/lib/content`; nothing here writes one.
 */

const GALLERY_ID = "gallery-heading";

export type ProjectGalleryProps = {
  readonly gallery: RealProject["gallery"];
};

export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  const [lead, ...rest] = gallery.images;

  return (
    <section id="gallery" aria-labelledby={GALLERY_ID} className={SECTION}>
      <div className={FRAME}>
        <div className="relative">
          {/* TYPE FIRST IN THE DOM. On a phone this reads marker, caption,
              picture; at `lg` the column lifts out of flow and the picture
              takes over the band's height. */}
          <div className="lg:absolute lg:right-gutter-lg lg:top-1/2 lg:z-10 lg:w-[30ch] lg:-translate-y-1/2">
            <h2 id={GALLERY_ID} className={`${EDGE} ${LABEL} lg:px-0`}>
              {gallery.label}
            </h2>

            <div className={`${EDGE} mt-6 ${RAIL_COPY} lg:mt-8 lg:px-0`}>
              <Reveal as="p" delay={0.1}>
                {gallery.body}
              </Reveal>
            </div>
          </div>

          {/* EDGE-BLEED-LEFT. `calc(50% - 50vw)` is exact: below 1440px the
              frame IS the viewport and it resolves to 0; above it, it is
              precisely the frame's own left inset. */}
          {lead ? (
            <ImageCard
              src={lead.src}
              alt={lead.alt}
              sizes="(min-width: 1024px) 42vw, (min-width: 768px) 72vw, 100vw"
              surface="ink"
              shift={6}
              scale={1.05}
              delay={0.05}
              className="mt-10 aspect-[4/5] w-full md:w-[72%] lg:mt-0 lg:ml-[calc(50%-50vw)] lg:w-[42vw]"
            />
          ) : null}
        </div>

        {/* BAND TWO — the gallery proper. */}
        <ul
          role="list"
          className={`${EDGE} mt-14 md:grid md:grid-cols-2 md:gap-8 lg:mt-24 lg:gap-12`}
        >
          {rest.map((image, index) => (
            <li
              key={image.src}
              className={index % 2 === 1 ? "mt-8 md:mt-16" : "mt-8 md:mt-0"}
            >
              <ImageCard
                src={image.src}
                alt={image.alt}
                sizes="(min-width: 768px) 44vw, 100vw"
                surface="ink"
                shift={5}
                scale={1.05}
                delay={0.06}
                className={
                  image.placeholder
                    ? "aspect-[4/5] w-full border border-line"
                    : "aspect-[4/5] w-full"
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
