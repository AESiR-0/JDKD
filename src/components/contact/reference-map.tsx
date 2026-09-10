"use client";

import { Counter } from "@/components/motion/counter";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";

export function ReferenceMap() {
  return (
    <div className="relative w-full overflow-hidden bg-deep">
      {/* ── MAP ARTWORK GROUND ───────────────────────────────────────── */}
      <ParallaxImage
        src="/images/contact/location-map.jpg"
        alt="Satellite map of Mathura Road corridor"
        sizes="100vw"
        shift={3}
        scale={1.03}
        surface="ink"
        imageClassName="opacity-70"
        className="h-[680px] w-full md:h-[760px] lg:h-[820px]"
      >
        {/* Gradient Scrims: Left weighted for type legibility, bottom for metrics */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-deep via-deep/80 to-transparent lg:via-deep/60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-deep to-transparent"
        />

        {/* ── CARTOGRAPHIC LABELS OVERLAY ─────────────────────────────── */}
        {/* Mathura Road Angled Highway Label */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[56%] top-[55%] -rotate-45 select-none font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-muted/60 lg:left-[60%] lg:top-[52%]"
        >
          MATHURA ROAD
        </div>

        {/* Nizamuddin Station Node */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[48%] top-[14%] flex flex-col items-center gap-1 select-none text-[10px] uppercase tracking-label text-muted/80 lg:left-[54%] lg:top-[12%]"
        >
          <span className="flex size-3.5 items-center justify-center rounded-full border border-muted/50 text-[8px]">
            ◎
          </span>
          <span>NIZAMUDDIN</span>
        </div>

        {/* Sarai Kale Khan Metro Station Node */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[12%] top-[65%] flex items-center gap-2 select-none text-[10px] uppercase tracking-label text-muted/80 lg:right-[16%] lg:top-[68%]"
        >
          <span className="flex size-4 items-center justify-center rounded-full border border-muted/60 text-[9px]">
            Ⓜ
          </span>
          <span className="text-right">
            SARAI KALE KHAN
            <br />
            METRO STATION
          </span>
        </div>

        {/* ── THE PINPOINT: JDKD CORPORATE TOWER ────────────────────────── */}
        <div className="absolute left-[62%] top-[40%] flex items-center gap-3.5 lg:left-[66%] lg:top-[38%]">
          <span className="relative flex size-4 items-center justify-center">
            {/* Glowing amber ping beacon */}
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#C9AD7F] opacity-75" />
            <span className="relative inline-flex size-3.5 rounded-full bg-[#C9AD7F] shadow-[0_0_16px_#C9AD7F]" />
          </span>

          <div className="rounded-xs border border-line/50 bg-deep/85 px-3.5 py-2 backdrop-blur-xs">
            <span className="block font-sans text-caption font-semibold uppercase tracking-label text-ink">
              JDKD CORPORATE TOWER
            </span>
            <span className="block text-[11px] text-muted">
              A-11, Mathura Road
              <br />
              New Delhi, 110076
            </span>
          </div>
        </div>

        {/* ── READING OVERLAY: LEFT EDGE ──────────────────────────────── */}
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between px-gutter py-12 md:px-gutter-lg md:py-16 lg:py-20">
          {/* Section Heading Block */}
          <div className="max-w-[44ch] pt-6">
            <Reveal as="p" className="text-micro uppercase tracking-label text-muted">
              OUR LOCATION
            </Reveal>

            <h2 className="mt-4 font-display text-headline uppercase text-ink md:text-h1 lg:text-[4rem] leading-[0.98]">
              <Reveal as="span" stagger={0.08} duration={1}>
                <span className="block not-italic">In the heart</span>
                <span className="block italic text-pure">of opportunity.</span>
              </Reveal>
            </h2>

            <Reveal
              as="p"
              delay={0.15}
              className="mt-6 max-w-[34ch] text-small text-muted leading-relaxed"
            >
              Strategically located on Mathura Road, with seamless metro access
              and close to key commercial hubs.
            </Reveal>

            {/* Directions Button */}
            <div className="mt-8">
              <a
                href="https://www.google.com/maps/search/?api=1&query=28.5284,77.2946"
                target="_blank"
                rel="noreferrer noopener"
                data-press
                className="group inline-flex items-center gap-4 text-left"
              >
                <span className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-[border-color,background-color,color] duration-300 ease-editorial group-hover:border-pure group-hover:bg-ink group-hover:text-canvas">
                  <span className="text-body font-light transition-transform duration-300 ease-editorial group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </span>
                <span className="font-display text-small uppercase tracking-label text-ink transition-colors duration-200 group-hover:text-pure">
                  Get directions
                </span>
              </a>
            </div>
          </div>

          {/* ── METRIC STRIP (MATCHING REFERENCE) ──────────────────────── */}
          <div className="mt-auto grid grid-cols-1 gap-6 border-t border-line/60 pt-6 sm:grid-cols-3 sm:gap-8 lg:max-w-[48rem]">
            {/* Metric 1 */}
            <div className="sm:border-r sm:border-line/60 sm:pr-8">
              <Counter
                value="2"
                unit="min"
                className="font-sans font-light tabular-nums text-h3 text-ink md:text-h2"
                unitClassName="text-small text-muted ml-1.5"
              />
              <p className="mt-2 text-micro uppercase tracking-label text-muted">
                Sarai Kale Khan Metro
              </p>
            </div>

            {/* Metric 2 */}
            <div className="sm:border-r sm:border-line/60 sm:pr-8">
              <Counter
                value="10"
                unit="min"
                className="font-sans font-light tabular-nums text-h3 text-ink md:text-h2"
                unitClassName="text-small text-muted ml-1.5"
              />
              <p className="mt-2 text-micro uppercase tracking-label text-muted">
                Nizamuddin
              </p>
            </div>

            {/* Metric 3 */}
            <div>
              <Counter
                value="25"
                unit="min"
                className="font-sans font-light tabular-nums text-h3 text-ink md:text-h2"
                unitClassName="text-small text-muted ml-1.5"
              />
              <p className="mt-2 text-micro uppercase tracking-label text-muted">
                Connaught Place
              </p>
            </div>
          </div>
        </div>
      </ParallaxImage>
    </div>
  );
}
