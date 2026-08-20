import type { Metadata } from "next";

import { Counter } from "@/components/motion/counter";
import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  ABOUT_PAGE,
  ASSET,
  CONTACT,
  ROUTES,
  type DisplayLine,
} from "@/lib/content";

/**
 * /about — the practice, composed as a document rather than as a brochure.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE ARGUMENT THIS PAGE MAKES, IN ORDER.
 *
 *   00  MASTHEAD    the title as a STAIRCASE — three lines, each stepping
 *                   further right — with the tower held as a portrait off the
 *                   right viewport edge, closed by a full-bleed hairline and a
 *                   colophon. Nothing is centred and nothing is a plate.
 *   01  STATEMENT   dominance LEFT: the lobby bleeds off the left edge and the
 *                   sentence hangs on the right.
 *   02  PRACTICE    dominance RIGHT: the three disciplines set the height and
 *                   the wide lobby fills the band beside them.
 *   03  NUMBERS     a LEDGER of enormous figures, left-aligned so the ragged
 *                   right edge they make is the drawing — except for one,
 *                   flipped to the right gutter. That break IS the band.
 *   04  PRINCIPLES  a CASCADE: five blocks each stepping 7% further right, so
 *                   their hairlines draw a descending stair.
 *   05  LEADERSHIP  a deliberate VOID, closed by a red rule with nothing
 *                   written on it. The page ends on an unsigned signature line.
 *
 * Dominance alternates R → L → R and then stops: the back half of the page is
 * type only. Photography is the second material here, not the first.
 *
 * NO `PageHero`. Its title/lede/plate stack is the shared opener for routes
 * that want a shared opener; this page composes its own so the h1 can be a
 * staircase measured against a portrait. `PageHero` is still used by
 * `/projects`, `/projects/[slug]` and `not-found` — do not delete it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A GRID.
 *
 * There is no `grid-cols-12` and no `col-span-*` below, and there must not be
 * one on any internal route except where the content genuinely IS a grid — a
 * specification table, a gallery. A uniform twelve-column grid applied
 * site-wide is what made a previous build read as a corporate brochure and got
 * it rejected. Layout is ANCHOR-BASED. Three things repeat and everything else
 * is composed per section:
 *
 *   1. LEFT EDGE    the page gutter. Display type and (LABELS) hang off it —
 *                   `px-gutter md:px-gutter-lg` in flow,
 *                   `left-gutter md:left-gutter-lg` out of flow.
 *   2. RIGHT RAIL   a ~30ch measure flush to the right gutter. Small sans copy
 *                   lives here. This one repetition is what makes six
 *                   differently-composed sections read as a single system.
 *   3. OPTICAL BAND the middle of the frame, where the dominant image sits.
 *
 * Consistency comes from VERTICAL RHYTHM — `py-section` / `lg:py-section-lg`
 * — not from alignment. Nothing lines up between sections on purpose.
 *
 * THE ONE DOCUMENTED EXCEPTION to the right rail: when an image owns the right
 * edge for the full height of a band, the type column takes the LEFT edge
 * instead (see `Practice` below, and `sections/buildings.tsx` chapter one on the
 * homepage). The rail does not get to sit under a photograph.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE FRAME. Each `<section>` is full-bleed and owns its own vertical rhythm
 * plus `overflow-x-clip`. Inside it, ONE unpadded `max-w-shell` element is the
 * frame every anchor is measured against. It carries no padding on purpose: an
 * absolutely positioned child resolves `left: 38%` against its containing
 * block's PADDING box, so a padded frame would put percentage anchors and flow
 * children one gutter out of agreement. Reading children apply their own edge
 * anchor.
 *
 * `overflow-x-clip` rather than `overflow-hidden`: it clips only the horizontal
 * axis, so a block may still overhang vertically, and it creates no scroll
 * container — which means it cannot break a `position: sticky` sub-nav or a
 * ScrollTrigger pin further down a page.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHICH CHILD SETS A BAND'S HEIGHT. Exactly one, and it must be the one left in
 * flow at `lg`. Everything else in the band is absolute and measured against it.
 * Get this backwards and percentage anchors resolve against zero.
 *
 * NUMERALS ARE SET IN `font-sans`, ALWAYS. The display serif is Cormorant
 * Garamond, which has OLD-STYLE FIGURES: several digits drop below the baseline
 * and others rise above it, so a figure like 23,456 set in it reads as a wobble
 * rather than as a measurement. Geist has lining figures and the body already
 * sets `font-variant-numeric: tabular-nums`. Every numeral on this page — the
 * ledger, the principle indices — is therefore grotesque.
 *
 * MOBILE. Every anchor below is `lg:`-prefixed. What is left at 375px is one
 * gutter-padded column in DOM order — which is the layout, not a fallback for
 * it. DOM order is therefore reading order: type before its picture in every
 * band.
 *
 * ONE H1. The masthead renders it. Every section here opens at `<h2>`.
 *
 * SERVER COMPONENT, and it must stay one. `Reveal`, `ImageCard` and `Counter`
 * are the only client boundaries and all three are leaves.
 */

/* ==========================================================================
   METADATA
   The pattern every route copies. `ROUTES[key].title` is the SHORT form
   because `app/layout.tsx` sets a "%s | JDKD" template; `ogTitle` is the
   standalone sentence, because that template is not applied to openGraph.
   ========================================================================== */

const ROUTE = ROUTES.about;

export const metadata: Metadata = {
  title: ROUTE.title,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
  openGraph: {
    type: "website",
    url: ROUTE.path,
    title: ROUTE.ogTitle,
    description: ROUTE.description,
    images: [
      {
        url: ROUTE.ogImage.src,
        width: ROUTE.ogImage.width,
        height: ROUTE.ogImage.height,
        alt: ROUTE.ogImage.alt,
      },
    ],
  },
};

/* ==========================================================================
   SHARED TREATMENTS

   Written out whole and shared by reference. NEVER build a Tailwind class by
   concatenation or interpolation — the v4 scanner reads source text, so a class
   assembled at runtime is never generated. Joining two COMPLETE literals (as
   the sections below do) is fine; splicing a value into one is not.
   ========================================================================== */

/** The section shell. Full-bleed, owns the rhythm, clips the horizontal axis. */
const SECTION = "relative overflow-x-clip py-section lg:py-section-lg";

/** The unpadded coordinate space every percentage anchor is measured against. */
const FRAME = "relative mx-auto w-full max-w-shell";

/** The left-edge anchor, for any child that is in flow. */
const EDGE = "px-gutter md:px-gutter-lg";

/** Parenthetical section marker. There are NO numerals in this vocabulary. */
const LABEL =
  "font-display text-label uppercase italic tracking-label text-muted";

/**
 * The h1. SIZE IS CAPPED, NOT FLAT: `min(11vw, 3.5rem)` holds the 56px
 * unprefixed ceiling everywhere it fits and shrinks only on the narrow widths
 * that cannot hold it — the remedy the system prefers over inventing a
 * breakpoint. The `lg` cap is MEASURED, not guessed: "THE PRACTICE" renders at
 * 6.41em in Cormorant at −0.045em tracking, and the portrait leaves the title a
 * 54% column — 54% of the FRAME, which stops growing at 1440px while a `vw`
 * font size does not. So the two constraints are 6.41em ≤ 0.54·vw below the
 * shell (→ 8.4vw) and 6.41em ≤ 778px above it (→ 121px); 7vw capped at 112px
 * clears both with room to spare.
 */
const TITLE =
  "block font-display text-[min(11vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-ink md:text-h1 md:leading-[0.98] lg:text-[min(7vw,7rem)] lg:leading-[0.9]";

/** Section display heading. One step below the h1 at every width. */
const DISPLAY =
  "block font-display text-[min(12vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-ink md:text-h1 md:leading-[0.98] lg:text-[min(5vw,5rem)] lg:leading-[0.94]";

/** Right-rail copy. `text-small` sits on the rail so `30ch` measures the copy. */
const RAIL_COPY = "text-small text-muted";

/**
 * THE STAIRCASE, for the h1. One COMPLETE literal per line — never
 * `lg:pl-[${n}%]`, which the v4 scanner cannot see. A title longer than this
 * array falls back to the flush left edge rather than to a missing class.
 */
const STAIR: readonly string[] = ["lg:pl-0", "lg:pl-[9%]", "lg:pl-[18%]"];

/**
 * THE CASCADE, for the five principles. Same rule: complete literals only. The
 * last block sits 28% in, which at the narrowest `lg` width still leaves its
 * 38ch measure inside the right gutter.
 */
const CASCADE: readonly string[] = [
  "lg:ml-0",
  "lg:ml-[7%]",
  "lg:ml-[14%]",
  "lg:ml-[21%]",
  "lg:ml-[28%]",
];

/** Positional class for index `i`, or the flush position if the list is short. */
function step(scale: readonly string[], index: number): string {
  return index < scale.length ? scale[index] : "";
}

/* ==========================================================================
   DISPLAY HEADING

   Display type is broken for COMPOSITION, not for reading. The visible stack is
   hidden from assistive technology and `spoken` carries the readable sentence
   `sr-only`, because otherwise a screen reader announces every line break as a
   sentence break. Copy this component wherever a page splits display type.
   ========================================================================== */

type DisplayHeadingProps = {
  readonly id: string;
  readonly lines: readonly DisplayLine[];
  readonly spoken: string;
  /** Placement classes on the `<h2>` itself. */
  readonly className?: string;
  /** Type classes on the revealed stack. @default DISPLAY */
  readonly typeClassName?: string;
};

function DisplayHeading({
  id,
  lines,
  spoken,
  className,
  typeClassName = DISPLAY,
}: DisplayHeadingProps) {
  return (
    <h2 id={id} className={className}>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true" className="block">
        <Reveal as="span" stagger={0.08} duration={1} className={typeClassName}>
          {lines.map((line) => (
            <span
              key={line.text}
              className={line.style === "italic" ? "italic" : "not-italic"}
            >
              {line.text}
            </span>
          ))}
        </Reveal>
      </span>
    </h2>
  );
}

/* ==========================================================================
   00 — MASTHEAD

   Replaces `PageHero` on this route. The clearance arithmetic is copied from it
   and is NOT taste: the bar is `h-14` (56px) and `md:h-16` (64px) and it is
   SOLID `bg-canvas` from the first pixel on every route but the homepage, so a
   masthead starting at the top of the document would open underneath an opaque
   bar. `pt-32 md:pt-40 lg:pt-48` leaves 72 / 96 / 128px of air beneath it.

        Home / About
        (ABOUT)

        THE PRACTICE                                ┌──────────────┐
             BEHIND THE                             │              │
                  BUILDING.                         │ tower 4:5    │
                                                    │ bleeds off   │
                                                    │ the RIGHT    │
                                                    │ edge, 32vw   │
                                                    └──────────────┘
        ───────────────────────────────────────────────────────── full bleed
        JDKD DEVELOPERS LLP                     ┌──────────────────┐
        GRADE A COMMERCIAL OFFICE BUILDING      │ lede, 34ch       │
        A-11, MOHAN COOPERATIVE …               └──────────────────┘

   THE PORTRAIT IS IN FLOW and sets the type band's height; the title is the
   single absolutely positioned child, vertically centred against it. One
   absolute child means the band cannot collide with itself at any width.

   THE PORTRAIT BLEEDS OFF THE RIGHT VIEWPORT EDGE rather than sitting inside
   the frame, and that is what keeps it clear of the title on a wide monitor:
   pinned to the frame, 32vw would grow to 42% of a 1440px frame at 1920px and
   cross into the title's column; pinned to the viewport it moves AWAY from the
   title as the window widens.
   ========================================================================== */

const TITLE_ID = "page-title";

function Masthead() {
  const { label, titleLines, spokenTitle, lede, heroImage } = ABOUT_PAGE;

  return (
    <header className="relative overflow-x-clip pt-32 md:pt-40 lg:pt-48">
      <div className={FRAME}>
        {/* NEVER inside a `Reveal`: the mask keeps `overflow: hidden` after it
            finishes and would clip the focus ring off the crumb links. */}
        <div className={EDGE}>
          <Breadcrumbs
            trail={[
              { label: "Home", href: ROUTES.home.path },
              { label: ROUTES.about.title },
            ]}
          />
          <p className={`mt-8 ${LABEL}`}>{label}</p>
        </div>

        <div className="relative mt-10 lg:mt-16">
          {/* TYPE FIRST IN THE DOM. On a phone this reads title then portrait;
              at `lg` the title lifts out of flow and the portrait takes over
              the band's height. */}
          <h1
            id={TITLE_ID}
            className={`${EDGE} lg:absolute lg:left-gutter-lg lg:top-1/2 lg:z-10 lg:w-[54%] lg:-translate-y-1/2 lg:px-0`}
          >
            <span className="sr-only">{spokenTitle}</span>
            <span aria-hidden="true" className="block">
              <Reveal as="span" stagger={0.09} duration={1.05} className={TITLE}>
                {titleLines.map((line, index) => (
                  <span
                    key={line.text}
                    className={`block ${step(STAIR, index)} ${
                      line.style === "italic" ? "italic" : "not-italic"
                    }`}
                  >
                    {line.text}
                  </span>
                ))}
              </Reveal>
            </span>
          </h1>

          {/* EDGE-BLEED-RIGHT. `calc(50% - 50vw)` is exact: below 1440px the
              frame IS the viewport and it resolves to 0; above it, it is
              precisely the frame's own right inset. The header's
              `overflow-x-clip` absorbs the scrollbar delta. */}
          <ImageCard
            src={heroImage.src}
            alt={heroImage.alt}
            sizes="(min-width: 1024px) 32vw, (min-width: 768px) 62vw, 100vw"
            surface="ink"
            shift={6}
            scale={1.05}
            delay={0.12}
            preload
            className="mt-14 aspect-[4/5] w-full md:ml-auto md:w-[62%] lg:mt-0 lg:mr-[calc(50%-50vw)] lg:w-[32vw]"
          />
        </div>

        {/* THE HORIZON — the only rule on this page that reaches both viewport
            edges. Everything below it is measured against the page gutter. */}
        <div
          aria-hidden="true"
          className="mt-16 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] h-px bg-line lg:mt-24"
        />

        {/* COLOPHON. Facts, in the site's label vocabulary so they read as an
            imprint rather than as copy. Nothing here is written for this page —
            every line is the asset record. */}
        <div
          className={`${EDGE} mt-10 lg:mt-12 lg:flex lg:items-start lg:justify-between lg:gap-16`}
        >
          <ul
            role="list"
            className="text-micro uppercase tracking-label text-muted lg:w-[46%]"
          >
            <li>{CONTACT.entity}</li>
            <li className="mt-3">{ASSET.assetClass}</li>
            <li className="mt-3">{ASSET.address.oneLine}</li>
          </ul>

          {/* RIGHT RAIL. */}
          <div
            className={`mt-10 max-w-[34ch] ${RAIL_COPY} lg:mt-0 lg:w-[34ch]`}
          >
            <Reveal as="p" delay={0.14}>
              {lede}
            </Reveal>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
   01 — STATEMENT

   Dominance LEFT, inverting the masthead. The photograph bleeds off the left
   viewport edge and is the only child left in flow at `lg`, so it alone sets
   the band's height. The heading and the rail travel together as ONE absolutely
   positioned column flush to the right gutter, vertically centred against the
   picture — one absolute child, so the band cannot collide with itself.

        ▓ viewport edge
        ┌──────────────────────┐        ────              ← the column opens
        │                      │        DECISIONS            on a short rule
        │   lobby.jpg 4:5      │        MADE ONCE,
        │   bleeds off the     │        LIVED WITH
        │   LEFT edge, 42vw    │        FOR DECADES.
        │                      │
        │                      │              ┌────────────┐
        └──────────────────────┘              │ rail, 32ch │
                                              └────────────┘
   ========================================================================== */

const STATEMENT_ID = "statement-heading";

function Statement() {
  const { statement } = ABOUT_PAGE;

  return (
    <section id="statement" aria-labelledby={STATEMENT_ID} className={SECTION}>
      <div className={FRAME}>
        <p className={`${EDGE} ${LABEL}`}>{statement.label}</p>

        <div className="relative mt-12 lg:mt-20">
          {/* TYPE FIRST IN THE DOM. */}
          <div className="lg:absolute lg:right-gutter-lg lg:top-1/2 lg:z-10 lg:w-[46%] lg:-translate-y-1/2">
            {/* A short rule rather than a second label: the section is already
                named above, and the column needs a top edge to start from. */}
            <span
              aria-hidden="true"
              className="hidden lg:mb-10 lg:block lg:h-px lg:w-24 lg:bg-line-strong"
            />

            <DisplayHeading
              id={STATEMENT_ID}
              lines={statement.headingLines}
              spoken={statement.spokenHeading}
              className={`${EDGE} lg:px-0`}
            />

            {/* RIGHT RAIL — flush to the right of the column. */}
            <div
              className={`${EDGE} mt-10 ${RAIL_COPY} lg:mt-12 lg:ml-auto lg:w-[32ch] lg:px-0`}
            >
              <Reveal as="div" stagger={0.09} delay={0.1}>
                {statement.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-5 first:mt-0">
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            </div>
          </div>

          <ImageCard
            src={statement.image.src}
            alt={statement.image.alt}
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 72vw, 100vw"
            surface="ink"
            shift={6}
            scale={1.05}
            delay={0.05}
            className="mt-12 aspect-[4/5] w-full md:w-[72%] lg:mt-0 lg:ml-[calc(50%-50vw)] lg:w-[42vw]"
          />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   02 — WHAT JDKD DOES

   Dominance flips RIGHT, and with it the type column moves to the LEFT EDGE —
   the documented exception to the rail. Here the DISCIPLINES are the flow child
   that sets the band's height and the picture is the absolute one, stretched to
   match it (`inset-y-0` + `aspect-auto h-full`). That inversion is deliberate:
   a list of three grows with its copy, and an absolutely positioned list would
   overflow the picture it was measured against.

   The three titles reach `text-h2` at `lg` — the only sub-section heading on
   this page allowed to, because those three words ARE the content of the band.

        ▓                                                            ▓
        │  COMMERCIAL WORK,                    ┌───────────────────────
        │  START TO FINISH.                    │
        │                                      │   lobby-wide.jpg
        │  DEVELOPMENT  ────                   │   full band height
        │  LEASING      ────                   │   bleeds off the
        │  STEWARDSHIP  ────                   │   RIGHT edge, 46vw
        │                                      └───────────────────────
   ========================================================================== */

const PRACTICE_ID = "practice-heading";

function Practice() {
  const { practice } = ABOUT_PAGE;

  return (
    <section id="practice" aria-labelledby={PRACTICE_ID} className={SECTION}>
      <div className={FRAME}>
        {/* HEADER BAND — label and heading at the left edge, intro in the
            rail. No picture here, so the rail behaves normally. */}
        <div className="relative">
          <p className={`${EDGE} ${LABEL}`}>{practice.label}</p>

          <DisplayHeading
            id={PRACTICE_ID}
            lines={practice.headingLines}
            spoken={practice.spokenHeading}
            className={`${EDGE} mt-10 lg:mt-14 lg:w-[56%]`}
          />

          <div
            className={`${EDGE} mt-10 ${RAIL_COPY} lg:absolute lg:right-gutter-lg lg:top-0 lg:mt-0 lg:w-[30ch] lg:px-0`}
          >
            <Reveal as="div" stagger={0.09} delay={0.08}>
              {practice.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-5 first:mt-0">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </div>

        {/* DISCIPLINES BAND — the list is in flow and sets the height; the
            picture is absolute and fills it. */}
        <div className="relative mt-16 lg:mt-32">
          <ol
            // `list-none` strips list semantics in Safari; the role puts them
            // back. This is a LIST, not a grid: three rows, one measure.
            role="list"
            className={`${EDGE} lg:w-[48%]`}
          >
            {practice.disciplines.map((discipline) => (
              <li
                key={discipline.id}
                className="border-t border-line pt-8 pb-8 first:border-t-0 first:pt-0 last:pb-0 lg:pt-12 lg:pb-12"
              >
                <Reveal
                  as="h3"
                  className="font-display text-h3 uppercase tracking-tight text-ink lg:text-h2"
                >
                  {discipline.title}
                </Reveal>
                <Reveal
                  as="p"
                  delay={0.06}
                  className="mt-4 max-w-[44ch] text-small text-muted lg:mt-6"
                >
                  {discipline.body}
                </Reveal>
              </li>
            ))}
          </ol>

          {/* EDGE-BLEED-RIGHT, full band height. `aspect-auto` cancels the
              mobile aspect ratio so `h-full` can take over — without it the two
              would fight and the frame would keep the ratio. */}
          <ImageCard
            src={practice.image.src}
            alt={practice.image.alt}
            sizes="(min-width: 1024px) 46vw, (min-width: 768px) 72vw, 100vw"
            surface="ink"
            shift={5}
            scale={1.05}
            delay={0.08}
            className="mt-12 aspect-[4/3] w-full md:ml-auto md:w-[72%] lg:absolute lg:inset-y-0 lg:right-[calc(50%-50vw)] lg:mt-0 lg:aspect-auto lg:h-full lg:w-[46vw]"
          />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   03 — BY THE NUMBERS

   No picture. A LEDGER: five figures stacked on hairlines, every numeral flush
   to the left gutter, so the ragged right edge they make — 23,456 against 7
   against 2 — is the drawing. The plot area is set at 160px, a step that exists
   nowhere else on the site, because it is the one figure that describes the
   whole asset.

   ONE ROW IS FLIPPED to the right gutter. That is not a mistake and it is not
   negotiable: five identical rows is a specification table; four and a break is
   a composition. Do not tidy it.

        (BY THE NUMBERS)                             note, 30ch
        ─────────────────────────────────────────────────────────
        23,456 sq.ft
        PLOT AREA — 2,179.13 SQ.M
        ─────────────────────────────────────────────────────────
        7
        OFFICE FLOORS
        ─────────────────────────────────────────────────────────
        2
        BASEMENT LEVELS
        ─────────────────────────────────────────────────────────
                                                          14'9"
                                            FLOOR HEIGHT — 4.5 METRES
        ─────────────────────────────────────────────────────────
        41.05 m
        TERRACE PARAPET LEVEL

   The section's accessible name comes from its parenthetical marker, which is
   the `<h2>` — the same device `site-footer.tsx` uses for its columns.
   ========================================================================== */

const NUMBERS_ID = "numbers-heading";

type FigurePlacement = {
  /** Row treatment: which gutter the figure hangs from at `lg`. */
  readonly row: string;
  /** Size of the numeral. Unprefixed steps stay at or below `text-headline`. */
  readonly numeral: string;
  /** Measure and alignment for the descriptor beneath it. */
  readonly descriptor: string;
};

/**
 * How each figure sits. Separated from `@/lib/content` on purpose: content owns
 * what a figure says, the page owns where it goes.
 *
 * Keyed by `Figure.id`, which is an open string so a page may carry as many
 * figures as its composition places. A figure with no entry here falls back to
 * the flush-left row rather than vanishing — a missing placement should look
 * ordinary, not disappear.
 */
const FIGURE_PLACEMENT: Readonly<Record<string, FigurePlacement>> = {
  // The whole asset in one number, and the only one given its own scale.
  "plot-area": {
    row: "",
    numeral: "text-headline lg:text-[min(11vw,10rem)] lg:leading-[0.86]",
    descriptor: "max-w-[30ch]",
  },
  "office-floors": {
    row: "",
    numeral: "text-headline lg:text-numeral",
    descriptor: "max-w-[24ch]",
  },
  basements: {
    row: "",
    numeral: "text-headline lg:text-numeral",
    descriptor: "max-w-[24ch]",
  },
  // THE BREAK. Flipped to the right gutter and right-aligned against it.
  "floor-height": {
    row: "lg:ml-auto lg:w-[46%] lg:text-right",
    numeral: "text-headline lg:text-numeral",
    descriptor: "max-w-[24ch] lg:ml-auto",
  },
  parapet: {
    row: "",
    numeral: "text-headline lg:text-numeral",
    descriptor: "max-w-[24ch]",
  },
};

const FIGURE_FALLBACK: FigurePlacement = {
  row: "",
  numeral: "text-headline lg:text-numeral",
  descriptor: "max-w-[24ch]",
};

/** The hairline every row hangs from, and the air around it. */
const FIGURE_ROW =
  "border-t border-line py-10 last:border-b last:border-line lg:py-14";

/**
 * The numeral itself. GROTESQUE, never the display serif — see the file header.
 * `whitespace-nowrap` so a counter mid-animation cannot break "23,456" over two
 * lines and reflow the row beneath it.
 */
const NUMERAL = "whitespace-nowrap font-sans font-light tracking-[-0.03em] text-ink";

function Numbers() {
  const { numbers } = ABOUT_PAGE;

  return (
    <section id="numbers" aria-labelledby={NUMBERS_ID} className={SECTION}>
      <div className={FRAME}>
        {/* Marker at the left edge, note in the rail. No absolute positioning
            needed for a type-only header, so this is a padded flex row — the
            simpler of the two rail idioms. Use it whenever no picture is
            setting the band's height. */}
        <div
          className={`${EDGE} lg:flex lg:items-start lg:justify-between lg:gap-16`}
        >
          <h2 id={NUMBERS_ID} className={LABEL}>
            {numbers.label}
          </h2>
          <p className={`mt-8 max-w-[30ch] ${RAIL_COPY} lg:mt-0 lg:w-[30ch]`}>
            {numbers.note}
          </p>
        </div>

        <ul role="list" className={`${EDGE} mt-14 lg:mt-24`}>
          {numbers.figures.map((figure) => {
            const placement = FIGURE_PLACEMENT[figure.id] ?? FIGURE_FALLBACK;

            return (
              <li key={figure.id} className={FIGURE_ROW}>
                <div className={placement.row}>
                  <Counter
                    value={figure.value}
                    unit={figure.unit}
                    className={`${NUMERAL} ${placement.numeral}`}
                    unitClassName="text-small text-muted lg:text-body-lg"
                  />

                  <p
                    className={`mt-5 text-micro uppercase tracking-label text-muted ${placement.descriptor}`}
                  >
                    {figure.descriptor}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ==========================================================================
   04 — THE FIVE PRINCIPLES

   The homepage renders these as a frosted bento. That treatment uses
   `backdrop-filter`, which is permitted in exactly one place on this site and
   is NOT permitted here, so the same five principles are re-composed as a
   CASCADE: five blocks, each stepping 7% further right than the one above, each
   opening on its own hairline. The rules therefore draw a descending stair
   across the band and the white space collects, deliberately, on the left.

   THE NUMERALS ARE PART OF THE CARD, not a section marker. "02 /" above a
   section label was removed from this system deliberately; `Principle.index` is
   a different device and it stays — set in `font-sans`, like every other
   numeral on this page.

   One content source, two renderings — `ABOUT_PAGE.principles.items` reads
   straight from `BELIEFS_GRID`, so the homepage and this page cannot drift.
   ========================================================================== */

const PRINCIPLES_ID = "principles-heading";

function Principles() {
  const { principles } = ABOUT_PAGE;

  return (
    <section id="principles" aria-labelledby={PRINCIPLES_ID} className={SECTION}>
      <div className={FRAME}>
        <div className="relative">
          <p className={`${EDGE} ${LABEL}`}>{principles.label}</p>

          <DisplayHeading
            id={PRINCIPLES_ID}
            lines={principles.headingLines}
            spoken={principles.spokenHeading}
            className={`${EDGE} mt-10 lg:mt-14 lg:w-[52%]`}
          />

          <div
            className={`${EDGE} mt-10 ${RAIL_COPY} lg:absolute lg:right-gutter-lg lg:top-0 lg:mt-0 lg:w-[30ch] lg:px-0`}
          >
            <Reveal as="p" delay={0.1}>
              {principles.intro}
            </Reveal>
          </div>
        </div>

        <ol role="list" className={`${EDGE} mt-16 lg:mt-32`}>
          {principles.items.map((principle, index) => (
            <li
              key={principle.id}
              className={`border-t border-line pt-8 pb-8 lg:w-[46%] lg:pt-12 lg:pb-12 ${step(
                CASCADE,
                index,
              )}`}
            >
              <div className="flex items-baseline gap-5">
                <span
                  aria-hidden="true"
                  className="font-sans text-micro tabular-nums tracking-label text-muted"
                >
                  {principle.index}
                </span>
                <Reveal
                  as="h3"
                  className="font-display text-h3 uppercase tracking-tight text-ink lg:text-h2"
                >
                  {principle.title}
                </Reveal>
              </div>

              <Reveal
                as="p"
                delay={0.06}
                className="mt-5 max-w-[38ch] text-small text-muted lg:mt-6"
              >
                {principle.body}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ==========================================================================
   05 — LEADERSHIP

   A LABELLED, VISIBLY EMPTY SLOT, and the page's last statement.

   The client has not confirmed names or bios, so this section publishes none.
   What it publishes instead is the SPACE they will occupy: a tall column with
   nothing in it, closed at the foot by a red hairline with nothing written on
   it — a signature line, not yet signed — and the holding text from
   `UNRESOLVED.leadership` beneath.

   Never invent a name here, and never quietly drop the section. An absent slot
   reads as "no leadership published"; a labelled empty one reads as "not yet
   supplied", which is the truth. Ending the page on an admission is a stronger
   close than ending it on a claim.

   Type-only band, so it uses the padded flex idiom rather than absolute
   positioning.
   ========================================================================== */

const LEADERSHIP_ID = "leadership-heading";

function Leadership() {
  const { leadership } = ABOUT_PAGE;

  return (
    <section id="leadership" aria-labelledby={LEADERSHIP_ID} className={SECTION}>
      <div className={FRAME}>
        <p className={`${EDGE} ${LABEL}`}>{leadership.label}</p>

        <div
          className={`${EDGE} mt-12 lg:mt-24 lg:flex lg:items-stretch lg:justify-between lg:gap-16`}
        >
          <div className="lg:w-[46%]">
            <DisplayHeading
              id={LEADERSHIP_ID}
              lines={leadership.headingLines}
              spoken={leadership.spokenHeading}
            />

            <Reveal
              as="p"
              className={`mt-10 max-w-[34ch] ${RAIL_COPY} lg:mt-12`}
              delay={0.1}
            >
              {leadership.body}
            </Reveal>
          </div>

          {/* THE VOID. `justify-end` pushes the rule to the foot of a column
              that is deliberately taller than its contents; the emptiness above
              it is the whole point and must not be filled. */}
          <div className="mt-16 flex flex-col justify-end lg:mt-0 lg:min-h-[26rem] lg:w-[34ch]">
            <p className="text-micro uppercase tracking-label text-muted">
              {leadership.slot.label}
            </p>

            {/* The signature line. Red is legal here because it is a 1px rule
                — on this site it is never a fill. */}
            <span
              aria-hidden="true"
              className="mt-12 block h-px w-full bg-red"
            />

            <p className="mt-5 text-small text-muted">
              {leadership.slot.placeholder}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   THE PAGE

   No wrapper element and no `className` here on purpose: every section is
   full-bleed and owns its own frame, so anything this function wrapped them in
   would become a second, competing coordinate space. `app/layout.tsx` already
   provides `<main id="main">`, the skip link, the header and the footer — do
   not add a second `<main>`.
   ========================================================================== */

export default function AboutPage() {
  return (
    <>
      <Masthead />
      <Statement />
      <Practice />
      <Numbers />
      <Principles />
      <Leadership />
    </>
  );
}
