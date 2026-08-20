import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { CONTACT, NOT_FOUND_PAGE } from "@/lib/content";

/**
 * The 404. Root `app/not-found.tsx`, so it answers BOTH cases: a `notFound()`
 * thrown inside a route segment, and any URL that matches no route at all.
 *
 * Conventions are copied from `app/about/page.tsx`, the worked reference.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO `metadata` EXPORT, AND THAT IS NOT AN OMISSION.
 *
 * `not-found.js` is the one route file in the App Router that does not read a
 * `metadata` export — the file convention documents that field for
 * `global-not-found.js` only, and that file is experimental and would have to
 * re-declare the fonts, the stylesheet and the whole document shell to exist.
 * So the root layout's default title stands here, and Next injects
 * `<meta name="robots" content="noindex">` on any response that carries a 404
 * status. `ROUTES.notFound` still holds the copy for the day the experimental
 * flag is worth taking; exporting an object this file cannot use would only
 * read as metadata that ships.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHAT A LOST VISITOR NEEDS: to know the address is wrong, to be told what this
 * site is, and to be handed a way onward. That is the whole page — the hero
 * says the first two, the nav and the phone number are the third. No search
 * box, no illustration, no joke.
 *
 * NO HERO PLATE. `PageHero` takes an optional full-bleed image; a 404 is the
 * last place to spend a 21:9 photograph and an LCP preload. Type only.
 *
 * NO BREADCRUMBS EITHER. A trail describes where you are in a hierarchy, and
 * this page is not in one — the requested address does not exist, so there is
 * nothing to be the parent of.
 *
 * THE BAND BELOW IS A `<div>`, NOT A `<section>`. Every `<section>` on this site
 * carries `aria-labelledby` pointing at its own heading, and this band has no
 * heading to point at: the copy in `NOT_FOUND_PAGE` deliberately supplies none,
 * and inventing one would be inventing content. The `<nav>` inside carries the
 * landmark and its own accessible name instead, which is the honest structure —
 * it IS navigation, not a section of prose.
 *
 * SERVER COMPONENT. `PageHero`'s `Reveal` and the links are all it contains,
 * and the links are deliberately outside every mask: a `Reveal` keeps
 * `overflow: hidden` after it finishes and would clip their focus rings.
 */

/* ==========================================================================
   SHARED TREATMENTS
   Written out whole — never build a Tailwind class by interpolation.
   ========================================================================== */

/** The band shell. Owns the rhythm, clips the horizontal axis. */
const SECTION = "relative overflow-x-clip py-section lg:py-section-lg";

/** The unpadded coordinate space every anchor is measured against. */
const FRAME = "relative mx-auto w-full max-w-shell";

/** The left-edge anchor, for any child that is in flow. */
const EDGE = "px-gutter md:px-gutter-lg";

/**
 * One recovery link. A hairline row the full measure of the reading column,
 * with the label in the display cut. `flex` rather than `block` so the row's
 * hit area is the row, and the focus ring wraps the whole of it.
 *
 * `text-ink` at rest and `text-pure` on hover: these are the only links on the
 * page and they should read as the destination, not as chrome.
 */
const LINK_ROW =
  "flex items-center py-7 font-display text-h3 uppercase tracking-tight text-ink transition-colors duration-200 ease-editorial hover:text-pure lg:py-8 lg:text-h2";

export default function NotFound() {
  return (
    <>
      <PageHero
        label={NOT_FOUND_PAGE.label}
        titleLines={NOT_FOUND_PAGE.titleLines}
        spokenTitle={NOT_FOUND_PAGE.spokenTitle}
        lede={NOT_FOUND_PAGE.lede}
      />

      <div className={SECTION}>
        <div className={FRAME}>
          {/* Real routes only. `NOT_FOUND_PAGE.links` is built from `ROUTES`,
              so a link here cannot outlive the page it points at. */}
          <nav aria-label="JDKD pages" className={EDGE}>
            {/* `list-none` strips list semantics in Safari; the role puts them
                back. Rows are separated by hairlines, top and bottom. */}
            <ul role="list" className="border-t border-line">
              {NOT_FOUND_PAGE.links.map((link) => (
                <li key={link.id} className="border-b border-line">
                  <Link href={link.href} className={LINK_ROW}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* The working path to a human, which a broken address is exactly the
              moment to offer. Outside the nav: a phone number is not a page. */}
          <p className={`${EDGE} mt-12 text-small text-muted lg:mt-16`}>
            {CONTACT.leasingContact.role} — {CONTACT.leasingContact.name},{" "}
            <a
              href={CONTACT.leasingContact.phoneHref}
              className="text-ink underline decoration-red decoration-2 underline-offset-4"
            >
              {CONTACT.leasingContact.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
