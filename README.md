# JDKD

Corporate website for **JDKD Developers LLP**, New Delhi.

The site presents **JDKD Corporate Tower** — a LEED certified, Grade A commercial office
building at A-11, Mohan Cooperative Industrial Estate (MCIE), Mathura Road, New Delhi —
which is now available for leasing.

## Stack

| | |
|---|---|
| Framework | Next.js 16.3.1, App Router, `src/` dir, `@/*` alias |
| UI | React 19.2.8 |
| Language | TypeScript (strict) |
| Styles | Tailwind CSS v4 via `@tailwindcss/postcss` |
| Motion | GSAP 3.15 + `@gsap/react`, `motion` (Framer Motion v13) |

> **This is not the Next.js most references describe.** Version 16 carries breaking changes.
> The authoritative docs ship on disk at `node_modules/next/dist/docs/01-app/` — read the
> relevant guide before using an API. See `AGENTS.md`.

There is **no `tailwind.config.*`**. Every design token lives in the `@theme` block in
`src/app/globals.css`, which is the single source of truth for colour, type, spacing,
containers, radius and easing.

## Commands

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint — note: `next build` does NOT lint, run this separately
npx tsc --noEmit
```

## Structure

```
src/
  app/
    layout.tsx        fonts, metadata, skip link, header/main/footer
    page.tsx          homepage — composes the nine sections in order
    globals.css       @theme design tokens + base styles
  components/
    site-header.tsx   client — nav, mobile panel, tap-to-call bar
    site-footer.tsx   server — three columns, RERA slot, wordmark
    sections/         one file per homepage section
    ui/               SectionMarker, RuleCard, Chip, CredentialTrio, EnquiryForm
    motion/           Reveal, Counter, ParallaxImage (all client leaves)
  lib/
    content.ts        ALL copy, figures, images and contact data
design-system/        static HTML reference for every component
docs/                 SPEC.md and FLOW.md
```

### Homepage order

`Hero · Statement · FeaturedAsset · Numbers · Location · PhotoStatement · Pillars ·
Portfolio · Cta`, then the footer from `layout.tsx`.

Section numerals come from `SECTIONS` in `src/lib/content.ts`, **not** from the order of
JSX in `page.tsx`. Reordering the page does not renumber the markers.

## Conventions

- **Content never lives in components.** All copy, numbers, addresses, phone numbers,
  image paths and alt text come from `src/lib/content.ts`.
- **Sections are Server Components** and take no props. Client boundaries are pushed down
  to leaves (`Reveal`, `Counter`, `ParallaxImage`, `PortfolioFilter`, `EnquiryForm`,
  `SiteHeader`). Never put `"use client"` on a section, `page.tsx` or `layout.tsx`.
- **Type ceiling: 72px desktop / 40px mobile.** Steps above `text-headline` (40px) may only
  appear behind an `md:`/`lg:` prefix. Headlines are sentence case and end with a period.
- **Red is never a fill** — hairline rules, focus rings and the logo only. **Gold** is
  budgeted to two `RuleCard` headers site-wide. **Chips are never coloured.**
- **Motion is `transform` + `opacity` only.** No `filter`, no `backdrop-filter`, no animated
  `box-shadow`. One motion idea per section. Every GSAP timeline gates on
  `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
- **Images:** never pass `quality`; use `preload` (not the deprecated `priority`) on the hero
  only, one per page; every `fill` image needs a real `sizes` string.

## Unresolved before launch

These are deliberately **not** filled in. Each renders a visible placeholder slot — never
invent a value. Tracked in `src/lib/content.ts` under `UNRESOLVED` and in `docs/SPEC.md` §7.

- **RERA registration number** — statutory disclosure; the footer renders a labelled empty slot.
- **Residential portfolio** — two portfolio cards are explicit placeholders and are not linked.
- **Leadership** — names and bios unconfirmed, not published.
- **Production domain** — `SITE.origin` falls back to `https://jdkd.example`. Set
  `NEXT_PUBLIC_SITE_URL` in the deployment environment.
- **Project detail route** — `/projects/commercial/jdkd-corporate-tower` does not exist yet,
  so the tower's `href` points at the on-page `#asset` anchor. Swap it back in
  `src/lib/content.ts` when the route ships.
- **Enquiry form submission** — not wired to a backend. It intercepts submit and directs the
  user to call the leasing contact.

## Contact

Leasing enquiries: Mr. Roy — 9811998811
