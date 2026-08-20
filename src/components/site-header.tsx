"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BRAND,
  CONTACT,
  NAV_CTA,
  NAV_ITEMS,
  ROUTES,
  SECTIONS,
  SITE,
} from "@/lib/content";

/**
 * SiteHeader — persistent site chrome.
 *
 * CLIENT COMPONENT, and one of only three in the tree. It owns three pieces of
 * runtime state and nothing else: whether the bar has cleared the hero, whether
 * the mobile panel is open, and where focus goes while it is. It renders no
 * section content, so nothing else is dragged across the boundary.
 *
 * THREE AFFORDANCES, per docs/FLOW.md §2:
 *   1. Desktop bar — mark on the left edge, the route links centred, persistent
 *      Enquire pill on the right, over a 1px divider.
 *      ABOUT → /about · PROJECTS → /projects · CONTACT → /contact · the pill →
 *      the enquiry form. Every href is built in `@/lib/content` from
 *      `ROUTES[…].path` (or, for the pill, `SECTIONS.enquire.id`), so a moved
 *      route or a renamed anchor is a compile error rather than a dead link —
 *      never retype one here.
 *   2. Mobile panel — hamburger opens a full-screen sheet beneath the bar.
 *   3. Mobile quick-contact bar — Call / WhatsApp / Enquire, pinned to the
 *      bottom above the safe-area inset. Tap-to-call is the dominant
 *      conversion path in Indian commercial leasing, so it is always visible
 *      below 768px and is the one thing on this page that never scrolls away.
 *
 * REAL ROUTES, NOT FRAGMENTS. The nav used to be four homepage anchors, which
 * is all a one-page site could offer. It is now three routes that exist, so the
 * links behave identically wherever they are clicked from, and the one the
 * visitor is already on is marked `aria-current="page"` — see `isCurrent`.
 * They are `next/link`s so the navigation is client-side and prefetched; the
 * pill and the quick-contact bar stay plain `<a>` only where they target a
 * fragment or a `tel:` / WhatsApp URL.
 *
 * TRANSPARENT OVER THE HERO — HOMEPAGE ONLY. The bar is `fixed`, so on the
 * homepage, which opens with a full-bleed hero, it starts transparent with
 * white type and picks up a solid canvas background once the hero has passed
 * beneath it. That crossing is detected with an IntersectionObserver rather
 * than a scroll listener — passive, nothing per frame, honest about the 60fps
 * mid-range Android target.
 *
 * EVERY OTHER ROUTE IS SOLID FROM THE FIRST PIXEL, and that is not a detail:
 * internal routes open with `PageHero`, whose `<h1>` sits directly beneath the
 * bar rather than under a photograph. A transparent bar there would leave white
 * type over the canvas background — invisible — and the title reading as though
 * it were underneath the header. The initial state is derived from the
 * pathname, which is known during prerender, so the first paint is already
 * correct on both kinds of route and neither flashes. If the homepage somehow
 * renders no hero element, the observer effect falls back to solid.
 *
 * FROSTED, AND THE SECOND `backdrop-filter` ON THIS SITE. The solid state is a
 * translucent plate over a capped blur rather than a flat fill — see
 * `BAR_TREATMENT`. The blur is `md:`-prefixed exactly as the homepage bento's
 * is: below 768px the plate is flat translucent and no filter is composited at
 * all. That is the performance floor, and it is also what keeps the sheet
 * working — a live `backdrop-filter` would make the bar the containing block
 * for the `fixed` sheet inside it, and the sheet would collapse onto the bar's
 * own 56px box. The sheet is a below-768px affordance, so the two never meet.
 * `data-frost` carries the `prefers-reduced-transparency` override in
 * `globals.css`, which drops the translucency and the filter together.
 *
 * RETRACT ON THE WAY DOWN, RETURN ON THE WAY UP. Scrolling down slides the bar
 * off the top edge; any upward travel brings it straight back. Four things pin
 * it open regardless of direction: the top of the document, an open sheet,
 * focus anywhere inside the header, and `prefers-reduced-motion` — under which
 * it never retracts at all, rather than snapping in and out. See `retracted`.
 *
 * The quick-contact bar does NOT retract. It is a sibling of the header, so
 * nothing above touches it, and it stays pinned for the reason it exists: on a
 * phone, tap-to-call is the conversion path and it does not get to scroll away.
 *
 * MOTION. Colour transitions and a single `translate`, both on discrete state
 * changes — nothing is animated per frame, so this still spends none of the
 * page's motion budget. The global reduced-motion block neutralises the
 * transitions, and the retract is additionally gated on the same media query in
 * JS so reduced motion means "stays put", not "teleports".
 *
 * CLEARANCE. The quick-contact bar is fixed, so it would otherwise sit on top
 * of the last few lines of the page. `SiteFooter` reserves the matching strip
 * of space below 768px; the two are a pair, keep them in sync.
 */

/**
 * The one route that opens with a full-bleed hero, so the one route where the
 * bar may start transparent. Every internal route opens with `PageHero`, which
 * has no plate behind the title — those must be solid from the first paint.
 */
const HERO_ROUTE = ROUTES.home.path;

/** Panel id, referenced by the toggle's `aria-controls`. */
const PANEL_ID = "site-nav-panel";

/**
 * Desktop nav link colour, by bar treatment and by whether the link is the
 * route the visitor is already on. Looked up, never assembled: each value is a
 * COMPLETE literal because the Tailwind v4 scanner reads source text and would
 * never generate a class built by interpolation.
 *
 * The current route reads at full strength and the rest sit back. Over the hero
 * the whole set is white, so there the distinction is opacity rather than hue —
 * and `hover:text-ink` is dropped from the current link because it is already
 * ink and a hover that changes nothing is a lie.
 */
const NAV_LINK_TONE = {
  inverted: {
    current: "text-pure focus-visible:outline-pure",
    other: "text-pure/75 hover:text-pure focus-visible:outline-pure",
  },
  solid: {
    current: "text-ink",
    other: "text-muted hover:text-ink",
  },
} as const;

/**
 * The bar's two treatments, looked up rather than assembled — same reason as
 * `NAV_LINK_TONE`: the Tailwind v4 scanner reads source text.
 *
 * `frosted` is the solid state. The unprefixed half is the phone: a flat
 * translucent plate, no filter, which is both the cheap path and the only one
 * compatible with the `fixed` sheet this element contains. The `md:` half adds
 * the frosting — a thinner plate over a blur capped at 10px, which is chrome
 * that lets the page move underneath rather than a glass slab. Written WITH
 * the prefix here and in the prose above so the scanner cannot emit an
 * unprefixed frosting utility, the same discipline `BeliefsGrid` keeps.
 *
 * The 1px divider is unchanged: `border-line` under the plate, transparent
 * over the hero.
 */
const BAR_TREATMENT = {
  inverted: "border-transparent bg-transparent",
  frosted: "border-line bg-canvas/90 md:bg-canvas/75 md:backdrop-blur-[10px]",
} as const;

/**
 * Scroll travel, in px, that has to accumulate in ONE direction before the bar
 * changes state. A fling's momentum and a trackpad both emit a few pixels of
 * counter-travel, and a bar that toggled on those would flicker. Travel under
 * this is ignored AND leaves the baseline where it was, so a slow deliberate
 * drag still adds up to a change rather than being swallowed frame by frame.
 */
const SCROLL_STEP = 8;

/**
 * Above this offset the bar is pinned open whatever the direction of travel.
 * Comfortably clears both bar heights (h-14 / md:h-16), so the visitor can
 * never be at the top of a document with the chrome retracted.
 */
const TOP_ZONE = 96;

/** Tabbable descendants, for the panel's focus trap. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Interface labels. These are chrome microcopy — they assert no fact about the
 * asset, the entity or the address, so they do not belong in `@/lib/content`.
 * Everything that IS a fact (labels, hrefs, the phone number, the mark) is read
 * from content.
 */
const UI = {
  homeLink: `${SITE.name} — home`,
  primaryNav: "Primary",
  panelNav: "Menu",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  quickContact: "Quick contact",
  call: `Call ${CONTACT.leasingContact.name}`,
  whatsapp: "WhatsApp",
  newTab: "opens in a new tab",
} as const;

/**
 * `useGSAP` uses the same guard internally. A layout effect lets the observer
 * correct the bar before the browser paints; on the server there is no layout
 * to read, so it degrades to `useEffect` and the SSR default stands.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Is `href` the route the visitor is on?
 *
 * A nav href is a bare path — that is enforced by the comment on `NAV_ITEMS`
 * and it is what makes this comparison possible at all.
 *
 * The `startsWith` arm is what marks PROJECTS while the visitor is on
 * `/projects/jdkd-corporate-tower`: the trailing slash is required, or
 * `/projects` would also claim a hypothetical `/projects-archive`. `/` is
 * excluded because every path starts with it, and the mark is not in the nav
 * anyway — there is no HOME item to light up.
 */
function isCurrent(pathname: string, href: string): boolean {
  if (href === ROUTES.home.path) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const opensOnHero = pathname === HERO_ROUTE;

  /**
   * The Enquire pill's target. On the homepage it is the panel further down
   * the same document; anywhere else it is `/contact`'s own form, because
   * `/#enquire` from an internal route would navigate the visitor AWAY from
   * what they were reading and back to the homepage.
   */
  const enquireHref = opensOnHero ? NAV_CTA.href : NAV_CTA.awayHref;

  const [solid, setSolid] = useState(!opensOnHero);
  const [open, setOpen] = useState(false);
  /**
   * Slid off the top edge by the scroll direction. Always starts false: the
   * first paint of any route is the top of a document, and this must never be
   * the reason a visitor cannot find the nav.
   */
  const [retracted, setRetracted] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  /* --- Transparent over the hero, solid once past it ---------------------- */

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    // Gated on the route, not just on finding the element: an internal page is
    // free to use "hero" as an id for something of its own, and a stray match
    // must never be able to make the bar transparent over `PageHero`.
    const hero = opensOnHero
      ? document.getElementById(SECTIONS.hero.id)
      : null;

    // Not the homepage, no hero to watch, or no observer to watch it with —
    // either way the bar is solid from the first pixel. Never leave it
    // transparent by default: white type on the canvas background would be
    // unreadable.
    if (!header || !hero || !("IntersectionObserver" in window)) {
      setSolid(true);
      return;
    }

    // Shrinking the observer root by the bar's own height makes the callback
    // fire exactly when the hero's lower edge passes under the bar.
    const observer = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      {
        rootMargin: `-${Math.round(header.offsetHeight)}px 0px 0px 0px`,
        threshold: 0,
      },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [opensOnHero, pathname]);

  /* --- Mobile panel: scroll lock, Escape, focus trap, focus restore ------- */

  useEffect(() => {
    if (!open) return;

    const root = headerRef.current;
    if (!root) return;

    // Captured now so the cleanup does not read a ref that may have moved on.
    // The toggle never unmounts, so this is the same node either way.
    const toggle = toggleRef.current;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    // Move focus into the sheet so the next Tab lands on a menu item.
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      // The trap spans the whole header element, because the toggle that
      // closes the sheet lives in the bar rather than inside the sheet.
      const stops = Array.from(
        root!.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null);
      if (stops.length === 0) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !root!.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !root!.contains(active))
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      toggle?.focus();
    };
  }, [open]);

  /**
   * The sheet is a below-768px affordance, and the toggle that opens it is
   * `md:hidden` — so it can only ever be opened on a narrow viewport. The one
   * way to end up with an open sheet on a wide one is a resize, so this
   * subscribes to that crossing and nothing else. Without it the sheet would
   * vanish behind the media query while its scroll lock and focus trap stayed
   * armed.
   */
  useEffect(() => {
    if (!open) return;

    const query = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [open, close]);

  /* --- Retract on scroll down, return on scroll up ------------------------ */

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Every re-entry starts from a visible bar: the sheet has just opened or
    // closed, or a client-side navigation has moved the document to the top.
    // `pathname` is in the deps for that second case and nothing else.
    setRetracted(false);

    // NEVER while the sheet is open. The toggle that closes it lives in the
    // bar, so retracting it would strip the only way out of the sheet — and
    // the sheet is `fixed` to `top-14`, which assumes the bar is still there.
    if (open) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let baseline = window.scrollY;
    let latest = baseline;
    let frame = 0;

    /**
     * Runs at most once a frame, and reads NOTHING from the DOM that could
     * force a layout — `latest` was captured by the listener and
     * `document.activeElement` is a pointer, not a measurement.
     */
    function settle() {
      frame = 0;
      const y = latest;

      // Pinned open: the top of the document, reduced motion (which means the
      // bar simply never hides, not that it hides without a transition), or
      // focus somewhere inside the header — a keyboard visitor must not have
      // the nav slide out from under them mid-tab.
      if (
        y <= TOP_ZONE ||
        reducedMotion.matches ||
        header!.contains(document.activeElement)
      ) {
        baseline = y;
        setRetracted(false);
        return;
      }

      const travel = y - baseline;
      // Under the threshold: leave the baseline alone so the next event
      // measures from the same point and slow travel still accumulates.
      if (Math.abs(travel) < SCROLL_STEP) return;

      baseline = y;
      setRetracted(travel > 0);
    }

    function handleScroll() {
      latest = window.scrollY;
      if (frame) return;
      frame = requestAnimationFrame(settle);
    }

    /**
     * A retracted bar keeps its links in the tab order — it is off-screen, not
     * hidden — so focus arriving from the page below has to bring it back or
     * the focus ring lands somewhere the visitor cannot see. `focusin` bubbles,
     * so one listener on the header covers every control in it.
     */
    function handleFocusIn() {
      setRetracted(false);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    header.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.removeEventListener("focusin", handleFocusIn);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [open, pathname]);

  const inverted = !solid && !open;

  return (
    <>
      <header
        ref={headerRef}
        // Only while the plate is actually up. Over the hero there is no
        // translucent surface to reduce, and `prefers-reduced-transparency`
        // must not repaint a deliberately transparent bar as a solid one.
        data-frost={inverted ? undefined : ""}
        className={cx(
          // The `translate` in the transition list is the retract. It is an
          // explicit list rather than `transition-all`: this element sits over
          // every page and nothing else on it is allowed to animate.
          "fixed inset-x-0 top-0 z-50 border-b transition-[color,background-color,border-color,translate] duration-300 ease-editorial",
          inverted ? BAR_TREATMENT.inverted : BAR_TREATMENT.frosted,
          // Applied ONLY while retracted — never a `translate-y-0` counterpart.
          // Any non-`none` translate makes this element the containing block
          // for the `fixed` sheet inside it, which would collapse the sheet
          // onto the bar's own box; the resting state therefore carries no
          // transform at all. Retracted, the sheet is `hidden`, so the two
          // cannot overlap. `none` → `0 -100%` interpolates as identity, so the
          // return still transitions.
          retracted && "-translate-y-full",
        )}
      >
        {/* Logo left, nav centre, action right. The nav takes `flex-1` rather
            than an absolute centre: the mark and the pill measure within a few
            pixels of one another, so the remaining space is centred on the bar
            to the eye, and — unlike a translated absolute child — the nav can
            never ride over either of them at the 768px floor. */}
        <div className="mx-auto flex h-14 w-full max-w-shell items-center justify-between gap-4 px-gutter md:h-16 md:gap-6 md:px-gutter-lg lg:gap-8">
          <Link
            href="/"
            aria-label={UI.homeLink}
            // The bar stays visible above the open sheet, so this is the one
            // control that could change route while the sheet is armed. Closing
            // here keeps the scroll lock and focus trap from outliving it.
            onClick={close}
            className="shrink-0 focus-visible:outline-offset-4"
          >
            <Image
              src={BRAND.mark.src}
              alt={BRAND.mark.alt}
              width={BRAND.mark.width}
              height={BRAND.mark.height}
              // Deliberately left at the default `loading="lazy"`. Next 16
              // emits a <link rel="preload" as="image"> for `loading="eager"`
              // as well as for `preload`, and that link lands in the head ahead
              // of the hero's — two image preloads competing, with the LCP
              // element losing. Verified in the served HTML. The mark is in the
              // initial viewport, so the lazy threshold is already satisfied
              // and the browser fetches it on the first pass anyway; it is 15KB
              // against the hero's 148KB. The hero keeps the only preload.
              className="h-6 w-auto md:h-7"
            />
          </Link>

          <nav
            aria-label={UI.primaryNav}
            className="hidden md:flex md:min-w-0 md:flex-1 md:justify-center"
          >
            <ul className="flex items-center gap-6 lg:gap-8">
              {NAV_ITEMS.map((item) => {
                const current = isCurrent(pathname, item.href);

                if (item.id === "projects") {
                  return (
                    <li key={item.id} className="relative group">
                      <Link
                        href={item.href}
                        // `page`, never `true`: these are pages. The attribute
                        // is what a screen reader announces; the colour below is
                        // the sighted half of the same statement, and neither is
                        // allowed to carry it alone.
                        aria-current={current ? "page" : undefined}
                        className={cx(
                          "inline-flex items-center gap-1.5 whitespace-nowrap text-label uppercase tracking-label transition-colors duration-200 ease-editorial",
                          NAV_LINK_TONE[inverted ? "inverted" : "solid"][
                            current ? "current" : "other"
                          ],
                        )}
                      >
                        <span>{item.label}</span>
                        <svg
                          className="size-3 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path d="M2.5 4.5L6 8L9.5 4.5" />
                        </svg>
                      </Link>

                      <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-[opacity,transform] duration-200 ease-editorial group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 -translate-y-1 z-50 min-w-[260px]">
                        <div className="rounded-card border border-line bg-surface/95 p-2 backdrop-blur-[16px] shadow-2xl">
                          <Link
                            href="/projects"
                            className="flex flex-col rounded-sm px-3 py-2.5 transition-colors duration-150 hover:bg-ink/5 focus-visible:bg-ink/5"
                          >
                            <span className="text-micro uppercase tracking-label font-sans font-medium text-ink">
                              All Projects
                            </span>
                            <span className="text-caption text-muted">
                              Portfolio overview & pipeline
                            </span>
                          </Link>
                          <div className="my-1 border-t border-line" />
                          <Link
                            href="/projects/jdkd-corporate-tower"
                            className="flex flex-col rounded-sm px-3 py-2.5 transition-colors duration-150 hover:bg-ink/5 focus-visible:bg-ink/5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-micro uppercase tracking-label font-sans font-medium text-ink">
                                JDKD Corporate Tower
                              </span>
                              <span className="rounded bg-pure/10 px-1.5 py-0.5 font-sans text-[10px] uppercase tracking-wider text-pure">
                                Leasing
                              </span>
                            </div>
                            <span className="text-caption text-muted">
                              Mohan Cooperative, New Delhi
                            </span>
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      // `page`, never `true`: these are pages. The attribute
                      // is what a screen reader announces; the colour below is
                      // the sighted half of the same statement, and neither is
                      // allowed to carry it alone.
                      aria-current={current ? "page" : undefined}
                      className={cx(
                        "whitespace-nowrap text-label uppercase tracking-label transition-colors duration-200 ease-editorial",
                        NAV_LINK_TONE[inverted ? "inverted" : "solid"][
                          current ? "current" : "other"
                        ],
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            {/* The persistent action. Visible at every breakpoint. A `Link`
                rather than an `<a>`: on the homepage `/#enquire` is a
                same-document scroll either way, and from an internal route
                this makes the hop to `/contact#enquire` a client-side
                navigation with the destination prefetched. */}
            <Link
              href={enquireHref}
              className={cx(
                "inline-flex items-center rounded-chip border px-4 py-2 text-micro uppercase tracking-micro transition-colors duration-200 ease-editorial md:px-5 md:py-2.5",
                inverted
                  ? "border-line-strong text-pure hover:border-pure hover:bg-pure hover:text-canvas focus-visible:outline-pure"
                  : "border-ink bg-ink text-canvas hover:border-pure hover:bg-pure",
              )}
            >
              {NAV_CTA.label}
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              aria-expanded={open}
              aria-controls={PANEL_ID}
              className={cx(
                "-mr-2 flex size-10 cursor-pointer flex-col items-center justify-center gap-[5px] transition-colors duration-200 ease-editorial md:hidden",
                inverted ? "text-pure focus-visible:outline-pure" : "text-ink",
              )}
            >
              <span className="sr-only">
                {open ? UI.closeMenu : UI.openMenu}
              </span>
              {/* Two rules, not three — the deck's hairline vocabulary. They
                  cross into an X when the sheet is open. Transform only. */}
              <span
                aria-hidden="true"
                className={cx(
                  "block h-px w-5 bg-current transition-transform duration-300 ease-editorial",
                  open && "translate-y-[3px] rotate-45",
                )}
              />
              <span
                aria-hidden="true"
                className={cx(
                  "block h-px w-5 bg-current transition-transform duration-300 ease-editorial",
                  open && "-translate-y-[3px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>

        {/* Full-screen sheet. Always in the DOM so `aria-controls` always
            resolves; `hidden` takes it out of the tab order and the a11y tree
            while closed. */}
        <div
          id={PANEL_ID}
          ref={panelRef}
          hidden={!open}
          className="fixed inset-x-0 bottom-0 top-14 overflow-y-auto overscroll-contain bg-canvas px-gutter pb-12 pt-8 md:hidden"
        >
          <nav aria-label={UI.panelNav}>
            <ul className="flex flex-col border-t border-line">
              {NAV_ITEMS.map((item) => {
                const current = isCurrent(pathname, item.href);

                if (item.id === "projects") {
                  return (
                    <li key={item.id} className="border-b border-line">
                      <div className="flex items-center justify-between py-5 text-h3">
                        <Link
                          href={item.href}
                          aria-current={current ? "page" : undefined}
                          onClick={close}
                          className={current ? "text-pure" : "text-ink"}
                        >
                          {item.label}
                        </Link>
                        <span
                          aria-hidden="true"
                          className={cx(
                            "block h-hair bg-red",
                            current ? "w-rule" : "w-rule-sm",
                          )}
                        />
                      </div>
                      <div className="mb-4 flex flex-col gap-2 border-l border-line pl-4">
                        <Link
                          href="/projects"
                          onClick={close}
                          className="block py-1 text-label uppercase tracking-label text-muted hover:text-ink"
                        >
                          All Projects
                        </Link>
                        <Link
                          href="/projects/jdkd-corporate-tower"
                          onClick={close}
                          className="flex items-center justify-between py-1 text-label uppercase tracking-label text-ink hover:text-pure"
                        >
                          <span>JDKD Corporate Tower</span>
                          <span className="font-sans text-micro text-muted">
                            (Now Leasing)
                          </span>
                        </Link>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.id} className="border-b border-line">
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onClick={close}
                      className={cx(
                        "flex items-center justify-between py-5 text-h3",
                        // The sheet has no hover, so the current row is
                        // distinguished by weight of colour alone.
                        current ? "text-pure" : "text-ink",
                      )}
                    >
                      <span>{item.label}</span>
                      {/* The red hairline is the row's own marker at rest and
                          grows on the current row — the one place red widens,
                          and still a hairline, never a fill. */}
                      <span
                        aria-hidden="true"
                        className={cx(
                          "block h-hair bg-red",
                          current ? "w-rule" : "w-rule-sm",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href={enquireHref}
            onClick={close}
            className="mt-10 flex w-full items-center justify-center rounded-card border border-ink bg-ink px-7 py-4 text-label uppercase tracking-micro text-canvas"
          >
            {NAV_CTA.label}
          </Link>

          <div className="mt-10 border-t border-line pt-6">
            <p className="text-micro uppercase tracking-label text-muted">
              {CONTACT.leasingContact.role}
            </p>
            <p className="mt-3 text-body text-ink">
              {CONTACT.leasingContact.name}
            </p>
            <a
              href={CONTACT.leasingContact.phoneHref}
              className="mt-1 inline-block text-h3 text-ink underline decoration-red decoration-2 underline-offset-4"
            >
              {CONTACT.leasingContact.phoneDisplay}
            </a>
            <div className="mt-6 flex flex-col gap-1">
              {CONTACT.address.lines.map((line) => (
                <p key={line} className="text-small text-muted">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile quick-contact bar. `design-system/actions-forms.html`: three
          equal cells, 1px rules showing through the gaps, ink for the primary
          action, below 768px only, above the safe-area inset. */}
      <nav
        aria-label={UI.quickContact}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-line pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-3 gap-px">
          <li>
            <a
              href={CONTACT.leasingContact.phoneHref}
              className="flex h-full items-center justify-center bg-ink px-2 py-4 text-center text-micro uppercase tracking-micro text-canvas focus-visible:-outline-offset-2"
            >
              {UI.call}
            </a>
          </li>
          <li>
            <a
              href={CONTACT.leasingContact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full items-center justify-center border-l border-line bg-surface px-2 py-4 text-center text-micro uppercase tracking-micro text-ink focus-visible:-outline-offset-2"
            >
              {UI.whatsapp}
              <span className="sr-only"> ({UI.newTab})</span>
            </a>
          </li>
          <li>
            <Link
              href={enquireHref}
              className="flex h-full items-center justify-center border-l border-line bg-surface px-2 py-4 text-center text-micro uppercase tracking-micro text-ink focus-visible:-outline-offset-2"
            >
              {NAV_CTA.label}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
