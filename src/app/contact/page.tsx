import type { Metadata } from "next";

import { ImageCard } from "@/components/motion/image-card";
import { Reveal } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EnquiryForm } from "@/components/ui/enquiry-form";
import {
  ASSET,
  CONTACT_PAGE,
  ROUTES,
  SECTIONS,
  type DisplayLine,
} from "@/lib/content";

/**
 * /contact — the page where the enquiry IS the subject, not a card on it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE ARGUMENT THIS PAGE MAKES, IN ORDER.
 *
 *   00  MASTHEAD    the invitation at display scale, hard against the left
 *                   edge, with the lede — which leads with the phone number and
 *                   discloses that the form is dead — hung off the right rail.
 *   01  CALL        the number at 136px in the GROTESQUE. The largest single
 *                   element on the site after the homepage wordmark, and the
 *                   only channel on this page that reaches a human today. It is
 *                   a link, not an image of a number.
 *   02  ENQUIRE     a room, not a card: pine runs off the LEFT viewport edge
 *                   for 58vw, the photograph runs off the RIGHT for 42vw, and
 *                   they meet on a hard vertical boundary with no gutter
 *                   between them. That seam is the composition.
 *   03  ADDRESS     the street set as display type, then a full-bleed horizon.
 *   04  DIRECTIONS  four hairline rows, quiet, the page exhaling.
 *
 * NO `PageHero` HERE. Its title/lede/plate stack is the shared opener for the
 * routes that want a shared opener; this page and `/about` each compose their
 * own masthead instead, because on both of them the h1 has to be measured
 * against something specific — here, the number below it. `PageHero` is still
 * used by `/projects`, `/projects/[slug]` and `not-found`, so it stays in the
 * tree. Do not delete it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * HONESTY IS PART OF THE LAYOUT, NOT A FOOTNOTE.
 *
 * `EnquiryForm` has no endpoint. Submitting it posts nowhere. So the disclosure
 * appears THREE times before a visitor can type into a required field: in the
 * lede, in the giant number band, and as `form.notice` directly above the first
 * label, under a red hairline. Do NOT move that notice below the fields, do not
 * add an endpoint here, and do not fake a success state.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A GRID. No `grid-cols-12`, no `col-span-*`. Three anchors — left
 * edge, ~30ch right rail, optical band — and vertical rhythm rather than
 * alignment holds the sections together.
 *
 * The enquiry band takes the DOCUMENTED EXCEPTION to the rail: the photograph
 * owns the right edge for the full height of the band, so the type column moves
 * to the LEFT EDGE. The rail returns to the right everywhere else.
 *
 * WHICH CHILD SETS EACH BAND'S HEIGHT. In the enquiry band, the pine column: it
 * is the only child left in flow at `lg`, which is what lets the photograph
 * take `inset-y-0` and fill it exactly. Get that backwards and the photograph
 * measures against zero.
 *
 * MOBILE. Every anchor is `lg:`-prefixed. What is left at 375px is one
 * gutter-padded column in DOM order — and DOM order is reading order: type
 * before its picture in every band.
 *
 * ONE H1. The masthead renders it. Sections open at `<h2>`, blocks at `<h3>`.
 *
 * SERVER COMPONENT. `Reveal`, `ImageCard` and `EnquiryForm` are the only client
 * boundaries and all three are leaves.
 */

/* ==========================================================================
   METADATA
   ========================================================================== */

const ROUTE = ROUTES.contact;

export const metadata: Metadata = {
  title: ROUTE.title,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
  openGraph: {
    type: "website",
    url: ROUTE.path,
    title: ROUTE.ogTitle,
    description: ROUTE.description,
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
   SHARED TREATMENTS

   Written out whole and shared by reference. NEVER build a Tailwind class by
   concatenation or interpolation — the v4 scanner reads source text, so a class
   assembled at runtime is never generated. Joining two COMPLETE literals is
   fine; splicing a value into one is not.
   ========================================================================== */

/** The section shell. Full-bleed, owns the rhythm, clips the horizontal axis. */
const SECTION = "relative overflow-x-clip py-section lg:py-section-lg";

/** The unpadded coordinate space every percentage anchor is measured against. */
const FRAME = "relative mx-auto w-full max-w-shell";

/** The left-edge anchor, for any child that is in flow. */
const EDGE = "px-gutter md:px-gutter-lg";

/** Parenthetical section marker. There are NO numerals in this vocabulary. */
const LABEL =
  "font-display text-label uppercase italic tracking-label text-muted";

/** Right-rail copy. `text-small` sits on the rail so `30ch` measures the copy. */
const RAIL_COPY = "text-small text-muted";

/**
 * The h1. SIZE IS CAPPED, NOT FLAT: `min(12vw, 3.5rem)` holds the 56px
 * unprefixed ceiling everywhere it fits and shrinks only on the narrow widths
 * that cannot hold it. The arbitrary steps carry no line height of their own,
 * so each restores one explicitly rather than relying on cascade order.
 */
const TITLE =
  "block font-display text-[min(12vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-ink md:text-h1 md:leading-[0.98] lg:text-[min(6.6vw,8rem)] lg:leading-[0.9]";

/** Section display heading. One step below the h1 at every width. */
const DISPLAY =
  "block font-display text-[min(11vw,3.5rem)] uppercase leading-[1.02] tracking-tight text-ink md:text-h1 md:leading-[0.98] lg:text-[min(5vw,4.5rem)] lg:leading-[0.94]";

/** The site's link treatment for a phone number: red hairline underline. */
const PHONE_LINK =
  "text-ink underline decoration-red decoration-2 underline-offset-4";

/**
 * THE NUMBER.
 *
 * Set in `font-sans`, and that is not a slip. The display serif carries
 * OLD-STYLE FIGURES — 9, 8 and 1 all sit on different baselines and 8 has a
 * descender — so a ten-digit number in it reads as a decorated squiggle.
 * Geist has lining tabular figures, which is why every numeral on this site is
 * set in it. At this scale the grotesque against the serif around it is also
 * the point: the one machine-readable thing on the page looks machine-readable.
 *
 * SIZE IS BOUNDED BY THE STRING, not by taste. Ten tabular digits measure
 * ~6em, and −0.03em tracking trims that to ~5.7em. At 375px the gutters leave
 * 327px, so the unprefixed cap of 52px (min(14vw, 3.25rem)) lands at ~299px —
 * inside the gutter with room to spare, and inside the 56px `text-headline`
 * ceiling the system puts on unprefixed steps. The `lg` cap of 136px lands at
 * ~775px inside a 1328px measure.
 *
 * NOT INSIDE A `Reveal`. The mask keeps `overflow: hidden` after it finishes
 * and would clip the focus ring off this link — the single most important
 * control on the page.
 */
const CALL_LINK =
  "inline-block font-sans font-light tabular-nums text-[min(14vw,3.25rem)] leading-[0.9] tracking-[-0.03em] text-ink underline decoration-red decoration-2 underline-offset-[0.14em] transition-colors duration-200 ease-editorial hover:text-pure md:text-[min(9vw,5rem)] lg:text-[min(9.2vw,8.5rem)]";

/* ==========================================================================
   DISPLAY HEADING

   Display type is broken for COMPOSITION, not for reading. The visible stack is
   hidden from assistive technology and `spoken` carries the readable sentence
   `sr-only`, because otherwise a screen reader announces every line break as a
   sentence break.
   ========================================================================== */

type DisplayHeadingProps = {
  readonly id: string;
  readonly lines: readonly DisplayLine[];
  readonly spoken: string;
  /** Placement classes on the `<h2>` itself. */
  readonly className?: string;
  /** Type classes on the revealed stack. @default DISPLAY */
  readonly typeClassName?: string;
};

function DisplayHeading({
  id,
  lines,
  spoken,
  className,
  typeClassName = DISPLAY,
}: DisplayHeadingProps) {
  return (
    <h2 id={id} className={className}>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true" className="block">
        <Reveal as="span" stagger={0.08} duration={1} className={typeClassName}>
          {lines.map((line) => (
            <span
              key={line.text}
              className={line.style === "italic" ? "italic" : "not-italic"}
            >
              {line.text}
            </span>
          ))}
        </Reveal>
      </span>
    </h2>
  );
}

/* ==========================================================================
   00 — MASTHEAD

   Replaces `PageHero` on this route. Same clearance arithmetic — the bar is
   `h-14` / `md:h-16` and SOLID from the first pixel on every route but the
   homepage, so `pt-32 md:pt-40 lg:pt-48` is CLEARANCE, not taste. Do not
   reduce it.

   What differs from `PageHero`: no plate, and the band closes on a hairline
   that runs to both viewport edges. That rule is the page's horizon — the
   number band below it is measured against it, and nothing else on the page
   spans the full viewport until the aerial plate near the foot.

        Home / Contact
        (CONTACT)

        ENQUIRE
        ABOUT THE                              ┌──────────────────┐
        BUILDING.                              │  lede, 32ch      │ ← foot-aligned
                                               └──────────────────┘
        ───────────────────────────────────────────────────────────── full bleed
   ========================================================================== */

const TITLE_ID = "page-title";

function Masthead() {
  const { label, titleLines, spokenTitle, lede } = CONTACT_PAGE;

  return (
    <header className="relative overflow-x-clip pt-32 md:pt-40 lg:pt-48">
      <div className={FRAME}>
        {/* NEVER inside a `Reveal`: the mask would clip the crumb focus ring. */}
        <div className={EDGE}>
          <Breadcrumbs
            trail={[
              { label: "Home", href: ROUTES.home.path },
              { label: ROUTES.contact.title },
            ]}
          />
          <p className={`mt-8 ${LABEL}`}>{label}</p>
        </div>

        {/* TYPE BAND. The h1 stays in FLOW at every width and alone sets this
            band's height, which is what makes `lg:bottom-0` on the rail mean
            "aligned to the foot of the title" rather than "aligned to
            nothing". */}
        <div className="relative mt-10 lg:mt-16">
          <h1 id={TITLE_ID} className={`${EDGE} lg:w-[60%]`}>
            <span className="sr-only">{spokenTitle}</span>
            <span aria-hidden="true" className="block">
              <Reveal as="span" stagger={0.09} duration={1.05} className={TITLE}>
                {titleLines.map((line) => (
                  <span
                    key={line.text}
                    className={line.style === "italic" ? "italic" : "not-italic"}
                  >
                    {line.text}
                  </span>
                ))}
              </Reveal>
            </span>
          </h1>

          {/* RIGHT RAIL. Slightly wider than the usual 30ch because this lede
              carries the no-backend disclosure and must not fragment. */}
          <div
            className={`${EDGE} mt-10 w-full ${RAIL_COPY} lg:absolute lg:right-gutter-lg lg:bottom-0 lg:mt-0 lg:w-[32ch] lg:px-0`}
          >
            <Reveal as="p" delay={0.14}>
              {lede}
            </Reveal>
          </div>
        </div>

        {/* THE HORIZON. `calc(50% - 50vw)` is exact: below 1440px the frame IS
            the viewport and it resolves to 0; above it, it is precisely the
            frame's own inset. The header's `overflow-x-clip` absorbs the
            scrollbar delta. */}
        <div
          aria-hidden="true"
          className="mt-16 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] h-px bg-line lg:mt-24"
        />
      </div>
    </header>
  );
}

/* ==========================================================================
   01 — THE CALL

   The page's largest element, and deliberately so: the form does not work and
   this does. Giving the working channel less weight than a dead form would be a
   lie told in layout.

        (CALL)

        9811998811                    ← left edge, 136px, grotesque, a tel: link
                                              ┌──────────────────┐
                                              │ Leasing enquiries│
                                              │ MR. ROY          │ ← flush RIGHT
                                              │ the qualifier    │
                                              └──────────────────┘

   The rail hangs off the RIGHT gutter under a number that is hard against the
   LEFT one. Nothing in this band lines up with anything else in it; the empty
   diagonal between the two is the composition.
   ========================================================================== */

const CALL_ID = "call-heading";

function Call() {
  const { call, contact } = CONTACT_PAGE;
  const { leasingContact } = contact;

  return (
    <section id="call" aria-labelledby={CALL_ID} className={SECTION}>
      <div className={FRAME}>
        <div className={EDGE}>
          <h2 id={CALL_ID} className={LABEL}>
            {call.label}
          </h2>
        </div>

        <div className={`${EDGE} mt-10 lg:mt-16`}>
          <a
            href={leasingContact.phoneHref}
            aria-label={`Call ${leasingContact.name} on ${leasingContact.phoneDisplay}`}
            className={CALL_LINK}
          >
            {leasingContact.phoneDisplay}
          </a>
        </div>

        <div className={`${EDGE} mt-10 lg:mt-14 lg:flex lg:justify-end`}>
          <div className="lg:w-[30ch] lg:text-right">
            <p className="text-micro uppercase tracking-label text-muted">
              {leasingContact.role}
            </p>
            <Reveal
              as="p"
              className="mt-4 font-display text-h3 uppercase tracking-tight text-ink"
            >
              {leasingContact.name}
            </Reveal>
            <p className={`mt-4 ${RAIL_COPY}`}>{call.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   02 — THE ENQUIRY

   A ROOM, NOT A CARD. Pine runs off the LEFT viewport edge for 58vw; the
   photograph runs off the RIGHT for 42vw; they meet on a hard vertical seam
   with no gutter, no rule and no gap between them.

        ▓                                                            ▓
        ├──────────────────────────────────┬──────────────────────────┤
        │ (ENQUIRY)                        │                          │
        │ TELL US                          │                          │
        │ WHAT YOU NEED.                   │   lobby.jpg              │
        │                                  │   FULL band height       │
        │ statement, 38ch                  │   bleeds off the RIGHT   │
        │ ─── red hairline ───             │   viewport edge, 42vw    │
        │ the form is not connected …      │                          │
        │ FULL NAME ───────────            │                          │
        │ EMAIL ───────────────            │                          │
        │ [ SEND ]                         │                          │
        ├──────────────────────────────────┴──────────────────────────┤
        ▓                                                            ▓

   58 / 42 ADDS TO EXACTLY ONE VIEWPORT. Pine's right edge sits at
   `-(V-W)/2 + 58vw` in frame coordinates and the photograph's left edge at
   `W + (V-W)/2 - 42vw`; those are the same number at every viewport width, so
   the seam cannot open a hairline gap on a wide monitor.

   THE PINE COLUMN IS IN FLOW and sets the band's height; the photograph is the
   single absolutely positioned child and fills it (`inset-y-0` + `aspect-auto`
   + `h-full`). `aspect-auto` cancels the mobile ratio so `h-full` can take
   over — without it the two fight and the frame keeps the ratio.

   THE TYPE STILL STARTS AT THE PAGE GUTTER. Pine bleeds left, so its own
   padding has to give the bleed back: `calc(50vw - 50% + 3.5rem)`. Padding
   percentages resolve against the containing block's inline size — the frame —
   so below 1440px that collapses to exactly `gutter-lg` and the enquiry's first
   character lands on the same vertical as the h1 four hundred pixels above it.
   That continuity across a colour change is the whole trick.

   THE FORM IS NOT WIRED. `EnquiryForm` intercepts submit, tells the visitor in
   a live region that nothing was sent, and hands over Mr. Roy's number. The
   notice below says so BEFORE the first field. Do not add an endpoint here.
   ========================================================================== */

const ENQUIRY_ID = "enquiry-heading";
/** Names the form itself. Its own `<h3>`, not the section's `<h2>`. */
const FORM_ID = "enquiry-form-heading";

/**
 * Restyling of the shared `EnquiryForm`, applied entirely from the OUTSIDE —
 * `ui/enquiry-form.tsx` is untouched. Three groups, three different reasons.
 *
 * 1. DE-CARDING. The form was authored as a self-contained card on
 *    `bg-surface`. Here the room is the card, so its own chrome is stripped.
 *    Those five carry `!` because they collide with the form's base utilities
 *    on the same property, and which of two same-property utilities wins
 *    depends on the order Tailwind emits them, not on the order they appear in
 *    the class string.
 *
 * 2. CONTRAST REPAIR, not taste. `--color-muted` (#8D938F) measures 5.3:1 on
 *    `--color-surface` but only 3.4:1 on `--color-pine` (#254441), which fails
 *    WCAG AA for the field labels, the optional-field note and the consent
 *    line. `text-ink/80` restores about 6.6:1 and the placeholder tint about
 *    5.6:1 — both AA at these sizes. Those two win on specificity alone, so
 *    neither needs a bang.
 *
 * 3. SCALE. This page's brief is that the enquiry is the subject rather than a
 *    widget, so the labels go from 11px to 15px, the fields gain vertical air,
 *    and the submit stops being a full-width slab. `text-[0.9375rem]` rather
 *    than `text-label` on purpose: a named step would also overwrite the
 *    label's `tracking-label`, and the wide tracking is what keeps 15px
 *    uppercase reading as a label rather than as copy. The gap override
 *    targets the fields wrapper — the form's first `<div>` child; its siblings
 *    are a `<p>`, a `<button>` and the live region.
 */
const FORM_ON_PINE =
  "mt-10 max-w-none! rounded-none! border-0! bg-transparent! p-0! lg:max-w-[36rem]! [&_.text-muted]:text-ink/80 [&_input]:placeholder:text-ink/70 [&_textarea]:placeholder:text-ink/70 [&>div:first-of-type]:gap-9 [&_label]:text-[0.9375rem] [&_input]:py-4! [&_textarea]:py-4! [&_input]:text-body-lg! [&_textarea]:text-body-lg! [&_button]:w-auto! [&_button]:px-14!";

function Enquiry() {
  const { statement, form, enquiryImage, contact } = CONTACT_PAGE;

  /*
   * The section id is read from `SECTIONS.enquire`, not retyped: the header's
   * Enquire pill builds `NAV_CTA.awayHref` from that same constant, so this
   * section and the button that points at it cannot drift apart.
   */
  return (
    <section
      id={SECTIONS.enquire.id}
      aria-labelledby={ENQUIRY_ID}
      // No `py` of its own: the pine column carries the rhythm, so the colour
      // reaches the band's true top and bottom edges.
      className="relative overflow-x-clip"
    >
      <div className={FRAME}>
        {/* THE ROOM. In flow at every width, so it sets the band's height. */}
        <div className="bg-pine px-gutter py-section md:px-gutter-lg lg:ml-[calc(50%-50vw)] lg:w-[58vw] lg:min-h-[46rem] lg:py-section-lg lg:pl-[calc(50vw_-_50%_+_3.5rem)] lg:pr-20">
          {/* On pine, `text-muted` measures 3.4:1 and fails AA, so every small
              element in this room is tinted from `--color-ink` instead. */}
          <p className="font-display text-label uppercase italic tracking-label text-ink/80">
            {form.label}
          </p>

          <DisplayHeading
            id={ENQUIRY_ID}
            lines={statement.headingLines}
            spoken={statement.spokenHeading}
            className="mt-8 lg:mt-12"
          />

          <div className="mt-10 max-w-[38ch] text-small text-ink/85 lg:mt-12">
            <Reveal as="div" stagger={0.09} delay={0.1}>
              {statement.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-5 first:mt-0">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>

          {/* THE DISCLOSURE, ABOVE THE FIELDS. Red is legal here because it is
              a 1px rule — never a fill. The link sits outside every `Reveal`
              so its focus ring is not clipped by a mask. */}
          <p className="mt-12 max-w-[46ch] border-t border-red pt-6 text-small text-ink/85">
            {form.notice}{" "}
            <a href={contact.leasingContact.phoneHref} className={PHONE_LINK}>
              {contact.leasingContact.phoneDisplay}
            </a>
            .
          </p>

          <Reveal
            as="h3"
            id={FORM_ID}
            className="mt-12 font-display text-h3 uppercase tracking-tight text-ink"
          >
            {form.heading}
          </Reveal>

          <p className="mt-4 max-w-[38ch] text-small text-ink/85">{form.body}</p>

          {/* Never inside a `Reveal`: the mask keeps `overflow: hidden` after
              it finishes and would clip the focus ring off every field. */}
          <EnquiryForm labelledBy={FORM_ID} className={FORM_ON_PINE} />
        </div>

        {/* THE GROUND. Absolute at `lg` and stretched to the room's height, so
            colour and photograph share one unbroken seam. */}
        <ImageCard
          src={enquiryImage.src}
          alt={enquiryImage.alt}
          sizes="(min-width: 1024px) 42vw, 100vw"
          surface="ink"
          shift={6}
          scale={1.05}
          delay={0.06}
          className="aspect-[4/5] w-full lg:absolute lg:inset-y-0 lg:right-[calc(50%-50vw)] lg:aspect-auto lg:h-full lg:w-[42vw]"
        />
      </div>
    </section>
  );
}

/* ==========================================================================
   03 — THE ADDRESS

   The address IS the statement, which is why there are no `headingLines` in
   `CONTACT_PAGE.address`: inventing a headline to sit above a street would add
   words that say less than the street does. The section's accessible name
   therefore comes from its parenthetical marker, which is the `<h2>`.

   A real `<address>` element: it is the contact information for the nearest
   `<body>`, which is exactly what this is. `not-italic` cancels the browser
   default, since the italic in this system belongs to the display cut.

   Beneath it the band opens all the way out to both viewport edges for the
   only photograph on this page that is allowed a horizon. Its caption is three
   confirmed distances and nothing else.
   ========================================================================== */

const ADDRESS_ID = "address-heading";

function Address() {
  const { address, contact } = CONTACT_PAGE;

  return (
    <section id="address" aria-labelledby={ADDRESS_ID} className={SECTION}>
      <div className={FRAME}>
        <div
          className={`${EDGE} lg:flex lg:items-start lg:justify-between lg:gap-16`}
        >
          <div className="lg:w-[58%]">
            <h2 id={ADDRESS_ID} className={LABEL}>
              {address.label}
            </h2>

            <address className="mt-10 not-italic lg:mt-14">
              <Reveal
                as="div"
                stagger={0.08}
                className="font-display text-h3 uppercase tracking-tight text-ink md:text-h2 lg:text-[min(3vw,2.75rem)] lg:leading-[1.06]"
              >
                {address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </Reveal>
            </address>
          </div>

          {/* RIGHT RAIL — ~30ch. The entity and the asset, in the site's label
              vocabulary so they read as a colophon rather than as copy. */}
          <ul
            role="list"
            className="mt-12 text-micro uppercase tracking-label text-muted lg:mt-0 lg:w-[30ch]"
          >
            <li>{contact.entity}</li>
            <li className="mt-3">{ASSET.assetClass}</li>
            <li className="mt-3">{ASSET.availability}</li>
          </ul>
        </div>

        {/* FULL BLEED, BOTH EDGES. No `w-screen` — the element is a block with
            `width: auto`, so the two negative margins already resolve it to
            100vw; `w-screen` would additionally count the scrollbar and push
            the page into horizontal overflow. */}
        <ImageCard
          src={address.image.src}
          alt={address.image.alt}
          sizes="100vw"
          surface="ink"
          shift={5}
          scale={1.05}
          delay={0.08}
          className="mt-16 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] aspect-[4/3] md:aspect-[16/9] lg:mt-24 lg:aspect-[21/9]"
        />

        <p
          className={`${EDGE} mt-6 text-micro uppercase tracking-label text-muted`}
        >
          {address.caption}
        </p>
      </div>
    </section>
  );
}

/* ==========================================================================
   04 — GETTING THERE

   Four ways of arriving, drawn only from the confirmed location facts — the
   350 m to Sarita Vihar on the Violet Line, direct Mathura Road access, Apollo
   Hospital at 500 m, the NOIDA hub at 5 km. Nothing here is estimated and
   nothing is rounded up.

   A `<dl>`, not a list and certainly not a grid: mode is the term, the walking
   or driving note is its description. Each pair is wrapped in the `<div>` the
   HTML specification permits inside a `<dl>`, which is what carries the
   hairline and the flex row. The page ends quietly on purpose.
   ========================================================================== */

const DIRECTIONS_ID = "directions-heading";

function Directions() {
  const { directions } = CONTACT_PAGE;

  return (
    <section id="directions" aria-labelledby={DIRECTIONS_ID} className={SECTION}>
      <div className={FRAME}>
        {/* Type-only band, so the padded flex idiom rather than absolute
            positioning — simpler, and it cannot overflow. */}
        <div
          className={`${EDGE} lg:flex lg:items-start lg:justify-between lg:gap-16`}
        >
          <h2 id={DIRECTIONS_ID} className={LABEL}>
            {directions.label}
          </h2>

          <p className={`mt-8 max-w-[30ch] ${RAIL_COPY} lg:mt-0 lg:w-[30ch]`}>
            {directions.body}
          </p>
        </div>

        <dl className={`${EDGE} mt-14 lg:mt-24`}>
          {directions.items.map((item) => (
            <div
              key={item.id}
              className="border-t border-line py-8 last:border-b last:border-line lg:flex lg:items-baseline lg:gap-12 lg:py-11"
            >
              <Reveal
                as="dt"
                className="font-display text-h3 uppercase tracking-tight text-ink lg:w-[34%] lg:text-h2"
              >
                {item.mode}
              </Reveal>

              <Reveal
                as="dd"
                delay={0.06}
                className="mt-4 max-w-[46ch] text-small text-muted lg:mt-0 lg:ml-auto lg:w-[42ch]"
              >
                {item.detail}
              </Reveal>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ==========================================================================
   THE PAGE

   No wrapper element on purpose: every section is full-bleed and owns its own
   frame, so anything this function wrapped them in would become a second,
   competing coordinate space. `app/layout.tsx` already provides
   `<main id="main">`, the skip link, the header and the footer.
   ========================================================================== */

export default function ContactPage() {
  return (
    <>
      <Masthead />
      <Call />
      <Enquiry />
      <Address />
      <Directions />
    </>
  );
}
