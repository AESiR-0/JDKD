import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import {
  BRAND,
  CONTACT,
  FOOTER_ID,
  FOOTER_LEGAL,
  NAV_ITEMS,
  UNRESOLVED,
} from "@/lib/content";

/**
 * SiteFooter — Compact, architectural, Awwwards-level monograph footer.
 *
 * Replaced the oversized sprawling bands with a refined, single-tier
 * architectural composition:
 * - Left: Refined CTA "Have a project? Let's talk." + direct contact info
 * - Center: Compact navigational directory with hairline accents
 * - Right: Practice location & leasing direct line
 * - Bottom: Elegant wordmark, RERA disclosure, and copyright in a single disciplined bar
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id={FOOTER_ID}
      className="relative w-full border-t border-line/40 bg-deep text-ink selection:bg-red selection:text-pure"
    >
      <div className="mx-auto w-full max-w-shell px-gutter md:px-gutter-lg pt-16 lg:pt-20 pb-12">
        {/* Main 12-column grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 pb-14 border-b border-line/30">
          {/* Col 1: CTA and Primary Action (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted block mb-3">
                LET&apos;S CONNECT
              </span>
              <h2 className="font-display font-light text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.05] tracking-tight text-pure">
                <span className="block not-italic">Have a project?</span>
                <span className="block italic text-[#e6e2da]">Let&apos;s talk.</span>
              </h2>
            </div>

            <div>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 text-micro uppercase tracking-widest text-pure transition-colors hover:text-white"
              >
                <span className="flex size-11 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:scale-105 group-hover:border-pure group-hover:bg-pure group-hover:text-deep">
                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </span>
                <span className="font-sans text-xs tracking-widest text-pure/90 transition-colors group-hover:text-pure">
                  GET IN TOUCH
                </span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-caption text-muted font-sans">
              <a
                href={CONTACT.leasingContact.phoneHref}
                className="transition-colors hover:text-pure"
              >
                +91 {CONTACT.leasingContact.phoneDisplay}
              </a>
              <span className="text-line" aria-hidden="true">
                /
              </span>
              <a
                href={CONTACT.leasingContact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-pure"
              >
                WhatsApp Enquiries
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Directory (3 cols) */}
          <div className="lg:col-span-3 lg:pl-6">
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted block mb-4">
              DIRECTORY
            </span>
            <ul className="space-y-3 font-sans text-small">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-pure/80 transition-colors hover:text-pure"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {item.label}
                    </span>
                    <span className="text-muted/40 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Location & Details (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted block mb-3">
                PROJECT LOCATION
              </span>
              <p className="font-sans text-small text-pure/75 leading-relaxed">
                JDKD Corporate Tower
                <br />
                A-11, Mohan Cooperative Industrial Estate
                <br />
                Mathura Road, New Delhi – 110076
              </p>
            </div>

            {/* Statutory RERA snippet */}
            <div className="border-t border-line/20 pt-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/70 block">
                {UNRESOLVED.rera.label}
              </span>
              <p className="font-mono text-[10px] text-muted/60 mt-1">
                {UNRESOLVED.rera.placeholder}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean, compact architectural signature */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-caption text-muted font-sans">
          <div className="flex items-center gap-4">
            <span className="font-display font-light text-2xl uppercase tracking-tighter text-pure">
              {BRAND.wordmark}
            </span>
            <span className="text-line" aria-hidden="true">
              |
            </span>
            <span className="text-[11px] uppercase tracking-micro text-muted/80">
              {FOOTER_LEGAL.entity}
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-muted/70">
            <span>
              &copy; {year} {FOOTER_LEGAL.copyrightHolder}. All rights reserved.
            </span>
            <a
              href="#main-content"
              className="text-pure/80 uppercase tracking-widest transition-colors hover:text-pure"
            >
              Back to top &uarr;
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
