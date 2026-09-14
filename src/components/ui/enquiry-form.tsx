"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { ASSET, CONTACT, CTA, ENQUIRY_FIELDS } from "@/lib/content";
import {
  HONEYPOT_FIELD,
  submitEnquiry,
  type EnquiryError,
} from "@/lib/enquiry";

/**
 * EnquiryForm - the walkthrough request, section 08's primary conversion.
 *
 * Client leaf. It owns nothing but its own field state, so the section that
 * renders it stays a Server Component. Do not lift this boundary upward.
 *
 * WIRED to `/api/enquiry` (see `@/lib/enquiry`), which forwards to the Google
 * Apps Script web app. Success is only ever reported after the route confirms
 * the row was written; any failure hands the visitor Mr. Roy's number.
 *
 * FIELD STYLING follows `design-system/actions-forms.html`: underline-only
 * inputs, no boxes; the underline brightens on focus and moves to
 * `--line-strong` once a field holds a value. The global `:focus-visible` ring
 * is deliberately left intact on top of that - the coloured underline is a
 * decoration, not an accessible focus indicator.
 *
 * THE FOCUS UNDERLINE IS WHITE, NOT RED: this form only ships on
 * `--color-pine`, where #C61D24 measures 1.82:1 and `--color-pure` 10.6:1.
 *
 * NO MOTION. Reveal masks keep `overflow: hidden` after they finish, which would
 * clip the focus ring on anything focusable inside them, so interactive blocks
 * are never wrapped in one.
 */

type SubmitStatus = "idle" | "sending" | "sent" | EnquiryError;

export type EnquiryFormProps = {
  /** Id of the heading that names this form - normally the section's `<h2>`. */
  labelledBy: string;
  /**
   * Id of an explanatory paragraph above the fields, announced with the form
   * so someone jumping between form controls does not skip past it.
   */
  describedBy?: string;
  className?: string;
};

// `placeholder:text-muted` (5.4:1 on white), not an alpha-reduced variant -
// the phone field's placeholder carries the only format hint in the form, so it
// has to clear WCAG AA. `border-color` is named rather than `transition-colors`,
// which would also animate `color` and `background-color`. 150ms matches
// `[data-press]`: a field is touched as often as a button.
const FIELD_BASE =
  "w-full border-b bg-transparent py-3 text-body text-ink transition-[border-color] duration-150 ease-editorial placeholder:text-muted focus:border-pure";

function emptyValues(): Record<string, string> {
  return Object.fromEntries(ENQUIRY_FIELDS.map((field) => [field.id, ""]));
}

export function EnquiryForm({
  labelledBy,
  describedBy,
  className,
}: EnquiryFormProps) {
  const uid = useId();
  const [values, setValues] = useState<Record<string, string>>(emptyValues);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const honeypotRef = useRef<HTMLInputElement | null>(null);
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const consentId = `${uid}-consent`;
  const fieldId = (id: string) => `${uid}-${id}`;
  const sending = status === "sending";

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setStatus("sending");

    // Known fields map to their own sheet columns; anything added to
    // ENQUIRY_FIELDS later lands in "Details" without code changes here.
    const { name, organisation, email, phone, requirement, message, ...rest } =
      values;
    const result = await submitEnquiry({
      form: "walkthrough",
      name: name ?? "",
      email,
      phone,
      company: organisation,
      // The walkthrough form's free-text field is `requirement`.
      message: requirement ?? message,
      details: rest,
      website: honeypotRef.current?.value ?? "",
      elapsedMs: Date.now() - openedAt.current,
      page: window.location.pathname,
    });

    if (result.ok) {
      setValues(emptyValues());
      setStatus("sent");
    } else {
      setStatus(result.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy ? `${describedBy} ${consentId}` : consentId}
      aria-busy={sending}
      className={`w-full max-w-[460px] rounded-card border border-line bg-surface p-6 sm:p-7 ${className ?? ""}`}
    >
      {/* Spam trap: invisible, unfocusable and hidden from assistive tech. A
          person never fills it; a bot filling every input does. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Website
          <input
            ref={honeypotRef}
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

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

      <button data-press
        type="submit"
        disabled={sending}
        className="mt-6 w-full cursor-pointer rounded-card border border-ink bg-ink px-7 py-3.5 text-label uppercase tracking-micro text-canvas transition-colors duration-200 ease-editorial hover:border-pure hover:bg-pure disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? "Sending…" : CTA.submitLabel}
      </button>

      {/* Always mounted so the result is announced when it appears. Set at the
          weight of what it says (`text-small text-ink`) over a red hairline -
          a 1px rule, never a fill. */}
      <div role="status" aria-live="polite">
        {status === "sent" ? (
          <p className="mt-6 border-t border-red pt-4 text-small text-ink">
            Thank you - your enquiry has reached the leasing desk.{" "}
            {CONTACT.leasingContact.name} will be in touch shortly.
          </p>
        ) : status === "invalid" ? (
          <p className="mt-6 border-t border-red pt-4 text-small text-ink">
            Please check your name, email and phone number, then try again.
          </p>
        ) : status === "not_configured" ||
          status === "upstream" ||
          status === "network" ? (
          <p className="mt-6 border-t border-red pt-4 text-small text-ink">
            Your enquiry could not be sent just now. Please call{" "}
            {CONTACT.leasingContact.name} on{" "}
            <a data-press="row"
              href={CONTACT.leasingContact.phoneHref}
              className="text-ink underline decoration-red decoration-2 underline-offset-4"
            >
              {CONTACT.leasingContact.phoneDisplay}
            </a>{" "}
            to book a walkthrough.
          </p>
        ) : null}
      </div>
    </form>
  );
}
