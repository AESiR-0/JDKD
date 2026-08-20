"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { ASSET, CONTACT, CTA, ENQUIRY_FIELDS } from "@/lib/content";

/**
 * EnquiryForm — the walkthrough request, section 08's primary conversion.
 *
 * Client leaf. It owns nothing but its own field state, so the section that
 * renders it stays a Server Component. Do not lift this boundary upward.
 *
 * NOT WIRED. There is no endpoint yet, so submit is intercepted, nothing leaves
 * the browser, and the form says so in a live region and hands the visitor
 * Mr. Roy's number instead. When a backend exists, replace `handleSubmit` — the
 * markup, labels and states do not need to change.
 *
 * FIELD STYLING follows `design-system/actions-forms.html`: underline-only
 * inputs, no boxes; the underline moves to #C61D24 on focus and to
 * `--line-strong` once a field holds a value. The global `:focus-visible` ring
 * is deliberately left intact on top of that — the coloured underline is a
 * decoration, not an accessible focus indicator.
 *
 * NO MOTION. Reveal masks keep `overflow: hidden` after they finish, which would
 * clip the focus ring on anything focusable inside them, so interactive blocks
 * are never wrapped in one.
 */

type SubmitStatus = "idle" | "unavailable";

export type EnquiryFormProps = {
  /** Id of the heading that names this form — normally the section's `<h2>`. */
  labelledBy: string;
  className?: string;
};

// `placeholder:text-muted` (5.4:1 on white), not an alpha-reduced variant —
// the phone field's placeholder carries the only format hint in the form, so it
// has to clear WCAG AA. `text-muted/60` computed to ~2.4:1.
const FIELD_BASE =
  "w-full border-b bg-transparent py-3 text-body text-ink placeholder:text-muted focus:border-red";

function emptyValues(): Record<string, string> {
  return Object.fromEntries(ENQUIRY_FIELDS.map((field) => [field.id, ""]));
}

export function EnquiryForm({ labelledBy, className }: EnquiryFormProps) {
  const uid = useId();
  const [values, setValues] = useState<Record<string, string>>(emptyValues);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const consentId = `${uid}-consent`;
  const fieldId = (id: string) => `${uid}-${id}`;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // No endpoint yet. Never let the browser navigate away with the payload.
    event.preventDefault();
    setStatus("unavailable");
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby={labelledBy}
      aria-describedby={consentId}
      className={`w-full max-w-[460px] rounded-card border border-line bg-surface p-6 sm:p-7 ${className ?? ""}`}
    >
      <div className="flex flex-col gap-5">
        {ENQUIRY_FIELDS.map((field) => {
          const id = fieldId(field.id);
          const filled = values[field.id].trim().length > 0;
          const underline = filled ? "border-line-strong" : "border-line";

          return (
            <div key={field.id}>
              <label
                htmlFor={id}
                className="block text-micro uppercase tracking-label text-muted"
              >
                {field.label}
                {/* Which fields are optional is meaningful information, not
                    decoration — so it carries full `text-muted` (5.4:1) rather
                    than an alpha-reduced tint that computed to ~2.9:1. */}
                {!field.required ? (
                  <span className="text-muted"> (optional)</span>
                ) : null}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.id}
                  rows={3}
                  required={field.required}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={values[field.id]}
                  onChange={handleChange}
                  className={`${FIELD_BASE} ${underline} mt-2 resize-y`}
                />
              ) : (
                <input
                  id={id}
                  name={field.id}
                  type={field.type}
                  required={field.required}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={values[field.id]}
                  onChange={handleChange}
                  className={`${FIELD_BASE} ${underline} mt-2`}
                />
              )}
            </div>
          );
        })}
      </div>

      <p id={consentId} className="mt-6 text-caption text-muted">
        By submitting, you agree to be contacted about {ASSET.name}. We do not
        share your details with third parties.
      </p>

      <button
        type="submit"
        className="mt-6 w-full cursor-pointer rounded-card border border-ink bg-ink px-7 py-3.5 text-label uppercase tracking-micro text-canvas transition-colors duration-200 ease-editorial hover:border-pure hover:bg-pure"
      >
        {CTA.submitLabel}
      </button>

      {/* Live region is always mounted so the message is announced when it
          appears. It collapses to nothing while the form is untouched. */}
      <div role="status" aria-live="polite">
        {status === "unavailable" ? (
          <p className="mt-6 border-t border-line pt-4 text-caption text-muted">
            Online enquiries are not connected yet, so nothing was sent. Call{" "}
            {CONTACT.leasingContact.name} on{" "}
            <a
              href={CONTACT.leasingContact.phoneHref}
              className="text-ink underline decoration-red decoration-2 underline-offset-4"
            >
              {CONTACT.leasingContact.phoneDisplay}
            </a>{" "}
            to book a time.
          </p>
        ) : null}
      </div>
    </form>
  );
}
