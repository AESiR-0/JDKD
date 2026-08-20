import { Reveal } from "@/components/motion/reveal";
import {
  DisplayHeading,
  EDGE,
  FRAME,
  LABEL,
  SECTION,
} from "@/components/project/chrome";
import { EnquiryForm } from "@/components/ui/enquiry-form";
import type { Contact, RealProject } from "@/lib/content";

/**
 * ENQUIRE — the page's last statement and its only conversion surface.
 *
 * The composition is the site's established enquiry treatment, the one
 * `sections/cta.tsx` sets on the homepage: two extremes and nothing in the
 * middle. The statement hangs off the LEFT EDGE and is vertically centred; the
 * pine panel is flush RIGHT and runs off the viewport edge.
 *
 *      ▓                                                            ▓
 *      │  (ENQUIRE)                                                 │
 *      │                                            ┌────────────────
 *      │   WALK THE          ← centred on           │  bg-pine      │
 *      │   BUILDING.           the panel            │  38vw wide    │
 *      │                                            │  enquiry form │
 *      │                                            └────────────────
 *
 * WHICH CHILD SETS THE HEIGHT — the panel, because it is the only one left in
 * flow at `lg`. That is what makes `lg:top-1/2 lg:-translate-y-1/2` on the
 * statement mean "centred on the panel" rather than "centred on nothing".
 *
 * NO BACKGROUND ART here, unlike the homepage: the gallery band sits directly
 * above this section and a sixth photograph would be one too many.
 *
 * THE FORM IS NOT WIRED, AND IT SAYS SO. `EnquiryForm` intercepts submit,
 * sends nothing, and hands the visitor Mr. Roy's number in a live region. That
 * behaviour is the honest one and it is not to be replaced with a fake success
 * state; this section restyles the form only from the OUTSIDE, exactly as
 * `sections/cta.tsx` does, and does not touch `ui/enquiry-form.tsx`.
 */

const ENQUIRE_ID = "enquire-heading";

/**
 * Restyling of the shared `EnquiryForm` for the pine panel, applied entirely
 * from the outside. The form was authored as a self-contained card on
 * `bg-surface`; here the panel is the card, so the form's own chrome is
 * stripped. Those five overrides carry `!` because they collide with the
 * form's base utilities on the same property, and which of two same-property
 * utilities wins depends on the order Tailwind emits them, not on the order
 * they appear in the class string.
 *
 * The colour overrides are CONTRAST REPAIRS, not taste. `--color-muted`
 * (#8D938F) measures 5.3:1 on `--color-surface` but only 3.4:1 on
 * `--color-pine` (#254441), which fails WCAG AA for the field labels, the
 * optional-field note and the consent line. `text-ink/80` restores about
 * 6.6:1 and the placeholder tint about 5.6:1 — both AA at these sizes.
 */
const FORM_ON_PINE =
  "mt-9 max-w-none! rounded-none! border-0! bg-transparent! p-0! [&_.text-muted]:text-ink/80 [&_input]:placeholder:text-ink/70 [&_textarea]:placeholder:text-ink/70";

export type ProjectEnquiryProps = {
  readonly enquiry: RealProject["enquiry"];
  readonly contact: Contact;
};

export function ProjectEnquiry({ enquiry, contact }: ProjectEnquiryProps) {
  return (
    <section id="enquire" aria-labelledby={ENQUIRE_ID} className={SECTION}>
      <div className={FRAME}>
        <p className={`${EDGE} ${LABEL}`}>{enquiry.label}</p>

        <div className="relative mt-10 lg:mt-16">
          {/* LEFT EDGE — the statement, vertically centred on the panel at
              `lg`. Broken for composition, not for reading: the readable
              sentence is `sr-only` inside the `<h2>` and the visible stack is
              hidden from assistive technology. Its id names both this section
              and the form. */}
          <DisplayHeading
            id={ENQUIRE_ID}
            lines={enquiry.headingLines}
            spoken={enquiry.spokenHeading}
            className={`${EDGE} lg:absolute lg:left-gutter-lg lg:top-1/2 lg:w-[46%] lg:-translate-y-1/2 lg:px-0`}
          />

          {/* RIGHT — the pine panel. In flow, so it sets the band's height,
              and bleeding off the right viewport edge with the documented
              `calc(50%-50vw)` pattern. Below 1440px that calc resolves to 0
              and the panel simply meets the edge. */}
          <div className="mt-12 bg-pine px-gutter py-12 md:px-gutter-lg lg:mt-0 lg:ml-auto lg:mr-[calc(50%-50vw)] lg:w-[38vw] lg:px-12 lg:py-16">
            <Reveal
              as="p"
              start="top bottom"
              className="max-w-[34ch] text-small text-ink/85"
            >
              {enquiry.body}
            </Reveal>

            <EnquiryForm labelledBy={ENQUIRE_ID} className={FORM_ON_PINE} />

            {/* Not wrapped in a Reveal: the mask keeps `overflow: hidden`
                after it finishes and would clip this link's focus ring. */}
            <p className="mt-9 border-t border-line pt-6 text-caption text-ink/80">
              {contact.leasingContact.role} — {contact.leasingContact.name},{" "}
              <a
                href={contact.leasingContact.phoneHref}
                className="text-ink underline decoration-red decoration-2 underline-offset-4"
              >
                {contact.leasingContact.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
