"use client";

import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
// Phones fire resize as the address bar collapses; refreshing pinned sections
// on each one makes them jump mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * SmoothScroll - the site's single smooth-scroll engine.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY THIS EXISTS.
 *
 * Every parallax on this site is scrubbed against the scroll position. With
 * native scrolling that position arrives in whatever increments the input
 * device produces - and a Windows mouse wheel produces discrete jumps of
 * roughly 100px. So a transform bound to it moves in visible steps. The
 * reference this site is measured against reads as liquid for exactly one
 * reason: its scroll position is interpolated before anything is bound to it.
 *
 * Lenis lerps `window.scrollY`, so every ScrollTrigger downstream inherits the
 * smoothing for free. There is no second engine - Locomotive was not installed
 * and must not be. One engine, or the two fight over the same scroll position.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE SAFETY CONTRACT, which is the same one the rest of this codebase keeps.
 *
 * A smooth-scroll engine sits between the visitor and the ability to READ THE
 * PAGE. That is a heavier failure than a missing animation, so the whole
 * initialisation is inside a try/catch: if Lenis throws for any reason, this
 * component does nothing at all and the browser's own scrolling - which was
 * never removed - carries the page. `globals.css` sets `scroll-behavior: auto`
 * rather than `smooth`, so the native fallback is immediate rather than
 * animated, which is correct: CSS smooth scrolling is what was fighting
 * ScrollTrigger's pin in the first place.
 *
 * REDUCED MOTION is handled twice, like everything else here. `matchMedia` is
 * checked before construction so the engine is never built at all, and
 * `respectReducedMotion` is left at its default `true` as a second floor in
 * case the preference changes while the page is open.
 *
 * TOUCH IS LEFT ALONE. `syncTouch` stays at its default `false`, so touch
 * scrolling remains the platform's own. Overriding it is the single most
 * common way sites running this library end up feeling worse on a phone than
 * they did without it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WIRING TO GSAP. Three lines, and each one matters:
 *
 *   1. `lenis.on("scroll", ScrollTrigger.update)` - triggers read the lerped
 *      position rather than the raw one.
 *   2. `gsap.ticker.add(...)` with `autoRaf: false` - one requestAnimationFrame
 *      loop for the whole page instead of two racing each other. The `* 1000`
 *      is a unit conversion: the ticker reports seconds, `raf` wants ms.
 *   3. `lagSmoothing(0)` - GSAP otherwise skips ahead after a long frame to
 *      "catch up", which desynchronises the tween time from the scroll
 *      position and shows up as a jump in the pinned run.
 *
 * ANCHORS are handed to Lenis (`anchors: true`) because in-page links are the
 * one navigation this site has - the header nav is entirely `#section` hrefs.
 * With CSS smooth scrolling gone, this is what animates them, and it animates
 * them through the same engine ScrollTrigger is synchronised with.
 *
 * Rendered once, from `app/layout.tsx`. It renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Never construct the engine at all for a visitor who has asked for less
    // motion. `respectReducedMotion` would neutralise it anyway; not building
    // it means there is nothing to neutralise.
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    try {
      lenis = new Lenis({
        // 0.1 is a slow, heavy glide - right for a building, wrong for a
        // dashboard. Higher tracks the wheel more literally; 1 is native.
        lerp: 0.1,
        // Roughly one wheel notch per gesture. The default overshoots on the
        // long pinned run, where a single flick could clear a whole panel.
        wheelMultiplier: 0.9,
        // Touch stays native. See above.
        syncTouch: false,
        // We drive the loop from GSAP's ticker instead.
        autoRaf: false,
        // The header's nav is entirely in-page anchors; this is what moves them
        // now that `scroll-behavior: smooth` is gone.
        anchors: true,
      });

      const instance = lenis;
      instance.on("scroll", ScrollTrigger.update);

      raf = (time: number) => {
        instance.raf(time * 1000);
      };
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // Pin spacing and every trigger below it were measured against a
      // document that Lenis has just taken over. Measure once more.
      ScrollTrigger.refresh();
    } catch {
      // The engine is an enhancement. Native scrolling was never taken away,
      // so failing here costs the glide and nothing else.
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
      raf = null;
    }

    return () => {
      if (raf) gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's own default.
      lenis?.destroy();
    };
  }, []);

  return null;
}
