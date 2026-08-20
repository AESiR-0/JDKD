import type { ProjectNavItem } from "@/lib/content";

/**
 * The project detail page's sticky sub-nav.
 *
 * One long page, eight anchors. This is the only navigation that exists inside
 * the document, so it has to stay reachable the whole way down — hence sticky
 * rather than a block that scrolls away with the hero.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY IT IS A DIRECT CHILD OF `<main>` AND FULL-BLEED.
 *
 * `position: sticky` travels only inside its own parent's box. Nested in a
 * gutter-padded wrapper of its own — a wrapper whose height is the bar's height
 * — it would unstick the moment that wrapper left the viewport, which is one
 * scroll tick. So the bar IS the block: the page renders it as a sibling of the
 * sections, its parent is `<main>`, and it therefore stays pinned for the whole
 * document.
 *
 * That makes the bar span the viewport rather than the shell, so the padding
 * moves inward: the SCROLLER carries `px-gutter md:px-gutter-lg` and caps
 * itself at `max-w-shell`, which puts the first link exactly on the same left
 * edge as every `(LABEL)` below it. Nothing negative-margins out of a padded
 * parent, so there is no horizontal overflow at 375px.
 *
 * `top-14` / `md:top-16` are `SiteHeader`'s own two heights — the bar parks
 * directly under the fixed header. Keep them in sync with it.
 *
 * NO `backdrop-blur`. `bg-canvas/95` is a plain alpha, not a filter; the
 * homepage bento and the fixed bar in `SiteHeader` are the only two sanctioned
 * `backdrop-filter`s on this site and neither travels to new components. This
 * bar also parks directly under that one, and two stacked blurs sampling the
 * same scroll is precisely the composite cost the rule exists to avoid.
 *
 * NOT WRAPPED IN `<Reveal>`, ever. The mask keeps `overflow: hidden` after it
 * finishes and would clip the focus ring off every link in here.
 *
 * SERVER COMPONENT. These are plain fragment links; the browser does the
 * scrolling and `globals.css` supplies the smooth behaviour (and drops it under
 * `prefers-reduced-motion`). Highlighting the section in view would need a
 * scroll listener, and a client boundary is not worth a decoration.
 */

export type ProjectNavProps = {
  /** The page's running order. `ProjectSectionId` doubles as the anchor id. */
  readonly items: readonly ProjectNavItem[];
  /** Accessible name for the `<nav>`. @default "On this page" */
  readonly label?: string;
};

/**
 * Scrollbar is hidden on both engines: `scrollbar-width` for Firefox, the
 * pseudo-element for WebKit and Blink. The row still scrolls — it simply has no
 * chrome under a row of 13px labels.
 */
const SCROLLER =
  "mx-auto flex w-full max-w-shell gap-6 overflow-x-auto px-gutter py-4 md:gap-8 md:px-gutter-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const LINK =
  "block shrink-0 whitespace-nowrap text-micro uppercase tracking-label text-muted transition-colors duration-200 ease-editorial hover:text-ink";

export function ProjectNav({ items, label = "On this page" }: ProjectNavProps) {
  return (
    <nav
      aria-label={label}
      className="sticky top-14 z-40 border-y border-line bg-canvas/95 md:top-16"
    >
      {/* `list-none` strips list semantics in Safari; the role puts them back. */}
      <ul role="list" className={SCROLLER}>
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a href={`#${item.id}`} className={LINK}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
