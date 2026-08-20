import { FeaturesPin } from "@/components/sections/features-pin";
import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { FEATURES, SECTIONS } from "@/lib/content";

/** Ten slats per drape. Fewer reads as a single wipe, more reads as noise. */
const SLATS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/** "04" — the panel count, taken from the content rather than retyped. */
const PANEL_TOTAL = String(FEATURES.length).padStart(2, "0");

/**
 * 06 — FEATURES. Four panels advancing in place.
 *
 * Conventions are inherited from `sections/about.tsx`; read that first. What
 * follows is only what this section does differently.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NOTHING NAMES THIS SECTION.
 *
 * No heading, no parenthetical label, no numeral, no title —
 * `SECTIONS.features.paren` is `null` and that is deliberate, not an omission.
 * The four amenities name themselves. The `<section>` therefore carries
 * `aria-label`, and each panel carries its own `<h2>`: there is no section-level
 * heading above them to be subordinate to, so `h3` would skip a level.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE COMPOSITION, at `lg` and above. One panel:
 *
 *      0%                42%        56%                      100%
 *      ├─────────────────┤          ├────────────────────────┤
 *                                     ┌──────┐
 *      TERRACE                   ┌────┤ 1:1  │
 *      LOUNGE                    │    └──┬───┴────┐
 *      │                         └───────┤  4:5   │
 *      │ description, 30ch               │        │
 *      └ vertical hairline               │        │
 *                                        └────────┘
 *                                        placeholder note ────┤ right gutter
 *
 * Two columns, 42% and 44%, with the 14% between them left empty — that gap is
 * the composition. `justify-between` inside the panel's own gutter padding puts
 * the type on the LEFT EDGE and the figure's right edge on the right gutter.
 * Neither column is a grid span; both are percentages of the panel, and the
 * exact split is decided by a measurement rather than a preference — see
 * `TITLE` and `FIGURE` below.
 *
 * THE RIGHT RAIL, honestly. Every other section puts its small sans copy in a
 * ~30ch measure flush to the right gutter. This one cannot: the right 44% is
 * the image pair, which is what the brief asks for. What carries over is the
 * measure — the description is `max-w-[30ch]` and so is the placeholder note,
 * and the note is the block that lands on the right gutter. The discipline is
 * kept; only its side changes, and only where an image already occupies it.
 *
 * THE PAIR. The 1:1 sits up and to the LEFT of the 4:5 and paints over it. The
 * rise is `pt-[8%]` on the wrapper rather than a negative offset on the square:
 * percentage padding resolves against width, so the two frames keep their
 * relationship at every viewport, and nothing overhangs a boundary it would
 * have to be clipped out of.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE PIN IS AN ENHANCEMENT, AND THE MARKUP BELOW IS THE FALLBACK.
 *
 * What is authored here is a plain `<ul>` of four panels in normal flow, one
 * `py-section` rhythm apart. That is what paints with no JS, with reduced
 * motion, below 1024px, and in a viewport too short to hold a panel whole.
 *
 * `FeaturesPin` sets `data-pinned` on the stage — and only after ScrollTrigger
 * has been created without throwing. The `lg:group-data-[pinned]:*` utilities
 * on the frame and the panels are the entire pinned layout: the stage becomes
 * one viewport tall, the panels stack on top of one another inside it, and GSAP
 * crossfades their opacity against the scrub. No attribute, no rewrite.
 *
 * A previous build shipped a blank page because animation sat on the critical
 * path. The failure mode here is a long readable list, never an empty viewport.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TWO THINGS RIDE ON THE PIN, AND BOTH ARE AUTHORED IN THEIR OFF STATE.
 *
 * THE DRAPES. Every figure carries a stack of ten slats over its imagery. At
 * rest each slat is `scaleY(0)` — a zero-height line, nothing on screen — and
 * that rest state is a CLASS, not an inline style, so it is what the browser
 * paints with no JS, under reduced motion, below `lg`, and again the moment
 * GSAP's inline transform is cleared. `FeaturesPin` swings them shut and open
 * against the scrub; a drape can only be closed by an animation that is
 * actively running. A drape stuck shut would be an invisible photograph, which
 * is the exact failure this site has already shipped once, so the direction of
 * the default is the whole safety argument.
 *
 * THE PROGRESS RAIL. A hairline in the left gutter, `display: none` until the
 * stage carries `data-pinned` — so it is absent below `lg`, absent under
 * reduced motion, and absent if `ScrollTrigger.create` ever throws. It is
 * `aria-hidden`: the four panels carry the semantics and a screen reader has no
 * use for a scroll gauge. Its fill is authored empty for the same reason as the
 * slats, but the stakes are lower — an unfilled track hides nothing.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PLACEHOLDERS. All eight frames are client stand-ins. Two things keep that
 * visible: the hairline `PROVISIONAL_FRAME` border used site-wide (see
 * `sections/buildings.tsx`), and the note under each pair. The panel copy
 * itself states confirmed facts — the parapet height, the in-house gym, the
 * dual-side parking — so the copy cannot carry the disclosure the way the
 * Buildings chapters do, and the note has to.
 *
 * SERVER COMPONENT. `FeaturesPin` is a client wrapper that only takes
 * `children`, so everything below stays server-rendered.
 */

/* --------------------------------------------------------------------------
   PANEL COMPOSITION

   One composition, repeated across all four panels. That is the point of a
   pinned run: the panels advance in place, so the frame the reader is looking
   at must not move under them. The asymmetry lives INSIDE the panel — the 14%
   dead gap, the square breaking up and out of the portrait — not between panels.

   Class strings are written out whole. NEVER build a Tailwind class by
   concatenation or interpolation; the v4 scanner reads source text.
-------------------------------------------------------------------------- */

/**
 * A panel. In flow it is a stacked list item; under `data-pinned` it lies over
 * its siblings inside the viewport-high stage. Both states share the `lg` two
 * column arrangement, so the pin changes position and nothing else.
 */
const PANEL =
  "relative mt-section px-gutter first:mt-0 md:px-gutter-lg lg:mt-section-lg lg:flex lg:items-center lg:justify-between lg:group-data-[pinned]:absolute lg:group-data-[pinned]:inset-0 lg:group-data-[pinned]:mt-0";

/** LEFT EDGE — the type column. */
const TYPE_COLUMN = "lg:w-[42%]";

/**
 * Panel title, capped fluid rather than stepped.
 *
 * MEASURED, NOT GUESSED. "INFRASTRUCTURE" set in Prata uppercase at
 * `tracking-tight` is 9.48em wide — the widest unbreakable word any of the four
 * titles contains. So the largest size that fits without clipping is the
 * column's width over 9.48, and a flat `text-headline` would already overflow a
 * 375px screen while a flat `text-h1` would overflow the 42% column at every
 * desktop width. The contract's remedy for display type that has to fit a
 * column is to cap the fluid size instead of adding breakpoints:
 *
 *   below lg   min(8vw, 3.5rem)      375px → 30px of a possible 34.5
 *                                    700px+ → held at text-headline
 *   lg and up  min(3.8vw, 3.5rem)    1024px → 39px of a possible 40
 *                                    1440px → 55px of a possible 58
 *
 * `3.5rem` IS `text-headline`, so the ceiling at every width is a step the rest
 * of the site already uses; it simply becomes fluid on the screens where that
 * step does not fit. An arbitrary font-size carries no line-height from the
 * scale, which is why both leadings are set explicitly.
 */
const TITLE =
  "font-display text-[min(8vw,3.5rem)] uppercase leading-[1] tracking-tight text-ink lg:text-[min(3.8vw,3.5rem)] lg:leading-[0.95]";

/**
 * The panel's single hairline, and the one place on the site it runs vertically:
 * it divides the display title from the sans copy rather than separating two
 * blocks of equal weight.
 */
const DESCRIPTION_RULE = "mt-8 border-l border-line pl-6 lg:mt-10";

/** Body copy, on the site-wide ~30ch measure. */
const DESCRIPTION = "max-w-[30ch] text-small text-muted";

/**
 * OPTICAL BAND — the image pair, ending on the right gutter.
 *
 * The `max-w` cap is what keeps a pinned panel inside one viewport. A 4:5 frame
 * at 44% of the shell would stand 644px tall with its note, which overruns the
 * 640px viewport floor the pin runs down to; capped at 31rem it stands 555px
 * and clears it everywhere. The cap only starts binding around 1240px, so below
 * that the 42 / 14 / 44 split holds exactly and above it the extra width simply
 * becomes more of the gap.
 */
const FIGURE = "relative mt-16 w-full lg:mt-0 lg:w-[44%] lg:max-w-[31rem]";

/** The pair's own box. `pt-[8%]` is the square's rise above the portrait. */
const PAIR = "relative pt-[8%]";

/**
 * Drawn around every frame whose asset is a client stand-in — the same hairline
 * the Buildings chapters use. It is the visible difference between
 * "photograph" and "reserved space".
 */
const PROVISIONAL_FRAME = "border border-line";

/** 4:5, pushed right and down, the dominant frame of the pair. */
const LARGE_FRAME = "ml-auto aspect-[4/5] w-[74%]";

/** 1:1, up and to the left, painting over the portrait's corner. */
const SMALL_FRAME = "aspect-square w-full";

/** Placement of the square inside the pair. */
const SMALL_POSITION = "absolute left-0 top-0 w-[42%]";

/**
 * The placeholder note. `lg:ml-auto` is what lands it on the right gutter, so
 * the section still puts a 30ch measure where every other section puts one.
 */
const NOTE = "mt-6 max-w-[30ch] text-micro text-muted lg:ml-auto";

/* --------------------------------------------------------------------------
   THE DRAPES

   A stack of slats laid over the pair — both frames, the note excluded, since
   the note is type and type crossfades with the rest of the panel.

   `z-10` puts the stack above the square, which is itself absolutely placed
   over the portrait. `pointer-events-none` keeps it out of the way of a
   selection drag. `aria-hidden` is on the wrapper: the frames already take an
   empty alt because the figcaption speaks for them, and a set of empty bars
   has nothing to announce either.
-------------------------------------------------------------------------- */

const DRAPE = "pointer-events-none absolute inset-0 z-10 flex flex-col";

/**
 * One slat. `flex-1` gives all ten an equal share of the pair's height without
 * any percentage arithmetic, and `bg-canvas` is the page ground, so a shut
 * drape does not read as a panel laid over the photograph — it reads as the
 * photograph being taken away.
 *
 * THE REST STATE IS THE SAFE STATE, AND IT IS A CLASS.
 *
 * `[transform:scaleY(0)]` — an arbitrary property, deliberately not the
 * `scale-y-0` utility. Tailwind v4 compiles `scale-*` to the standalone `scale`
 * property, which COMPOSES with `transform` rather than being replaced by it;
 * GSAP writes `transform`, so the two would multiply and every slat would be
 * pinned to zero height forever. Writing the longhand means GSAP's inline
 * `transform` simply overrides this rule while it animates, and clearing that
 * inline transform — which is what the pin's catch block and `mm.revert()` both
 * do — drops the slat straight back to open.
 *
 * `transform-origin` is left at its `50% 50%` default: each slat grows and
 * shrinks about its own midline, which is how a real venetian slat moves, and
 * it means nothing in the timeline ever has to touch the origin.
 */
const SLAT = "block flex-1 bg-canvas [transform:scaleY(0)]";

/* --------------------------------------------------------------------------
   THE PROGRESS RAIL

   `hidden` by default and `block` only under `lg:group-data-[pinned]`, so it
   exists exactly as long as the pin does and not one breakpoint longer. The
   inner box re-establishes the shell so the rule sits 24px from the SHELL's
   left edge rather than the viewport's — past 1440px those are not the same
   place, and the rule belongs beside the type, not floating in the margin.
-------------------------------------------------------------------------- */

const RAIL_LAYER =
  "pointer-events-none absolute inset-0 hidden lg:group-data-[pinned]:block";

/** LEFT EDGE, one gutter in — 32px clear of the title's own left edge. */
const RAIL_SHELL = "mx-auto flex h-full w-full max-w-shell items-center px-gutter";

const RAIL = "flex flex-col items-center gap-4";

/** Current panel above, total below. Geist, because these are numerals. */
const RAIL_NUMERAL = "font-sans text-micro tracking-micro text-muted";

/** The 1px track. Fluid height so it stays a margin note, never a fixture. */
const RAIL_TRACK = "relative block h-[clamp(5rem,16vh,10rem)] w-px bg-line";

/**
 * The filled portion. Same `[transform:scaleY(0)]` rest state and the same
 * reasoning as a slat, with `origin-top` so it fills downward — and
 * `transform-origin` is a separate property, so GSAP's `transform` leaves it be.
 */
const RAIL_FILL =
  "absolute inset-x-0 top-0 block h-full origin-top bg-ink [transform:scaleY(0)]";

export function Features() {
  return (
    <section
      id={SECTIONS.features.id}
      // No heading exists to point `aria-labelledby` at, by design.
      aria-label={SECTIONS.features.label}
      // Standard rhythm. The ~280px pacing break that follows Beliefs B is
      // expressed as `pb-` on that section, so adding a `pt-` break here would
      // double it.
      className="relative overflow-x-clip py-section lg:py-section-lg"
    >
      <FeaturesPin>
        {/* THE FRAME — unpadded coordinate space, and the list itself.
            `list-none` strips list semantics in Safari; the role puts them
            back. `h-full` is inert until the stage has a height to fill. */}
        <ul
          role="list"
          className="relative mx-auto w-full max-w-shell lg:group-data-[pinned]:h-full"
        >
          {FEATURES.map((feature) => (
            <li
              key={feature.id}
              // The hook `FeaturesPin` selects on. Inert without it.
              data-feature-panel=""
              className={PANEL}
            >
              <div className={TYPE_COLUMN}>
                <h2 className={TITLE}>
                  <Reveal as="span" className="block" duration={1}>
                    {feature.title}
                  </Reveal>
                </h2>

                <div className={DESCRIPTION_RULE}>
                  <Reveal as="p" className={DESCRIPTION} delay={0.08}>
                    {feature.description}
                  </Reveal>
                </div>
              </div>

              {/* The pair is a `<figure>` and the note is its `<figcaption>`,
                  so both frames take an empty `alt`: the caption already says
                  what they are, and duplicating it would have a screen reader
                  announce the same sentence twice. The asset's own alt text is
                  the caption — the copy still comes from `@/lib/content`. */}
              <figure className={FIGURE}>
                <div className={PAIR}>
                  <ImageCard
                    src={feature.largeImage.src}
                    alt=""
                    sizes="(min-width: 1240px) 368px, (min-width: 1024px) 33vw, 74vw"
                    surface="ink"
                    shift={4}
                    scale={1.05}
                    delay={0.06}
                    className={
                      feature.largeImage.placeholder
                        ? `${LARGE_FRAME} ${PROVISIONAL_FRAME}`
                        : LARGE_FRAME
                    }
                  />

                  <div className={SMALL_POSITION}>
                    <ImageCard
                      src={feature.smallImage.src}
                      alt=""
                      sizes="(min-width: 1240px) 208px, (min-width: 1024px) 19vw, 42vw"
                      surface="ink"
                      shift={3}
                      scale={1.04}
                      delay={0.2}
                      className={
                        feature.smallImage.placeholder
                          ? `${SMALL_FRAME} ${PROVISIONAL_FRAME}`
                          : SMALL_FRAME
                      }
                    />
                  </div>

                  {/* THE DRAPE. Ten empty bars at zero height until the pin
                      scrubs them; the hook `FeaturesPin` selects on is on each
                      slat, and both halves are inert on their own. */}
                  <div aria-hidden="true" className={DRAPE}>
                    {SLATS.map((slat) => (
                      <span
                        key={slat}
                        data-feature-slat=""
                        className={SLAT}
                      />
                    ))}
                  </div>
                </div>

                <Reveal as="figcaption" className={NOTE} delay={0.14}>
                  {feature.largeImage.alt}
                </Reveal>
              </figure>
            </li>
          ))}
        </ul>

        {/* THE PROGRESS RAIL. Decorative, and a sibling of the list rather
            than a child of it — a `<ul>` takes list items and nothing else. */}
        <div aria-hidden="true" className={RAIL_LAYER}>
          <div className={RAIL_SHELL}>
            <div className={RAIL}>
              <span data-feature-index="" className={RAIL_NUMERAL}>
                01
              </span>
              <span className={RAIL_TRACK}>
                <span data-feature-progress="" className={RAIL_FILL} />
              </span>
              <span className={RAIL_NUMERAL}>{PANEL_TOTAL}</span>
            </div>
          </div>
        </div>
      </FeaturesPin>
    </section>
  );
}
