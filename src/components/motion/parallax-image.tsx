"use client";

import { useRef, type ReactNode } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * ParallaxImage — a full-bleed image frame with a CAPPED scrub.
 *
 * Two transforms, both scrubbed against the frame's passage through the
 * viewport: a slow vertical drift and a gentle scale. Both are clamped, because
 * the reference site's uncapped scale is exactly the effect the client rejected.
 * Transform only — no filter, no backdrop-filter, no animated box-shadow.
 *
 * LAYOUT CONTRACT. The frame is `position: relative; overflow: hidden` and the
 * image fills it. The frame has NO intrinsic height — you must give it one via
 * `className`, either a height (`h-svh`, `h-[70vh]`) or an aspect ratio
 * (`aspect-[4/5] md:aspect-[16/9]`). Without that the frame collapses.
 *
 * OVERSCAN. The inner layer is inset by `-shift%` top and bottom so the drift
 * can never expose an edge. That means the visible crop is always slightly
 * tighter than the frame — compose for it.
 *
 * PRELOAD. `preload` is Next 16's replacement for the deprecated `priority`.
 * Set it on the hero image and nowhere else: exactly one preloaded image per
 * page. Every other instance stays on the default lazy loading.
 *
 * SOURCE RESOLUTION. `hero-tower.jpg` is 814x900 and the other renders are no
 * wider than 864px. On a 1920px full-bleed frame the browser will request a
 * larger candidate than the source can supply and the result will look soft.
 * That is a source-asset limitation, not a component bug.
 *
 * REDUCED MOTION. The scrub lives inside a `gsap.matchMedia` guard: nothing
 * animates, the image simply sits at its resting crop.
 *
 * @example Hero
 * <ParallaxImage
 *   src={IMAGES.heroTower.src}
 *   alt={IMAGES.heroTower.alt}
 *   sizes="100vw"
 *   preload
 *   className="h-svh w-full"
 * />
 *
 * @example Two-up panel
 * <ParallaxImage
 *   src={IMAGES.locationAerial.src}
 *   alt={IMAGES.locationAerial.alt}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   className="aspect-[4/5] w-full md:aspect-[3/4]"
 * />
 */

/** Hard ceilings. Values outside these ranges are clamped, not honoured. */
const SCALE_MIN = 1;
const SCALE_MAX = 1.12;
const SHIFT_MIN = 0;
const SHIFT_MAX = 10;

export type ParallaxImageProps = {
  /** Path under /public, e.g. `IMAGES.heroTower.src`. */
  src: string;
  /** Real descriptive alt text. Empty string only for decorative artwork. */
  alt: string;
  /**
   * Required. A `fill` image without `sizes` gets a 1x/2x srcset instead of a
   * responsive one. Use "100vw" full-bleed, or the column width otherwise.
   */
  sizes: string;
  /**
   * Frame classes. MUST supply a height or an aspect ratio.
   * This is the only prop that controls the frame's box.
   */
  className?: string;
  /** Classes on the `<img>` itself. `object-cover` is already applied. */
  imageClassName?: string;
  /** Preload this image. Hero only — one per page. @default false */
  preload?: boolean;
  /** Scale at the end of the scrub. Clamped to 1 – 1.12. @default 1.08 */
  scale?: number;
  /** Peak vertical drift, in percent of frame height. Clamped 0 – 10. @default 6 */
  shift?: number;
  /** ScrollTrigger `start`. @default "top bottom" */
  start?: string;
  /** ScrollTrigger `end`. @default "bottom top" */
  end?: string;
  /**
   * Rendered over the image, inside the frame — scrims, headlines, markers.
   * Position it yourself; the frame is a positioning context.
   */
  /**
   * Background painted behind the image while it decodes.
   *
   * MUST be `"ink"` wherever the frame carries a dark scrim and white type —
   * otherwise the frame flashes #FFFFFF behind white text before the image
   * lands. This cannot be corrected from the call site: a background utility
   * passed through `className` has the same specificity as the base one, so
   * which wins depends on generated-stylesheet order, not argument order.
   */
  surface?: "pure" | "ink";
  children?: ReactNode;
};

const SURFACE_CLASS: Record<"pure" | "ink", string> = {
  pure: "bg-surface",
  ink: "bg-deep",
};

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  preload = false,
  scale = 1.08,
  shift = 6,
  start = "top bottom",
  end = "bottom top",
  surface = "pure",
  children,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  const cappedScale = clamp(scale, SCALE_MIN, SCALE_MAX);
  const cappedShift = clamp(shift, SHIFT_MIN, SHIFT_MAX);

  useGSAP(
    () => {
      const frame = frameRef.current;
      const layer = layerRef.current;
      if (!frame || !layer) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          layer,
          { yPercent: -cappedShift / 2, scale: 1 },
          {
            yPercent: cappedShift / 2,
            scale: cappedScale,
            ease: "none",
            scrollTrigger: { trigger: frame, start, end, scrub: true },
          },
        );
      });

      return () => {
        mm.revert();
      };
    },
    {
      scope: frameRef,
      dependencies: [cappedScale, cappedShift, start, end],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={frameRef}
      className={cx(
        "relative overflow-hidden",
        SURFACE_CLASS[surface],
        className,
      )}
    >
      <div
        ref={layerRef}
        className="absolute inset-x-0 will-change-transform"
        // Overscan: the drift can never reach the frame edge.
        style={{ top: `-${cappedShift}%`, bottom: `-${cappedShift}%` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className={cx("object-cover", imageClassName)}
        />
      </div>
      {children}
    </div>
  );
}
