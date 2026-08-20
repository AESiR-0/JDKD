import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { HERO, IMAGES, SECTIONS } from "@/lib/content";

/**
 * 01 — HERO. The dusk tower, the wordmark and one serif statement.
 *
 * Conventions are inherited from `components/sections/about.tsx`, the worked
 * reference section. Read that file first; this one only documents where it
 * departs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A GRID.
 *
 * No `grid-cols-12`, no `col-span-*`. Two anchors carry the whole composition:
 *
 *   1. LEFT EDGE    the page gutter. The wordmark hangs off it, bottom-anchored
 *                   inside the frame, and runs across the building.
 *   2. RIGHT RAIL   flush to the right gutter. The serif statement sits at the
 *                   top of the rail, cap-aligned to the wordmark's top; the
 *                   lede sits beneath it on the site's standard ~30ch measure.
 *
 * There is no OPTICAL BAND here because the image is not a plate inside the
 * frame — it IS the frame's ground, full-bleed behind everything.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE COMPOSITION, at `lg` and above.
 *
 *      left gutter                                    right gutter
 *      ├─────────────────────────────────────────────────────┤
 *
 *                                              AN ADDRESS      ← rail top, cap
 *                        ▓▓▓▓                  THAT WORKS.       aligned to the
 *                        ▓▓▓▓                                    wordmark's top
 *                        ▓▓▓▓                  lede, 30ch
 *      ┌───────────────────────────────┐
 *      │  J D K D                      │  ← ~62% band, over the building
 *      └───────────────────────────────┘
 *      ╰── baseline 14% up from the foot
 *
 * The rail's top is `calc(86% - 10.75rem)`: 100% less the wordmark's 14% foot
 * inset, less its own line box (`text-mega` is 12.5rem at a 0.86 line-height,
 * so 10.75rem). Both blocks are set in the same face, so aligning the line-box
 * tops aligns the caps. If the wordmark's step or leading changes, that
 * constant changes with it — they are one measurement, not two.
 *
 * WHAT THIS SECTION DELIBERATELY DOES NOT HAVE: a credential trio, a scroll
 * cue, a section label (`SECTIONS.hero.paren` is `null` for exactly this
 * reason), and a single number. The hero states the name and one idea.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE ART. Full-bleed, and a SIBLING of the frame rather than a descendant of
 * it, so it spans the viewport while the reading content stays bound to the
 * shell. It is `ParallaxImage` rather than `ImageCard` on purpose: `ImageCard`
 * opens with a clip wipe, and the LCP element of the page must not begin life
 * clipped to nothing. This is also the page's ONLY `preload` image.
 *
 * The scrub runs `top top` → `bottom top` rather than the component's default
 * `top bottom`, because a hero starts at the top of the document: with the
 * default window the trigger would already be halfway through its range at
 * scroll zero and the first paint would show a pre-drifted, pre-scaled crop.
 *
 * TWO SCRIMS, both transform-free and both `bg-*` only — no `filter`, no
 * `backdrop-filter` (that is permitted in exactly two places on this site — the
 * bento cards and the site header's bar — and this is neither):
 *   - a flat wash at 25%, so the muted lede clears contrast wherever it lands;
 *   - a directional gradient, bottom-weighted from `deep` on mobile and turned
 *     diagonal at `lg` so the tower's silhouette stays open toward the top
 *     right while the wordmark's corner goes dark.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * MOBILE. One gutter-padded column, bottom-anchored in DOM order: wordmark,
 * serif statement, lede. Every anchor above is `lg:`-prefixed, so this is what
 * remains when the art direction switches off — not a second layout. The
 * bottom padding clears the fixed quick-contact bar `SiteHeader` pins below
 * 768px (3rem plus the safe-area inset; `SiteFooter` reserves the same strip).
 *
 * ACCESSIBILITY. "JDKD" is a wordmark, not a page title, so the visible mark is
 * `aria-hidden` and the `<h1>` carries `HERO.documentTitle` `sr-only`. The
 * section takes `aria-label` rather than `aria-labelledby`: naming the landmark
 * with the full document title would repeat the whole sentence in the landmark
 * list.
 *
 * SERVER COMPONENT. `ParallaxImage` and `Reveal` are the only client
 * boundaries, and they are leaves. Never put `"use client"` on a section.
 */
export function Hero() {
  return (
    <section
      id={SECTIONS.hero.id}
      aria-label={SECTIONS.hero.label}
      // `overflow-x-clip`, never `overflow-hidden`: the wordmark may run past
      // the frame at the largest step, and a scroll container here would break
      // the pinned Features run further down the page.
      className="relative overflow-x-clip"
    >
      {/* ── THE ART ──────────────────────────────────────────────────────
          Sibling of the frame, so it spans the viewport rather than the shell.
          Height comes from the frame's `min-h-svh`. */}
      <div className="absolute inset-0">
        <ParallaxImage
          src={IMAGES.heroTower.src}
          alt={IMAGES.heroTower.alt}
          sizes="100vw"
          // The one preloaded image on the page.
          preload
          // Dark ground behind a dark scrim: never let this flash white.
          surface="ink"
          shift={7}
          scale={1.06}
          start="top top"
          end="bottom top"
          className="h-full w-full"
        />

        {/* Flat wash — the contrast floor for the muted lede. */}
        <div aria-hidden="true" className="absolute inset-0 bg-deep/25" />

        {/* Directional scrim — bottom-weighted, diagonal from `lg` so the
            tower stays open toward the top right. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-deep from-5% via-deep/55 via-42% to-transparent to-82% lg:bg-linear-to-tr lg:from-8% lg:via-deep/45 lg:via-55% lg:to-92%"
        />
      </div>

      {/* ── THE FRAME ────────────────────────────────────────────────────
          Unpadded horizontally on purpose: an absolutely positioned child
          resolves `bottom: 14%` and `top: calc(86% - 10.75rem)` against this
          element's padding box, so a horizontal gutter here would offset every
          anchor. The vertical padding is mobile-only and reset at `lg`, where
          both children go absolute and the box is exactly one small viewport
          tall. */}
      <div className="relative mx-auto flex min-h-svh w-full max-w-shell flex-col justify-end pb-[calc(4.5rem_+_env(safe-area-inset-bottom))] lg:block lg:pb-0">
        {/* LEFT EDGE — the wordmark, bottom-anchored, spanning the left ~62%
            of the frame so it crosses the building. */}
        <h1 className="px-gutter md:px-gutter-lg lg:absolute lg:bottom-[14%] lg:left-gutter-lg lg:w-[62%] lg:px-0">
          <span className="sr-only">{HERO.documentTitle}</span>
          <span aria-hidden="true" className="block">
            <Reveal
              as="span"
              delay={0.12}
              duration={1.15}
              // `text-mega` is the hero wordmark and nothing else on this site.
              // `text-pure` likewise — the brightest display type, used once.
              className="block font-display text-headline uppercase tracking-tight text-pure md:text-display lg:text-mega"
            >
              {HERO.wordmark}
            </Reveal>
          </span>
        </h1>

        {/* RIGHT RAIL — the serif statement and the lede beneath it. Both are
            flush to the right gutter; only their left edges differ, which is
            the step in the composition. The rail block is wider than the
            measure so the display line is never broken by it; the lede then
            takes the site's standard ~30ch and is pushed back out to the
            gutter with `ml-auto`. */}
        <div className="mt-10 w-full px-gutter md:px-gutter-lg lg:absolute lg:right-gutter-lg lg:top-[calc(86%_-_10.75rem)] lg:mt-0 lg:w-[34%] lg:px-0">
          <Reveal
            as="p"
            stagger={0.1}
            delay={0.28}
            duration={1}
            className="font-display text-h2 uppercase italic tracking-tight text-ink"
          >
            {HERO.serifLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>

          {/* The ~30ch measure, set on the element that carries `text-small`,
              so thirty characters really is thirty characters.

              NO `ml-auto`. It previously pushed this block's right edge to the
              gutter while the serif statement above started at the rail's left
              edge, so the two had different left edges and the column read as
              misaligned. In the reference every line in the right column shares
              one left edge — the rail is a column, not two independently
              justified blocks. */}
          <Reveal
            as="p"
            delay={0.42}
            duration={0.95}
            className="mt-6 max-w-[46ch] text-small text-muted lg:mt-8 lg:max-w-[30ch]"
          >
            {HERO.lede}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
