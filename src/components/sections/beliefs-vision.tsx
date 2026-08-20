import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { BELIEFS_VISION, SECTIONS } from "@/lib/content";

/**
 * 04 — BELIEFS A / THE VISION STATEMENT.
 *
 * Conventions come from `sections/about.tsx`; read that file first. What this
 * section adds to the vocabulary is the EDGE BLEED and the OVERLAP.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A GRID. No twelve-column grid, no column spans. The composition
 * is three anchors and one deliberate collision.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE COMPOSITION, at `lg` and above.
 *
 *   viewport edge
 *   │
 *   ├──────── 48vw ────────┤        40%                  right gutter
 *   ┌──────────────────────┐         ├────────────────────────┤
 *   │                      │                    (OUR BELIEFS)   ← flush RIGHT
 *   │   lobby-wide.jpg     │
 *   │   bleeds off the     │  A VISION OF                ← heading opens INSIDE
 *   │   LEFT viewport edge │▓ CONSIDERED WORK              the image, z-above
 *   │   4:5                │
 *   │                      │              ┌────────────┐
 *   └──────────────────────┘              │ right rail │  ← lower third
 *                                         └────────────┘
 *
 * THE OVERLAP IS THE POINT. `calc(50% - 50vw)` puts the image's left edge on
 * the viewport edge, so its RIGHT edge lands at `calc(50% - 50vw) + 48vw`
 * — which resolves to roughly 46–48% of the frame at every width from 1024px
 * up. The heading starts at 40%, so its opening characters always sit on top of
 * the photograph rather than beside it. Do not "fix" the collision.
 *
 * Because the two numbers must stay in that relationship, they are set once,
 * here, and reused by the scrim: change 48vw or 40% and you change whether this
 * section has a composition at all.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE LABEL HANGS OFF THE RIGHT. Everywhere else on the site the parenthetical
 * marker hangs off the LEFT EDGE. Here the image owns the left edge for the
 * full height of the section, so the marker moves to the right gutter. It is
 * the only section where that is true, and it is a composition decision rather
 * than a drift in the system.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * BAND HEIGHT. The image is the only child left in flow at `lg` — the heading
 * and the rail are both absolute — so the image alone sets the band's height
 * (48vw at 4:5 = 60vw). Everything else is positioned as a percentage of that.
 *
 * MOBILE. One gutter-padded column in DOM order: label, image, heading,
 * paragraph. Every anchor is `lg:`-prefixed, so the mobile view is what is left
 * when the art direction switches off. At `md` the image simply runs flush to
 * the left of the frame at 72% — a left bleed already, without the `vw` maths.
 *
 * SERVER COMPONENT. `ImageCard` and `Reveal` are the only client boundaries.
 */

const HEADING_ID = "vision-heading";

export function BeliefsVision() {
  return (
    <section
      id={SECTIONS.vision.id}
      aria-labelledby={HEADING_ID}
      // Standard rhythm. The three pacing breaks are elsewhere — after the
      // hero, after the bento below, and before the CTA.
      className="relative overflow-x-clip py-section lg:py-section-lg"
    >
      {/* THE FRAME — unpadded coordinate space, capped at the shell. Every
          percentage below is measured against it. */}
      <div className="relative mx-auto w-full max-w-shell">
        {/* RIGHT GUTTER — the section label. See the note above on why this one
            marker hangs off the right rather than the left edge. */}
        <p className="px-gutter text-right font-display text-label uppercase italic tracking-label text-muted md:px-gutter-lg">
          {BELIEFS_VISION.label}
        </p>

        {/* ── THE BAND ───────────────────────────────────────────────────
            One positioning context shared by the image, the heading and the
            rail. Its height comes from the image. */}
        <div className="relative mt-12 lg:mt-24">
          {/* EDGE-BLEED-LEFT. `calc(50% - 50vw)` is exact: below 1440px the
              frame is the viewport and it resolves to 0; above it, it is
              precisely the frame's own left inset. `overflow-x-clip` on the
              section absorbs the scrollbar delta. */}
          <ImageCard
            src={BELIEFS_VISION.image.src}
            alt={BELIEFS_VISION.image.alt}
            sizes="(min-width: 1024px) 48vw, (min-width: 768px) 72vw, 100vw"
            surface="ink"
            shift={6}
            scale={1.05}
            delay={0.05}
            className="aspect-[4/5] w-full md:w-[72%] lg:ml-[calc(50%-50vw)] lg:w-[48vw]"
          />

          {/* The heading's first characters land on the photograph. This ramp
              buys them their contrast back. A plain gradient: no filters of any
              kind, and no frosting — the one frosted surface on this site is the
              bento below. Its geometry mirrors the image exactly. */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden lg:absolute lg:top-0 lg:left-[calc(50%-50vw)] lg:block lg:h-full lg:w-[48vw] lg:bg-linear-to-r lg:from-transparent lg:via-deep/25 lg:to-deep/90"
          />

          {/* THE HEADING — opens at 40%, over the image's right edge, z-above
              it. Two lines, broken for composition rather than for reading, so
              the readable sentence is `sr-only` and the visible stack is hidden
              from assistive technology.

              The size is capped rather than stepped: `min(5.4vw, 5rem)` keeps
              "CONSIDERED WORK" on one line inside a 54%-wide column at every
              width from 1024px up, which the flat 96px display step would not.
              Capping beats adding breakpoints — see the contract. */}
          <h2
            id={HEADING_ID}
            className="mt-12 px-gutter md:px-gutter-lg lg:absolute lg:top-[36%] lg:left-[40%] lg:z-10 lg:mt-0 lg:w-[54%] lg:px-0"
          >
            <span className="sr-only">{BELIEFS_VISION.spokenHeading}</span>
            <span aria-hidden="true" className="block">
              {/* Same cap below `md` as `about.tsx`, for the same measured
                  reason: at 375px a flat `text-headline` ran "CONSIDERED WORK"
                  43px past the viewport edge. `leading-[1.02]` replaces the
                  line height the arbitrary step does not carry. */}
              <Reveal
                as="span"
                stagger={0.1}
                duration={1}
                className="block font-display text-[min(11.6vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-pure md:text-h1 md:leading-[0.98] lg:text-[min(5.4vw,5rem)] lg:leading-[0.95]"
              >
                {BELIEFS_VISION.headingLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </Reveal>
            </span>
          </h2>

          {/* RIGHT RAIL — the ~30ch measure flush to the right gutter, sitting
              in the band's lower third. This is the repetition that ties nine
              differently-composed sections into one system: all small sans copy
              lives here. Do not centre it and do not widen it.

              `text-small` is set on the rail element itself so the `ch` measure
              resolves against the copy it is measuring. */}
          <div className="mt-12 w-full px-gutter text-small text-muted md:px-gutter-lg lg:absolute lg:right-gutter-lg lg:bottom-[8%] lg:mt-0 lg:w-[30ch] lg:px-0">
            <Reveal as="div" delay={0.12}>
              <p>{BELIEFS_VISION.paragraph}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
