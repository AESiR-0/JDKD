"use client";

import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Counter — scroll-triggered count-up for the "By the numbers" band.
 *
 * Takes the finished display string and works out for itself whether it can be
 * counted. `"23,456"` and `"41.05"` and `"7"` animate from zero, preserving the
 * source string's thousands separators and decimal places. Anything that is not
 * a plain number — `14'9"`, `LEED`, `7 + 2B` — is simply rendered. That is the
 * intended behaviour, not a fallback: the brief's own figures include both.
 *
 * NO REFLOW. The final string is always in the layout as an invisible ghost
 * that reserves the exact box; the animating text is absolutely positioned over
 * it. Combined with the site-wide `tabular-nums` this means digits never
 * shuffle the surrounding layout mid-animation.
 *
 * ACCESSIBILITY. The animated digits are decorative churn and are hidden from
 * assistive technology; a visually-hidden node carries the real value and unit,
 * so a screen reader announces "23,456 sq.ft" once, not a stream of numbers.
 *
 * REDUCED MOTION. The timeline lives inside a `gsap.matchMedia` guard, so the
 * final value is what paints — no count-up at all.
 *
 * @example
 * {FIGURES.map((figure) => (
 *   <div key={figure.id}>
 *     <Counter value={figure.value} unit={figure.unit}
 *              className="text-numeral font-light" />
 *     <p className="mt-3.5 text-caption uppercase tracking-micro text-muted">
 *       {figure.label}
 *     </p>
 *   </div>
 * ))}
 */

export type CounterProps = {
  /**
   * The rendered value, exactly as it should read at rest — separators,
   * quotes and all. Usually `Figure.value` from `@/lib/content`.
   */
  value: string;
  /** Small muted unit rendered after the figure, e.g. "sq.ft". */
  unit?: string | null;
  /** Classes for the figure itself (size, weight, colour). */
  className?: string;
  /** Classes for the unit. @default "text-body-lg text-muted" */
  unitClassName?: string;
  /** Seconds. @default 1.2 */
  duration?: number;
  /** ScrollTrigger `start`. @default "top 60%" */
  start?: string;
};

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Plain integer or decimal, with or without comma grouping. Nothing else. */
const NUMERIC = /^\d{1,3}(?:,\d{3})*(?:\.\d+)?$|^\d+(?:\.\d+)?$/;

type Parsed = {
  target: number;
  decimals: number;
  grouped: boolean;
};

function parse(value: string): Parsed | null {
  const trimmed = value.trim();
  if (!NUMERIC.test(trimmed)) return null;

  const grouped = trimmed.includes(",");
  const bare = trimmed.replace(/,/g, "");
  const target = Number(bare);
  if (!Number.isFinite(target)) return null;

  const dot = bare.indexOf(".");
  const decimals = dot === -1 ? 0 : bare.length - dot - 1;

  return { target, decimals, grouped };
}

function formatter({ decimals, grouped }: Parsed) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
}

export function Counter({
  value,
  unit = null,
  className,
  unitClassName = "text-body-lg text-muted",
  duration = 1.2,
  start = "top 60%",
}: CounterProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const figureRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const figure = figureRef.current;
      if (!root || !figure) return;

      const parsed = parse(value);
      if (!parsed) return; // Non-numeric display — render it and stop.

      const format = formatter(parsed);
      const state = { n: 0 };
      const mm = gsap.matchMedia();

      /*
       * FAILSAFE — the reason this exists.
       *
       * Zeroing the figure is a bet that the tween will run and put the real
       * number back. If that bet loses, the page does not merely lose an
       * animation: it publishes "0 office floors" where the truth is 7. A
       * wrong number on a leasing page is worse than a static one, and this is
       * the same failure class that once left the whole site blank.
       *
       * So the zeroed state is only allowed to persist while the tween is
       * demonstrably alive. If it has not started within a second and a half —
       * ticker stalled, trigger never fired, plugin missing — the confirmed
       * value is restored and the figure simply stands still.
       */
      let started = false;
      let failsafe = 0;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Layout effect: this lands before first paint, so the value never
        // flashes its final state and then restarts from zero.
        figure.textContent = format.format(0);

        gsap.to(state, {
          n: parsed.target,
          duration,
          ease: "power2.out",
          onStart: () => {
            started = true;
          },
          onUpdate: () => {
            started = true;
            figure.textContent = format.format(state.n);
          },
          onComplete: () => {
            figure.textContent = value;
          },
          scrollTrigger: { trigger: root, start, once: true },
        });

        failsafe = window.setTimeout(() => {
          if (!started) figure.textContent = value;
        }, 1500);

        return () => {
          window.clearTimeout(failsafe);
          figure.textContent = value;
        };
      });

      return () => {
        window.clearTimeout(failsafe);
        mm.revert();
        figure.textContent = value;
      };
    },
    { scope: rootRef, dependencies: [value, duration, start], revertOnUpdate: true },
  );

  return (
    <span ref={rootRef} className="inline-flex items-baseline gap-1.5">
      <span className="sr-only">{unit ? `${value} ${unit}` : value}</span>

      <span aria-hidden="true" className={cx("relative inline-block tabular-nums", className)}>
        {/* Ghost reserves the final box so the count-up cannot reflow. */}
        <span className="invisible">{value}</span>
        <span ref={figureRef} className="absolute inset-0">
          {value}
        </span>
      </span>

      {unit ? (
        <span aria-hidden="true" className={unitClassName}>
          {unit}
        </span>
      ) : null}
    </span>
  );
}
