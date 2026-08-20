import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { BELIEFS_GRID, SECTIONS } from "@/lib/content";

/**
 * 05 — BELIEFS B / THE BENTO.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ONE OF EXACTLY TWO REAL GRIDS ON THIS SITE.
 *
 * Everywhere else, `grid-cols-*` and `col-span-*` are forbidden: a uniform
 * twelve-column grid applied site-wide is what made the previous build read as
 * a corporate brochure. This section and the FAQ rows are the two sanctioned
 * exceptions, and this one is a bento — 4 columns by 3 rows with FIVE cards on
 * UNEVEN spans, leaving two cells empty on purpose:
 *
 *        col 1     col 2     col 3     col 4
 *      ┌───────────────────┬─────────┬─────────┐
 * row1 │                   │   02    │         │
 *      │        01         │LONGEVITY│   03    │
 *      │     LOCATION      ├─────────┤  LIGHT  │
 * row2 │       2 x 2       │ (empty) │  1 x 2  │
 *      ├───────────────────┼─────────┼─────────┤
 * row3 │        04         │   05    │ (empty) │
 *      │  INFRASTRUCTURE   │STEWARD- │         │
 *      │       2 x 1       │  SHIP   │         │
 *      └───────────────────┴─────────┴─────────┘
 *
 * The two holes are the composition. A bento with every cell filled is a table.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE BACKDROP FILTER LIVES HERE AND IN ONE OTHER PLACE ON THIS SITE — the
 * fixed bar in `SiteHeader`, which is a 56px strip rather than a full-bleed
 * panel and keeps the identical `md:` gate. Nowhere else.
 *
 * The five cards are frosted plates over a photographic ground:
 * `md:backdrop-blur-[14px]` on `md:bg-ink/[0.06]` inside a `border-line`
 * hairline.
 *
 * BELOW 768px THE BLUR IS OFF. Not softened — off. The cards fall back to a
 * flat `bg-surface/85`, which is the unprefixed base here; the frosted
 * treatment is added behind `md:` and therefore only ever reaches a viewport
 * that can afford to composite it. This is a hard requirement, and it is the
 * reason the frosting utilities below are all `md:`-prefixed rather than
 * written plain with a mobile override.
 *
 * Those two class names are written WITH their `md:` prefix even here in the
 * prose, because Tailwind v4's scanner reads this comment as source text: an
 * unprefixed mention would emit a real unprefixed frosting utility into the
 * stylesheet, and the next person to grep the built CSS for frosting below the
 * breakpoint would find it. Same reason the CSS property itself is spelled
 * with a space throughout this file.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE BACKDROP AND THE PACING BREAK.
 *
 * The photograph is a SIBLING of the frame, per the full-bleed contract, and it
 * is inset from the section's foot by exactly the section's bottom padding.
 * This section carries one of the three pacing breaks (~280px, after Beliefs
 * B), and a break filled with photograph is not a break — so the image stops at
 * the top of it and the remaining rhythm is open canvas.
 *
 * `ParallaxImage` directly rather than `ImageCard`: this is a full-bleed
 * background, which is the one case the contract reserves for it.
 *
 * NO HEADING, NO LABEL. `SECTIONS.beliefs.paren` is null by design — the cards'
 * own numerals and titles are the labelling, and a parenthetical above them
 * would be a third layer of the same information. The section is therefore
 * named with `aria-label` rather than `aria-labelledby`.
 *
 * SERVER COMPONENT. `ParallaxImage` and `Reveal` are the only client
 * boundaries, and they are leaves.
 */

/* --------------------------------------------------------------------------
   PLACEMENT

   Where each card sits. Content owns what a principle says; the section owns
   where it goes — so no span, offset or order appears in `@/lib/content`.

   The map is length-locked to the principles tuple, so it has exactly as many
   entries as there are principles. Add a sixth principle to the content model
   and this array is a compile error rather than a card that silently fails to
   appear.

   Class strings are written out whole. NEVER build a Tailwind class by
   concatenation or interpolation — the v4 scanner reads source text, and a
   class assembled at runtime is never generated.
-------------------------------------------------------------------------- */

type CardPlacement = {
  /** Grid placement. One column on phones, two at `md`, the bento at `lg`. */
  readonly cell: string;
  /**
   * Where the title/body block sits inside a tall card. Cards that span two
   * rows push it to the foot so the numeral and the title are not stranded
   * together at the top of a 26rem plate.
   */
  readonly foot: string;
  /** Seconds before this card's copy reveals. Reads left to right. */
  readonly delay: number;
};

/**
 * One `V` per element of `T`, arity preserved.
 *
 * `T` must stay a type parameter: a mapped type is only homomorphic — and so
 * only keeps a tuple a tuple — when it is written over `keyof` a generic.
 * Inlining `keyof typeof BELIEFS_GRID.principles` here instead maps `length`
 * and every array method as well, which is not what we want.
 */
type PerElement<T extends readonly unknown[], V> = {
  readonly [K in keyof T]: V;
};

const CARD_PLACEMENT: PerElement<
  typeof BELIEFS_GRID.principles,
  CardPlacement
> = [
  // 01 LOCATION — the anchor plate, two columns by two rows.
  {
    cell: "md:col-span-2 lg:col-start-1 lg:row-start-1 lg:col-span-2 lg:row-span-2",
    foot: "mt-16 lg:mt-auto",
    delay: 0,
  },
  // 02 LONGEVITY — a single cell, top right of centre.
  {
    cell: "lg:col-start-3 lg:row-start-1 lg:col-span-1 lg:row-span-1",
    foot: "mt-12 lg:mt-10",
    delay: 0.08,
  },
  // 03 LIGHT — the tall column at the right edge. Leaves the cell beneath 02
  // empty, which is what stops the top band reading as a row of three.
  {
    cell: "lg:col-start-4 lg:row-start-1 lg:col-span-1 lg:row-span-2",
    foot: "mt-12 lg:mt-auto",
    delay: 0.16,
  },
  // 04 INFRASTRUCTURE — the wide plate along the foot.
  {
    cell: "md:col-span-2 lg:col-start-1 lg:row-start-3 lg:col-span-2 lg:row-span-1",
    foot: "mt-12 lg:mt-10",
    delay: 0.08,
  },
  // 05 STEWARDSHIP — a single cell, and the last thing on the board. The cell
  // to its right stays empty.
  {
    cell: "lg:col-start-3 lg:row-start-3 lg:col-span-1 lg:row-span-1",
    foot: "mt-12 lg:mt-10",
    delay: 0.16,
  },
];

/**
 * The frosted plate.
 *
 * The unprefixed half is the mobile card: flat, opaque enough to carry type
 * over a photograph, and entirely free of frosting. The `md:` half is the
 * frosted treatment. Both set `background-color`, and the `md:` variant wins by
 * media query rather than by specificity.
 */
const CARD_SURFACE =
  "flex flex-col rounded-card border border-line bg-surface/85 p-7 md:bg-ink/[0.06] md:p-8 md:backdrop-blur-[14px]";

export function BeliefsGrid() {
  return (
    <section
      id={SECTIONS.beliefs.id}
      // This section renders no heading by design, so the accessible name is
      // carried here instead of by `aria-labelledby`.
      aria-label={SECTIONS.beliefs.label}
      // PACING BREAK BELOW. One of the three points in the scroll that gets
      // ~280px instead of the standard rhythm. Split into explicit `pt-`/`pb-`
      // rather than left as a `py-` a second utility has to fight.
      className="relative overflow-x-clip pt-section pb-[11rem] lg:pt-section-lg lg:pb-[17.5rem]"
    >
      {/* FULL-BLEED BACKDROP — a sibling of the frame, never a descendant.
          Stops short of the section's foot by exactly the bottom padding, so
          the pacing break lands on open canvas rather than on photography. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 bottom-[11rem] lg:bottom-[17.5rem]"
      >
        <ParallaxImage
          src={BELIEFS_GRID.backdrop.src}
          alt={BELIEFS_GRID.backdrop.alt}
          sizes="100vw"
          surface="ink"
          shift={8}
          scale={1.06}
          className="h-full w-full"
        />
        {/* The scrim the cards are read against. Flat colour, not a frosted
            layer — the frosting belongs to the cards alone. */}
        <div className="absolute inset-0 bg-deep/70" />
      </div>

      {/* THE FRAME — unpadded coordinate space, capped at the shell, stacked
          above the backdrop. */}
      <div className="relative mx-auto w-full max-w-shell">
        <ul
          // `list-none` from preflight strips list semantics in Safari; the
          // role puts them back.
          role="list"
          className="grid grid-cols-1 gap-4 px-gutter md:grid-cols-2 md:px-gutter-lg lg:auto-rows-[minmax(13rem,auto)] lg:grid-cols-4 lg:gap-5"
        >
          {BELIEFS_GRID.principles.map((principle, index) => {
            const placement = CARD_PLACEMENT[index];

            return (
              <li
                key={principle.id}
                className={`${CARD_SURFACE} ${placement.cell}`}
              >
                <Reveal as="div" delay={placement.delay}>
                  <span className="block font-display text-h3 text-muted">
                    {principle.index}
                  </span>
                </Reveal>

                {/* `mt-auto` on the two-row plates pins this block to the foot
                    of the card; the flat `mt-*` is the minimum gap everywhere
                    else. */}
                <Reveal
                  as="div"
                  stagger={0.08}
                  delay={placement.delay + 0.06}
                  className={placement.foot}
                >
                  <h3 className="font-display text-h2 uppercase tracking-tight text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-5 max-w-[46ch] text-small text-muted">
                    {principle.body}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* RIGHT RAIL — the ~30ch measure flush to the right gutter, present in
            every section on the site.

            It carries the backdrop's provisional status. The photograph behind
            these cards is a labelled stand-in the client will replace, and a
            stand-in must never be dressed as finished work — so the disclosure
            renders from the asset's own `placeholder` flag and disappears by
            itself the moment real interior photography lands in `IMAGES`. */}
        {BELIEFS_GRID.backdrop.placeholder ? (
          <p className="mt-10 w-full px-gutter text-micro text-muted md:px-gutter-lg lg:mt-14 lg:ml-auto lg:mr-gutter-lg lg:w-[30ch] lg:px-0">
            Placeholder frame. Interior photography of JDKD Corporate Tower to
            follow.
          </p>
        ) : null}
      </div>
    </section>
  );
}
