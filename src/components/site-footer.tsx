import {
  BRAND,
  CONTACT,
  FOOTER_COLUMNS,
  FOOTER_ID,
  FOOTER_LEGAL,
  UNRESOLVED,
} from "@/lib/content";

/**
 * SiteFooter — 09 in the deck's running order.
 *
 * Server Component. It ships no JavaScript at all: no reveal, no counter, no
 * scrub. The deck gives section 09 no motion and neither does this.
 *
 * STRUCTURE, section 09 of the brief:
 *   (GET IN TOUCH) · (LOCATION) · (CONTACT) — the site's parenthetical labels,
 *   each opening on a 64x1px red hairline; then the RERA disclosure slot; then
 *   the oversized wordmark and the `text-caption` legal line.
 *
 * It carries `id="contact"` (`FOOTER_ID`) because the site's contact block is
 * here; the primary nav's Enquire pill points at `#enquire` in section 08.
 *
 * SURFACE. `bg-deep` — one step below the page's `bg-canvas`, so the page
 * closes a shade darker than it ran. Because the ground is dark, every rule
 * here is `border-line` / `bg-line-strong`, the tokens defined for a dark
 * surface. NOT `line-invert`: that token is `rgba(11,15,15,.18)`, which is
 * `--color-deep` at 18% ON `--color-deep` — an invisible rule. It exists for
 * light panels, and there are none in this component.
 *
 * RERA IS UNRESOLVED. The number is a statutory disclosure the client has not
 * supplied. What renders is a labelled, visibly empty slot — a blank rule where
 * the number goes — and the publishable holding line from `UNRESOLVED.rera`.
 * Never invent a registration number.
 *
 * WORDMARK. The brief's `text-display` (120px), stepped down to `text-headline`
 * below `md` so no unprefixed step exceeds the 56px ceiling. `BRAND.wordmark`
 * is stored lowercase and the display face uppercases it in CSS, so this needs
 * `font-display uppercase` to match the hero — without them it renders "jdkd"
 * in the grotesque. It is decorative: the entity is named in full on the legal
 * line directly beneath it, so it is hidden from assistive technology rather
 * than read out a second time.
 *
 * CLEARANCE. `SiteHeader` pins a fixed quick-contact bar to the bottom of the
 * viewport below 768px. The spacer at the end of this component reserves the
 * matching strip so the last line of the page is never covered. The two are a
 * pair — change one, change the other.
 */

/** Interface labels. Chrome microcopy, not site content. */
const UI = {
  backToTop: "Back to top",
  rightsReserved: "All rights reserved.",
} as const;

export function SiteFooter() {
  // Evaluated when the page is rendered, so the year never has to be edited by
  // hand. On a statically prerendered page this is the build year.
  const year = new Date().getFullYear();

  return (
    <footer id={FOOTER_ID} className="relative w-full bg-deep text-pure">
      <div className="mx-auto w-full max-w-shell px-gutter py-section md:px-gutter-lg lg:py-section-lg">
        {/* (GET IN TOUCH) (LOCATION) (CONTACT) */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => {
            const headingId = `footer-${column.id}`;

            return (
              <div key={column.id}>
                {/* The site's section-label vocabulary, unchanged here:
                    display serif, uppercase, italic, +0.14em, muted. */}
                <h2
                  id={headingId}
                  className="font-display text-label uppercase italic tracking-label text-muted"
                >
                  {column.heading}
                </h2>
                <span
                  aria-hidden="true"
                  className="mt-2.5 block h-hair w-rule-sm bg-red"
                />

                <div className="mt-6 flex flex-col gap-1.5">
                  {column.lines.map((line) => (
                    <p key={line} className="text-small text-pure/75">
                      {line}
                    </p>
                  ))}
                </div>

                {column.links.length > 0 ? (
                  <ul
                    aria-labelledby={headingId}
                    className="mt-5 flex flex-col items-start gap-3"
                  >
                    {column.links.map((link) => (
                      <li key={link.id}>
                        <a
                          href={link.href}
                          {...(link.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="inline-block text-body text-pure underline decoration-red decoration-2 underline-offset-4 transition-colors duration-200 ease-editorial hover:text-pure/80 focus-visible:outline-pure"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* RERA disclosure. Statutory, and awaiting a value from the client. */}
        <div className="mt-16 border-t border-line pt-8 md:mt-20">
          <dl className="max-w-lede">
            <dt className="text-micro uppercase tracking-label text-pure/60">
              {UNRESOLVED.rera.label}
            </dt>
            <dd className="mt-3">
              {/* The empty slot itself — a blank rule where the number goes. */}
              <span
                aria-hidden="true"
                className="block h-px w-full max-w-[240px] bg-line-strong"
              />
              <p className="mt-3 text-small text-pure/60">
                {UNRESOLVED.rera.placeholder}
              </p>
            </dd>
          </dl>
        </div>

        {/* Closing lockup: red hairline, oversized wordmark, legal line. */}
        <div className="mt-16 md:mt-20">
          <span aria-hidden="true" className="block h-hair w-rule bg-red" />
          <p
            aria-hidden="true"
            className="mt-8 select-none font-display text-headline uppercase leading-none tracking-tight text-pure md:text-display"
          >
            {BRAND.wordmark}
          </p>
          {/* Colophon. Names the entity the wordmark stands for, so the
              wordmark itself can stay decorative. */}
          <p className="mt-6 text-caption uppercase tracking-micro text-pure/60">
            {FOOTER_LEGAL.entity}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-16">
          <p className="text-caption text-pure/60">
            &copy; {year} {FOOTER_LEGAL.copyrightHolder}. {UI.rightsReserved}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={CONTACT.leasingContact.phoneHref}
              className="text-caption uppercase tracking-micro text-pure/75 transition-colors duration-200 ease-editorial hover:text-pure focus-visible:outline-pure"
            >
              {CONTACT.leasingContact.phoneDisplay}
            </a>
            {/* `#main` rather than `#hero`: the footer renders on every route
                and only the homepage has a hero. `<main id="main">` is provided
                by `app/layout.tsx` everywhere, so this is a real "top of page"
                on internal routes and identical to `#hero` on the homepage,
                where main opens with the hero. */}
            <a
              href="#main"
              className="text-caption uppercase tracking-micro text-pure/75 transition-colors duration-200 ease-editorial hover:text-pure focus-visible:outline-pure"
            >
              {UI.backToTop}
            </a>
          </div>
        </div>
      </div>

      {/* Clearance for the fixed quick-contact bar SiteHeader pins below 768px. */}
      <div
        aria-hidden="true"
        className="h-[calc(3.5rem+env(safe-area-inset-bottom))] md:hidden"
      />
    </footer>
  );
}
