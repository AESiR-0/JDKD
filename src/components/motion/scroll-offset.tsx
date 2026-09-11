"use client";

import { useRef, type ReactNode } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * ScrollOffset - a scroll-scrubbed vertical drift.
 *
 * Wraps content in a `<div>` that translates along Y as it crosses the
 * viewport. Combined with elements that scroll at native speed (or with
 * ParallaxImage, which drifts at its own rate), the speed differential
 * creates a layered depth illusion.
 *
 * Transform only, scrubbed linearly. Reduced motion gets nothing.
 */
export type ScrollOffsetProps = {
  children: ReactNode;
  /** Total pixels of vertical drift across the viewport passage. @default 30 */
  offset?: number;
  className?: string;
};

export function ScrollOffset({
  children,
  offset = 30,
  className,
}: ScrollOffsetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { y: -offset / 2 },
          {
            y: offset / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [offset], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
