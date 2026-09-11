"use client";

import { useState } from "react";

export function VCardDownload({ className = "" }: { className?: string }) {
  const [downloaded, setDownloaded] = useState(false);

  function handleDownload() {
    const vcardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Roy;Mr.;;;",
      "FN:Mr. Roy - JDKD Leasing",
      "ORG:JDKD Developers LLP",
      "TITLE:Director of Commercial Leasing",
      "TEL;TYPE=CELL,VOICE;VALUE=uri:tel:+919811998811",
      "ADR;TYPE=WORK:;;A-11, Mohan Cooperative Industrial Estate, Mathura Road;New Delhi;;110044;India",
      "NOTE:JDKD Corporate Tower (A-11 MCIE). Grade-A commercial leasing.",
      "URL:https://jdkd.in",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Mr_Roy_JDKD_Corporate_Tower.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      data-press
      className={`inline-flex cursor-pointer items-center gap-2 text-micro uppercase tracking-label font-medium transition-colors ${
        downloaded ? "text-[#C9AD7F]" : "text-muted hover:text-ink"
      } ${className}`}
      title="Save Mr. Roy to Phone Contacts (vCard)"
    >
      <svg
        className="size-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      >
        {downloaded ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        )}
      </svg>
      <span>{downloaded ? "Contact Saved (.vcf)" : "Save to Contacts (.vcf)"}</span>
    </button>
  );
}
