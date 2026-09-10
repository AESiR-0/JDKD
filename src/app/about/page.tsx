import type { Metadata } from "next";
import Image from "next/image";

import {
  ApproachStackedCards,
  BeliefPinnedDrawing,
  LocationPinnedMap,
  MastheadArc,
  OurStoryButton,
  WhoSignsItArcs,
} from "@/components/about/about-interactive";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { ROUTES } from "@/lib/content";

const ROUTE = ROUTES.about;

export const metadata: Metadata = {
  title: ROUTE.title,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
  openGraph: {
    type: "website",
    url: ROUTE.path,
    title: ROUTE.ogTitle,
    description: ROUTE.description,
  },
};

/**
 * /about — The practice behind the building.
 *
 * Six-Section Architectural Monograph with Continuous Scroll Pinning:
 * 01 / ABOUT JDKD       — The practice behind the building (Aperture & HUD)
 * 02 / OUR BELIEF       — Pinned blueprint draw with real-time wireframe arcs
 * 03 / A PRIME LOCATION — Pinned satellite cartography explorer (Contact page style)
 * 04 / OUR APPROACH     — Pinned horizontal scroll architectural gallery (5 panels)
 * 05 / A TRACK RECORD   — Kinetic metric monolith wall
 * 06 / WHO SIGNS IT     — Framed monograph manifesto & colophon
 */
export default function AboutPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen bg-canvas text-ink selection:bg-red selection:text-pure focus:outline-none"
    >
      {/* ─────────────────────────────────────────────────────────────────
          SECTION 01 — ABOUT JDKD (Masthead)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="masthead"
        aria-label="About JDKD Masthead"
        className="relative overflow-x-clip pt-28 lg:pt-36 pb-20 lg:pb-28"
      >
        <div className="mx-auto w-full max-w-shell px-gutter md:px-gutter-lg">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Column: Index, Headline, Copy, Story CTA */}
            <div className="lg:col-span-6 z-10">
              {/* Index & Eyebrow */}
              <div className="mb-8">
                <span className="font-sans text-xs uppercase tracking-widest text-ink block font-light">
                  01
                </span>
                <span
                  className="mt-1.5 mb-2.5 block h-px w-6 bg-red"
                  aria-hidden="true"
                />
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted">
                  ABOUT JDKD
                </span>
              </div>

              {/* Display Headline — Scaled down per user constraint */}
              <Reveal>
                <h1 className="font-display font-light text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.04] tracking-[-0.035em] text-ink">
                  <span className="block text-ink">The practice</span>
                  <span className="block italic text-[#e6e2da]">behind the</span>
                  <span className="block text-ink">building.</span>
                </h1>
              </Reveal>

              {/* Subtitle / Body Copy */}
              <Reveal delay={0.15}>
                <p className="mt-8 max-w-md text-small text-muted leading-relaxed">
                  At JDKD, we create intelligent, future-ready workspaces that
                  bring together people, purpose and possibility.
                </p>
              </Reveal>

              {/* CTA: Smooth scroll button */}
              <div className="mt-10">
                <OurStoryButton />
              </div>
            </div>

            {/* Right Column: Architectural Vertical Slit Photo & HUD Wireframe */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end min-h-[480px] lg:min-h-[580px]">
              {/* Elliptical Wireframe Arc */}
              <MastheadArc />

              <div className="relative flex items-center gap-6 lg:gap-10">
                {/* Vertical Slit Architectural Photo */}
                <div className="relative w-[260px] sm:w-[300px] lg:w-[340px] h-[440px] sm:h-[500px] lg:h-[560px] overflow-hidden bg-surface shadow-2xl border border-line/30">
                  <Image
                    src="/images/about/atrium-tree.jpg"
                    alt="JDKD architectural stone courtyard opening with sunbeam shadows and green tree"
                    fill
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 340px"
                    priority
                    className="object-cover object-center grayscale-[20%] contrast-[1.05]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>

                {/* Right HUD Floating Metadata Overlays */}
                <div className="hidden sm:flex flex-col justify-between h-[440px] sm:h-[500px] lg:h-[560px] py-4 text-micro uppercase tracking-[0.2em] text-muted font-sans select-none">
                  {/* Top: PEOPLE / PLACES / POSSIBILITIES */}
                  <div className="flex items-start gap-3">
                    <span
                      className="w-px h-16 bg-line-strong block"
                      aria-hidden="true"
                    />
                    <div className="space-y-1 pt-0.5 text-[10px] leading-tight text-muted">
                      <div>PEOPLE</div>
                      <div>PLACES</div>
                      <div>POSSIBILITIES</div>
                    </div>
                  </div>

                  {/* Middle: NEW DELHI / INDIA */}
                  <div className="text-[10px] leading-tight space-y-1 text-muted/80 pl-4">
                    <div>NEW DELHI</div>
                    <div>INDIA</div>
                  </div>

                  {/* Bottom: Coordinates with hairline */}
                  <div className="flex items-end gap-3">
                    <span
                      className="w-px h-10 bg-line block"
                      aria-hidden="true"
                    />
                    <div className="space-y-1 pb-0.5 font-mono text-[9px] text-muted/70 tracking-widest">
                      <div>28.6139° N</div>
                      <div>77.2090° E</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section bottom hairline */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-line"
          aria-hidden="true"
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 02 — OUR BELIEF (Pinned Blueprint Drawing Stage)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="belief"
        aria-label="Our Belief"
        className="relative overflow-hidden border-t border-line"
      >
        <BeliefPinnedDrawing />
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 03 — A PRIME LOCATION (Pinned Satellite Map Explorer)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="location"
        aria-label="A Prime Location"
        className="relative overflow-hidden border-t border-line"
      >
        <LocationPinnedMap />
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 04 — OUR APPROACH (Pinned Scroll Stacked Cards)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="approach"
        aria-label="Our Approach"
        className="relative overflow-hidden border-t border-line"
      >
        <ApproachStackedCards />
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 05 — A TRACK RECORD (Kinetic Metric Wall)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="track-record"
        aria-label="A Track Record"
        className="relative overflow-hidden pt-20 lg:pt-28 pb-20 lg:pb-24 border-t border-line"
      >
        <div className="relative mx-auto w-full max-w-shell px-gutter md:px-gutter-lg">
          {/* Index Header */}
          <div className="mb-14">
            <span className="font-sans text-xs uppercase tracking-widest text-ink block font-light">
              05
            </span>
            <span
              className="mt-1.5 mb-2.5 block h-px w-6 bg-red"
              aria-hidden="true"
            />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted">
              A TRACK RECORD
            </span>
          </div>

          {/* 4 Stat Columns with Vertical Hairline Dividers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
            {/* Stat 1: 12+ Years of experience */}
            <div className="relative pr-6 md:pr-8 md:border-r border-line group">
              <Counter
                value="12"
                unit="+"
                className="font-display font-light text-[3.25rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-none tracking-tight text-ink group-hover:text-pure transition-colors"
                unitClassName="font-display font-light text-[2.25rem] lg:text-[3rem] text-ink ml-0.5"
              />
              <p className="mt-3 text-small text-muted tracking-wide">
                Years of experience
              </p>
            </div>

            {/* Stat 2: 3 Iconic projects */}
            <div className="relative px-0 md:px-8 border-l md:border-l-0 md:border-r border-line pl-6 group">
              <Counter
                value="3"
                className="font-display font-light text-[3.25rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-none tracking-tight text-ink group-hover:text-pure transition-colors"
              />
              <p className="mt-3 text-small text-muted tracking-wide">
                Iconic projects
              </p>
            </div>

            {/* Stat 3: 2M+ Sq. ft. developed */}
            <div className="relative pr-6 md:px-8 md:border-r border-line pt-6 md:pt-0 border-t md:border-t-0 group">
              <Counter
                value="2"
                unit="M+"
                className="font-display font-light text-[3.25rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-none tracking-tight text-ink group-hover:text-pure transition-colors"
                unitClassName="font-display font-light text-[2.25rem] lg:text-[3rem] text-ink ml-0.5"
              />
              <p className="mt-3 text-small text-muted tracking-wide">
                Sq. ft. developed
              </p>
            </div>

            {/* Stat 4: 100+ Happy businesses */}
            <div className="relative px-0 md:pl-8 border-l md:border-l-0 pl-6 border-line pt-6 md:pt-0 border-t md:border-t-0 group">
              <Counter
                value="100"
                unit="+"
                className="font-display font-light text-[3.25rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-none tracking-tight text-ink group-hover:text-pure transition-colors"
                unitClassName="font-display font-light text-[2.25rem] lg:text-[3rem] text-ink ml-0.5"
              />
              <p className="mt-3 text-small text-muted tracking-wide">
                Happy businesses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 06 — WHO SIGNS IT (Framed Monograph Climax)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="who-signs-it"
        aria-label="Who Signs It"
        className="relative overflow-hidden pt-12 lg:pt-16 pb-28 lg:pb-36 border-t border-line"
      >
        <div className="relative mx-auto w-full max-w-shell px-gutter md:px-gutter-lg">
          {/* Framed Architectural Container from Image 2 */}
          <div className="relative border border-line/40 p-8 sm:p-14 lg:p-20 overflow-hidden min-h-[460px] flex flex-col justify-between">
            {/* Background Geometric Intersecting Arcs */}
            <WhoSignsItArcs />

            {/* Top Left: Index & Headline */}
            <div className="relative z-10">
              <div className="mb-8">
                <span className="font-sans text-xs uppercase tracking-widest text-ink block font-light">
                  06
                </span>
                <span
                  className="mt-1.5 mb-2.5 block h-px w-6 bg-red"
                  aria-hidden="true"
                />
              </div>

              {/* Scaled down per user constraint */}
              <Reveal>
                <h2 className="font-display font-light text-[2.5rem] sm:text-[3rem] lg:text-[3.75rem] leading-[1.04] tracking-[-0.035em] text-ink">
                  <span className="block text-ink">WHO</span>
                  <span className="block italic text-[#e6e2da]">SIGNS IT.</span>
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mt-8 max-w-md text-small text-muted leading-relaxed">
                  JDKD was founded with a simple belief that great architecture
                  does more than fill a space. It creates opportunity, well-being
                  and lasting value.
                </p>
              </Reveal>
            </div>

            {/* Bottom Right Colophon */}
            <div className="relative z-10 mt-16 self-end text-right">
              <div className="font-sans text-[11px] font-medium tracking-[0.25em] text-ink uppercase space-y-1 leading-relaxed">
                <div>A</div>
                <div>BETTER</div>
                <div>TOMORROW</div>
              </div>
              <div className="flex justify-end mt-2.5">
                <span className="w-6 h-px bg-red block" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
