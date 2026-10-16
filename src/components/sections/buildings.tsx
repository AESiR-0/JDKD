import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { VideoCard } from "@/components/motion/video-card";
import Link from "next/link";

import { BUILDINGS, BUILDINGS_CTA, SECTIONS, UNRESOLVED, type BuildingChapter } from "@/lib/content";

/**
 * 03 - BUILDINGS & PARKS. Four chapters, alternating dominance.
 *
 * Conventions are inherited wholesale from `sections/about.tsx` - read that
 * file first. This one adds nothing to the system; it only composes it three
 * more ways.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A GRID. No `grid-cols-12`, no `col-span-*`. Each chapter is one
 * flow child (the image, which alone sets the band's height) with the type
 * anchored absolutely over it - exactly the arrangement About uses for its
 * portrait, rail and heading.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE THREE COMPOSITIONS, at `lg` and above. `▓` is the viewport edge.
 *
 *   CHAPTER ONE - image bleeds off the RIGHT edge, type at the left edge.
 *
 *      ▓                                                            ▓
 *      │  DEVELOPMENT            ┌───────────────────────────────────
 *      │  ONE                    │                                   │
 *      │  ────                   │        park-01.jpg  4:3           │
 *      │  body 30ch              │                          52vw     │
 *      │                         └───────────────────────────────────
 *
 *   CHAPTER TWO - image bleeds off the LEFT edge, type in the RIGHT RAIL.
 *
 *      ▓                                                            ▓
 *      ───────────────────────────────┐                DEVELOPMENT  │
 *      │                              │                        TWO  │
 *      │   park-02.jpg  4:3           │                       ────  │
 *      │            48vw              │                 body 30ch   │
 *      ───────────────────────────────┘                             │
 *
 *   CHAPTER THREE - full-bleed image, the title crossing its top edge.
 *
 *      ▓                                                            ▓
 *      ───DEVELOPMENT─THREE──────────────────────────────────────────
 *      │                   park-03.jpg  16:9  100vw                  │
 *      ───────────────────────────────────────────────────────────────
 *                                                       body 30ch  ──┤
 *
 * The alternation is the point: dominance swings right, then left, then to the
 * full width. Nothing lines up between chapters on purpose - the only thing
 * they share is the ~30ch measure their copy is set on.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THESE ARE PLACEHOLDERS AND MUST READ AS PLACEHOLDERS.
 *
 * JDKD's wider project record has not been supplied. Nothing here names a
 * project, a place or a date. Three things keep that visible rather than
 * implied: the labelled `UNRESOLVED.portfolio` slot in the header rail, the
 * copy in each chapter, and the hairline frame drawn around any image whose
 * asset carries `placeholder: true`. A stand-in dressed as finished work is
 * the failure mode this section exists to avoid.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * MOBILE. Every anchor below is `lg:`-prefixed, so what is left when the art
 * direction switches off is one gutter-padded column in DOM order: title,
 * body, image - per chapter, top to bottom. There is no second layout.
 *
 * SERVER COMPONENT. `Reveal` and `ImageCard` are the only client boundaries
 * and they are leaves.
 */

/* --------------------------------------------------------------------------
   SHARED TREATMENTS

   Written out whole and shared by reference. NEVER build a Tailwind class by
   concatenation or interpolation - the v4 scanner reads source text, so a
   class assembled at runtime is never generated. Joining two complete literals
   (as the frames below do) is fine; splicing a value into one is not.
-------------------------------------------------------------------------- */

/** Chapter title. `text-h2` per the design system, uppercase display serif. */
const TITLE = "font-display text-h2 uppercase tracking-tight text-ink";

/** Body copy. `text-small`, on the site-wide ~30ch measure. */
const BODY = "max-w-[30ch] text-small text-muted";

/**
 * Line-set copy - a chapter whose `lines` the client wrote one phrase per line.
 * A wider measure than BODY, because each line is an authored phrase and
 * breaking one in two at 30ch would undo the very thing they asked for.
 */
const LINES = "max-w-[46ch] text-small text-muted";

/** The one hairline a chapter is allowed. Sparingly means once. */
const HAIRLINE = "my-6 block h-px w-24 bg-line-strong";

/**
 * Drawn around every frame whose asset is a client stand-in. It is the visible
 * difference between "photograph" and "reserved space".
 */
const PROVISIONAL_FRAME = "border border-line";

/** Placement of each chapter's image. Aspect ratios match the assets on disk. */
const FRAME_ONE = "aspect-[4/3] w-full lg:ml-auto lg:mr-[calc(50%-50vw)] lg:w-[52vw]";
const FRAME_TWO = "aspect-[4/3] w-full lg:ml-[calc(50%-50vw)] lg:w-[48vw]";
/**
 * Chapter two with a PORTRAIT still (M-82's facade photograph). A 4:3 frame
 * would crop the building's top or foot - and the whole facade, every
 * occupant on it, is the point of the picture. Narrower, so the plate stays
 * about as tall as the landscape one.
 */
const FRAME_TWO_PORTRAIT =
  "aspect-[4/5] w-full md:w-[72%] lg:ml-[calc(50%-50vw)] lg:w-[36vw]";
const FRAME_THREE = "aspect-[16/9] w-full";
/**
 * Chapter three with a STILL (M-39's facade photograph). 3:2 rather than 16:9:
 * the photo is a tall frontage, and 16:9 cannot hold both the JDKD mark on the
 * upper storey and the Standard Chartered fascia below it - the two things
 * the client asked this picture to show. The asset is cut to exactly 3:2.
 */
const FRAME_THREE_STILL = "aspect-[3/2] w-full";

/** Stable, section-scoped heading id - chapter ids are generic on their own. */
function headingId(chapter: BuildingChapter): string {
  return `buildings-${chapter.id}-title`;
}

/* --------------------------------------------------------------------------
   THE FRAME

   One place decides whether a chapter is a still or a loop, so the three
   compositions below stay compositions and never grow a second branch each.

   A chapter with footage gets `VideoCard`, which carries its own poster - so
   the no-JS, reduced-motion and not-yet-scrolled-to cases all still paint a
   photograph. Everything else keeps `ImageCard` and its parallax.

   The provisional hairline is drawn from the CHAPTER's flag, not the image's.
   A chapter now supplies its own artwork, and the two can disagree: the still
   behind a video frame may still be a stand-in while the footage is real.
-------------------------------------------------------------------------- */

function ChapterFrame({
  chapter,
  sizes,
  frame,
  shift,
  scale,
}: {
  chapter: BuildingChapter;
  sizes: string;
  frame: string;
  shift: number;
  scale: number;
}) {
  const className = chapter.placeholder
    ? `${frame} ${PROVISIONAL_FRAME}`
    : frame;

  if (chapter.video) {
    return (
      <VideoCard
        src={chapter.video.src}
        poster={chapter.video.poster}
        blurDataURL={chapter.video.blurDataURL}
        sizes={sizes}
        webm={chapter.video.webm}
        // The FOOTAGE's own description. Never `chapter.image.alt` - the still
        // behind a video frame may still be a stand-in while the clip is real.
        alt={chapter.video.alt}
        delay={0.08}
        className={className}
      />
    );
  }

  return (
    <ImageCard
      src={chapter.image.src}
      alt={chapter.image.alt}
      sizes={sizes}
      surface="ink"
      shift={shift}
      scale={scale}
      delay={0.08}
      className={className}
    />
  );
}

/* --------------------------------------------------------------------------
   THE COPY

   A paragraph on the 30ch measure, or - where the chapter carries `lines` -
   one block per line, revealed as a stagger. `align` is a complete literal
   appended to either, never a fragment spliced into one.
-------------------------------------------------------------------------- */

function ChapterCopy({
  chapter,
  align,
}: {
  chapter: BuildingChapter;
  align?: string;
}) {
  if (chapter.lines) {
    return (
      <Reveal
        as="p"
        stagger={0.05}
        delay={0.06}
        className={align ? `${LINES} ${align}` : LINES}
      >
        {chapter.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </Reveal>
    );
  }

  return (
    <Reveal as="p" className={align ? `${BODY} ${align}` : BODY} delay={0.06}>
      {chapter.body}
    </Reveal>
  );
}

/* --------------------------------------------------------------------------
   CHAPTER ONE - dominance right

   Used twice: first in the run, and again for the fourth chapter, where the
   swing comes back round to the right after the full-bleed third. Only the
   first one sits flush under the header band; a repeat pays the beat above it.
-------------------------------------------------------------------------- */

function ChapterOne({
  chapter,
  repeat = false,
}: {
  chapter: BuildingChapter;
  repeat?: boolean;
}) {
  const id = headingId(chapter);

  return (
    <article
      aria-labelledby={id}
      className={repeat ? "relative mt-beat lg:mt-beat-lg" : "relative"}
    >
      {/* LEFT EDGE - the type column. Absolute from `lg` so the image alone
          stays in flow and sets the band's height. */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:top-[18%] lg:left-gutter-lg lg:z-10 lg:w-[34%] lg:px-0">
        <Reveal as="h2" id={id} className={TITLE}>
          {chapter.title}
        </Reveal>
        <span aria-hidden="true" className={HAIRLINE} />
        <ChapterCopy chapter={chapter} />
        <div className="mt-8">
          <Link
            data-press
            href={`/projects/${chapter.slug}`}
            className="inline-flex items-center gap-3 border-b border-red pb-2 text-label uppercase tracking-label text-ink transition-colors duration-200 ease-editorial hover:text-pure"
          >
            Read more
            <span className="sr-only"> - {chapter.title}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* EDGE-BLEED-RIGHT - off the right viewport edge from `lg`; a plain
          full-width plate below it. */}
      <ChapterFrame
        chapter={chapter}
        sizes="(min-width: 1024px) 52vw, 100vw"
        frame={`mt-10 lg:mt-0 ${FRAME_ONE}`}
        shift={5}
        scale={1.06}
      />
    </article>
  );
}

/* --------------------------------------------------------------------------
   CHAPTER TWO - dominance left
-------------------------------------------------------------------------- */

function ChapterTwo({ chapter }: { chapter: BuildingChapter }) {
  const id = headingId(chapter);

  return (
    <article aria-labelledby={id} className="relative mt-beat lg:mt-beat-lg">
      {/* RIGHT RAIL - flush to the right gutter and set right-ragged from `lg`,
          so title, rule and copy all hang off the same edge. */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:top-[26%] lg:right-gutter-lg lg:z-10 lg:w-[34%] lg:px-0 lg:text-right">
        <Reveal as="h2" id={id} className={TITLE}>
          {chapter.title}
        </Reveal>
        <span aria-hidden="true" className={`${HAIRLINE} lg:ml-auto`} />
        <ChapterCopy chapter={chapter} align="lg:ml-auto" />
        <div className="mt-8 lg:flex lg:justify-end">
          <Link
            data-press
            href={`/projects/${chapter.slug}`}
            className="inline-flex items-center gap-3 border-b border-red pb-2 text-label uppercase tracking-label text-ink transition-colors duration-200 ease-editorial hover:text-pure"
          >
            Read more
            <span className="sr-only"> - {chapter.title}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* EDGE-BLEED-LEFT - off the left viewport edge from `lg`. A portrait
          still takes the portrait frame; footage and landscape stills keep
          the 4:3 one. */}
      {!chapter.video && chapter.image.height > chapter.image.width ? (
        <ChapterFrame
          chapter={chapter}
          sizes="(min-width: 1024px) 36vw, (min-width: 768px) 72vw, 100vw"
          frame={`mt-10 lg:mt-0 ${FRAME_TWO_PORTRAIT}`}
          shift={5}
          scale={1.06}
        />
      ) : (
        <ChapterFrame
          chapter={chapter}
          sizes="(min-width: 1024px) 48vw, 100vw"
          frame={`mt-10 lg:mt-0 ${FRAME_TWO}`}
          shift={5}
          scale={1.06}
        />
      )}
    </article>
  );
}

/* --------------------------------------------------------------------------
   CHAPTER THREE - full width, title crossing the image
-------------------------------------------------------------------------- */

function ChapterThree({ chapter }: { chapter: BuildingChapter }) {
  const id = headingId(chapter);

  return (
    <article aria-labelledby={id} className="relative mt-beat lg:mt-beat-lg">
      {/* LEFT EDGE - from `lg` the title straddles the image's top edge:
          `-top-[1.375rem]` is exactly half of the 44px line box `text-h2`
          produces, so the line sits centred on the edge rather than above or
          below it. On smaller screens it is simply the chapter's first line. */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:-top-[1.375rem] lg:left-gutter-lg lg:z-10 lg:w-[52%] lg:px-0">
        <Reveal as="h2" id={id} className={TITLE}>
          {chapter.title}
        </Reveal>
      </div>

      {/* FULL BLEED - `calc(50% - 50vw)` on both margins resolves to exactly
          one viewport width: below the shell it is 0, above it, it is the
          frame's own inset. The section's `overflow-x-clip` absorbs the
          scrollbar delta. */}
      <div className="relative mt-10 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] lg:mt-0">
        <ChapterFrame
          chapter={chapter}
          sizes="100vw"
          frame={chapter.video ? FRAME_THREE : FRAME_THREE_STILL}
          shift={4}
          scale={1.05}
        />

        {/* Contrast under the crossing title. A static gradient, not a filter:
            the title has to stay legible against whatever artwork the client
            supplies in place of this frame, not merely against this one.
            Masked off toward the right: the title only crosses the left of
            the frame, and M-39's JDKD mark sits top right - full-width shade
            would dim the one sign the picture is there to show. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-deep/70 to-transparent [mask-image:linear-gradient(to_right,black_35%,transparent_65%)]"
        />
      </div>

      {/* RIGHT RAIL - the flow variant, beneath the image. */}
      <div className="mt-8 w-full px-gutter text-small md:px-gutter-lg lg:mt-10 lg:mr-gutter-lg lg:ml-auto lg:w-[30ch] lg:px-0">
        <ChapterCopy chapter={chapter} />
        <div className="mt-8">
          <Link
            data-press
            href={`/projects/${chapter.slug}`}
            className="inline-flex items-center gap-3 border-b border-red pb-2 text-label uppercase tracking-label text-ink transition-colors duration-200 ease-editorial hover:text-pure"
          >
            Read more
            <span className="sr-only"> - {chapter.title}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   THE SECTION
-------------------------------------------------------------------------- */

/**
 * Destructured rather than mapped: each chapter is a different composition,
 * not a repeated card, so the three sit in named positions and the tuple in
 * `@/lib/content` guarantees all three exist.
 */
const [chapterOne, chapterTwo, chapterThree, chapterFour] = BUILDINGS;

const LABEL = SECTIONS.buildings.paren;

export function Buildings() {
  return (
    <section
      id={SECTIONS.buildings.id}
      // No visible section heading - the three chapter titles are the headings,
      // so the accessible name comes from the registry.
      aria-label={SECTIONS.buildings.label}
      className="relative overflow-x-clip pt-beat lg:pt-beat-lg"
    >
      {/* THE FRAME - unpadded coordinate space, capped at the shell. */}
      <div className="relative mx-auto w-full max-w-shell">
        {/* HEADER BAND - label and description on the left */}
        <div className="px-gutter md:px-gutter-lg">
          {LABEL ? (
            <p className="font-display text-label uppercase italic tracking-label text-muted">
              {LABEL}
            </p>
          ) : null}
          <p className="mt-3 max-w-[50ch] text-small text-muted leading-relaxed">
            {UNRESOLVED.portfolio.placeholder}
          </p>
        </div>

        {/* ── THE FOUR CHAPTERS ──────────────────────────────────────────
            Dominance swings right, then left, then full width, then right. */}
        <div className="mt-band lg:mt-band-lg">
          <ChapterOne chapter={chapterOne} />
          <ChapterTwo chapter={chapterTwo} />
          <ChapterThree chapter={chapterThree} />
          <ChapterOne chapter={chapterFour} repeat />
        </div>

        {/* THE WAY OUT. Three chapters is a sample, not the record, so the
            section that shows them has to say where the rest is. Left edge, on
            the gutter, in the site's one link treatment: a red hairline under a
            small uppercase label. NOT inside a `Reveal` - its mask keeps
            `overflow: hidden` after it finishes and would clip this control's
            focus ring. */}
        <div className="mt-beat px-gutter md:px-gutter-lg lg:mt-beat-lg">
          <Link
            data-press
            href={BUILDINGS_CTA.href}
            className="inline-flex items-center gap-3 border-b border-red pb-2 text-label uppercase tracking-label text-ink transition-colors duration-200 ease-editorial hover:text-pure"
          >
            {BUILDINGS_CTA.label}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
