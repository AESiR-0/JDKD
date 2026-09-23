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
import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { CLIENT_LOGOS, CLIENT_MORE, ROUTES } from "@/lib/content";

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
    // Declared rather than inherited: without it this page would share the
    // homepage's card, which names the tower rather than the practice.
    images: [
      {
        url: ROUTE.ogImage.src,
        width: ROUTE.ogImage.width,
        height: ROUTE.ogImage.height,
        alt: ROUTE.ogImage.alt,
      },
    ],
  },
};

/**
 * /about - The practice behind the building.
 *
 * Six-Section Architectural Monograph with Continuous Scroll Pinning:
 * 01 / ABOUT JDKD       - The practice behind the building (Aperture & HUD)
 * 02 / OUR BELIEF       - Pinned blueprint draw with real-time wireframe arcs
 * 03 / A PRIME LOCATION - Pinned satellite cartography explorer (Contact page style)
 * 04 / OUR APPROACH     - Pinned horizontal scroll architectural gallery (5 panels)
 * 05 / A TRACK RECORD   - Kinetic metric monolith wall
 * 06 / WHO SIGNS IT     - Framed monograph manifesto & colophon
 */
export default function AboutPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen bg-canvas text-ink selection:bg-red selection:text-pure focus:outline-none"
    >
      {/* ─────────────────────────────────────────────────────────────────
          SECTION 01 - ABOUT JDKD (Masthead)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="masthead"
        aria-label="About JDKD Masthead"
        className="relative overflow-x-clip pt-20 pb-12 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28"
      >
        <div className="mx-auto w-full max-w-shell px-gutter md:px-gutter-lg">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Column: Index, Headline, Copy, Story CTA */}
            <div className="min-w-0 lg:col-span-6 z-10">
              {/* Index & Eyebrow */}
              <Reveal stagger={0.06} className="mb-6 lg:mb-8">
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
              </Reveal>

              {/* Display Headline - Scaled down per user constraint */}
              <h1 className="font-display font-light text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.04] tracking-[-0.035em] text-ink">
                <Reveal as="span" stagger={0.08} duration={1}>
                  <span className="block text-ink">The practice</span>
                  <span className="block italic text-[#e6e2da]">behind the</span>
                  <span className="block text-ink">building.</span>
                </Reveal>
              </h1>

              {/* Subtitle / Body Copy */}
              <Reveal
                as="p"
                delay={0.15}
                className="mt-5 max-w-md text-small text-muted leading-relaxed lg:mt-8"
              >
                At JDKD, we create intelligent, future-ready workspaces that
                bring together people, purpose and possibility.
              </Reveal>

              {/* CTA: Smooth scroll button */}
              <div className="mt-6 lg:mt-10">
                <OurStoryButton />
              </div>
            </div>

            {/* Right Column: photo plate & HUD. Phones get a full-width plate with
                the HUD laid over it; from `sm` it is the slit photo with the HUD
                beside it. */}
            <div className="relative flex min-w-0 items-center justify-center sm:min-h-[480px] lg:col-span-6 lg:justify-end lg:min-h-[580px]">
              {/* Elliptical Wireframe Arc - it read as a stray line on phones */}
              <div className="hidden sm:contents">
                <MastheadArc />
              </div>

              <div className="relative flex w-full items-center gap-6 sm:w-auto lg:gap-10">
                {/* Architectural Photo Plate */}
                <div className="relative aspect-[4/5] max-h-[68svh] w-full overflow-hidden border border-line/30 bg-surface shadow-2xl sm:aspect-auto sm:max-h-none sm:h-[500px] sm:w-[300px] lg:h-[560px] lg:w-[340px]">
                  <ImageCard
                    src="/images/about/atrium-tree.jpg"
                    alt="JDKD architectural stone courtyard opening with sunbeam shadows and green tree"
                    sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) 300px, 340px"
                    preload
                    surface="ink"
                    shift={4}
                    scale={1.05}
                    delay={0.15}
                    duration={1.1}
                    imageClassName="object-center grayscale-[20%] contrast-[1.05]"
                    className="absolute inset-0"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-transparent"
                    aria-hidden="true"
                  />

                  {/* Phone HUD, over the photo (the beside-photo HUD is sm+). */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/55 via-transparent to-transparent sm:hidden"
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 flex select-none flex-col justify-between p-4 font-sans uppercase tracking-[0.2em] text-ink/85 sm:hidden"
                    aria-hidden="true"
                  >
                    <Reveal
                      stagger={0.06}
                      delay={0.6}
                      className="self-end space-y-1 text-right text-[10px] leading-tight"
                    >
                      <span className="block">PEOPLE</span>
                      <span className="block">PLACES</span>
                      <span className="block">POSSIBILITIES</span>
                    </Reveal>
                    <div className="flex items-end justify-between gap-4">
                      <Reveal
                        stagger={0.06}
                        delay={0.75}
                        className="space-y-1 font-mono text-[9px] tracking-widest text-ink/70"
                      >
                        <span className="block">28.6139° N</span>
                        <span className="block">77.2090° E</span>
                      </Reveal>
                      <Reveal
                        stagger={0.06}
                        delay={0.8}
                        className="space-y-1 text-right text-[10px] leading-tight"
                      >
                        <span className="block">NEW DELHI</span>
                        <span className="block">INDIA</span>
                      </Reveal>
                    </div>
                  </div>
                </div>

                {/* Right HUD Floating Metadata Overlays */}
                <div className="hidden sm:flex flex-col justify-between h-[440px] sm:h-[500px] lg:h-[560px] py-4 text-micro uppercase tracking-[0.2em] text-muted font-sans select-none">
                  {/* The HUD arrives once the photograph has started to open. */}
                  {/* Top: PEOPLE / PLACES / POSSIBILITIES */}
                  <Reveal delay={0.6}>
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
                  </Reveal>

                  {/* Middle: NEW DELHI / INDIA */}
                  <Reveal delay={0.68}>
                    <div className="text-[10px] leading-tight space-y-1 text-muted/80 pl-4">
                      <div>NEW DELHI</div>
                      <div>INDIA</div>
                    </div>
                  </Reveal>

                  {/* Bottom: Coordinates with hairline */}
                  <Reveal delay={0.76}>
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
                  </Reveal>
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
          SECTION 02 - OUR BELIEF (Pinned Blueprint Drawing Stage)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="belief"
        aria-label="Our Belief"
        className="relative overflow-hidden border-t border-line"
      >
        <BeliefPinnedDrawing />
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 03 - A PRIME LOCATION (Pinned Satellite Map Explorer)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="location"
        aria-label="A Prime Location"
        className="relative overflow-hidden border-t border-line"
      >
        <LocationPinnedMap />
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 04 - OUR APPROACH (Pinned Scroll Stacked Cards)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="approach"
        aria-label="Our Approach"
        className="relative overflow-hidden border-t border-line"
      >
        <ApproachStackedCards />
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 05 - A TRACK RECORD (Kinetic Metric Wall)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="track-record"
        aria-label="A Track Record"
        className="relative overflow-hidden pt-20 lg:pt-28 pb-20 lg:pb-24 border-t border-line"
      >
        <div className="relative mx-auto w-full max-w-shell px-gutter md:px-gutter-lg">
          {/* Index Header */}
          <Reveal stagger={0.06} className="mb-14">
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
          </Reveal>

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
              <Reveal as="p" delay={0.1} className="mt-3 text-small text-muted tracking-wide">
                Years of experience
              </Reveal>
            </div>

            {/* Stat 2: 3 Iconic projects */}
            <div className="relative px-0 md:px-8 border-l md:border-l-0 md:border-r border-line pl-6 group">
              <Counter
                value="3"
                className="font-display font-light text-[3.25rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-none tracking-tight text-ink group-hover:text-pure transition-colors"
              />
              <Reveal as="p" delay={0.16} className="mt-3 text-small text-muted tracking-wide">
                Iconic projects
              </Reveal>
            </div>

            {/* Stat 3: 2M+ Sq. ft. developed */}
            <div className="relative pr-6 md:px-8 md:border-r border-line pt-6 md:pt-0 border-t md:border-t-0 group">
              <Counter
                value="2"
                unit="M+"
                className="font-display font-light text-[3.25rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-none tracking-tight text-ink group-hover:text-pure transition-colors"
                unitClassName="font-display font-light text-[2.25rem] lg:text-[3rem] text-ink ml-0.5"
              />
              <Reveal as="p" delay={0.22} className="mt-3 text-small text-muted tracking-wide">
                Sq. ft. developed
              </Reveal>
            </div>

            {/* Stat 4: 100+ Happy businesses */}
            <div className="relative px-0 md:pl-8 border-l md:border-l-0 pl-6 border-line pt-6 md:pt-0 border-t md:border-t-0 group">
              <Counter
                value="100"
                unit="+"
                className="font-display font-light text-[3.25rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-none tracking-tight text-ink group-hover:text-pure transition-colors"
                unitClassName="font-display font-light text-[2.25rem] lg:text-[3rem] text-ink ml-0.5"
              />
              <Reveal as="p" delay={0.28} className="mt-3 text-small text-muted tracking-wide">
                Happy businesses
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          CLIENTS SECTION - Marquee & Edge Vignettes (Before Who Signs It)
          ───────────────────────────────────────────────────────────────── */}
      <section
        id="clients"
        aria-label="Our Clients"
        className="relative overflow-hidden border-t border-line py-16 lg:py-24"
      >
        <div className="relative mx-auto w-full max-w-shell px-gutter md:px-gutter-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            {/* Left Column (30%): Our Clients & "...& many more" */}
            <div className="w-full lg:w-[30%] shrink-0 pr-0 lg:pr-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-6 bg-red block" aria-hidden="true" />
                  <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted">
                    OUR CLIENTS
                  </span>
                </div>
                <Reveal as="h3" className="font-display font-light text-2xl sm:text-3xl text-pure tracking-tight leading-tight">
                  Trusted by industry leaders
                </Reveal>
              </div>
              <div className="mt-4 sm:mt-6">
                <span className="font-display italic text-muted/80 text-base sm:text-lg tracking-wide">
                  {CLIENT_MORE}
                </span>
              </div>
            </div>

            {/* Right Column (70%): Marquee with Edge Vignettes */}
            <div className="w-full lg:w-[70%] relative overflow-hidden py-4">
              {/* Left & Right Vignette Gradients */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-canvas via-canvas/90 to-transparent z-10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-canvas via-canvas/90 to-transparent z-10"
                aria-hidden="true"
              />

              {/* Seamless Marquee Track */}
              <div className="marquee-vignette w-full overflow-hidden">
                <div
                  className="animate-marquee flex items-center gap-12 sm:gap-16 lg:gap-20 py-2"
                  // Constant speed however long the roster gets (5 logos ran at 28s).
                  style={{ animationDuration: `${CLIENT_LOGOS.length * 5.6}s` }}
                >
                  {/* Track 1 */}
                  {CLIENT_LOGOS.map((client, idx) => (
                    <div
                      key={`track1-${client.name}-${idx}`}
                      className="shrink-0 flex items-center justify-center opacity-75 transition-[opacity,transform] duration-300 hover:opacity-100 hover:scale-105"
                      title={client.name}
                    >
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={client.width}
                        height={client.height}
                        className={`object-contain max-h-12 ${client.className}`}
                      />
                    </div>
                  ))}
                  {/* Track 2 (for seamless loop) - hidden from screen readers so
                      every client is announced once. */}
                  {CLIENT_LOGOS.map((client, idx) => (
                    <div
                      key={`track2-${client.name}-${idx}`}
                      aria-hidden="true"
                      className="shrink-0 flex items-center justify-center opacity-75 transition-[opacity,transform] duration-300 hover:opacity-100 hover:scale-105"
                    >
                      <Image
                        src={client.logo}
                        alt=""
                        width={client.width}
                        height={client.height}
                        className={`object-contain max-h-12 ${client.className}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 06 - WHO SIGNS IT (Framed Monograph Climax)
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
              <h2 className="font-display font-light text-[2.5rem] sm:text-[3rem] lg:text-[3.75rem] leading-[1.04] tracking-[-0.035em] text-ink">
                <Reveal as="span" stagger={0.08} duration={1}>
                  <span className="block text-ink">WHO</span>
                  <span className="block italic text-[#e6e2da]">SIGNS IT.</span>
                </Reveal>
              </h2>

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
              <Reveal stagger={0.08} className="font-sans text-[11px] font-medium tracking-[0.25em] text-ink uppercase space-y-1 leading-relaxed">
                <div>A</div>
                <div>BETTER</div>
                <div>TOMORROW</div>
              </Reveal>
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
