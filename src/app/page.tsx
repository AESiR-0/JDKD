import { About } from "@/components/sections/about";
import { BeliefsGrid } from "@/components/sections/beliefs-grid";
import { BeliefsVision } from "@/components/sections/beliefs-vision";
import { Buildings } from "@/components/sections/buildings";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";

/**
 * Homepage — the nine-section running order.
 *
 *   01 Hero            full-bleed dusk tower, wordmark on the left edge
 *   02 About           one composition that absorbs the statistics
 *   03 Buildings       three placeholder chapters, alternating dominance
 *   04 Beliefs A       the vision statement, image bleeding off the left edge
 *   05 Beliefs B       the frosted bento of five principles
 *   06 Features        four scroll-pinned panels, no heading at all
 *   07 FAQ             hairline rows, one answer open at a time
 *   08 CTA             full-bleed elevation with the pine enquiry panel
 *   09 Footer          rendered by `app/layout.tsx`, not here
 *
 * SERVER COMPONENT, and it must stay one. Every section is also a Server
 * Component; the only client boundaries on this page are the leaves those
 * sections compose — `Reveal`, `ImageCard`, `Counter`, `ParallaxImage`,
 * `FeaturesPin`, `FaqRows`, `EnquiryForm` — plus `SiteHeader` in the layout.
 *
 * Sections take no props. Each reads its own anchor id, label and copy from
 * `@/lib/content`, so the order of the JSX below is the only thing this file
 * decides. There is no wrapper element and no `className` here on purpose:
 * every section is full-bleed and owns its own frame, so anything this file
 * wrapped them in would become a second, competing coordinate space.
 *
 * NO `<main>` HERE. `layout.tsx` already provides `<main id="main">` around
 * these children, along with the skip link, header and footer.
 *
 * PACING BREAKS. Three points in the scroll get roughly 280px instead of the
 * standard `py-section` / `lg:py-section-lg` rhythm. They are expressed as
 * split padding on the section that OWNS the break — never as a spacer element
 * here, and never as a second utility stacked on a `py-`:
 *
 *   after Hero      `about.tsx`        pt-[11rem] lg:pt-[17.5rem]
 *   after Beliefs B `beliefs-grid.tsx` pb-[11rem] lg:pb-[17.5rem]
 *   before CTA      `cta.tsx`          pt-[11rem] lg:pt-[17.5rem]
 *
 * The hero contributes no rhythm of its own — it is `min-h-svh` with no
 * vertical padding — so About's `pt-` is the whole of the first break. Adding
 * a `pb-` to a neighbour of any of the three would double it.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Buildings />
      <BeliefsVision />
      <BeliefsGrid />
      <Features />
      <Faq />
      <Cta />
    </>
  );
}
