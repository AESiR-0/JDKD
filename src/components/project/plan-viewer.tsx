"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import type { FloorPlan } from "@/lib/content";

/**
 * PlanViewer — the floor-plan reader for `/projects/[slug]`.
 *
 * The sheets are DRAWINGS, not photographs. Each one carries a legend, grid
 * references and dimension strings printed at a size no phone can resolve, so
 * this component does two jobs that must both work independently:
 *
 *   1. it lets a visitor magnify and move around the drawing, and
 *   2. it writes the same information out in words — `summary`, `legend` and
 *      `notes` — as real, visible, selectable text.
 *
 * (2) is not a fallback for (1). It is the only route a screen-reader user, or
 * anyone who cannot read a fine-line CAD scan, has to the content, so it is
 * always rendered and never collapsed behind a toggle.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IT DEGRADES TO PLAIN IMAGES. The first render — the server render, and the
 * hydration render — is a stack of all three sheets: heading, plain `next/image`
 * at full width, full written readout. No tabs, no controls, no transforms.
 * Only after `useEffect` confirms the component is alive in a browser does it
 * swap to the tabbed viewer.
 *
 * That ordering is the point. If the bundle never arrives, or hydration throws,
 * what is left on screen is every drawing and every word of its description —
 * not a dead tab strip hiding two thirds of the content behind buttons that do
 * nothing. It follows the same instinct as `Reveal` and `ImageCard`: the
 * content must not depend on the JavaScript succeeding.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IT DOES NOT TRAP THE PAGE SCROLL. This is the hard part of a zoom viewer on
 * a phone, and the rule is: a gesture is only captured once the visitor has
 * ACTIVELY zoomed in.
 *
 *   at 100%    `touch-action: pan-y` — one finger scrolls the page straight
 *              through the frame, exactly as if it were a static image. Plain
 *              wheel scrolls the page too.
 *   zoomed in  `touch-action: none` — one finger now pans the drawing, and
 *              plain wheel zooms. Both self-release: wheel down keeps zooming
 *              out, and the moment the scale returns to 100% the frame hands
 *              the page its scroll back. `Reset` does it in one press.
 *
 *   always     ctrl/⌘ + wheel zooms (this is also what a trackpad pinch sends),
 *              two fingers pinch, and the arrow keys only move the drawing
 *              while it is zoomed — otherwise they stay the page's keys.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PAN AND SCALE ARE WRITTEN STRAIGHT TO THE DOM. `viewRef` is the single source
 * of truth and `applyView` writes one `transform` on the stage. React state
 * mirrors only what the CONTROLS need — the scale, for the readout and the
 * limit states — so a drag repaints one composited transform instead of
 * re-rendering the tree sixty times a second. Transform only: no `filter`, no
 * `backdrop-filter`, nothing this site's motion rules forbid.
 *
 * REDUCED MOTION is handled by `globals.css`, which zeroes every transition
 * duration with `!important` — that beats the inline duration written below, so
 * the glide on the buttons becomes an instant jump and the gestures, which are
 * untransitioned anyway, are unaffected.
 *
 * NO `<Reveal>` ANYWHERE IN THIS FILE. Its mask keeps `overflow: hidden` after
 * it finishes and would clip the focus ring on the tabs, the zoom controls and
 * the frame itself. The section that renders this component may animate its own
 * heading and copy; the viewer stays still.
 */

/* ==========================================================================
   GEOMETRY
   ========================================================================== */

/** Scale bounds. 6x is the point where the 1323px source stops adding detail. */
const MIN_SCALE = 1;
const MAX_SCALE = 6;

/** Multiplier per button press, per keyboard step, per double-click. */
const ZOOM_STEP = 1.6;

/** Wheel delta → scale factor. Tuned against a 100px notch on a mouse wheel. */
const WHEEL_SENSITIVITY = 0.0022;

/** Pixels the drawing travels per arrow key press. Shift multiplies it. */
const PAN_STEP = 56;

/** Glide for control-driven changes. Gestures are never transitioned. */
const GLIDE_MS = 320;

type View = { readonly scale: number; readonly x: number; readonly y: number };

const IDENTITY: View = { scale: MIN_SCALE, x: 0, y: 0 };

/** Matches what `applyView` writes, so the first paint needs no correction. */
const STAGE_STYLE: CSSProperties = {
  transform: "translate3d(0px, 0px, 0) scale(1)",
};

type Point = { readonly x: number; readonly y: number };

/**
 * The gesture in progress. `origin*` is the view at the moment the gesture
 * started — every frame is computed from that snapshot rather than from the
 * previous frame, so rounding cannot accumulate across a long drag.
 */
type Gesture =
  | { readonly mode: "none" }
  | {
      readonly mode: "pan";
      readonly pointerId: number;
      readonly pointerX: number;
      readonly pointerY: number;
      readonly originX: number;
      readonly originY: number;
    }
  | {
      readonly mode: "pinch";
      readonly distance: number;
      readonly scale: number;
      readonly focalX: number;
      readonly focalY: number;
      readonly originX: number;
      readonly originY: number;
    };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/* ==========================================================================
   THE ENHANCEMENT GATE

   `useSyncExternalStore` with two constant snapshots — false on the server and
   through hydration, true from the first client render after it. It is the
   supported way to ask "am I hydrated?": a `useEffect` + `setState` gate says
   the same thing but trips `react-hooks/set-state-in-effect`, and reading
   `typeof window` during render would desynchronise the two passes.

   Nothing ever changes, so the subscribe function returns a no-op unsubscribe
   and is never called back.
   ========================================================================== */

const subscribeToNothing = () => () => {};
const hydrated = () => true;
const notHydrated = () => false;

/* ==========================================================================
   THE WRITTEN SHEET

   Summary, legend and notes as text. Rendered in BOTH modes — the plain stack
   and the tabbed viewer — because it is the accessible route to the drawing,
   not an enhancement of it.

   The legend names its colours as WORDS and paints no swatches. The drawings
   key their legends in red and yellow; this site's red is a hairline and focus
   colour and must never appear as a fill, and a colour that is only shown
   cannot be read aloud. Naming it settles both at once.
   ========================================================================== */

/** Sub-block marker. Parenthetical, one step below a section's own label. */
const SUB_LABEL =
  "font-display text-micro uppercase italic tracking-label text-muted";

type PlanReadoutProps = {
  readonly plan: PlanViewerSheet;
  readonly className?: string;
};

function PlanReadout({ plan, className }: PlanReadoutProps) {
  return (
    <div className={className}>
      <div className="lg:flex lg:items-start lg:gap-16">
        {/* Summary and legend — the description of the drawing itself. */}
        <div className="lg:w-[52%]">
          <h4 className={SUB_LABEL}>(WHAT THIS SHEET SHOWS)</h4>
          <p className="mt-4 max-w-[58ch] text-small text-ink">
            {plan.description ?? plan.summary}
          </p>

          <h4 className={`${SUB_LABEL} mt-10`}>(LEGEND)</h4>
          <dl className="mt-4 max-w-[58ch]">
            {plan.legend.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-line py-3"
              >
                <dt className="w-[8ch] shrink-0 text-micro uppercase tracking-label text-ink">
                  {entry.colour}
                </dt>
                <dd className="min-w-0 flex-1 text-small text-muted">
                  {entry.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The strings printed on the sheet that no screen can resolve. */}
        <div className="mt-12 lg:mt-0 lg:ml-auto lg:w-[36ch]">
          <h4 className={SUB_LABEL}>(DIMENSIONS & NOTES)</h4>
          <ul role="list" className="mt-4">
            {plan.notes.map((note) => (
              <li
                key={note}
                className="border-t border-line py-3 text-small text-muted"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   CONTROL BUTTONS

   Real `<button>`s with real accessible names. `aria-disabled` rather than
   `disabled`: at the scale ceiling a truly disabled button drops out of the tab
   order under the visitor's own finger, which throws focus to the document.
   The handler no-ops instead, so focus stays where they put it.
   ========================================================================== */

const CONTROL =
  "flex h-10 cursor-pointer items-center justify-center rounded-card border border-line text-ink transition-colors duration-200 ease-editorial hover:border-line-strong aria-disabled:cursor-not-allowed aria-disabled:opacity-40";

type IconButtonProps = {
  readonly label: string;
  readonly disabled: boolean;
  readonly onPress: () => void;
  readonly children: ReactNode;
};

function IconButton({ label, disabled, onPress, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) onPress();
      }}
      className={`${CONTROL} w-10`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

/* ==========================================================================
   PLAN VIEWER
   ========================================================================== */

/**
 * One sheet, as the viewer wants it.
 *
 * `FloorPlan` from `@/lib/content` satisfies this as-is — pass
 * `PROJECT_TOWER.plans.sheets` straight through. `label` and `description` are
 * accepted as aliases of `tabLabel` and `summary` so a caller that has already
 * renamed them does not have to rename them back; everything else is required,
 * because `title`, `legend` and `notes` ARE the accessible reading of the
 * drawing and a sheet without them cannot be published.
 */
export type PlanViewerSheet = FloorPlan & {
  /** Alias for `tabLabel` — the short form used in the selector. */
  readonly label?: string;
  /** Alias for `summary` — what the drawing shows, in words. */
  readonly description?: string;
};

export type PlanViewerProps = {
  /**
   * The sheets, in the order they should be offered. Each carries its own
   * selector label (`tabLabel`), full `title`, `image`, and the written
   * `summary` / `legend` / `notes` that make it readable without the drawing.
   */
  readonly plans: readonly PlanViewerSheet[];
  /**
   * How to work the viewer, in the client's own words — `PROJECT_TOWER.plans
   * .instructions`. Rendered as visible copy, never only as a `title`. It is
   * shown only in the enhanced mode, because in the plain stack there is
   * nothing to zoom and the sentence would be a lie.
   */
  readonly instructions: string;
  /** Placement classes from the section. The viewer owns no vertical rhythm. */
  readonly className?: string;
};

export function PlanViewer({ plans, instructions, className }: PlanViewerProps) {
  const uid = useId();

  /** False on the server and through hydration; true once React is driving. */
  const enhanced = useSyncExternalStore(
    subscribeToNothing,
    hydrated,
    notHydrated,
  );
  const [activeId, setActiveId] = useState<string>(() => plans[0]?.id ?? "");
  /** Mirror of `viewRef.current.scale` — for the readout and the limit states. */
  const [scale, setScale] = useState(MIN_SCALE);
  /** Debounced copy of the same, so a live region announces once per gesture. */
  const [announced, setAnnounced] = useState(100);
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<View>(IDENTITY);
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const gestureRef = useRef<Gesture>({ mode: "none" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = plans.find((plan) => plan.id === activeId) ?? plans[0];
  // Defaults keep the geometry callbacks total when `plans` is empty; the
  // component returns null below, after the hooks have all been declared.
  const sheetWidth = active?.image.width ?? 1;
  const sheetHeight = active?.image.height ?? 1;

  /**
   * Bounds the view so the drawing can never be dragged off its own frame.
   * The rendered content is `object-contain`, so its resting size is the
   * contain fit of the sheet inside the frame; at scale `s` the overhang on
   * each axis is half the difference, and that is exactly the pan range.
   */
  const clampView = useCallback(
    (next: View): View => {
      const nextScale = clamp(next.scale, MIN_SCALE, MAX_SCALE);
      const viewport = viewportRef.current;
      if (!viewport) return { scale: nextScale, x: 0, y: 0 };

      const rect = viewport.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return { scale: nextScale, x: 0, y: 0 };
      }

      const fit = Math.min(rect.width / sheetWidth, rect.height / sheetHeight);
      const maxX = Math.max(0, (sheetWidth * fit * nextScale - rect.width) / 2);
      const maxY = Math.max(
        0,
        (sheetHeight * fit * nextScale - rect.height) / 2,
      );

      return {
        scale: nextScale,
        x: clamp(next.x, -maxX, maxX),
        y: clamp(next.y, -maxY, maxY),
      };
    },
    [sheetWidth, sheetHeight],
  );

  /** The one place a transform is written. Nothing else touches the stage. */
  const applyView = useCallback(
    (next: View, animate: boolean) => {
      const view = clampView(next);
      viewRef.current = view;

      const stage = stageRef.current;
      if (stage) {
        stage.style.transitionProperty = "transform";
        stage.style.transitionDuration = animate ? `${GLIDE_MS}ms` : "0ms";
        stage.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
        stage.style.transform = `translate3d(${view.x.toFixed(2)}px, ${view.y.toFixed(2)}px, 0) scale(${view.scale.toFixed(4)})`;
      }

      setScale((current) =>
        Math.abs(current - view.scale) < 0.0005 ? current : view.scale,
      );
    },
    [clampView],
  );

  /**
   * Zooms about a focal point, given in pixels from the CENTRE of the frame —
   * the same origin the transform uses, so the point under the cursor or
   * between the fingers stays under it.
   */
  const zoomAt = useCallback(
    (target: number, focalX: number, focalY: number, animate: boolean) => {
      const current = viewRef.current;
      const nextScale = clamp(target, MIN_SCALE, MAX_SCALE);
      const ratio = nextScale / current.scale;
      applyView(
        {
          scale: nextScale,
          x: focalX - (focalX - current.x) * ratio,
          y: focalY - (focalY - current.y) * ratio,
        },
        animate,
      );
    },
    [applyView],
  );

  const resetView = useCallback(
    (animate: boolean) => {
      applyView(IDENTITY, animate);
    },
    [applyView],
  );

  /**
   * A new sheet always opens at 100%, centred.
   *
   * Done here rather than in an effect keyed on `activeId`, and it needs no
   * imperative write: the panel below is keyed by the sheet, so the stage is a
   * NEW element that renders with the identity transform of `STAGE_STYLE`
   * already on it. All this has to do is put the model back in step with it.
   */
  function selectPlan(id: string) {
    if (id === activeId) return;
    pointersRef.current.clear();
    gestureRef.current = { mode: "none" };
    viewRef.current = IDENTITY;
    setDragging(false);
    setScale(MIN_SCALE);
    setActiveId(id);
  }

  /* -- Wheel ------------------------------------------------------------
     A native listener, because React's own wheel handler is registered
     passively at the root and `preventDefault` inside it is ignored.

     `activeId` is in the dependencies on purpose: the panel is keyed by the
     sheet, so switching tabs replaces the frame element and the listener has
     to move with it. ------------------------------------------------------ */
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!enhanced || !viewport) return;

    const onWheel = (event: WheelEvent) => {
      const zoomIntent = event.ctrlKey || event.metaKey;
      // Not zoomed and no modifier: this is the page's scroll, not ours.
      if (!zoomIntent && viewRef.current.scale <= MIN_SCALE) return;

      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const lines = event.deltaMode === 1 ? 16 : 1;
      const factor = Math.exp(-event.deltaY * lines * WHEEL_SENSITIVITY);
      zoomAt(
        viewRef.current.scale * factor,
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
        false,
      );
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [enhanced, activeId, zoomAt]);

  /* -- Re-clamp when the frame changes size ------------------------------ */
  useEffect(() => {
    if (!enhanced) return;
    const onResize = () => applyView(viewRef.current, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [enhanced, applyView]);

  /* -- Announce the scale once the gesture settles ------------------------ */
  useEffect(() => {
    const timer = window.setTimeout(
      () => setAnnounced(Math.round(scale * 100)),
      400,
    );
    return () => window.clearTimeout(timer);
  }, [scale]);

  /* -- Pointer gestures --------------------------------------------------- */

  function beginPinch(surface: HTMLDivElement) {
    const viewport = viewportRef.current;
    const points = Array.from(pointersRef.current.values()).slice(0, 2);
    if (!viewport || points.length < 2) return;

    // A pan may have been running on the first finger. Hand its capture back
    // before the two-finger gesture takes over.
    pointersRef.current.forEach((_point, id) => {
      if (surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
    });

    const [a, b] = points;
    const rect = viewport.getBoundingClientRect();
    gestureRef.current = {
      mode: "pinch",
      distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
      scale: viewRef.current.scale,
      focalX: (a.x + b.x) / 2 - (rect.left + rect.width / 2),
      focalY: (a.y + b.y) / 2 - (rect.top + rect.height / 2),
      originX: viewRef.current.x,
      originY: viewRef.current.y,
    };
    setDragging(false);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const pointers = pointersRef.current;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size >= 2) {
      beginPinch(event.currentTarget);
      return;
    }

    // At 100% there is nothing to move, and taking the pointer here would be
    // taking the page's scroll with it.
    if (viewRef.current.scale <= MIN_SCALE) return;

    gestureRef.current = {
      mode: "pan",
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: viewRef.current.x,
      originY: viewRef.current.y,
    };
    // Capture keeps the drag alive when the pointer leaves the frame. It
    // throws `NotFoundError` for a pointer the browser has already released,
    // and losing the capture is survivable where losing the handler is not.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* the drag continues uncaptured */
    }
    setDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const pointers = pointersRef.current;
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const gesture = gestureRef.current;

    if (gesture.mode === "pinch") {
      const viewport = viewportRef.current;
      const points = Array.from(pointers.values()).slice(0, 2);
      if (!viewport || points.length < 2) return;

      const [a, b] = points;
      const rect = viewport.getBoundingClientRect();
      const distance = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      const nextScale = clamp(
        gesture.scale * (distance / gesture.distance),
        MIN_SCALE,
        MAX_SCALE,
      );
      const ratio = nextScale / gesture.scale;
      // The content point that sat under the fingers when the pinch began
      // stays under them: t = midpoint − (focal − origin) × ratio.
      applyView(
        {
          scale: nextScale,
          x:
            (a.x + b.x) / 2 -
            (rect.left + rect.width / 2) -
            (gesture.focalX - gesture.originX) * ratio,
          y:
            (a.y + b.y) / 2 -
            (rect.top + rect.height / 2) -
            (gesture.focalY - gesture.originY) * ratio,
        },
        false,
      );
      return;
    }

    if (gesture.mode === "pan" && gesture.pointerId === event.pointerId) {
      applyView(
        {
          scale: viewRef.current.scale,
          x: gesture.originX + (event.clientX - gesture.pointerX),
          y: gesture.originY + (event.clientY - gesture.pointerY),
        },
        false,
      );
    }
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const pointers = pointersRef.current;
    if (!pointers.delete(event.pointerId)) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const remaining = Array.from(pointers.entries());

    // One finger lifted out of a pinch: carry on panning with the other.
    if (remaining.length === 1 && viewRef.current.scale > MIN_SCALE) {
      const [id, point] = remaining[0];
      gestureRef.current = {
        mode: "pan",
        pointerId: id,
        pointerX: point.x,
        pointerY: point.y,
        originX: viewRef.current.x,
        originY: viewRef.current.y,
      };
      return;
    }

    if (remaining.length === 0) {
      gestureRef.current = { mode: "none" };
      setDragging(false);
    }
  }

  function handleDoubleClick(event: ReactMouseEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (viewRef.current.scale > MIN_SCALE) {
      resetView(true);
      return;
    }

    const rect = viewport.getBoundingClientRect();
    zoomAt(
      ZOOM_STEP * ZOOM_STEP,
      event.clientX - (rect.left + rect.width / 2),
      event.clientY - (rect.top + rect.height / 2),
      true,
    );
  }

  /* -- Keyboard on the frame ---------------------------------------------
     The arrow keys are only taken while the drawing is zoomed in. At 100% they
     stay the page's keys, which is the keyboard half of not trapping scroll.
     ---------------------------------------------------------------------- */
  function handleFrameKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const current = viewRef.current;

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomAt(current.scale * ZOOM_STEP, 0, 0, true);
      return;
    }
    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      zoomAt(current.scale / ZOOM_STEP, 0, 0, true);
      return;
    }
    if (event.key === "0") {
      event.preventDefault();
      resetView(true);
      return;
    }

    const step = event.shiftKey ? PAN_STEP * 3 : PAN_STEP;
    const dx =
      event.key === "ArrowLeft" ? step : event.key === "ArrowRight" ? -step : 0;
    const dy =
      event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0;
    if (dx === 0 && dy === 0) return;
    if (current.scale <= MIN_SCALE) return;

    event.preventDefault();
    applyView(
      { scale: current.scale, x: current.x + dx, y: current.y + dy },
      true,
    );
  }

  /* -- Keyboard on the tab strip — APG tabs, manual activation ------------ */
  function handleTabKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = plans.length - 1;
    let next = -1;

    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next < 0) return;
    event.preventDefault();
    tabRefs.current[next]?.focus();
  }

  if (!active) return null;

  /* -- Plain stack: server render, and the whole thing without JS ---------- */
  if (!enhanced) {
    return (
      <div className={className}>
        <ul role="list">
          {plans.map((plan) => (
            <li key={plan.id} className="mt-20 first:mt-0">
              <h3 className="font-display text-h3 uppercase tracking-tight text-ink">
                {plan.title}
              </h3>
              <div className="mt-6 border border-line bg-deep">
                <Image
                  src={plan.image.src}
                  alt={plan.image.alt}
                  width={plan.image.width}
                  height={plan.image.height}
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  className="h-auto w-full"
                />
              </div>
              <PlanReadout plan={plan} className="mt-10" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const zoomed = scale > MIN_SCALE;
  const panelId = `${uid}-panel-${active.id}`;
  const activeTabId = `${uid}-tab-${active.id}`;
  const hintId = `${uid}-hint`;
  const titleId = `${uid}-title`;

  return (
    <div className={className}>
      <p className="max-w-[58ch] text-small text-muted">{instructions}</p>

      {/* SELECTOR — scrolls inside itself on a narrow screen, so a long set of
          sheet names can never put the page into horizontal overflow. The
          vertical padding is what keeps the focus ring off the scroller's own
          clipped edge. */}
      <div className="mt-10 border-y border-line">
        <div
          role="tablist"
          aria-label="Floor plan sheets"
          aria-orientation="horizontal"
          className="flex gap-8 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {plans.map((plan, index) => {
            const selected = plan.id === active.id;
            return (
              <button
                key={plan.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${plan.id}`}
                aria-selected={selected}
                // Only the selected sheet's panel is in the document, so only
                // the selected tab may claim to control one — `aria-controls`
                // pointing at an id that does not exist is worse than none.
                aria-controls={selected ? panelId : undefined}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectPlan(plan.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap pb-3 text-micro uppercase tracking-label transition-colors duration-200 ease-editorial ${
                  selected ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {plan.label ?? plan.tabLabel}
                {/* The active marker is a hairline — red is a rule colour on
                    this site, never a fill. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 block h-hair ${
                    selected ? "bg-red" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* The panel is keyed by the sheet: a new drawing gets a new frame and a
          new stage, so no stale transform can survive a tab change. */}
      <div
        key={active.id}
        id={panelId}
        role="tabpanel"
        aria-labelledby={activeTabId}
        className="mt-10"
      >
        <h3 id={titleId} className="sr-only">
          {active.title}
        </h3>

        <div
          ref={viewportRef}
          role="group"
          aria-labelledby={titleId}
          aria-describedby={hintId}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleFrameKeyDown}
          // The scroll contract, in one property: the browser keeps vertical
          // panning until the visitor has zoomed in, and only then does the
          // frame take the gesture.
          style={{ touchAction: zoomed ? "none" : "pan-y" }}
          className={`relative mt-6 aspect-[3/2] w-full select-none overflow-hidden border border-line bg-deep md:aspect-[16/7] ${
            zoomed ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
          }`}
        >
          {/* No `will-change: transform` here. It would promote the stage to a
              layer rasterised once at its resting scale, and a drawing that
              stays soft at 600% is a viewer that does not work. Without the
              hint the browser re-rasters at the scale it is actually painting,
              which is the whole point of magnifying a plan. */}
          <div ref={stageRef} style={STAGE_STYLE} className="absolute inset-0">
            <Image
              src={active.image.src}
              alt={active.image.alt}
              fill
              // Deliberately far larger than the frame. `sizes` normally
              // describes the LAYOUT box, but this image is magnified up to
              // 6x inside it, so the layout box is the wrong basis: asking for
              // the biggest candidate gets the full 1323px sheet, which is all
              // the detail the scan holds.
              sizes="150vw"
              draggable={false}
              className="object-contain"
            />
          </div>
        </div>

        <p id={hintId} className="sr-only">
          Zoomable drawing. Press the plus and minus keys to zoom, the arrow
          keys to move the drawing once it is zoomed in, and zero to reset it.
          The same information is written out in words below.
        </p>

        {/* CONTROLS — under the frame, never over the drawing. */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <IconButton
            label="Zoom out"
            disabled={!zoomed}
            onPress={() => zoomAt(viewRef.current.scale / ZOOM_STEP, 0, 0, true)}
          >
            <span
              aria-hidden="true"
              className="block h-hair w-4 bg-current"
            />
          </IconButton>

          <IconButton
            label="Zoom in"
            disabled={scale >= MAX_SCALE}
            onPress={() => zoomAt(viewRef.current.scale * ZOOM_STEP, 0, 0, true)}
          >
            <span aria-hidden="true" className="relative block size-4">
              <span className="absolute left-0 top-1/2 block h-hair w-full -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-0 block h-full w-hair -translate-x-1/2 bg-current" />
            </span>
          </IconButton>

          <button
            type="button"
            aria-disabled={!zoomed}
            onClick={() => {
              if (zoomed) resetView(true);
            }}
            className={`${CONTROL} px-4 text-micro uppercase tracking-label`}
          >
            Reset
          </button>

          <p
            aria-hidden="true"
            className="ml-auto text-micro tracking-label text-muted"
          >
            {Math.round(scale * 100)}%
          </p>
        </div>

        <PlanReadout plan={active} className="mt-12" />
      </div>

      {/* THE ANNOUNCEMENT, outside the keyed panel so the live region survives
          a change of sheet — a region that is inserted rather than updated is
          a region most screen readers will not read. `announced` lags the
          scale by 400ms on purpose: a pinch would otherwise announce forty
          times on its way to 300%. */}
      <p role="status" aria-live="polite" className="sr-only">
        {`Zoom ${announced} percent.`}
      </p>
    </div>
  );
}
