"use client";

import { useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/content";

const AREA_OPTIONS = [
  "5,000 - 10,000 sq ft",
  "18,000 sq ft (Single Floor)",
  "36,000+ sq ft (Multi-Floor)",
  "Full Building Anchor HQ",
];

const FLOOR_OPTIONS = [
  "Penthouse Terrace & Sky Lounge",
  "Levels 06 - 07 (Top Floors)",
  "Level 05 (High-Efficiency Plate)",
  "Levels 02 - 04 (Mid-Rise)",
  "Ground Floor Commercial Suite",
];

const TIMELINE_OPTIONS = [
  "Immediate Occupancy",
  "Q3 2026",
  "Q4 2026",
  "2027 Forward Planning",
];

export function WalkthroughScheduler({
  initialFloor,
}: {
  initialFloor?: string;
}) {
  const [selectedArea, setSelectedArea] = useState<string>(AREA_OPTIONS[1]);
  const [selectedFloor, setSelectedFloor] = useState<string>(
    initialFloor || FLOOR_OPTIONS[1],
  );
  const [selectedTimeline, setSelectedTimeline] = useState<string>(
    TIMELINE_OPTIONS[0],
  );

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [confirmedBooking, setConfirmedBooking] = useState<{
    refId: string;
    timestamp: string;
  } | null>(null);

  function generateWhatsAppUrl(): string {
    const text = [
      `*LEASING ENQUIRY - JDKD CORPORATE TOWER (A-11 MCIE)*`,
      `---------------------------------------`,
      `*Entity:* ${company || "Corporate Tenant"}`,
      `*Contact:* ${name || "Executive"}`,
      `*Phone:* ${phone || "Not provided"}`,
      `*Email:* ${email || "Not provided"}`,
      ``,
      `*Area Requirement:* ${selectedArea}`,
      `*Preferred Level:* ${selectedFloor}`,
      `*Occupancy Timeline:* ${selectedTimeline}`,
      notes ? `*Notes:* ${notes}` : "",
      `---------------------------------------`,
      `Requesting availability and a private walkthrough slot.`,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/919811998811?text=${encodeURIComponent(text)}`;
  }

  function handleDispatchWhatsApp(e: FormEvent) {
    e.preventDefault();
    const url = generateWhatsAppUrl();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleDirectSubmission(e: FormEvent) {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const refId = `JDKD-WT-${randomCode}`;
    const timestamp = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setConfirmedBooking({ refId, timestamp });
  }

  return (
    <div
      id="walkthrough-scheduler"
      className="border border-line/70 bg-deep/50 p-6 md:p-8 lg:p-10"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line/60 pb-6">
        <div>
          <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
            Private Walkthrough & Space Configurator
          </span>
          <h3 className="mt-2 font-display text-h3 uppercase text-ink md:text-h2">
            Schedule an Inspection
          </h3>
        </div>
        <p className="max-w-[44ch] text-small text-muted">
          Select target floor plate dimensions and preferred levels. Dispatch
          directly to our leasing director on WhatsApp or request a priority desk
          callback.
        </p>
      </div>

      {confirmedBooking ? (
        /* Confirmation Receipt State */
        <div className="mt-8 border border-[#C9AD7F]/70 bg-surface/80 p-8 text-ink">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/40 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-2 rounded-full bg-emerald-400" />
              <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
                Walkthrough Request Registered
              </span>
            </div>
            <span className="font-sans tabular-nums text-caption text-muted">
              REF: {confirmedBooking.refId} · {confirmedBooking.timestamp} IST
            </span>
          </div>

          <h4 className="mt-6 font-display text-h3 uppercase text-ink">
            Thank you, {name || "Corporate Executive"}.
          </h4>
          <p className="mt-2 max-w-[50ch] text-small text-muted">
            Your inspection request for{" "}
            <strong className="text-ink">{selectedFloor}</strong> (
            {selectedArea}) has been logged directly on the desk of Mr. Roy.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 border-y border-line/40 py-5 sm:grid-cols-3 text-small">
            <div>
              <span className="block text-[11px] uppercase tracking-label text-muted">
                Entity
              </span>
              <span className="mt-1 font-medium text-ink">
                {company || "Confidential"}
              </span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-label text-muted">
                Timeline
              </span>
              <span className="mt-1 font-medium text-ink">
                {selectedTimeline}
              </span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-label text-muted">
                Callback SLA
              </span>
              <span className="mt-1 font-medium text-emerald-400">
                Within 2 Working Hours
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noreferrer noopener"
              data-press
              className="inline-flex items-center gap-2 border border-[#C9AD7F] bg-[#C9AD7F] px-6 py-3 text-label uppercase tracking-label text-deep font-semibold transition-colors hover:bg-pure hover:border-pure"
            >
              <span>Instant Confirmation on WhatsApp</span>
              <span>↗</span>
            </a>
            <button
              type="button"
              onClick={() => setConfirmedBooking(null)}
              data-press
              className="cursor-pointer border border-line/60 px-6 py-3 text-label uppercase tracking-label text-muted transition-colors hover:border-line hover:text-ink"
            >
              Edit Requirements
            </button>
          </div>
        </div>
      ) : (
        /* Configurator Form */
        <form onSubmit={handleDirectSubmission} className="mt-8 space-y-8">
          {/* Step 1: Area Selection */}
          <div>
            <label className="block text-micro uppercase tracking-label text-[#C9AD7F]">
              01 · Target Usable Floor Area
            </label>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {AREA_OPTIONS.map((area) => {
                const active = selectedArea === area;
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setSelectedArea(area)}
                    data-press
                    className={`cursor-pointer border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-[#C9AD7F] bg-surface text-ink font-medium"
                        : "border-line/40 bg-surface/20 text-muted hover:border-line hover:text-ink"
                    }`}
                  >
                    <span className="block text-small">{area}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Preferred Level */}
          <div>
            <label className="block text-micro uppercase tracking-label text-[#C9AD7F]">
              02 · Preferred Building Level
            </label>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {FLOOR_OPTIONS.map((floor) => {
                const active = selectedFloor === floor;
                return (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => setSelectedFloor(floor)}
                    data-press
                    className={`cursor-pointer border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-[#C9AD7F] bg-surface text-ink font-medium"
                        : "border-line/40 bg-surface/20 text-muted hover:border-line hover:text-ink"
                    }`}
                  >
                    <span className="block text-small">{floor}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Occupancy Timeline */}
          <div>
            <label className="block text-micro uppercase tracking-label text-[#C9AD7F]">
              03 · Target Occupancy Timeline
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {TIMELINE_OPTIONS.map((timeline) => {
                const active = selectedTimeline === timeline;
                return (
                  <button
                    key={timeline}
                    type="button"
                    onClick={() => setSelectedTimeline(timeline)}
                    data-press
                    className={`cursor-pointer border px-4 py-3 text-center transition-colors ${
                      active
                        ? "border-[#C9AD7F] bg-surface text-ink font-medium"
                        : "border-line/40 bg-surface/20 text-muted hover:border-line hover:text-ink"
                    }`}
                  >
                    <span className="block text-caption">{timeline}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Contact Information Fields */}
          <div className="border-t border-line/50 pt-8">
            <span className="block text-micro uppercase tracking-label text-[#C9AD7F]">
              04 · Tenant Contact Details
            </span>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] uppercase tracking-label text-muted">
                  Full Name <span className="text-[#C9AD7F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors focus:border-pure focus:outline-none placeholder:text-muted/60"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-label text-muted">
                  Company / Organization <span className="text-[#C9AD7F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sequoia Capital / Trilegal"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 w-full border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors focus:border-pure focus:outline-none placeholder:text-muted/60"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-label text-muted">
                  Direct Phone Number <span className="text-[#C9AD7F]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors focus:border-pure focus:outline-none placeholder:text-muted/60"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-label text-muted">
                  Corporate Email
                </label>
                <input
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border-b border-line bg-transparent py-2.5 text-body text-ink transition-colors focus:border-pure focus:outline-none placeholder:text-muted/60"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-[11px] uppercase tracking-label text-muted">
                Specific Walkthrough Requirements / Fit-Out Notes
              </label>
              <textarea
                rows={2}
                placeholder="Preferred date/time, parking slot requirements, power load needs, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full resize-y border-b border-line bg-transparent py-2 text-body text-ink transition-colors focus:border-pure focus:outline-none placeholder:text-muted/60"
              />
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/40 pt-6">
            <p className="text-caption text-muted">
              Confidentiality guaranteed. Details are shared directly with JDKD
              Leasing only.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {/* WhatsApp Direct */}
              <button
                type="button"
                onClick={handleDispatchWhatsApp}
                data-press
                className="cursor-pointer border border-[#C9AD7F] bg-[#C9AD7F] px-6 py-3 text-label uppercase tracking-label text-deep font-semibold transition-colors hover:bg-pure hover:border-pure"
              >
                Send via WhatsApp ↗
              </button>

              {/* Form Callback Request */}
              <button
                type="submit"
                data-press
                className="cursor-pointer border border-ink bg-transparent px-6 py-3 text-label uppercase tracking-label text-ink transition-colors hover:border-pure hover:bg-ink hover:text-deep"
              >
                Request Priority Callback
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
