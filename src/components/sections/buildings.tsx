import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { BUILDINGS, SECTIONS, UNRESOLVED, type BuildingChapter } from "@/lib/content";

/**
 * 03 — BUILDINGS & PARKS. Three chapters, alternating dominance.
 *
 * Conventions are inherited wholesale from `sections/about.tsx` — read that
 * file first. This one adds nothing to the system; it only composes it three
 * more ways.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A GRID. No `grid-cols-12`, no `col-span-*`. Each chapter is one
 * flow child (the image, which alone sets the band's height) with the type
 * anchored absolutely over it — exactly the arrangement About uses for its
 * portrait, rail and heading.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE THREE COMPOSITIONS, at `lg` and above. `▓` is the viewport edge.
 *
 *   CHAPTER ONE — image bleeds off the RIGHT edge, type at the left edge.
 *
 *      ▓                                                            ▓
 *      │  DEVELOPMENT            ┌───────────────────────────────────
 *      │  ONE                    │                                   │
 *      │  ────                   │        park-01.jpg  4:3           │
 *      │  body 30ch              │                          52vw     │
 *      │                         └───────────────────────────────────
 *
 *   CHAPTER TWO — image bleeds off the LEFT edge, type in the RIGHT RAIL.
 *
 *      ▓                                                            ▓
 *      ───────────────────────────────┐                DEVELOPMENT  │
 *      │                              │                        TWO  │
 *      │   park-02.jpg  4:3           │                       ────  │
 *      │            48vw              │                 body 30ch   │
 *      ───────────────────────────────┘                             │
 *
 *   CHAPTER THREE — full-bleed image, the title crossing its top edge.
 *
 *      ▓                                                            ▓
 *      ───DEVELOPMENT─THREE──────────────────────────────────────────
 *      │                   park-03.jpg  16:9  100vw                  │
 *      ───────────────────────────────────────────────────────────────
 *                                                       body 30ch  ──┤
 *
 * The alternation is the point: dominance swings right, then left, then to the
 * full width. Nothing lines up between chapters on purpose — the only thing
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
 * body, image — per chapter, top to bottom. There is no second layout.
 *
 * SERVER COMPONENT. `Reveal` and `ImageCard` are the only client boundaries
 * and they are leaves.
 */

/* --------------------------------------------------------------------------
   SHARED TREATMENTS

   Written out whole and shared by reference. NEVER build a Tailwind class by
   concatenation or interpolation — the v4 scanner reads source text, so a
   class assembled at runtime is never generated. Joining two complete literals
   (as the frames below do) is fine; splicing a value into one is not.
-------------------------------------------------------------------------- */

/** Chapter title. `text-h2` per the design system, uppercase display serif. */
const TITLE = "font-display text-h2 uppercase tracking-tight text-ink";

/** Body copy. `text-small`, on the site-wide ~30ch measure. */
const BODY = "max-w-[30ch] text-small text-muted";

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
const FRAME_THREE = "aspect-[16/9] w-full";

/** Stable, section-scoped heading id — chapter ids are generic on their own. */
function headingId(chapter: BuildingChapter): string {
  return `buildings-${chapter.id}-title`;
}

/* --------------------------------------------------------------------------
   CHAPTER ONE — dominance right
-------------------------------------------------------------------------- */

function ChapterOne({ chapter }: { chapter: BuildingChapter }) {
  const id = headingId(chapter);

  return (
    <article aria-labelledby={id} className="relative">
      {/* LEFT EDGE — the type column. Absolute from `lg` so the image alone
          stays in flow and sets the band's height. */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:top-[18%] lg:left-gutter-lg lg:z-10 lg:w-[34%] lg:px-0">
        <Reveal as="h2" id={id} className={TITLE}>
          {chapter.title}
        </Reveal>
        <span aria-hidden="true" className={HAIRLINE} />
        <Reveal as="p" className={BODY} delay={0.06}>
          {chapter.body}
        </Reveal>
      </div>

      {/* EDGE-BLEED-RIGHT — off the right viewport edge from `lg`; a plain
          full-width plate below it. */}
      <ImageCard
        src={chapter.image.src}
        alt={chapter.image.alt}
        sizes="(min-width: 1024px) 52vw, 100vw"
        surface="ink"
        shift={5}
        scale={1.06}
        delay={0.08}
        className={
          chapter.image.placeholder
            ? `mt-10 lg:mt-0 ${FRAME_ONE} ${PROVISIONAL_FRAME}`
            : `mt-10 lg:mt-0 ${FRAME_ONE}`
        }
      />
    </article>
  );
}

/* --------------------------------------------------------------------------
   CHAPTER TWO — dominance left
-------------------------------------------------------------------------- */

function ChapterTwo({ chapter }: { chapter: BuildingChapter }) {
  const id = headingId(chapter);

  return (
    <article aria-labelledby={id} className="relative mt-24 lg:mt-44">
      {/* RIGHT RAIL — flush to the right gutter and set right-ragged from `lg`,
          so title, rule and copy all hang off the same edge. */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:top-[26%] lg:right-gutter-lg lg:z-10 lg:w-[34%] lg:px-0 lg:text-right">
        <Reveal as="h2" id={id} className={TITLE}>
          {chapter.title}
        </Reveal>
        <span aria-hidden="true" className={`${HAIRLINE} lg:ml-auto`} />
        <Reveal as="p" className={`${BODY} lg:ml-auto`} delay={0.06}>
          {chapter.body}
        </Reveal>
      </div>

      {/* EDGE-BLEED-LEFT — off the left viewport edge from `lg`. */}
      <ImageCard
        src={chapter.image.src}
        alt={chapter.image.alt}
        sizes="(min-width: 1024px) 48vw, 100vw"
        surface="ink"
        shift={5}
        scale={1.06}
        delay={0.08}
        className={
          chapter.image.placeholder
            ? `mt-10 lg:mt-0 ${FRAME_TWO} ${PROVISIONAL_FRAME}`
            : `mt-10 lg:mt-0 ${FRAME_TWO}`
        }
      />
    </article>
  );
}

/* --------------------------------------------------------------------------
   CHAPTER THREE — full width, title crossing the image
-------------------------------------------------------------------------- */

function ChapterThree({ chapter }: { chapter: BuildingChapter }) {
  const id = headingId(chapter);

  return (
    <article aria-labelledby={id} className="relative mt-24 lg:mt-44">
      {/* LEFT EDGE — from `lg` the title straddles the image's top edge:
          `-top-[1.375rem]` is exactly half of the 44px line box `text-h2`
          produces, so the line sits centred on the edge rather than above or
          below it. On smaller screens it is simply the chapter's first line. */}
      <div className="w-full px-gutter md:px-gutter-lg lg:absolute lg:-top-[1.375rem] lg:left-gutter-lg lg:z-10 lg:w-[52%] lg:px-0">
        <Reveal as="h2" id={id} className={TITLE}>
          {chapter.title}
        </Reveal>
      </div>

      {/* FULL BLEED — `calc(50% - 50vw)` on both margins resolves to exactly
          one viewport width: below the shell it is 0, above it, it is the
          frame's own inset. The section's `overflow-x-clip` absorbs the
          scrollbar delta. */}
      <div className="relative mt-10 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] lg:mt-0">
        <ImageCard
          src={chapter.image.src}
          alt={chapter.image.alt}
          sizes="100vw"
          surface="ink"
          shift={4}
          scale={1.05}
          delay={0.08}
          className={
            chapter.image.placeholder
              ? `${FRAME_THREE} ${PROVISIONAL_FRAME}`
              : FRAME_THREE
          }
        />

        {/* Contrast under the crossing title. A static gradient, not a filter:
            the title has to stay legible against whatever artwork the client
            supplies in place of this frame, not merely against this one. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-deep/70 to-transparent"
        />
      </div>

      {/* RIGHT RAIL — the flow variant, beneath the image. */}
      <div className="mt-8 w-full px-gutter text-small md:px-gutter-lg lg:mt-10 lg:mr-gutter-lg lg:ml-auto lg:w-[30ch] lg:px-0">
        <Reveal as="p" className="text-muted" delay={0.06}>
          {chapter.body}
        </Reveal>
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
const [chapterOne, chapterTwo, chapterThree] = BUILDINGS;

const LABEL = SECTIONS.buildings.paren;

export function Buildings() {
  return (
    <section
      id={SECTIONS.buildings.id}
      // No visible section heading — the three chapter titles are the headings,
      // so the accessible name comes from the registry.
      aria-label={SECTIONS.buildings.label}
      className="relative overflow-x-clip py-section lg:py-section-lg"
    >
      {/* THE FRAME — unpadded coordinate space, capped at the shell. */}
      <div className="relative mx-auto w-full max-w-shell">
        {/* HEADER BAND — label at the left edge, unresolved slot in the rail. */}
        <div className="relative">
          {LABEL ? (
            <p className="px-gutter font-display text-label uppercase italic tracking-label text-muted md:px-gutter-lg">
              {LABEL}
            </p>
          ) : null}

          {/* THE UNRESOLVED SLOT. Labelled and visibly empty. The client's
              project record is pending; a rule with nothing above it is the
              honest rendering of that, and never a fabricated project list. */}
          <div className="mt-10 w-full px-gutter text-small md:px-gutter-lg lg:absolute lg:top-0 lg:right-gutter-lg lg:mt-0 lg:w-[30ch] lg:px-0">
            <p className="text-micro uppercase tracking-label text-muted">
              {UNRESOLVED.portfolio.label}
            </p>
            <span aria-hidden="true" className="mt-4 block h-px w-full bg-line" />
            <p className="mt-4 text-muted">{UNRESOLVED.portfolio.placeholder}</p>
          </div>
        </div>

        {/* ── THE THREE CHAPTERS ─────────────────────────────────────────
            Dominance swings right, then left, then full width. */}
        <div className="mt-20 lg:mt-36">
          <ChapterOne chapter={chapterOne} />
          <ChapterTwo chapter={chapterTwo} />
          <ChapterThree chapter={chapterThree} />
        </div>
      </div>
    </section>
  );
}
