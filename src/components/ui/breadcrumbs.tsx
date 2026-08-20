import Link from "next/link";

/**
 * Breadcrumbs — the internal routes' one piece of orientation chrome.
 *
 * SERVER COMPONENT. It has no state and no effects; do not add `"use client"`.
 *
 * SEMANTICS, and why they are not negotiable:
 *   - a `<nav>` with an accessible name, so a screen reader can jump to it and
 *     hear what it is rather than "navigation, navigation";
 *   - an `<ol>`, because the order carries the meaning;
 *   - `aria-current="page"` on the last crumb, which is rendered as plain text
 *     rather than as a link to the page you are already on;
 *   - separators are `aria-hidden` and live OUTSIDE the link text, so the
 *     accessible name of each crumb is the crumb, not "Projects slash".
 *
 * NEVER PUT THIS INSIDE A `<Reveal>`. The reveal mask keeps `overflow: hidden`
 * after it finishes and would clip the focus ring off the crumb links. `PageHero`
 * renders the `breadcrumbs` slot outside every mask for exactly this reason.
 *
 * TYPE. `text-micro` uppercase on `tracking-label`, muted — the site's label
 * vocabulary, one step below a section marker so it reads as chrome rather than
 * as content.
 *
 * @example
 * <Breadcrumbs
 *   trail={[
 *     { label: "Home", href: ROUTES.home.path },
 *     { label: "Projects", href: ROUTES.projects.path },
 *     { label: project.name },
 *   ]}
 * />
 */

export type Crumb = {
  readonly label: string;
  /**
   * Internal path. Omit it — or pass null — for the crumb that IS the current
   * page. The last crumb is treated as current whether or not it carries an
   * href, so a trail can be built from a route table without special-casing
   * its tail.
   */
  readonly href?: string | null;
};

export type BreadcrumbsProps = {
  /** Root first, current page last. Two or more entries. */
  readonly trail: readonly Crumb[];
  /** Accessible name for the `<nav>`. @default "Breadcrumb" */
  readonly label?: string;
  /** Extra classes on the `<nav>`. Placement is the page's decision. */
  readonly className?: string;
};

/** Rendered between crumbs. Hidden from assistive technology. */
const SEPARATOR = "/";

export function Breadcrumbs({
  trail,
  label = "Breadcrumb",
  className,
}: BreadcrumbsProps) {
  if (trail.length === 0) return null;

  return (
    <nav aria-label={label} className={className}>
      {/* `list-none` strips list semantics in Safari; the role puts them back.
          `flex-wrap` is what keeps a long trail off the horizontal scrollbar at
          375px — the trail wraps, the page never widens. */}
      <ol
        role="list"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro uppercase tracking-label text-muted"
      >
        {trail.map((crumb, index) => {
          const isCurrent = index === trail.length - 1 || !crumb.href;

          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-x-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted">
                  {SEPARATOR}
                </span>
              ) : null}

              {isCurrent || !crumb.href ? (
                <span aria-current="page" className="text-ink">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="transition-colors duration-200 ease-editorial hover:text-ink"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
