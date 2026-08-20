import { Reveal } from "@/components/motion/reveal";
import {
  DisplayHeading,
  EDGE,
  FRAME,
  LABEL,
  RAIL_COPY,
  SECTION,
} from "@/components/project/chrome";
import { PlanViewer } from "@/components/project/plan-viewer";
import type { RealProject } from "@/lib/content";

/**
 * FLOOR PLANS — the section that frames the viewer.
 *
 * THE DRAWINGS ARE 1323 × 552 SCANS carrying legends, grid references and
 * dimension strings that no phone can render legibly. Everything that follows
 * from that — the sheet selector, pinch-zoom and pan, the real `<button>`
 * controls, and the written record of each sheet's summary, legend and notes —
 * belongs to `@/components/project/plan-viewer`, which is a client leaf with
 * its own file and its own contract. THIS SECTION DOES NOT DUPLICATE ANY OF IT.
 *
 * In particular `plans.instructions` is passed to the viewer rather than
 * printed here: the viewer shows it only in its enhanced mode, because without
 * JavaScript there is nothing to zoom and a sentence about pinching would be a
 * lie. Printing it here as well would break that.
 *
 *      ▓                                                            ▓
 *      │  (FLOOR PLANS)                                             │
 *      │  THE                                ┌──────────────────┐   │
 *      │  DRAWINGS.                          │  body, ~30ch     │   │
 *      │                                     └──────────────────┘   │
 *      │  ┌──────────────────────────────────────────────────────┐  │
 *      │  │  PlanViewer — selector, frame, controls, written     │  │
 *      │  │  record of every sheet                               │  │
 *      │  └──────────────────────────────────────────────────────┘  │
 *
 * NOT A GRID: a type-only header band on the flex rail idiom, then one
 * full-width block. The viewer is never wrapped in a `Reveal` — the mask keeps
 * `overflow: hidden` after it finishes and would clip the focus rings off its
 * controls.
 */

const PLANS_ID = "plans-heading";

export type ProjectPlansProps = {
  readonly plans: RealProject["plans"];
};

export function ProjectPlans({ plans }: ProjectPlansProps) {
  return (
    <section id="plans" aria-labelledby={PLANS_ID} className={SECTION}>
      <div className={FRAME}>
        <p className={`${EDGE} ${LABEL}`}>{plans.label}</p>

        {/* HEADER BAND — flex rail idiom: nothing here is a picture, so
            nothing has to leave the flow and the rail cannot overflow. */}
        <div
          className={`${EDGE} mt-10 lg:mt-14 lg:flex lg:items-start lg:justify-between lg:gap-16`}
        >
          <DisplayHeading
            id={PLANS_ID}
            lines={plans.headingLines}
            spoken={plans.spokenHeading}
            className="lg:w-[48%]"
          />

          <div className={`mt-10 ${RAIL_COPY} lg:mt-0 lg:w-[30ch]`}>
            <Reveal as="p" delay={0.1}>
              {plans.body}
            </Reveal>
          </div>
        </div>

        {/* THE VIEWER. It owns the selector, the zoom controls, the scroll
            contract and the written record; this file only gives it the sheets
            and the left edge to sit on. */}
        <PlanViewer
          plans={plans.sheets}
          instructions={plans.instructions}
          className={`${EDGE} mt-14 lg:mt-20`}
        />
      </div>
    </section>
  );
}
