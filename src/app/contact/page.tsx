import type { Metadata } from "next";
import Link from "next/link";

import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { ScrollOffset } from "@/components/motion/scroll-offset";
import { ReferenceForm } from "@/components/contact/reference-form";
import { ReferenceMap } from "@/components/contact/reference-map";
import { ROUTES, SECTIONS } from "@/lib/content";

/* ==========================================================================
   METADATA
   ========================================================================== */

const ROUTE = ROUTES.contact;

export const metadata: Metadata = {
  title: "Contact & Leasing Enquiries | JDKD",
  description:
    "Whether you're looking to lease, schedule an inspection, or simply learn more about JDKD Corporate Tower, our team is here to help.",
  alternates: { canonical: ROUTE.path },
  openGraph: {
    type: "website",
    url: ROUTE.path,
    title: "Contact - JDKD Corporate Tower",
    description:
      "Start a conversation with the JDKD leasing desk at A-11 Mathura Road, New Delhi.",
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

/* ==========================================================================
   SHARED LAYOUT TOKENS
   ========================================================================== */

const SECTION = "relative overflow-x-clip pt-beat lg:pt-beat-lg";
const FRAME = "relative mx-auto w-full max-w-shell";
const EDGE = "px-gutter md:px-gutter-lg";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-canvas text-ink selection:bg-ink selection:text-canvas">
      {/* =====================================================================
          01 - HERO ("LET'S CONNECT - Start a conversation.")
          ===================================================================== */}
      <section
        id="hero"
        aria-labelledby="contact-hero-heading"
        className="relative overflow-x-clip pt-28 md:pt-36 lg:pt-40"
      >
        <div className={FRAME}>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* ── LEFT COLUMN: Text & Actions ─────────────────────────── */}
            <div className={`${EDGE} lg:col-span-6 flex flex-col justify-between lg:min-h-[640px]`}>
              <ScrollOffset offset={40}>
                <Reveal as="p" className="text-micro uppercase tracking-label text-muted">
                  LET&apos;S CONNECT
                </Reveal>

                <h1
                  id="contact-hero-heading"
                  className="mt-6 font-display text-headline-fluid uppercase text-ink md:text-h1 lg:text-[4.5rem] lg:leading-[0.94] tracking-tight"
                >
                  <Reveal as="span" stagger={0.08} duration={1}>
                    <span className="block not-italic">Start a</span>
                    <span className="block italic text-pure">conversation.</span>
                  </Reveal>
                </h1>

                <Reveal
                  as="p"
                  delay={0.18}
                  className="mt-8 max-w-[34ch] text-body-lg text-muted leading-relaxed"
                >
                  Whether you&apos;re looking to lease, schedule an inspection,
                  or simply learn more about JDKD Corporate Tower, our team is
                  here to help.
                </Reveal>

                {/* Circular Button: GET IN TOUCH */}
                <div className="mt-10">
                  <a
                    href={`#${SECTIONS.enquire.id}`}
                    data-press
                    className="group inline-flex items-center gap-4 text-left"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full border border-line text-ink transition-[border-color,background-color,color] duration-300 ease-editorial group-hover:border-pure group-hover:bg-ink group-hover:text-canvas">
                      <span className="text-body font-light transition-transform duration-300 ease-editorial group-hover:translate-x-0.5">
                        &rarr;
                      </span>
                    </span>
                    <span className="font-display text-small uppercase tracking-label text-ink transition-colors duration-200 group-hover:text-pure">
                      GET IN TOUCH
                    </span>
                  </a>
                </div>
              </ScrollOffset>

              {/* Index Indicator at bottom left: 01 ───── 03 */}
              <div className="mt-16 flex items-center gap-4 text-micro font-sans tabular-nums text-muted lg:mt-0">
                <span>01</span>
                <span className="block h-px w-20 bg-line-strong" />
                <span>03</span>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Architectural Tower Plate ──────────────── */}
            <div className="relative lg:col-span-6 px-gutter md:px-gutter-lg lg:px-0">
              <div className="relative">
                <ImageCard
                  src="/images/contact/hero-facade.jpg"
                  alt="JDKD Corporate Tower illuminated facade at dusk"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  surface="ink"
                  shift={5}
                  scale={1.06}
                  delay={0.08}
                  duration={1.1}
                  className="aspect-[2/3] w-full max-w-[540px] lg:ml-auto"
                />

                {/* Overlays follow the wipe (0.08s + 1.1s) rather than racing it. */}
                {/* Overlay Top Right */}
                <Reveal
                  stagger={0.07}
                  delay={0.7}
                  className="pointer-events-none absolute right-6 top-8 text-right text-micro uppercase tracking-label text-ink/90 md:right-10 md:top-10"
                >
                  <span className="block text-muted">&mdash;</span>
                  <span className="mt-2 block">PEOPLE</span>
                  <span className="block">PLACES</span>
                  <span className="block">POSSIBILITIES</span>
                </Reveal>

                {/* Overlay Bottom Right */}
                <Reveal
                  stagger={0.07}
                  delay={0.9}
                  className="pointer-events-none absolute bottom-6 right-6 text-right text-micro uppercase tracking-label text-ink/90 md:bottom-10 md:right-10"
                >
                  <span className="block font-semibold">JDKD CORPORATE TOWER</span>
                  <span className="mt-1 block text-muted">
                    Mathura Road, New Delhi
                  </span>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          02 - ENQUIRY ("ENQUIRE NOW - We're here to help.")
          ===================================================================== */}
      <section
        id={SECTIONS.enquire.id}
        aria-labelledby="enquiry-section-heading"
        className={SECTION}
      >
        <div className={FRAME}>
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
            {/* ── LEFT COLUMN: Textured Concrete Portrait ──────────────── */}
            <div className="relative lg:col-span-5 px-gutter md:px-gutter-lg lg:px-0">
              <div className="relative h-full min-h-[480px]">
                <ImageCard
                  src="/images/contact/concrete-wall.jpg"
                  alt="Curved textured concrete wall with olive tree in sunlight"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  surface="ink"
                  shift={5}
                  scale={1.06}
                  delay={0.08}
                  duration={1.1}
                  className="aspect-[3/4] h-full w-full object-cover lg:aspect-auto"
                />

                {/* Motto Overlay on Concrete: "SPACES FOR A BRIGHTER TOMORROW" */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-8 text-ink/85 md:px-12">
                  <span className="text-micro text-muted">&mdash;</span>
                  <Reveal
                    stagger={0.08}
                    delay={0.6}
                    duration={1}
                    className="mt-4 font-display text-h3 uppercase leading-tight tracking-wider text-ink/90 md:text-h2"
                  >
                    <span className="block">SPACES</span>
                    <span className="block">FOR A</span>
                    <span className="block">BRIGHTER</span>
                    <span className="block">TOMORROW</span>
                  </Reveal>
                  <span className="mt-4 text-micro text-muted">&mdash;</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Enquiry Suite & Direct Reach ───────────── */}
            <div className={`${EDGE} lg:col-span-7 flex flex-col justify-between`}>
              <ScrollOffset offset={25}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-line/50 pb-8">
                  <div>
                    <Reveal as="p" className="text-micro uppercase tracking-label text-muted">
                      ENQUIRE NOW
                    </Reveal>
                    <h2
                      id="enquiry-section-heading"
                      className="mt-4 font-display text-headline uppercase text-ink md:text-h1 lg:text-[3.75rem] leading-[0.98]"
                    >
                      <Reveal as="span" stagger={0.08} duration={1}>
                        <span className="block not-italic">We&apos;re here</span>
                        <span className="block italic text-pure">to help.</span>
                      </Reveal>
                    </h2>
                  </div>

                  <Reveal
                    as="p"
                    delay={0.1}
                    className="max-w-[28ch] text-small text-muted"
                  >
                    Share a few details and our team will get back to you shortly.
                  </Reveal>
                </div>

                {/* The Reference Underline-Only Form */}
                <div className="mt-8">
                  <ReferenceForm />
                </div>
              </ScrollOffset>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          03 - LOCATION ("OUR LOCATION - In the heart of opportunity.")
          ===================================================================== */}
      <section
        id="location"
        aria-labelledby="location-heading"
        className={SECTION}
      >
        <ReferenceMap />
      </section>

      {/* =====================================================================
          04 - PRE-FOOTER ("DISCOVER JDKD - More than buildings, a better tomorrow.")
          ===================================================================== */}
      <section
        id="discover"
        aria-labelledby="discover-heading"
        className="relative overflow-x-clip pt-beat pb-beat lg:pt-beat-lg lg:pb-beat-lg"
      >
        <div className={FRAME}>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* ── LEFT COLUMN: Atrium Curve Plate ──────────────────────── */}
            <div className="relative lg:col-span-5 px-gutter md:px-gutter-lg lg:px-0">
              <ImageCard
                src="/images/contact/atrium-curve.jpg"
                alt="Sweeping curved concrete atrium with warm LED cove illumination"
                sizes="(min-width: 1024px) 40vw, 100vw"
                surface="ink"
                shift={4}
                scale={1.05}
                delay={0.08}
                duration={1.1}
                className="aspect-[4/3] w-full"
              />
            </div>

            {/* ── RIGHT COLUMN: Discover Heading & Nav Links ───────────── */}
            <div className={`${EDGE} lg:col-span-7`}>
              <ScrollOffset offset={35}>
                <Reveal as="p" className="text-micro uppercase tracking-label text-muted">
                  DISCOVER JDKD
                </Reveal>

                <h2
                  id="discover-heading"
                  className="mt-6 font-display text-headline uppercase text-ink md:text-h1 lg:text-[3.75rem] leading-[0.98]"
                >
                  <Reveal as="span" stagger={0.08} duration={1}>
                    <span className="block not-italic">More than</span>
                    <span className="block not-italic">buildings,</span>
                    <span className="block italic text-pure">
                      a better tomorrow.
                    </span>
                  </Reveal>
                </h2>

                {/* Navigation Links with 1px hairlines */}
                <div className="mt-12 divide-y divide-line/60 border-y border-line/60">
                  <Link
                    href="/projects"
                    data-press="row"
                    className="group flex items-center justify-between py-6 text-label uppercase tracking-label text-ink transition-colors hover:text-pure"
                  >
                    <span>PROJECTS</span>
                    <span className="text-body font-light transition-transform duration-300 ease-editorial group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>

                  <Link
                    href="/about"
                    data-press="row"
                    className="group flex items-center justify-between py-6 text-label uppercase tracking-label text-ink transition-colors hover:text-pure"
                  >
                    <span>ABOUT</span>
                    <span className="text-body font-light transition-transform duration-300 ease-editorial group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>

                  <Link
                    href="/projects/jdkd-corporate-tower"
                    data-press="row"
                    className="group flex items-center justify-between py-6 text-label uppercase tracking-label text-ink transition-colors hover:text-pure"
                  >
                    <span>APPROACH</span>
                    <span className="text-body font-light transition-transform duration-300 ease-editorial group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </ScrollOffset>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
