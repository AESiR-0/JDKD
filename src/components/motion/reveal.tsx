"use client";

import { Children, useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Reveal — the site's signature mask-up reveal.
 *
 * An `overflow: hidden` wrapper clips an inner element that travels from
 * `translateY(100%)` to `0` with a fade. Transform and opacity only.
 *
 * WHY THIS USES NO ANIMATION LIBRARY. Every visible word on the page passes
 * through this component. When the reveal was driven by a scroll library, a
 * single misfire left the entire site blank — the hidden state applied and the
 * tween that would undo it never ran. The visibility of the page must not
 * depend on a JS animation succeeding.
 *
 * So the hidden state lives in CSS behind `html.reveal-js`, which an inline
 * script in `app/layout.tsx` adds before first paint and removes again after
 * four seconds if nothing ever revealed. This component only observes and
 * flips an attribute; the transition itself is CSS. GSAP is still used for the
 * parallax and the counters, where failure is cosmetic rather than fatal.
 *
 * REDUCED MOTION is handled twice over: the inline script never adds the class,
 * and `globals.css` neutralises the hidden state even if it is present.
 *
 * @example Single block
 * <Reveal as="h2" className="font-display text-headline">Built upward.</Reveal>
 *
 * @example Line-by-line stagger — each child becomes its own masked line
 * <Reveal as="h2" stagger={0.09}>
 *   {LINES.map((line) => <span key={line}>{line}</span>)}
 * </Reveal>
 */

/** Root tags that only accept phrasing content, so masks must be `<span>`. */
const PHRASING_ROOTS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "span",
  "label",
  "figcaption",
  "dt",
  "dd",
]);

export type RevealProps = {
  /**
   * Content to reveal. With `stagger`, each direct child becomes its own
   * masked line and is revealed in sequence.
   */
  children: ReactNode;
  /**
   * Root element type — `"h2"` for a section heading, `"div"` for a copy
   * block, `"li"` inside a list. @default "div"
   */
  as?: ElementType;
  /**
   * Mask-wrapper element. Derived from `as` when omitted: `"span"` for
   * phrasing-only roots such as `h2`/`p`, otherwise `"div"`.
   */
  lineAs?: "span" | "div" | "li";
  /** Passed through, so `aria-labelledby` can target this element. */
  id?: string;
  /** Seconds before the first line moves. @default 0 */
  delay?: number;
  /**
   * Seconds between lines. Any value greater than 0 splits `children` into
   * separately masked lines. @default 0
   */
  stagger?: number;
  /** Seconds per line. @default 0.9 */
  duration?: number;
  /**
   * When the reveal fires, in ScrollTrigger's vocabulary — kept for API
   * stability. Only the coarse distinction is honoured: a value containing
   * "bottom" reveals as soon as any part enters the viewport, otherwise the
   * block must be meaningfully inside it. @default "top 85%"
   */
  start?: string;
  /** Retained for API compatibility. The observer always disconnects after the
   * first reveal, so the animation never reverses. @default true */
  once?: boolean;
  /** Extra classes on the root. */
  className?: string;
  /** Extra classes on each mask wrapper. Rarely needed. */
  lineClassName?: string;
};

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function Reveal({
  children,
  as = "div",
  lineAs,
  id,
  delay = 0,
  stagger = 0,
  duration = 0.9,
  start = "top 85%",
  className,
  lineClassName,
}: RevealProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal-line]"),
    );
    if (targets.length === 0) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      targets.forEach((el, index) => {
        el.style.setProperty("--reveal-duration", `${duration}s`);
        el.style.setProperty("--reveal-delay", `${delay + index * stagger}s`);
        el.setAttribute("data-reveal-in", "");
      });
    };

    // An IntersectionObserver always delivers an initial callback for an
    // observed element, so `observerFired` staying false means the observer
    // itself is broken — in which case show the content rather than hide it.
    let observerFired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        observerFired = true;
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin: start.includes("bottom") ? "0px" : "0px 0px -12% 0px" },
    );
    observer.observe(root);

    const failsafe = window.setTimeout(() => {
      if (!observerFired) reveal();
    }, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [delay, duration, stagger, start]);

  const Tag = as as ElementType;
  const isPhrasingRoot = typeof as === "string" && PHRASING_ROOTS.has(as);
  const Line = (lineAs ?? (isPhrasingRoot ? "span" : "div")) as ElementType;

  const lines = stagger > 0 ? Children.toArray(children) : [children];

  return (
    <Tag ref={rootRef} id={id} className={className}>
      {lines.map((line, index) => (
        <Line
          // Lines are a static, authored list — index keys are stable here.
          key={index}
          className={cx(
            // `pb`/`-mb` give descenders room inside the clip without
            // changing the element's effective box.
            "block overflow-hidden pb-[0.12em] -mb-[0.12em]",
            lineClassName,
          )}
        >
          {/* Same tag as the mask, so block children stay in valid markup. */}
          <Line data-reveal-line="" className="block">
            {line}
          </Line>
        </Line>
      ))}
    </Tag>
  );
}
