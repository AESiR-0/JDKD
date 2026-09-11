"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

/**
 * VideoCard - ImageCard's moving sibling. Same frame, same bottom-to-top clip
 * wipe; read `motion/image-card.tsx` first.
 *
 * THE POSTER IS THE CONTENT, THE VIDEO IS THE ENHANCEMENT. Three layers paint
 * in order, so the frame is never an empty box:
 *   1. `blurDataURL` - a ~300-byte inline JPEG, present in the HTML itself.
 *   2. The poster through next/image - sized to `sizes`, WebP, lazy.
 *   3. The progressive MP4, transparent until it is actually `playing`, then
 *      faded in. The poster MUST be frame 0 of the clip, so the fade is
 *      invisible rather than a jump cut.
 *
 * LOADING. `preload="none"` until the frame is one viewport away, then the
 * file is fetched. The MP4s are faststart, so playback begins after the first
 * few hundred KB and the rest streams while it plays. It only plays while on
 * screen.
 *
 * WCAG 2.2.2 - the loop needs a real pause control; a deliberate pause
 * latches so the viewport observer never undoes it. REDUCED MOTION: the video
 * never loads or plays, and the poster stands. Paused while the tab is hidden.
 */
export type VideoCardProps = {
  /** Path under /public without extension, e.g. "/video/a23-aerial". */
  src: string;
  /** Poster path under /public. Frame 0 of the clip. */
  poster: string;
  /** Tiny inline JPEG data URL, blurred behind the poster while it loads. */
  blurDataURL: string;
  /** `sizes` for the poster - the frame's rendered width. */
  sizes: string;
  /**
   * Describes what the footage shows. Carried by a visually-hidden node -
   * the media itself is decorative to assistive tech.
   */
  alt: string;
  /** True when a `.webm` sits beside the `.mp4`. @default false */
  webm?: boolean;
  /** Aspect and placement classes for the frame. */
  className?: string;
  /** Seconds before the wipe starts. @default 0 */
  delay?: number;
  /** Seconds the wipe takes. @default 0.8 */
  duration?: number;
};

export function VideoCard({
  src,
  poster,
  blurDataURL,
  sizes,
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
  const [shown, setShown] = useState(false);
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
  }, [delay, duration]);

  /* --- Warm one viewport ahead, play only while on screen ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionOk) return;

    let warmed = false;
    const warm = () => {
      if (warmed) return;
      warmed = true;
      video.preload = "auto";
      video.load();
    };

    const play = () => {
      if (pausedByUser.current || document.hidden) return;
      warm();
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    };

    const pause = () => {
      video.pause();
      setPlaying(false);
    };

    const warmObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          warm();
          warmObserver.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    warmObserver.observe(video);

    const playObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) play();
        else pause();
      }
    });
    playObserver.observe(video);

    const onVisibility = () => {
      if (document.hidden) pause();
      else if (video.getBoundingClientRect().bottom > 0) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPlaying = () => setShown(true);
    video.addEventListener("playing", onPlaying);

    return () => {
      warmObserver.disconnect();
      playObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("playing", onPlaying);
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
      className={`relative overflow-hidden bg-deep ${className ?? ""}`}
    >
      <span id={descId} className="sr-only">
        {alt}
      </span>

      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        quality={85}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover"
      />

      <video
        ref={videoRef}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="none"
        data-shown={shown ? "" : undefined}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-editorial data-shown:opacity-100"
      >
        {webm ? <source src={`${src}.webm`} type="video/webm" /> : null}
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>

      {/* THE PAUSE CONTROL (WCAG 2.2.2) */}
      {motionOk ? (
        <button
          data-press
          type="button"
          onClick={toggle}
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
