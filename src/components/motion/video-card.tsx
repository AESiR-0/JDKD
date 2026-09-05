"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

/**
 * VideoCard — ImageCard's moving sibling.
 *
 * Same frame, same bottom-to-top clip wipe, same parallax vocabulary. The only
 * difference is what is inside the frame. Read `motion/image-card.tsx` first;
 * this documents where it departs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE POSTER IS THE CONTENT. THE VIDEO IS THE ENHANCEMENT.
 *
 * `preload="none"` and no `autoplay` attribute, so the browser fetches exactly
 * one JPEG until this component decides otherwise. That inverts the usual cost
 * of putting video on a marketing page: with JS off, with a metered connection,
 * with reduced motion, or before the frame is anywhere near the viewport, the
 * page is carrying a poster and nothing else.
 *
 * Playback starts only when the frame actually enters the viewport, and stops
 * again when it leaves. A five-second loop running in a section nobody has
 * scrolled to is decode work and battery for no one.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WCAG 2.2.2 — PAUSE, STOP, HIDE.
 *
 * These loops run longer than five seconds and repeat indefinitely, which is
 * exactly the case the criterion covers, so a pause control is REQUIRED and
 * not a nicety. It is a real `<button>`, it is keyboard reachable, its label
 * changes with state, and it sits inside the frame rather than over the type.
 *
 * Once a visitor pauses, the observer stops being allowed to restart playback —
 * `pausedByUser` latches. A control that is undone by the next scroll is not a
 * control.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REDUCED MOTION. Checked before the first play and again on change: the video
 * element never plays, the poster stands, and the pause control is not
 * rendered at all — there is nothing to pause.
 *
 * TAB VISIBILITY. Paused on `visibilitychange`. Browsers throttle background
 * tabs unevenly and a loop that keeps decoding in one is pure waste.
 *
 * AUTOPLAY REJECTION. `play()` returns a promise that rejects under a policy
 * this component cannot see. Caught and ignored: the poster is already the
 * correct fallback, so a refused play is a non-event rather than an error.
 */
export type VideoCardProps = {
  /** Path under /public without extension, e.g. "/video/a23-aerial". */
  src: string;
  /** Poster image path. Painted before, instead of, and behind the video. */
  poster: string;
  /**
   * Describes what the footage shows. Carried by a visually-hidden node —
   * the video itself is `aria-hidden`, exactly as the site's wordmark is.
   */
  alt: string;
  /** True when a `.webm` sits beside the `.mp4`. @default false */
  webm?: boolean;
  /** Aspect and placement classes for the frame. */
  className?: string;
  /** Seconds before the wipe starts. @default 0 */
  delay?: number;
  /** Seconds the wipe takes. @default 1.1 */
  duration?: number;
};

export function VideoCard({
  src,
  poster,
  alt,
  webm = false,
  className,
  delay = 0,
  duration = 0.8,
}: VideoCardProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pausedByUser = useRef(false);
  const descId = useId();

  const [playing, setPlaying] = useState(false);
  const [motionOk, setMotionOk] = useState(false);

  /* --- Reduced motion, watched rather than sampled once ------------------ */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* --- The wipe. Identical contract to ImageCard. ------------------------ */
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
       * make the picture visible — the CSS transition does, and a transition
       * that never runs leaves the frame clipped to nothing with the attribute
       * sitting on it, looking for all the world like it worked.
       *
       * The boot failsafe in `app/layout.tsx` cannot catch that: it drops
       * `expand-js` only when NO frame anywhere has opened, and these had. So
       * every frame now guarantees its own end state — if the transition has
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

  /* --- Play only while visible, and only if motion is wanted ------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionOk) return;

    const play = () => {
      if (pausedByUser.current) return;
      // Rejection is a policy decision, not a failure. The poster stands.
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    };
    const pause = () => {
      video.pause();
      setPlaying(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) play();
          else pause();
        }
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
    };
  }, [motionOk]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      // Latches: the viewport observer must not undo a deliberate pause.
      pausedByUser.current = true;
      video.pause();
      setPlaying(false);
    }
  };

  const style = {
    "--expand-delay": `${delay}s`,
    "--expand-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div
      ref={frameRef}
      data-expand=""
      style={style}
      // `bg-deep` for the same reason ImageCard takes `surface="ink"`: a dark
      // frame must never flash white while the poster decodes.
      className={`relative overflow-hidden bg-deep ${className ?? ""}`}
    >
      <span id={descId} className="sr-only">{alt}</span>

      <video
        ref={videoRef}
        aria-hidden="true"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        // No `controls`, no `autoplay`: playback is this component's decision,
        // and the pause control below is the visitor's.
        className="h-full w-full object-cover"
      >
        {webm ? <source src={`${src}.webm`} type="video/webm" /> : null}
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>

      {/* THE PAUSE CONTROL. Rendered only when there is something to pause —
          under reduced motion the video never plays, so a control would be a
          button that does nothing. Two 1px rules and a rotation elsewhere on
          this site; here, two bars and a triangle, drawn in CSS rather than
          shipped as an icon font. */}
      {motionOk ? (
        <button
          data-press
          type="button"
          onClick={toggle}
          // Verb-first name; the footage description is already the sr-only
          // node above, so it is referenced, not repeated, as the description.
          aria-label={playing ? "Pause video" : "Play video"}
          aria-describedby={descId}
          className="absolute bottom-gutter right-gutter z-10 flex size-10 cursor-pointer items-center justify-center rounded-card border border-line bg-deep/55 text-ink transition-colors duration-200 ease-editorial hover:border-line-strong lg:bottom-gutter-lg lg:right-gutter-lg"
        >
          <span aria-hidden="true" className="flex items-center gap-[3px]">
            {playing ? (
              <>
                <span className="block h-3 w-px bg-current" />
                <span className="block h-3 w-px bg-current" />
              </>
            ) : (
              <span className="ml-px block size-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
            )}
          </span>
        </button>
      ) : null}
    </div>
  );
}
