"use client";

import { useState } from "react";
import { CONTACT, ASSET } from "@/lib/content";
import { VCardDownload } from "./vcard-download";

export function ConciergeDeck() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const { leasingContact, address } = CONTACT;

  function handleCopyPhone() {
    navigator.clipboard.writeText(leasingContact.phoneDisplay);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2400);
  }

  return (
    <div className="border border-line/70 bg-pine/30 p-6 md:p-8 lg:p-12 relative overflow-hidden backdrop-blur-xs">
      {/* Ambient background light pool */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Left Column: Direct Phone & Executive Identity */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-[#C9AD7F]" />
              <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
                Direct Line · Human Access Today
              </span>
            </div>

            {/* Massive Grotesque Phone Number */}
            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <a
                data-press="row"
                href={leasingContact.phoneHref}
                className="font-sans font-light tabular-nums text-[min(14vw,3.5rem)] leading-[0.92] tracking-[-0.03em] text-ink underline decoration-red decoration-2 underline-offset-[0.14em] transition-colors duration-200 hover:text-pure md:text-[min(9vw,5.5rem)] lg:text-[min(8vw,6.5rem)]"
                title={`Call ${leasingContact.name} on ${leasingContact.phoneDisplay}`}
              >
                {leasingContact.phoneDisplay}
              </a>

              <button
                type="button"
                onClick={handleCopyPhone}
                data-press
                className="cursor-pointer rounded-xs border border-line/50 bg-surface/60 px-3 py-1.5 text-micro uppercase tracking-label text-muted transition-colors hover:border-line hover:text-ink"
              >
                {copiedPhone ? "✓ COPIED" : "COPY"}
              </button>
            </div>

            {/* Contact Persona & Role */}
            <div className="mt-8 border-t border-line/40 pt-6">
              <div className="font-display text-h3 uppercase text-ink">
                {leasingContact.name}
              </div>
              <div className="text-small text-[#C9AD7F] mt-1">
                {leasingContact.role} · JDKD Corporate Tower
              </div>
              <p className="mt-3 max-w-[46ch] text-small text-muted leading-relaxed">
                Direct point of contact for corporate tenants, institutional
                investors, and IPC commercial leasing representatives.
              </p>
            </div>
          </div>

          {/* Quick Action Utilities: WhatsApp, vCard, Email */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line/40 pt-6">
            <a
              href={leasingContact.whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              data-press
              className="inline-flex items-center gap-2 border border-emerald-500/60 bg-emerald-950/40 px-5 py-2.5 text-label uppercase tracking-label text-emerald-300 transition-colors hover:bg-emerald-900/60 hover:text-emerald-100"
            >
              <span>WhatsApp Concierge</span>
              <span>↗</span>
            </a>

            <VCardDownload className="border border-line/50 bg-surface/40 px-4 py-2.5" />

            <a
              href="mailto:leasing@jdkd.in?subject=Leasing%20Enquiry%20-%20JDKD%20Corporate%20Tower"
              data-press
              className="inline-flex items-center gap-2 text-micro uppercase tracking-label text-muted hover:text-ink transition-colors px-2 py-2"
            >
              <span>Email: leasing@jdkd.in</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Right Column: Physical Address & Structural Assets */}
        <div className="lg:col-span-5 border-t border-line/40 pt-8 lg:border-t-0 lg:border-l lg:border-line/40 lg:pl-10">
          <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
            Location & Physical Asset
          </span>

          <address className="mt-4 not-italic">
            <div className="font-display text-h3 uppercase text-ink leading-snug">
              {address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
          </address>

          <div className="mt-6 space-y-4 border-t border-line/40 pt-5 text-small text-muted">
            <div className="flex items-start gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#C9AD7F]" />
              <span>
                <strong className="text-ink">Seven Office Floors:</strong> 14 ft
                9 in slab-to-slab clear height across all levels.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#C9AD7F]" />
              <span>
                <strong className="text-ink">Dual-Side Parking:</strong> Two
                basement tiers with dedicated one-way circulation ramps.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#C9AD7F]" />
              <span>
                <strong className="text-ink">Transit Proximity:</strong> 350 m
                walk from Sarita Vihar Metro Station (Violet Line).
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-line/40 pt-5 text-micro uppercase tracking-label text-muted">
            <div>Entity: JDKD Developers LLP</div>
            <div className="mt-1">Asset: {ASSET.assetClass}</div>
            <div className="mt-1 text-[#C9AD7F]">
              Availability: {ASSET.availability}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
