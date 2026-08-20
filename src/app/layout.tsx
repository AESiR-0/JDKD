import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { IMAGES, SITE } from "@/lib/content";

import "./globals.css";

/**
 * Both faces are loaded here, once, in the root layout — so both are preloaded
 * on every route and neither is instantiated twice. Never call a font loader
 * from a section or page component; reach the fonts through the `font-sans` /
 * `font-display` Tailwind utilities instead.
 *
 * Options must be inline object literals: next/font is statically analysed at
 * build time, so computed or spread options fail to compile.
 */
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesque",
  fallback: [
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

/**
 * Cormorant Garamond — the display serif, standing in for the licensed
 * PP Fragment (see `src/fonts/README.md`).
 *
 * A delicate old-style face with very fine hairlines and a light 300 cut, which
 * is what the reference's enormous thin display type actually needs. It is
 * noticeably NARROWER than the faces it replaces, so the fluid heading caps in
 * `features.tsx`, `cta.tsx` and `faq.tsx` — which were sized from measured
 * character widths — are now conservative rather than tight. Nothing clips;
 * those headings simply have room to grow.
 *
 * `globals.css` keeps `font-synthesis-weight: none` on `.font-display`; every
 * weight and the italic requested below is a real cut, so nothing is faked.
 */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  // Weights AND italics are declared explicitly. The italic cut is not
  // optional here: the About heading alternates italic and roman lines, and
  // every parenthetical section label is set in italic serif. Without it the
  // browser would synthesise a slanted roman.
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-display",
  fallback: [
    "Iowan Old Style",
    "Palatino Linotype",
    "Georgia",
    "Times New Roman",
    "serif",
  ],
});

/**
 * Share card. `twitter.card: "summary_large_image"` renders blank without an
 * image, so both graphs point at the real dusk render — its intrinsic size is
 * taken from `IMAGES.heroTower` rather than retyped, so a re-crop cannot leave
 * the dimensions lying.
 */
const SHARE_IMAGE = {
  url: IMAGES.heroTower.src,
  width: IMAGES.heroTower.width,
  height: IMAGES.heroTower.height,
  alt: IMAGES.heroTower.alt,
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default:
      "JDKD Corporate Tower — Grade A commercial leasing, Mathura Road, New Delhi",
    template: "%s | JDKD",
  },
  description:
    "JDKD Corporate Tower is a LEED certified, Grade A commercial office building at A-11 Mohan Cooperative Industrial Estate, Mathura Road, New Delhi. 23,456.16 sq.ft plot, seven office floors, 14 ft 9 in floor heights, two basements. Now available for leasing.",
  applicationName: "JDKD Developers LLP",
  authors: [{ name: "JDKD Developers LLP" }],
  creator: "JDKD Developers LLP",
  publisher: "JDKD Developers LLP",
  keywords: [
    "JDKD Corporate Tower",
    "Grade A office space New Delhi",
    "commercial leasing Mathura Road",
    "Mohan Cooperative Industrial Estate",
    "LEED certified office building Delhi",
    "Sarita Vihar office space",
    "JDKD Developers LLP",
  ],
  category: "Commercial real estate",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "JDKD Developers LLP",
    locale: "en_IN",
    title: "JDKD Corporate Tower — Grade A commercial landmark, New Delhi",
    description:
      "A LEED certified Grade A commercial landmark on Mathura Road. Seven office floors, two basements, 14 ft 9 in floor heights. Now available for leasing.",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "JDKD Corporate Tower — Grade A commercial landmark, New Delhi",
    description:
      "A LEED certified Grade A commercial landmark on Mathura Road. Now available for leasing.",
    images: [SHARE_IMAGE],
  },
  /**
   * Indexing is gated on a confirmed production origin. Until
   * NEXT_PUBLIC_SITE_URL is set, `metadataBase` is the placeholder domain, so
   * an indexable page would advertise a canonical URL that resolves nowhere.
   * Better to stay out of the index than to be indexed wrongly.
   */
  robots: SITE.originConfirmed
    ? { index: true, follow: true }
    : { index: false, follow: false },
  formatDetection: {
    telephone: true,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#121717",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      /*
       * The inline script in <body> adds `reveal-js` to documentElement before
       * React hydrates, so the server's className and the client's differ by
       * exactly that one class and React reports a mismatch. Suppressing is the
       * documented answer for a pre-hydration script that writes to <html> —
       * it scopes to THIS element's own attributes and text, never its
       * children, so a real mismatch anywhere inside the tree still surfaces.
       */
      suppressHydrationWarning
      // Next 16 no longer overrides scroll-behavior on navigation unless this
      // attribute is present. globals.css sets `scroll-behavior: smooth`.
      data-scroll-behavior="smooth"
      // NO `h-full` here. `height: 100%` on <html> pins the element to the
      // viewport while the document scrolls far past it, which gives
      // ScrollTrigger a scroller whose height disagrees with the content and
      // leaves every trigger measuring against the wrong box.
      className={`${geist.variable} ${cormorantGaramond.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-body text-ink">
        {/*
          Opts the document into the reveal's hidden state BEFORE first paint,
          so above-the-fold content never flashes visible then hides. It runs
          only when scripting is available and only when motion is wanted, so
          a no-JS or reduced-motion visitor simply gets the finished page.

          TWO CLASSES, NOT ONE, each with its own last-resort timeout:
          `reveal-js` hides text until a Reveal opens it, `expand-js` holds
          image frames clipped until an ImageCard wipes them open. They were a
          single class, which meant a failure in either mechanism was rescued
          only if TEXT had failed — reveals working while no image ever opened
          left every frame clipped shut, i.e. a page of visible copy and
          invisible photography. Splitting them lets each recover alone.

          If four seconds pass with no sign of life from a mechanism, its
          hiding is dropped so the content simply stands. A blank frame is a
          far worse failure than a missing animation.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){" +
              "var d=document.documentElement;" +
              "d.classList.add('reveal-js');d.classList.add('expand-js');" +
              "setTimeout(function(){" +
              "if(!document.querySelector('[data-reveal-in]'))d.classList.remove('reveal-js');" +
              "if(!document.querySelector('[data-expand-in]'))d.classList.remove('expand-js');" +
              "},4000)}}catch(e){}",
          }}
        />
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-gutter focus-visible:top-gutter focus-visible:z-50 focus-visible:bg-ink focus-visible:px-4 focus-visible:py-3 focus-visible:text-label focus-visible:uppercase focus-visible:tracking-label focus-visible:text-canvas"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
