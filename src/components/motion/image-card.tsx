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
  /** Classes on the `<img>` itself - grading, object-position. */
  imageClassName?: string;
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
  imageClassName,
}: ImageCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const expandRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const expand = expandRef.current;
    if (!container || !expand) return;

    let opened = false;
    let settle = 0;
    const open = () => {
      if (opened) return;
      opened = true;
      expand.setAttribute("data-expand-in", "");

      const ms = (delay + duration) * 1000 + 400;
      const done = () => {
        window.clearTimeout(settle);
        expand.removeEventListener("transitionend", done);
        expand.removeAttribute("data-expand");
      };
      expand.addEventListener("transitionend", done);
      settle = window.setTimeout(done, ms);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          open();
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(container);

    const failsafe = window.setTimeout(() => {
      if (!opened) open();
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
      window.clearTimeout(settle);
    };
  }, [delay, duration]);

  const style = {
    "--expand-delay": `${delay}s`,
    "--expand-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div ref={containerRef} className={className}>
      <div
        ref={expandRef}
        data-expand=""
        style={style}
        className="relative h-full w-full overflow-hidden"
      >
        <ParallaxImage
          src={src}
          alt={alt}
          sizes={sizes}
          shift={shift}
          scale={scale}
          surface={surface}
          preload={preload}
          imageClassName={imageClassName}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
