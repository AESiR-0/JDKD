import { About } from "@/components/sections/about";
import { BeliefsGrid } from "@/components/sections/beliefs-grid";
import { BeliefsVision } from "@/components/sections/beliefs-vision";
import { Buildings } from "@/components/sections/buildings";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";

/**
 * Homepage - the nine-section running order.
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
 * sections compose - `Reveal`, `ImageCard`, `Counter`, `ParallaxImage`,
 * `FeaturesPin`, `FaqRows`, `EnquiryForm` - plus `SiteHeader` in the layout.
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
 * VERTICAL RHYTHM. ONE OWNER PER GAP: every section pays its gap ONCE, on its
 * TOP, and no section anywhere carries bottom padding. The tokens live in
 * `globals.css` - `beat` (112/192px) is the standard gap, `break` (168/288px)
 * the pacing break, `band` (56/96px) the label-to-content step inside one.
 *
 *   standard        `pt-beat lg:pt-beat-lg`   every section not listed below
 *   after Beliefs B `features.tsx`            pt-break lg:pt-break-lg
 *   before CTA      `cta.tsx`                 pt-break lg:pt-break-lg
 *
 * The Hero→About seam is NOT a break: the hero's wordmark is pinned at
 * `lg:bottom-[14%]`, so ~126px of empty photograph already sits below the last
 * glyph, and About pays a plain beat on top of that. A section that opens on a
 * full-bleed art layer insets that layer from the top by the same token it
 * pays (`cta.tsx`, `beliefs-grid.tsx`), so a break paints on canvas, never
 * behind a photograph. Adding a `pb-` anywhere doubles the seam below it.
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
