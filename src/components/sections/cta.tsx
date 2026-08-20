import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { EnquiryForm } from "@/components/ui/enquiry-form";
import { CONTACT, CTA, SECTIONS } from "@/lib/content";

/**
 * 08 — CTA. The page's last statement and its only conversion surface.
 *
 * Conventions are copied from `sections/about.tsx`, the worked reference.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE COMPOSITION, at `lg` and above.
 *
 *      0%                          54%                        100%  viewport
 *      ├───────────────────────────┤                            │
 *      │                                                 ┌──────┴──────┐
 *      │   SCHEDULE A                                    │  bg-pine    │
 *      │   PRIVATE WALKTHROUGH.        ← vertically      │  34vw wide  │
 *      │                                 centred         │  enquiry    │
 *      │                                                 │  form       │
 *      └── tower-exterior.jpg, full bleed behind ────────┴─────────────┘
 *
 * Two extremes and nothing in the middle. The statement hangs off the LEFT
 * EDGE and is vertically centred against the panel; the panel is flush RIGHT
 * and runs off the viewport edge. The tower stays visible between them, which
 * is the whole reason the scrim clears on the right at `lg`.
 *
 * WHICH ELEMENT SETS THE HEIGHT. The panel, because it is the only child left
 * in flow at `lg` — exactly as About's portrait is. That is what makes
 * `lg:top-1/2 lg:-translate-y-1/2` on the statement mean "centred on the
 * panel" rather than "centred on nothing".
 *
 * FULL-BLEED ART is a SIBLING of the frame, not a descendant, and it is
 * absolutely positioned so the reading content sits over it rather than under
 * it. `ParallaxImage` directly, not `ImageCard`: this is a background, and the
 * clip wipe belongs to framed pictures.
 *
 * THE RIGHT RAIL, in this section, is the panel. All the small sans copy — the
 * lede, the field labels, the consent line, the phone — sits inside it on a
 * ~34ch measure flush to the right, which is the one repetition every section
 * shares.
 *
 * STATEMENT SIZE. `text-headline` (56px) is the specified step and the fluid
 * value caps there. Below the cap it is bounded by the longest word that cannot
 * break: "WALKTHROUGH." measures 8.61em in Prata at the shipped tracking, so
 * 9.7vw is what keeps it inside a 375px gutter, and at `lg` the whole second
 * line — "PRIVATE WALKTHROUGH.", 13.05em — has to clear the pine panel, which
 * is what sets 3.8vw there.
 *
 * SERVER COMPONENT. `ParallaxImage`, `Reveal` and `EnquiryForm` are the client
 * boundaries and all three are leaves.
 */

const HEADING_ID = "enquire-heading";

/**
 * Restyling of the shared `EnquiryForm` for the pine panel, applied entirely
 * from the outside — `ui/enquiry-form.tsx` itself is untouched.
 *
 * The form was authored as a self-contained card on `bg-surface`. Here the
 * panel is the card, so the form's own chrome is stripped. Those five
 * overrides carry `!` because they collide with the form's base utilities on
 * the same property, and which of two same-property utilities wins depends on
 * the order Tailwind emits them, not on the order they appear in the class
 * string. The bang makes the outcome deterministic rather than incidental.
 *
 * The colour overrides are contrast repairs, not taste. `--color-muted`
 * (#8D938F) measures 5.3:1 on `--color-surface` but only 3.4:1 on
 * `--color-pine` (#254441), which fails WCAG AA for the field labels, the
 * optional-field note and the consent line. `text-ink/80` restores about
 * 6.6:1, and the placeholder tint about 5.6:1 — both AA at these sizes. Those
 * two win on specificity alone, so neither needs a bang: the descendant
 * selectors score (0,2,0) and (0,1,2) against (0,1,0) and (0,1,1).
 */
const FORM_ON_PINE =
  "mt-9 max-w-none! rounded-none! border-0! bg-transparent! p-0! [&_.text-muted]:text-ink/80 [&_input]:placeholder:text-ink/70 [&_textarea]:placeholder:text-ink/70";

export function Cta() {
  return (
    <section
      id={SECTIONS.enquire.id}
      aria-labelledby={HEADING_ID}
      // PACING BREAK. One of the three points in the scroll that gets ~280px
      // instead of the standard rhythm. Split into explicit `pt-` and `pb-`
      // rather than a `py-` that a second utility then has to fight.
      className="relative overflow-x-clip pt-[11rem] pb-section lg:pt-[17.5rem] lg:pb-section-lg"
    >
      {/* FULL-BLEED ART — sibling of the frame, behind the reading content. */}
      <div className="absolute inset-0">
        <ParallaxImage
          src={CTA.image.src}
          alt={CTA.image.alt}
          sizes="100vw"
          surface="ink"
          shift={7}
          scale={1.05}
          className="h-full w-full"
        />
        {/* Left-weighted scrim: the statement needs a ground, the tower does
            not. It clears on the right at `lg` because the pine panel is
            opaque and already covers that edge. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-deep via-deep/70 to-deep/30 lg:via-deep/55 lg:to-transparent"
        />
      </div>

      {/* THE FRAME — unpadded coordinate space, capped at the shell. */}
      <div className="relative mx-auto w-full max-w-shell">
        {/* LEFT EDGE — the statement, vertically centred on the panel at `lg`.
            Broken for composition, not for reading: the readable sentence is
            `sr-only` and the visible stack is hidden from assistive
            technology. Its id names both this section and the form. */}
        <h2
          id={HEADING_ID}
          className="px-gutter md:px-gutter-lg lg:absolute lg:left-gutter-lg lg:top-1/2 lg:w-[54%] lg:-translate-y-1/2 lg:px-0"
        >
          <span className="sr-only">{CTA.spokenHeadline}</span>
          <span aria-hidden="true" className="block">
            <Reveal
              as="span"
              stagger={0.09}
              duration={1}
              className="block font-display text-[min(9.7vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-pure lg:text-[min(3.8vw,3.5rem)] lg:leading-[0.98]"
            >
              {CTA.headlineLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </Reveal>
          </span>
        </h2>

        {/* RIGHT — the pine panel. In flow, so it sets the frame's height, and
            bleeding off the right viewport edge with the documented
            `calc(50%-50vw)` pattern rather than any scrollbar arithmetic of
            its own. Below 1440px that calc resolves to 0 and the panel simply
            meets the edge. */}
        <div className="mt-14 bg-pine px-gutter py-12 md:px-gutter-lg lg:mt-0 lg:ml-auto lg:mr-[calc(50%-50vw)] lg:w-[34vw] lg:px-12 lg:py-16">
          <Reveal
            as="p"
            start="top bottom"
            className="max-w-[34ch] text-small text-ink/85"
          >
            {CTA.body}
          </Reveal>

          <EnquiryForm labelledBy={HEADING_ID} className={FORM_ON_PINE} />

          {/* Not wrapped in a Reveal: the mask keeps `overflow: hidden` after
              it finishes and would clip this link's focus ring. */}
          <p className="mt-9 border-t border-line pt-6 text-caption text-ink/80">
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
    </section>
  );
}
