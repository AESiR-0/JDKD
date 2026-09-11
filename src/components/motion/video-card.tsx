"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

/**
 * VideoCard — ImageCard's moving sibling, upgraded with HLS streaming.
 *
 * Same frame, same bottom-to-top clip wipe, same parallax vocabulary. The only
 * difference is what is inside the frame. Read `motion/image-card.tsx` first;
 * this documents where it departs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * HLS STREAMING ARCHITECTURE FOR INSTANT TIME-TO-FIRST-FRAME
 *
 * Previously, monolithic 1.8MB MP4 files required long buffering before the
 * browser could start playback. With HLS:
 *   - The video is divided into 2-second independent chunks (~120-250KB each).
 *   - IntersectionObserver triggers buffering 200px before the element enters
 *     the viewport, so segment 0 is already loaded when visible.
 *   - Safari / iOS: Native HLS hardware playback via `application/x-mpegURL`.
 *   - Chrome / Edge / Firefox: Ultra-fast playback via `hls.js` with MSE.
 *   - Fallback: Gracefully falls back to progressive `.mp4` and poster image
 *     if HLS or JavaScript is unavailable.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE POSTER IS THE CONTENT. THE VIDEO IS THE ENHANCEMENT.
 *
 * `preload="none"` and no `autoplay` attribute, so the browser fetches exactly
 * one JPEG until this component decides otherwise. With JS off, with a metered
 * connection, with reduced motion, or before the frame is anywhere near the
 * viewport, the page carries a poster and nothing else.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WCAG 2.2.2 — PAUSE, STOP, HIDE.
 *
 * Loops run indefinitely, so a pause control is REQUIRED. It is a real
 * `<button>`, keyboard reachable, with label changing with state.
 * Once a visitor pauses, `pausedByUser` latches — the viewport observer will
 * not undo a deliberate pause.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REDUCED MOTION. Checked before first play and again on change: the video
 * element never plays, the poster stands, and the pause control is omitted.
 *
 * TAB VISIBILITY. Paused on `visibilitychange`.
 */
export type VideoCardProps = {
  /** Path under /public without extension, e.g. "/video/a23-aerial". */
  src: string;
  /**
   * Optional HLS playlist path (e.g. "/video/hls/a23-aerial/index.m3u8").
   * If omitted, derived automatically from `src`.
   */
  hls?: string;
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
  hls,
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
  const hlsInstanceRef = useRef<{
    destroy: () => void;
    startLoad: () => void;
    stopLoad: () => void;
  } | null>(null);
  const hlsInitialized = useRef(false);
  const descId = useId();

  const [playing, setPlaying] = useState(false);
  const [motionOk, setMotionOk] = useState(false);

  // Compute standard HLS playlist path
  const hlsUrl =
    hls ??
    (src.startsWith("/video/")
      ? src.replace("/video/", "/video/hls/") + "/index.m3u8"
      : `${src}/index.m3u8`);

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
      { rootMargin: "300px 0px" }
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

  /* --- HLS stream setup & viewport playback observer ------------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionOk) return;

    let destroyed = false;

    // Check for native HLS (Safari iOS & macOS)
    const canNativeHls =
      video.canPlayType("application/vnd.apple.mpegurl") ||
      video.canPlayType("application/x-mpegURL");

    const initHls = async () => {
      if (hlsInitialized.current || destroyed) return;
      hlsInitialized.current = true;

      if (canNativeHls) {
        // Native HLS in Safari
        video.src = hlsUrl;
        return;
      }

      // Chrome, Edge, Firefox via hls.js
      try {
        const { default: Hls } = await import("hls.js");
        if (destroyed || !video) return;

        if (Hls.isSupported()) {
          const hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 8,
            maxBufferLength: 8,
            maxMaxBufferLength: 16,
            autoStartLoad: true,
          });

          hlsInstanceRef.current = hlsInstance;
          hlsInstance.loadSource(hlsUrl);
          hlsInstance.attachMedia(video);

          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!pausedByUser.current && !video.paused) {
              video.play().catch(() => {});
            }
          });

          hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hlsInstance.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hlsInstance.recoverMediaError();
                  break;
                default:
                  hlsInstance.destroy();
                  hlsInstanceRef.current = null;
                  video.src = `${src}.mp4`;
                  break;
              }
            }
          });
        } else {
          // Progressive MP4 fallback
          video.src = `${src}.mp4`;
        }
      } catch {
        // Progressive MP4 fallback
        if (video) video.src = `${src}.mp4`;
      }
    };

    const play = () => {
      if (pausedByUser.current) return;

      if (!hlsInitialized.current) {
        initHls().then(() => {
          if (!pausedByUser.current && !destroyed) {
            video.play().then(
              () => setPlaying(true),
              () => setPlaying(false)
            );
          }
        });
      } else {
        if (hlsInstanceRef.current) {
          hlsInstanceRef.current.startLoad();
        }
        video.play().then(
          () => setPlaying(true),
          () => setPlaying(false)
        );
      }
    };

    const pause = () => {
      video.pause();
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.stopLoad();
      }
      setPlaying(false);
    };

    // Buffer 200px before entering viewport for instantaneous first frame
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) play();
          else pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) pause();
      else if (!pausedByUser.current) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Bulletproof loop restart
    const onEnded = () => {
      if (!pausedByUser.current) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };
    video.addEventListener("ended", onEnded);

    return () => {
      destroyed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("ended", onEnded);
      video.pause();
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
      hlsInitialized.current = false;
    };
  }, [motionOk, src, hlsUrl]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.startLoad();
      }
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    } else {
      pausedByUser.current = true;
      video.pause();
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.stopLoad();
      }
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

      <video
        ref={videoRef}
        aria-hidden="true"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      >
        {/* Native HLS source for Safari / iOS browsers */}
        <source src={hlsUrl} type="application/x-mpegURL" />
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
