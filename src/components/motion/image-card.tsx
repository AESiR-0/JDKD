"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { ParallaxImage } from "@/components/motion/parallax-image";

/**
 * ImageCard - the site's standard picture frame.
 *
 * Two moves composed into one: the frame wipes open from the bottom edge
 * upward, and the image inside drifts against the scroll. They are deliberately
 * driven by different mechanisms:
 *
 *   - the wipe is CSS (`globals.css`, `[data-expand]`), because a frame stuck
 *     closed hides content, and content must never depend on JS animation
 *     succeeding;
 *   - the drift is GSAP inside `ParallaxImage`, because a parallax that fails
 *     to run is merely a still photograph.
 *
 * Reduced motion disables both - the inline script in `app/layout.tsx` never
 * adds `.reveal-js`, and `ParallaxImage` gates its own timeline.
 */
export type ImageCardProps = {
  src: string;
  alt: string;
  /** Responsive `sizes`. Required - these frames vary a lot between sections. */
  sizes: string;
  /** Aspect and placement classes for the frame. */
  className?: string;
  /** Seconds before the wipe starts. Stagger neighbouring cards with this. */
  delay?: number;
  /** Seconds the wipe takes. @default 1.1 */
  duration?: number;
  /** Parallax drift, in percent of frame height. 0 disables it. @default 6 */
  shift?: number;
  /** Capped scrub scale. 1 disables it. @default 1.08 */
  scale?: number;
  /** Dark frames must not flash white while the image decodes. */
  surface?: "pure" | "ink";
  /** Marks the LCP image. At most one per page. */
  preload?: boolean;
};

export function ImageCard({
  src,
  alt,
  sizes,
  className,
  delay = 0,
  duration = 0.8,
  shift = 6,
  scale = 1.08,
  surface = "ink",
  preload = false,
}: ImageCardProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let opened = false;
    let settle = 0;
    const open = () => {
      if (opened) return;
      opened = true;
      frame.setAttribute("data-expand-in", "");

      /*
       * PER-FRAME FAILSAFE, and the reason this exists.
       *
       * `data-expand-in` only asks for the clip to animate open. It does not
       * make the picture visible - the CSS transition does, and a transition
       * that never runs leaves the frame clipped to nothing with the attribute
       * sitting on it, looking for all the world like it worked.
       *
       * The boot failsafe in `app/layout.tsx` cannot catch that: it drops
       * `expand-js` only when NO frame anywhere has opened, and these had. So
       * every frame now guarantees its own end state - if the transition has
       * not reported finishing shortly after it should have, `data-expand`
       * comes off, the element leaves the rule's selector entirely, and the
       * photograph simply stands. An unanimated picture beats an invisible one.
       */
      const ms = (delay + duration) * 1000 + 400;
      const done = () => {
        window.clearTimeout(settle);
        frame.removeEventListener("transitionend", done);
      };
      frame.addEventListener("transitionend", done);
      settle = window.setTimeout(() => {
        frame.removeEventListener("transitionend", done);
        frame.removeAttribute("data-expand");
      }, ms);
    };

    // See `Reveal` - an observer that never delivers its initial callback is
    // broken, and a closed frame is worse than an unanimated one.
    let observerFired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        observerFired = true;
        if (entries.some((entry) => entry.isIntersecting)) {
          open();
          observer.disconnect();
        }
      },
      // Opens BEFORE the frame is on screen, so the wipe is finished by the
      // time it is looked at rather than running under the reader.
      { rootMargin: "300px 0px" },
    );
    observer.observe(frame);

    const failsafe = window.setTimeout(() => {
      if (!observerFired) open();
    }, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
      window.clearTimeout(settle);
    };
    // `delay`/`duration` feed the settle timer, so a change to either must
    // rebuild it rather than leave a stale deadline running.
  }, [delay, duration]);

  const style = {
    "--expand-delay": `${delay}s`,
    "--expand-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div ref={frameRef} data-expand="" style={style} className={className}>
      <ParallaxImage
        src={src}
        alt={alt}
        sizes={sizes}
        shift={shift}
        scale={scale}
        surface={surface}
        preload={preload}
        className="h-full w-full"
      />
    </div>
  );
}
