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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const expandRef = useRef<HTMLDivElement | null>(null);
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

  /* --- The wipe. Observes the unclipped container. ----------------------- */
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

  /* --- Warm one viewport ahead, play only while on screen ---------------- */
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !motionOk) return;

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
    warmObserver.observe(container);

    const playObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) play();
        else pause();
      }
    });
    playObserver.observe(container);

    const onVisibility = () => {
      if (document.hidden) pause();
      else if (container.getBoundingClientRect().bottom > 0) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPlaying = () => setShown(true);
    const onError = () => {
      setPlaying(false);
      setShown(false);
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    return () => {
      warmObserver.disconnect();
      playObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
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
      ref={containerRef}
      className={`relative ${className ?? ""}`}
    >
      <div
        ref={expandRef}
        data-expand=""
        style={style}
        className="relative h-full w-full overflow-hidden bg-deep"
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
          poster={poster}
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
    </div>
  );
}
