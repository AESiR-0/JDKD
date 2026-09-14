"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { CONTACT } from "@/lib/content";
import {
  HONEYPOT_FIELD,
  submitEnquiry,
  type EnquiryError,
} from "@/lib/enquiry";

type SubmitStatus = "idle" | "sending" | EnquiryError;

const EMPTY = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

export function ReferenceForm() {
  const [formData, setFormData] = useState(EMPTY);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [copiedPhone, setCopiedPhone] = useState(false);
  const honeypotRef = useRef<HTMLInputElement | null>(null);
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const sending = status === "sending";

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setStatus("sending");

    const result = await submitEnquiry({
      form: "contact",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      message: formData.message,
      website: honeypotRef.current?.value ?? "",
      elapsedMs: Date.now() - openedAt.current,
      page: window.location.pathname,
    });

    if (result.ok) {
      setSubmittedName(formData.name);
      setFormData(EMPTY);
      setStatus("idle");
    } else {
      setStatus(result.error);
    }
  }

  function handleCopyPhone() {
    navigator.clipboard.writeText(CONTACT.leasingContact.phoneDisplay);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2400);
  }

  const whatsAppUrl = `https://wa.me/919811998811?text=${encodeURIComponent(
    `*ENQUIRY - JDKD CORPORATE TOWER*\nName: ${formData.name || submittedName || "Executive"}\nCompany: ${
      formData.company || "Not specified"
    }\nPhone: ${formData.phone || "Not specified"}\nEmail: ${
      formData.email || "Not specified"
    }\nMessage: ${formData.message || "General leasing enquiry"}`,
  )}`;

  return (
    <div className="w-full">
      {submittedName !== null ? (
        <div
          role="status"
          className="border border-line/60 bg-surface/40 p-8 sm:p-10 text-ink"
        >
          <div className="flex items-center gap-2.5 text-micro uppercase tracking-label text-[#C9AD7F]">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Enquiry Received</span>
          </div>

          <h3 className="mt-4 font-display text-h3 uppercase text-ink">
            Thank you, {submittedName || "Executive"}.
          </h3>
          <p className="mt-3 text-small text-muted leading-relaxed max-w-[46ch]">
            Your enquiry has reached the JDKD leasing desk.{" "}
            {CONTACT.leasingContact.name}&apos;s team will be in touch shortly
            with availability and a time to walk the building.
          </p>

          <div className="mt-6 border-t border-line/40 pt-5 flex flex-wrap items-center gap-4">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer noopener"
              data-press
              className="inline-flex items-center gap-2 border border-line bg-ink px-5 py-2.5 text-label uppercase tracking-label text-canvas transition-colors hover:border-pure hover:bg-pure"
            >
              <span>Follow up on WhatsApp ↗</span>
            </a>

            <button
              type="button"
              onClick={() => setSubmittedName(null)}
              data-press
              className="cursor-pointer border border-line/50 px-5 py-2.5 text-label uppercase tracking-label text-muted transition-colors hover:border-line hover:text-ink"
            >
              Send Another Note
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          aria-busy={sending}
          className="space-y-6 lg:space-y-8"
        >
          {/* Spam trap: invisible, unfocusable, hidden from assistive tech. */}
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

          {/* Row 1: Full name* | Company name */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            <div>
              <label
                htmlFor="ref-name"
                className="block text-micro uppercase tracking-label text-muted"
              >
                Full name*
              </label>
              <input
                id="ref-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors duration-150 focus:border-pure focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="ref-company"
                className="block text-micro uppercase tracking-label text-muted"
              >
                Company name
              </label>
              <input
                id="ref-company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className="mt-1 w-full border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors duration-150 focus:border-pure focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Email address* | Phone number* */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            <div>
              <label
                htmlFor="ref-email"
                className="block text-micro uppercase tracking-label text-muted"
              >
                Email address*
              </label>
              <input
                id="ref-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors duration-150 focus:border-pure focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="ref-phone"
                className="block text-micro uppercase tracking-label text-muted"
              >
                Phone number*
              </label>
              <input
                id="ref-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors duration-150 focus:border-pure focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: How can we help?* */}
          <div>
            <label
              htmlFor="ref-message"
              className="block text-micro uppercase tracking-label text-muted"
            >
              How can we help?*
            </label>
            <textarea
              id="ref-message"
              name="message"
              rows={3}
              required
              value={formData.message}
              onChange={handleChange}
              className="mt-1 w-full resize-y border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors duration-150 focus:border-pure focus:outline-none"
            />
          </div>

          {/* Submit Button & WhatsApp Alternative */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
            <button
              type="submit"
              disabled={sending}
              data-press
              className="group inline-flex cursor-pointer items-center gap-4 text-left disabled:cursor-wait disabled:opacity-70"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-[border-color,background-color,color] duration-300 ease-editorial group-hover:border-pure group-hover:bg-ink group-hover:text-canvas">
                <span className="text-body font-light transition-transform duration-300 ease-editorial group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
              <span className="font-display text-small uppercase tracking-label text-ink transition-colors duration-200 group-hover:text-pure">
                {sending ? "Sending…" : "Submit enquiry"}
              </span>
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer noopener"
              data-press
              className="text-micro uppercase tracking-label text-muted hover:text-ink transition-colors"
            >
              Or compose on WhatsApp &rarr;
            </a>
          </div>

          <div role="status" aria-live="polite">
            {status === "invalid" ? (
              <p className="border-t border-red pt-4 text-small text-ink">
                Please check your name, email and phone number, then try again.
              </p>
            ) : status === "not_configured" ||
              status === "upstream" ||
              status === "network" ? (
              <p className="border-t border-red pt-4 text-small text-ink">
                Your enquiry could not be sent just now. Please call{" "}
                {CONTACT.leasingContact.name} on{" "}
                <a
                  data-press="row"
                  href={CONTACT.leasingContact.phoneHref}
                  className="text-ink underline decoration-red decoration-2 underline-offset-4"
                >
                  {CONTACT.leasingContact.phoneDisplay}
                </a>{" "}
                or use WhatsApp.
              </p>
            ) : null}
          </div>
        </form>
      )}

      {/* Direct Reach Bar below form (exact match to reference) */}
      <div className="mt-14 border-t border-line/60 pt-10">
        <div className="flex items-center gap-4">
          <span className="text-micro uppercase tracking-label text-muted whitespace-nowrap">
            OR REACH US DIRECTLY
          </span>
          <span className="block h-px w-full bg-line/40" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Phone */}
          <div>
            <span className="block text-micro uppercase tracking-label text-muted">
              Phone
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <a
                href={CONTACT.leasingContact.phoneHref}
                data-press="row"
                className="font-sans tabular-nums text-body-lg text-ink hover:text-pure transition-colors"
              >
                +91 {CONTACT.leasingContact.phoneDisplay}
              </a>
              <button
                type="button"
                onClick={handleCopyPhone}
                data-press
                title="Copy phone"
                className="cursor-pointer text-[10px] uppercase text-muted hover:text-ink"
              >
                {copiedPhone ? "✓" : "Copy"}
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <span className="block text-micro uppercase tracking-label text-muted">
              Email
            </span>
            <div className="mt-2">
              <a
                href="mailto:leasing@jdkd.in"
                data-press="row"
                className="font-sans text-body-lg text-ink hover:text-pure transition-colors"
              >
                leasing@jdkd.in
              </a>
            </div>
          </div>

          {/* Office */}
          <div>
            <span className="block text-micro uppercase tracking-label text-muted">
              Office
            </span>
            <address className="mt-2 font-sans not-italic text-small text-ink/90 leading-relaxed">
              A-11, Mathura Road,
              <br />
              New Delhi &ndash; 110076
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
