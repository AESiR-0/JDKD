"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { CONTACT } from "@/lib/content";

export function ReferenceForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleCopyPhone() {
    navigator.clipboard.writeText(CONTACT.leasingContact.phoneDisplay);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2400);
  }

  const whatsAppUrl = `https://wa.me/919811998811?text=${encodeURIComponent(
    `*ENQUIRY — JDKD CORPORATE TOWER*\nName: ${formData.name || "Executive"}\nCompany: ${
      formData.company || "Not specified"
    }\nPhone: ${formData.phone || "Not specified"}\nEmail: ${
      formData.email || "Not specified"
    }\nMessage: ${formData.message || "General leasing enquiry"}`,
  )}`;

  return (
    <div className="w-full">
      {submitted ? (
        <div className="border border-line/60 bg-surface/40 p-8 sm:p-10 text-ink">
          <div className="flex items-center gap-2.5 text-micro uppercase tracking-label text-[#C9AD7F]">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Enquiry Received</span>
          </div>

          <h3 className="mt-4 font-display text-h3 uppercase text-ink">
            Thank you, {formData.name || "Executive"}.
          </h3>
          <p className="mt-3 text-small text-muted leading-relaxed max-w-[46ch]">
            Your enquiry has been delivered directly to Mr. Roy at our leasing
            office. A formal availability brief and walkthrough coordination
            will follow shortly.
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
              onClick={() => setSubmitted(false)}
              data-press
              className="cursor-pointer border border-line/50 px-5 py-2.5 text-label uppercase tracking-label text-muted transition-colors hover:border-line hover:text-ink"
            >
              Send Another Note
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
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
                value={formData.name}
                onChange={handleChange}
                placeholder=""
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
                value={formData.company}
                onChange={handleChange}
                placeholder=""
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
                value={formData.email}
                onChange={handleChange}
                placeholder=""
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
                value={formData.phone}
                onChange={handleChange}
                placeholder=""
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
              placeholder=""
              className="mt-1 w-full resize-y border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors duration-150 focus:border-pure focus:outline-none"
            />
          </div>

          {/* Submit Button & WhatsApp Alternative */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
            <button
              type="submit"
              data-press
              className="group inline-flex cursor-pointer items-center gap-4 text-left"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-all duration-300 ease-editorial group-hover:border-pure group-hover:bg-ink group-hover:text-canvas">
                <span className="text-body font-light transition-transform duration-300 ease-editorial group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
              <span className="font-display text-small uppercase tracking-label text-ink transition-colors duration-200 group-hover:text-pure">
                Submit enquiry
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
