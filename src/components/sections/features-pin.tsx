"use client";

import { useRef, type ReactNode } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * FeaturesPin — the scroll pin for 06 FEATURES, and nothing else.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY THIS FILE EXISTS.
 *
 * Sections are Server Components and must stay Server Components. A pin needs
 * GSAP, GSAP needs the browser, so the client boundary has to sit somewhere —
 * and the one place it can sit without dragging four panels of copy and eight
 * images across it is a wrapper that takes `children`. Everything passed in
 * stays server-rendered; this component owns a `<div>`, a ref and a timeline.
 *
 * It is deliberately NOT in `components/motion/`. The primitives there
 * (`Reveal`, `ImageCard`, `Counter`, `ParallaxImage`) are the site's shared
 * vocabulary; this is one section's mechanism, co-located with the one section
 * that uses it. If a second pinned run ever appears, promote it then.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE FALLBACK IS THE MARKUP. THE PIN IS AN ATTRIBUTE.
 *
 * A previous build shipped a blank page because animation sat on the critical
 * path. So nothing here hides content and then relies on a tween to bring it
 * back:
 *
 *   - The panels are authored as four stacked list items in normal flow. That
 *     is what the browser paints with no JS, with reduced motion, below 1024px,
 *     and in any viewport too short to hold a pinned panel.
 *   - The stacked-in-place composition is pure CSS, gated on a single
 *     `data-pinned` attribute this component sets on the stage — and sets ONLY
 *     after `ScrollTrigger.create` has returned without throwing. No attribute,
 *     no rewrite of the layout.
 *   - If any step throws, the catch strips the attribute and clears the inline
 *     opacities, handing the panels straight back to the flow fallback.
 *
 * The consequence worth stating plainly: the failure mode of this file is a
 * long, readable, four-item list. It is never an empty viewport.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE TIMELINE. Opacity and scaleY — transform and opacity are the whole
 * permitted vocabulary, and a crossfade that moved anything would fight the pin.
 *
 * One "unit" below is one viewport height of scrolling. Each panel holds for
 * `DWELL`, then hands over across `FADE`, and the last panel gets a closing
 * `DWELL` of its own before the pin releases. With four panels that is
 * 3 × (0.45 + 0.35) + 0.45 = 2.85 units of pinned scroll, plus the viewport the
 * pin occupies — so the run reads as a shade under four screens.
 *
 * Accessibility: the hidden panels are faded, never `visibility: hidden` and
 * never `aria-hidden`. All four stay in the accessibility tree in DOM order, so
 * a screen reader hears the same four amenities a no-JS visitor reads. Nothing
 * inside a panel is focusable, so there is no tab stop behind a faded panel.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE DRAPES — what the handover actually looks like.
 *
 * A crossfade alone dissolves one photograph into another. The reference wipes
 * the imagery with a set of horizontal bands instead, so each figure carries a
 * stack of ten slats (`features.tsx`, `SLAT`) and one handover runs:
 *
 *   handover −0.10   the OUTGOING drape swings shut, slat by slat, over a
 *                    panel that is still at full opacity — this is the half
 *                    the reader actually sees as blinds closing
 *   handover         the INCOMING drape is set shut in one frame. It is
 *                    invisible at that instant: the panel it belongs to is at
 *                    opacity 0 and has not begun to fade in
 *   handover +0.11   both drapes shut. Both slats and page ground are
 *                    `bg-canvas`, so whatever their two opacities sum to, the
 *                    figure area composites to flat canvas and the crossfade
 *                    finishes underneath it, unseen
 *   handover +0.17   the incoming drape opens, slat by slat, revealing the new
 *                    photograph as its panel reaches full opacity
 *
 * A slat's every scaleY comes from a tween. Nothing here sets one shut at
 * build time, and `timeline.set` is explicitly `immediateRender: false` — a
 * zero-duration tween would otherwise apply the moment it is created, which is
 * how you ship a permanently shut drape over a photograph nobody can see.
 * Playhead at 0, or a scrub that never runs at all, means every slat is still
 * at the `scaleY(0)` its class gives it and all four images are visible.
 *
 * SPANS ARE CHOSEN SO THE CYCLE STILL BREATHES. A drape sweep takes
 * 0.10 + 9 × 0.012 = 0.208 units end to end. Panel n's drape finishes opening
 * at handover +0.378 and does not start shutting again until handover +0.70,
 * which leaves 0.27 units — a third of the cycle, and the part a reader who
 * stops scrolling mid-dwell is most likely to be looking at — with the
 * photograph completely clear.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE PROGRESS RAIL. The fill is one more tween on the same timeline, spanning
 * it exactly, so it cannot drift out of step with the panels. The numeral is
 * the one thing driven from `onUpdate` rather than the timeline: it is text,
 * not a property, and computing it from the elapsed time keeps the forward and
 * reverse cases identical without a `set` per panel. Both live inside markup
 * that is `display: none` unless `data-pinned` is on the stage, so neither can
 * be seen in any state this file does not reach.
 */

/** Scroll a panel holds before handing over, in viewport heights. */
const DWELL = 0.45;

/** Length of one crossfade, in viewport heights. */
const FADE = 0.35;

/** One slat's sweep, in viewport heights. */
const SLAT_SWEEP = 0.1;

/** Offset between neighbouring slats. What makes it read as slats, not a wipe. */
const SLAT_STAGGER = 0.012;

/**
 * scaleY of a shut slat. Slightly over 1 on purpose: at exactly 1 the ten
 * `flex-1` bars meet on fractional pixel boundaries and antialiasing leaves
 * nine hairlines of photograph showing through a drape that is supposed to be
 * closed. The 3% overlap costs nothing and removes them.
 */
const SLAT_SHUT = 1.03;

/** How far BEFORE its handover the outgoing drape starts to shut. */
const DRAPE_LEAD = 0.1;

/** How far AFTER its handover the incoming drape starts to open. */
const DRAPE_LAG = 0.17;

/**
 * The pin runs only where there is room for it. Below `lg` the panels are a
 * single column, and a viewport shorter than the tallest panel would pin a
 * composition that cannot be seen whole.
 */
const PIN_QUERY =
  "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

/**
 * The coupling with `features.tsx`: every panel carries `data-feature-panel`,
 * every slat `data-feature-slat`, and the rail's two moving parts their own
 * hooks. The section's `lg:group-data-[pinned]:*` utilities key off the
 * attribute set below. Both halves are inert on their own.
 */
const PANEL_SELECTOR = "[data-feature-panel]";
const SLAT_SELECTOR = "[data-feature-slat]";
const RAIL_FILL_SELECTOR = "[data-feature-progress]";
const RAIL_INDEX_SELECTOR = "[data-feature-index]";

/** Two digits, matching the "01" the markup ships with. */
function railLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export type FeaturesPinProps = {
  /** The section's frame and its panels. Stays a Server Component. */
  children: ReactNode;
};

export function FeaturesPin({ children }: FeaturesPinProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const mm = gsap.matchMedia();

      mm.add(PIN_QUERY, () => {
        const panels = gsap.utils.toArray<HTMLElement>(
          PANEL_SELECTOR,
          stage,
        );
        // One panel cannot advance, and zero means the markup changed shape.
        if (panels.length < 2) return;

        // Every slat and both rail parts, so the catch below can hand them all
        // back at once. Queried once — the markup is static.
        const drapes = panels.map((panel) =>
          gsap.utils.toArray<HTMLElement>(SLAT_SELECTOR, panel),
        );
        const railFill = stage.querySelector<HTMLElement>(RAIL_FILL_SELECTOR);
        const railIndex = stage.querySelector<HTMLElement>(RAIL_INDEX_SELECTOR);

        try {
          gsap.set(panels, { opacity: 0 });
          gsap.set(panels[0], { opacity: 1 });

          const timeline = gsap.timeline({
            paused: true,
            defaults: { ease: "none" },
          });

          const handoverAt = (index: number) =>
            (index - 1) * (DWELL + FADE) + DWELL;

          panels.forEach((panel, index) => {
            if (index === 0) return;
            const handover = handoverAt(index);
            timeline
              .to(panels[index - 1], { opacity: 0, duration: FADE }, handover)
              .to(panel, { opacity: 1, duration: FADE }, handover);

            // THE DRAPES. Guarded on length so a markup change that drops the
            // slats costs the effect and nothing else.
            const outgoing = drapes[index - 1];
            const incoming = drapes[index];

            if (outgoing.length > 0) {
              timeline.to(
                outgoing,
                {
                  scaleY: SLAT_SHUT,
                  duration: SLAT_SWEEP,
                  stagger: SLAT_STAGGER,
                },
                handover - DRAPE_LEAD,
              );
            }

            if (incoming.length > 0) {
              // `immediateRender: false` is load-bearing, not defensive.
              // `timeline.set` builds a zero-duration tween, and a
              // zero-duration tween renders the instant it is created unless
              // told otherwise — which would leave every incoming drape shut
              // over its photograph before a single pixel of scrolling had
              // happened. With it off, the playhead has to actually arrive
              // here before a slat is ever anything but open.
              timeline.set(
                incoming,
                { scaleY: SLAT_SHUT, immediateRender: false },
                handover,
              );
              timeline.to(
                incoming,
                { scaleY: 0, duration: SLAT_SWEEP, stagger: SLAT_STAGGER },
                handover + DRAPE_LAG,
              );
            }
          });

          // An empty tween, purely to hold the last panel on screen for one
          // more dwell before the pin lets go. Positioned EXPLICITLY rather
          // than appended: the last drape opens past the end of the final
          // crossfade, so an appended tween would start from there instead and
          // quietly lengthen the whole run.
          timeline.to(
            {},
            { duration: DWELL },
            handoverAt(panels.length - 1) + FADE,
          );

          // THE RAIL, added last so `timeline.duration()` is already final.
          // Spanning the timeline exactly means the fill cannot extend it, and
          // cannot drift out of step with the panels either.
          if (railFill) {
            timeline.to(
              railFill,
              { scaleY: 1, duration: timeline.duration() },
              0,
            );
          }

          // The numeral flips when a crossfade is more than half done, which
          // is the moment the arriving panel becomes the one being read.
          const flips: number[] = [];
          for (let index = 1; index < panels.length; index += 1) {
            flips.push(handoverAt(index) + FADE / 2);
          }
          let shown = 0;

          // The attribute goes on FIRST. It collapses four stacked panels into
          // one viewport-high stage, and ScrollTrigger has to measure the
          // composition it is actually going to pin.
          stage.setAttribute("data-pinned", "");

          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            // One viewport height per timeline unit. Measured on a 900px-tall
            // window that is 2565px of scrubbing, which with the pinned screen
            // itself makes the run 3465px — a shade under four screens.
            end: () =>
              `+=${Math.round(window.innerHeight * timeline.duration())}`,
            pin: true,
            anticipatePin: 1,
            scrub: 0.4,
            invalidateOnRefresh: true,
            animation: timeline,
            onUpdate: (self) => {
              if (!railIndex) return;
              const elapsed = self.progress * timeline.duration();
              let active = 0;
              for (const flip of flips) {
                if (elapsed >= flip) active += 1;
              }
              if (active === shown) return;
              shown = active;
              railIndex.textContent = railLabel(active);
            },
          });

          // SYNCHRONOUS, and it has to be. `end` is only evaluated when the
          // trigger refreshes, and pin spacing has just made the document some
          // four screens taller, so every trigger below this one is holding
          // stale bounds. Deferring this to `requestAnimationFrame` looks
          // equivalent and is not: rAF never fires in a background tab, which
          // leaves the pin created with a zero-length range — spacing of 0, a
          // timeline that never advances, and four panels stacked invisibly on
          // top of one another. Refresh here, where nothing can defer it.
          ScrollTrigger.refresh();
        } catch {
          // Enhancement failed. Give the panels back to the document: flow
          // layout, full opacity, four readable sections.
          stage.removeAttribute("data-pinned");
          gsap.set(panels, { clearProps: "opacity" });
          // And give the photography back too. Clearing the inline transform
          // drops every slat onto the `scaleY(0)` its class carries, which is
          // open — the rest state is authored so that losing the animation
          // reveals the images rather than hiding them. Same for the rail's
          // fill, though nothing is behind it and it is hidden by then anyway.
          drapes.forEach((slats) => {
            if (slats.length > 0) gsap.set(slats, { clearProps: "transform" });
          });
          if (railFill) gsap.set(railFill, { clearProps: "transform" });
        }

        return () => {
          stage.removeAttribute("data-pinned");
          // `mm.revert()` unwinds every inline style GSAP wrote, but the
          // numeral is text this file assigned by hand, so it has to be put
          // back by hand or a re-entry starts on a stale panel number.
          if (railIndex) railIndex.textContent = railLabel(0);
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: stageRef },
  );

  return (
    // `group` is what the panels' `group-data-[pinned]:*` utilities hang off.
    // `h-svh` applies only once the pin is live; until then the stage is as
    // tall as the four panels stacked inside it.
    <div ref={stageRef} className="group relative lg:data-[pinned]:h-svh">
      {children}
    </div>
  );
}
