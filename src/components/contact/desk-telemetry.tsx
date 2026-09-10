"use client";

import { useEffect, useState } from "react";

export function DeskTelemetry() {
  const [timeString, setTimeString] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // Format time in Asia/Kolkata (IST: UTC+5:30)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formattedTime = new Intl.DateTimeFormat("en-GB", options).format(now);
      setTimeString(formattedTime);

      // Determine day & hour in IST
      const dayOptions: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        weekday: "short",
      };
      const day = new Intl.DateTimeFormat("en-US", dayOptions).format(now);
      const hourOptions: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false,
      };
      const hour = parseInt(
        new Intl.DateTimeFormat("en-US", hourOptions).format(now),
        10,
      );

      // Office hours: Mon-Sat 09:30 to 18:30
      const isWorkday = day !== "Sun";
      const isWorkHours = hour >= 9 && hour < 19;
      setIsOpen(isWorkday && isWorkHours);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleCopyCoords() {
    navigator.clipboard.writeText("28.5284, 77.2946");
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2400);
  }

  return (
    <aside
      aria-label="Leasing Desk Telemetry"
      className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 border-y border-line/60 bg-deep/40 py-3.5 px-gutter md:px-gutter-lg backdrop-blur-xs text-micro uppercase tracking-label text-muted"
    >
      {/* 01: Location & GPS HUD */}
      <div className="flex items-center gap-3">
        <span className="inline-block size-1.5 rounded-full bg-[#C9AD7F]" />
        <span className="text-ink">New Delhi · A-11 MCIE</span>
        <button
          type="button"
          onClick={handleCopyCoords}
          data-press
          title="Copy exact GPS Coordinates"
          className="group inline-flex cursor-pointer items-center gap-1.5 rounded-xs border border-line/50 bg-surface/60 px-2 py-0.5 text-[10px] text-muted transition-colors hover:border-line hover:text-ink"
        >
          <span>28°31&apos;42.2&quot;N 77°17&apos;40.6&quot;E</span>
          <span className="text-[#C9AD7F]">
            {copiedCoords ? "✓ COPIED" : "COPY"}
          </span>
        </button>
      </div>

      {/* 02: Real-time IST Clock & Desk Beacon */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="text-muted">IST (UTC+5:30):</span>
          <span className="font-sans tabular-nums text-ink font-medium">
            {timeString || "09:30:00"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`relative flex size-2 ${
              isOpen ? "text-emerald-400" : "text-[#C9AD7F]"
            }`}
          >
            <span
              className={`absolute inline-flex size-full animate-ping rounded-full opacity-75 ${
                isOpen ? "bg-emerald-400" : "bg-[#C9AD7F]"
              }`}
            />
            <span
              className={`relative inline-flex size-2 rounded-full ${
                isOpen ? "bg-emerald-500" : "bg-[#C9AD7F]"
              }`}
            />
          </span>
          <span className={isOpen ? "text-ink" : "text-muted"}>
            {isOpen ? "Desk Active" : "Priority Line Standby"}
          </span>
        </div>
      </div>
    </aside>
  );
}
