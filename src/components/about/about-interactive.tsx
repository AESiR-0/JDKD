"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Counter } from "@/components/motion/counter";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Section 01: CTA Button "( → ) OUR STORY" with smooth scroll
 */
export function OurStoryButton() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("belief");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      href="#belief"
      onClick={handleClick}
      className="group inline-flex items-center gap-4 text-micro uppercase tracking-micro text-ink transition-colors hover:text-pure focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-ink group-hover:scale-105 group-hover:bg-line/20">
        <svg
          className="h-3.5 w-3.5 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-pure"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
      <span className="font-sans text-xs tracking-widest text-muted transition-colors group-hover:text-ink">
        OUR STORY
      </span>
    </a>
  );
}

/**
 * Section 01: Sweeping Elliptical Wireframe Arc
 */
export function MastheadArc() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 1000 700"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 580 -40 C 460 200, 480 500, 720 640 C 820 680, 940 660, 1040 620"
        stroke="rgba(242, 239, 234, 0.22)"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Section 02: Pinned Architectural Blueprint Drawing Stage
 *
 * Pins on desktop while user scroll scrub-draws the SVG arcs, crosshairs,
 * and activates the 4 principles with an architectural photographic study.
 */
export function BeliefPinnedDrawing() {
  const stageRef = useRef<HTMLDivElement>(null);
  const arc1Ref = useRef<SVGPathElement>(null);
  const arc2Ref = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const arc1 = arc1Ref.current;
        const arc2 = arc2Ref.current;
        const dot = dotRef.current;
        const ring = ringRef.current;
        const imgCard = imageCardRef.current;
        const principleItems = principlesRef.current?.children;

        if (!arc1 || !arc2) return;

        gsap.set([arc1, arc2], { strokeDasharray: 1800, strokeDashoffset: 1800 });
        if (dot) gsap.set(dot, { scale: 0, transformOrigin: "center" });
        if (ring) gsap.set(ring, { scale: 0, opacity: 0, transformOrigin: "center" });
        if (imgCard) gsap.set(imgCard, { opacity: 0.3, scale: 0.96 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=1200",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressTextRef.current) {
                const pct = Math.round(self.progress * 100);
                progressTextRef.current.textContent = `${pct}%`;
              }
            },
          },
        });

        // Step 1: Arc 1 & 2 draw across canvas
        tl.to(arc1, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }, 0);
        tl.to(arc2, { strokeDashoffset: 0, duration: 1.8, ease: "power2.out" }, 0.2);

        // Step 2: Coordinate node pulses and image clarifies
        if (dot) tl.to(dot, { scale: 1, duration: 0.6, ease: "back.out(2)" }, 0.8);
        if (ring) {
          tl.to(ring, { scale: 1.8, opacity: 0.7, duration: 0.8, ease: "power1.out" }, 1.0);
          tl.to(ring, { scale: 2.8, opacity: 0, duration: 0.6, ease: "power1.in" }, 1.6);
        }
        if (imgCard) {
          tl.to(imgCard, { opacity: 0.9, scale: 1, duration: 1.2, ease: "power2.out" }, 0.8);
        }

        // Step 3: Progressive reveal of 4 principles
        if (principleItems) {
          Array.from(principleItems).forEach((item, idx) => {
            tl.to(
              item,
              {
                x: -12,
                borderColor: "rgba(242, 239, 234, 0.4)",
                color: "#ffffff",
                duration: 0.5,
                ease: "power2.out",
              },
              1.2 + idx * 0.4
            );
          });
        }
      });

      return () => mm.revert();
    },
    { scope: stageRef }
  );

  return (
    <div
      ref={stageRef}
      className="relative flex flex-col justify-between min-h-screen w-full px-gutter md:px-gutter-lg py-16 lg:py-24"
    >
      {/* Background Architectural Blueprint SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 1000 650"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={arc1Ref}
          d="M-80 560 C180 100 530 80 1080 300"
          fill="none"
          stroke="#66726b"
          strokeWidth="1"
        />
        <path
          ref={arc2Ref}
          d="M620 -80 C650 180 920 270 1100 650"
          fill="none"
          stroke="#66726b"
          strokeWidth="1"
        />
        <line
          x1="90"
          y1="120"
          x2="90"
          y2="580"
          stroke="#7d857f"
          strokeWidth="1"
          strokeOpacity="0.45"
        />
        <line
          x1="90"
          y1="120"
          x2="500"
          y2="120"
          stroke="#7d857f"
          strokeWidth="1"
          strokeOpacity="0.45"
        />
        <circle ref={dotRef} cx="90" cy="120" r="4" fill="#c61d24" />
        <circle
          ref={ringRef}
          cx="90"
          cy="120"
          r="10"
          fill="none"
          stroke="#c61d24"
          strokeWidth="1"
        />
      </svg>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-line/40 pb-4">
        <div className="flex items-center gap-3 text-micro uppercase tracking-[0.2em] text-muted">
          <span className="w-6 h-px bg-red block" aria-hidden="true" />
          <span>02 / OUR BELIEF</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] text-muted/70 uppercase tracking-widest">
          <span>BLUEPRINT // DRAWING ACTIVE</span>
          <span className="text-ink font-semibold" ref={progressTextRef}>
            0%
          </span>
        </div>
      </div>

      {/* Center Layout: Typography (Left) + Integrated Architectural Image & Principles (Right) */}
      <div className="relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-10">
        <div className="lg:col-span-6">
          <h2 className="font-display font-light text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.05] tracking-[-0.03em] text-ink max-w-[560px]">
            <span className="block text-ink">An office</span>
            <span className="block italic text-[#e6e2da]">should do</span>
            <span className="block text-ink">more than</span>
            <span className="block text-ink">hold a team.</span>
          </h2>
          <p className="mt-8 max-w-[420px] text-small text-muted leading-relaxed">
            It should inspire, enable and create the conditions for great work.
            We design spaces that go beyond function - spaces that foster
            collaboration, focus and long-term value.
          </p>
        </div>

        {/* Right: Architectural Photo Plate & Principles */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row gap-8 items-center lg:justify-end">
          {/* Architectural Interior Study Plate */}
          <div
            ref={imageCardRef}
            className="relative w-48 h-64 sm:w-56 sm:h-72 overflow-hidden border border-line/40 bg-surface shadow-2xl shrink-0"
          >
            <Image
              src="/images/about/workspace-open.jpg"
              alt="JDKD open collaborative workspace with generous daylight, timber baffles, and integrated greenery"
              fill
              sizes="(max-width: 640px) 192px, 224px"
              className="object-cover contrast-[1.05]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-3 left-3 text-[9px] font-mono uppercase tracking-widest text-ink/80">
              FIG 02.1 // INTERIOR ATRIUM
            </div>
          </div>

          {/* The 4 Principles List */}
          <div ref={principlesRef} className="w-full max-w-xs space-y-0">
            {[
              { id: "01", label: "People first" },
              { id: "02", label: "Thoughtful design" },
              { id: "03", label: "Lasting quality" },
              { id: "04", label: "A better tomorrow" },
            ].map((item) => (
              <div
                key={item.id}
                className="group flex cursor-default items-center justify-between border-t border-line py-3.5 text-micro uppercase tracking-micro text-muted transition-all duration-300 hover:border-line-strong hover:pl-3 hover:text-ink"
              >
                <span className="font-sans text-[11px] text-muted/60 transition-colors group-hover:text-red">
                  {item.id}
                </span>
                <span className="font-sans text-[11px] tracking-widest text-[#c4c7c0] transition-colors group-hover:text-pure font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-line/30 text-[9px] uppercase tracking-[0.2em] text-muted/60 font-sans">
        <div>CONTINUE / THE DRAWING DEVELOPS</div>
        <div>JDKD PRACTICE ARCHIVE // REF 02</div>
      </div>
    </div>
  );
}

/**
 * Section 03: Pinned Satellite Cartography & Spatial Location Explorer
 *
 * Integrates the high-fidelity satellite photography from the Contact page
 * (/images/contact/location-map.jpg) with a pinned scrubbed aerial zoom,
 * glowing beacon, arterial highway vectors, and live commute metrics.
 */
export function LocationPinnedMap() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const radarSweepRef = useRef<SVGCircleElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const mapContainer = mapContainerRef.current;
      if (!stage || !mapContainer) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const radar = radarSweepRef.current;
        const route = routePathRef.current;
        const metrics = metricsRef.current;

        if (route) {
          const length = route.getTotalLength ? route.getTotalLength() : 800;
          gsap.set(route, { strokeDasharray: length, strokeDashoffset: length });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=1400",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Phase 1: Satellite aerial zoom
        tl.to(
          mapContainer,
          {
            scale: 1.06,
            duration: 2.0,
            ease: "power1.inOut",
          },
          0
        );

        // Phase 2: Radar expansion
        if (radar) {
          tl.fromTo(
            radar,
            { scale: 0.8, opacity: 0.9, transformOrigin: "center" },
            { scale: 3.2, opacity: 0, duration: 1.4, ease: "power1.out" },
            0.4
          );
        }

        // Phase 3: Route vector draw
        if (route) {
          tl.to(route, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }, 0.6);
        }

        // Phase 4: Metrics cards slide up & illuminate
        if (metrics) {
          tl.fromTo(
            metrics,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            1.0
          );
        }
      });

      return () => mm.revert();
    },
    { scope: stageRef }
  );

  return (
    <div
      ref={stageRef}
      className="relative flex flex-col justify-between min-h-screen w-full overflow-hidden bg-deep"
    >
      {/* ── MAP ARTWORK GROUND (Matching Contact Page) ── */}
      <div
        ref={mapContainerRef}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      >
        <Image
          src="/images/contact/location-map.jpg"
          alt="Satellite map of Mathura Road corridor and JDKD Corporate Tower"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center opacity-65 grayscale-[15%] contrast-[1.1]"
        />

        {/* Gradient Scrims for Legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/80 to-transparent lg:via-canvas/60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-canvas via-canvas/90 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-canvas to-transparent"
        />

        {/* Vector Transit Overlay SVG */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            ref={routePathRef}
            d="M 920 380 Q 800 480, 680 540 T 480 620"
            stroke="#C9AD7F"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <circle
            ref={radarSweepRef}
            cx="920"
            cy="380"
            r="30"
            stroke="#C9AD7F"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        {/* Cartographic Labels (Contact Page Style) */}
        <div
          aria-hidden="true"
          className="absolute left-[54%] top-[48%] -rotate-45 select-none font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-muted/60"
        >
          MATHURA ROAD HIGHWAY
        </div>

        <div
          aria-hidden="true"
          className="absolute left-[46%] top-[22%] flex flex-col items-center gap-1 select-none text-[10px] uppercase tracking-widest text-muted/90"
        >
          <span className="flex size-4 items-center justify-center rounded-full border border-muted/50 text-[9px] bg-canvas/80">
            ◎
          </span>
          <span className="font-sans font-medium">NIZAMUDDIN</span>
        </div>

        <div
          aria-hidden="true"
          className="absolute right-[12%] top-[62%] flex items-center gap-2.5 select-none text-[10px] uppercase tracking-widest text-muted/90"
        >
          <span className="flex size-4 items-center justify-center rounded-full border border-muted/60 text-[9px] bg-canvas/80 font-bold text-amber-200">
            Ⓜ
          </span>
          <span className="text-left font-sans font-medium">
            SARAI KALE KHAN
            <br />
            METRO STATION
          </span>
        </div>

        {/* JDKD Corporate Tower Pinpoint */}
        <div className="absolute left-[62%] top-[38%] flex items-center gap-3.5 z-20">
          <span className="relative flex size-5 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#c61d24] opacity-80" />
            <span className="relative inline-flex size-3.5 rounded-full bg-[#c61d24] shadow-[0_0_18px_#c61d24]" />
          </span>

          <div className="rounded-xs border border-line/60 bg-surface/90 px-4 py-2.5 backdrop-blur-md shadow-2xl">
            <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-pure">
              JDKD CORPORATE TOWER
            </span>
            <span className="block text-[10px] text-muted font-sans mt-0.5">
              A-11, Mathura Road, New Delhi, 110076
            </span>
          </div>
        </div>

        {/* Giant Watermark LOCATION */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-6 bottom-16 font-display text-[110px] lg:text-[180px] tracking-tight text-white/[0.03] select-none -rotate-90 origin-bottom-right"
        >
          LOCATION
        </div>
      </div>

      {/* ── FOREGROUND CONTENT OVERLAY ── */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-shell flex-col justify-between px-gutter md:px-gutter-lg py-16 lg:py-24">
        <div className="flex items-center justify-between border-b border-line/40 pb-4">
          <div className="flex items-center gap-3 text-micro uppercase tracking-[0.2em] text-muted">
            <span className="w-6 h-px bg-red block" aria-hidden="true" />
            <span>03 / A PRIME LOCATION</span>
          </div>
          <div className="hidden lg:block font-mono text-[10px] text-muted/70 tracking-widest">
            MATHURA ROAD / NEW DELHI / 28.6139° N / 77.2090° E
          </div>
        </div>

        <div className="my-auto max-w-[560px] py-10">
          <h2 className="font-display font-light text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.05] tracking-[-0.03em] text-ink">
            <span className="block text-ink">Where the city</span>
            <span className="block italic text-[#e6e2da]">moves,</span>
            <span className="block text-ink">business</span>
            <span className="block text-ink">follows.</span>
          </h2>
          <p className="mt-8 max-w-[440px] text-small text-muted leading-relaxed">
            Strategically situated at Mathura Road, with seamless metro access
            and close to key commercial hubs, JDKD Corporate Tower offers the
            connectivity and convenience that modern businesses need.
          </p>
        </div>

        <div
          ref={metricsRef}
          className="border-t border-line/40 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12"
        >
          <div className="border-l border-line pl-4">
            <div className="flex items-baseline gap-1">
              <Counter
                value="2"
                unit="min"
                className="font-display text-3xl sm:text-4xl text-ink font-light"
                unitClassName="font-sans text-xs uppercase tracking-widest text-muted ml-1"
              />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-muted mt-1">
              Sarai Kale Khan Metro
            </p>
          </div>

          <div className="border-l border-line pl-4">
            <div className="flex items-baseline gap-1">
              <Counter
                value="10"
                unit="min"
                className="font-display text-3xl sm:text-4xl text-ink font-light"
                unitClassName="font-sans text-xs uppercase tracking-widest text-muted ml-1"
              />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-muted mt-1">
              Nizamuddin Station
            </p>
          </div>

          <div className="border-l border-line pl-4">
            <div className="flex items-baseline gap-1">
              <Counter
                value="25"
                unit="min"
                className="font-display text-3xl sm:text-4xl text-ink font-light"
                unitClassName="font-sans text-xs uppercase tracking-widest text-muted ml-1"
              />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-muted mt-1">
              Connaught Place Hub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Section 04: Pinned Scroll Stacked Cards (Replacing Horizontal Scroll)
 *
 * Implements a true Awwwards-level card deck stacking sequence.
 * 5 architectural cards (each with high-res photography, technical telemetry,
 * and editorial narrative) stack on top of each other as the user scrolls.
 */
export function ApproachStackedCards() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const activeDotRef = useRef<HTMLDivElement>(null);
  const activeLabelRef = useRef<HTMLSpanElement>(null);

  const CARDS = [
    {
      id: "01",
      number: "01",
      title: "Design with purpose",
      subtitle: "Integrated Architecture & Natural Daylighting",
      body: "Optimized floor plates with 3.9m clear slab heights and continuous floor-to-ceiling glass maximizing natural daylight penetration, visual acoustics, and occupant wellness.",
      image: "/images/buildings/park-01.jpg",
      telemetry: "ELEVATION +14.20m // DAYLIGHT FACTOR 2.4%",
    },
    {
      id: "02",
      number: "02",
      title: "Build to last",
      subtitle: "Structural Seismic Engineering & LEED Standards",
      body: "Constructed with Zone IV seismic integrity, post-tensioned flat slabs, and high-performance low-E double-glazed thermal envelopes designed for generational durability.",
      image: "/images/facade-detail.jpg",
      telemetry: "STRUCTURAL ZONE IV // LEED CERTIFIED",
    },
    {
      id: "03",
      number: "03",
      title: "Create value",
      subtitle: "Operational Efficiency & Smart BMS Systems",
      body: "Centralized energy-efficient VRV HVAC systems, rainwater harvesting, 100% DG power backup, and destination-controlled high-speed elevators reducing long-term overhead.",
      image: "/images/about/boardroom-value.jpg",
      telemetry: "ENERGY EFFICIENCY -34% // VRV 4-PIPE",
    },
    {
      id: "04",
      number: "04",
      title: "Strengthen communities",
      subtitle: "Urban Fabric & Multimodal Transit Access",
      body: "Seamless pedestrian access off Mathura Road, dedicated multimodal transit drop-offs, curated ground-floor retail, and multi-tier security access infrastructure.",
      image: "/images/contact/atrium-curve.jpg",
      telemetry: "PEDESTRIAN CORRIDOR // METRO ACCESS",
    },
    {
      id: "05",
      number: "05",
      title: "A better tomorrow",
      subtitle: "The Future of Workspace & Sky Pavilion",
      body: "A landscaped rooftop terrace pavilion, electric vehicle charging bays, and flexible column-free floor plans tailored for high-growth modern enterprises.",
      image: "/images/about/sky-terrace-clear.jpg",
      telemetry: "SKY RETREAT // ZERO CARBON TARGET",
    },
  ];

  useGSAP(
    () => {
      const stage = stageRef.current;
      const cardsContainer = cardsContainerRef.current;
      if (!stage || !cardsContainer) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const cardEls = gsap.utils.toArray<HTMLElement>(".stacked-card");
        if (cardEls.length === 0) return;

        // Position all cards 1..n off-screen downwards
        cardEls.forEach((card, i) => {
          if (i > 0) {
            gsap.set(card, { yPercent: 105, scale: 1 });
          }
        });

        const totalSteps = cardEls.length - 1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${totalSteps * 900}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const activeIdx = Math.min(
                CARDS.length - 1,
                Math.floor(self.progress * CARDS.length)
              );
              if (activeDotRef.current) {
                activeDotRef.current.style.transform = `translateY(${activeIdx * 28}px)`;
              }
              if (activeLabelRef.current) {
                activeLabelRef.current.textContent = `0${activeIdx + 1} / 05`;
              }
            },
          },
        });

        // Sequence: Each incoming card slides up over the previous one smoothly.
        // Clean physical stacking: NO dark fade, NO filter brightness.
        // Previous card subtly settles (scale: 0.96), incoming card glides up to yPercent: 0.
        for (let i = 1; i < cardEls.length; i++) {
          const prevCard = cardEls[i - 1];
          const currCard = cardEls[i];

          // Subtly scale previous card down to 0.96 for soft physical depth without dimming
          tl.to(
            prevCard,
            {
              scale: 0.96,
              duration: 1.2,
              ease: "power1.out",
            },
            (i - 1) * 1.2
          );

          // If there are cards behind previous card, gently maintain their layered scale
          for (let j = 0; j < i - 1; j++) {
            tl.to(
              cardEls[j],
              {
                scale: Math.max(0.92, 0.96 - (i - 1 - j) * 0.02),
                duration: 1.2,
                ease: "power1.out",
              },
              (i - 1) * 1.2
            );
          }

          // Slide current card up into place smoothly
          tl.to(
            currCard,
            {
              yPercent: 0,
              scale: 1,
              duration: 1.2,
              ease: "power1.out",
            },
            (i - 1) * 1.2
          );
        }
      });

      return () => mm.revert();
    },
    { scope: stageRef }
  );

  return (
    <div
      ref={stageRef}
      className="relative flex flex-col justify-between min-h-screen w-full overflow-hidden bg-canvas px-gutter md:px-gutter-lg py-12 lg:py-16"
    >
      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-line/40 pb-4">
        <div className="flex items-center gap-3 text-micro uppercase tracking-[0.2em] text-muted">
          <span className="w-6 h-px bg-red block" aria-hidden="true" />
          <span>04 / OUR APPROACH</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-muted/70 tracking-widest">
          <span className="hidden sm:inline">STACKED ARCHITECTURAL MANIFESTO //</span>
          <span ref={activeLabelRef} className="text-pure font-bold">
            01 / 05
          </span>
        </div>
      </div>

      {/* Main Stage: Deck Stacking Container + Sticky Step Rail */}
      <div className="relative z-10 my-auto flex items-center justify-center py-6">
        <div className="relative w-full max-w-5xl flex gap-8 items-center">
          {/* Side Indicator Rail (Desktop) */}
          <div className="hidden lg:flex flex-col items-center gap-4 text-micro font-mono text-muted/60 shrink-0">
            <span className="text-[10px] text-muted/40 uppercase -rotate-90 origin-center tracking-widest mb-4">
              PHASE
            </span>
            <div className="relative flex flex-col items-center space-y-4">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-line/30" />
              <div
                ref={activeDotRef}
                className="absolute left-1/2 -translate-x-1/2 top-0 size-2 rounded-full bg-red transition-transform duration-300 shadow-[0_0_8px_#c61d24]"
              />
              {CARDS.map((c) => (
                <span
                  key={c.id}
                  className="size-3 flex items-center justify-center text-[9px] relative z-10"
                >
                  {c.number}
                </span>
              ))}
            </div>
          </div>

          {/* Stacking Card Deck */}
          <div
            ref={cardsContainerRef}
            className="relative w-full h-[540px] sm:h-[500px] lg:h-[520px]"
          >
            {CARDS.map((card, idx) => (
              <div
                key={card.id}
                className="stacked-card absolute inset-0 rounded-xs border border-line/60 bg-[#141513] p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col justify-between"
                style={{ zIndex: idx + 1 }}
              >
                {/* Card Top: Number & Telemetry */}
                <div className="flex items-center justify-between border-b border-line/30 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-red">
                      {card.number}
                    </span>
                    <span className="h-px w-4 bg-line-strong block" />
                    <span className="text-[10px] font-sans uppercase tracking-widest text-muted">
                      DISCIPLINE
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted/70">
                    {card.telemetry}
                  </span>
                </div>

                {/* Card Body: Split Content & Architecture Photo */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center my-auto">
                  {/* Copy Column */}
                  <div className="md:col-span-6 lg:col-span-7 space-y-4">
                    <h3 className="font-display font-light text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.04] tracking-tight text-pure">
                      {card.title}
                    </h3>
                    <p className="font-sans text-xs uppercase tracking-wider text-[#e6e2da] font-medium">
                      {card.subtitle}
                    </p>
                    <p className="text-small text-muted leading-relaxed max-w-lg">
                      {card.body}
                    </p>
                  </div>

                  {/* High-Resolution Architectural Photography Column */}
                  <div className="md:col-span-6 lg:col-span-5 relative h-52 sm:h-64 lg:h-72 w-full overflow-hidden border border-line/40 bg-surface">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-center grayscale-[15%] contrast-[1.08] hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-2.5 right-3 font-mono text-[8px] uppercase tracking-widest text-pure/75">
                      PLATE 0{idx + 1}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-line/20 pt-3 text-[9px] font-sans uppercase tracking-[0.2em] text-muted/60">
                  <div>JDKD CORPORATE TOWER // MONOGRAPH ARCHIVE</div>
                  <div>SCROLL TO ADVANCE</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-line/30 text-[9px] uppercase tracking-[0.2em] text-muted/60 font-sans">
        <div>THE SYSTEM BECOMES THE STRUCTURE</div>
        <div>STACKED CARD ARCHITECTURE // 05 PHASES</div>
      </div>
    </div>
  );
}

/**
 * Section 06: Geometric Intersecting Wireframe Arcs
 */
export function WhoSignsItArcs() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 0 320 C 180 100, 520 80, 740 600"
        fill="none"
        stroke="#56605a"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
      <path
        d="M 740 0 C 750 240, 700 440, 600 600"
        fill="none"
        stroke="#7d857f"
        strokeWidth="1"
        strokeOpacity="0.55"
      />
    </svg>
  );
}
