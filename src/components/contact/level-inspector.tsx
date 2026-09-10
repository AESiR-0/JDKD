"use client";

import { useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/lib/content";

export type BuildingLevel = {
  id: string;
  name: string;
  shortLabel: string;
  elevation: string;
  area: string;
  ceiling: string;
  status: "Available" | "Reserved" | "Dedicated";
  use: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  features: readonly string[];
};

export const BUILDING_LEVELS: readonly BuildingLevel[] = [
  {
    id: "terrace",
    name: "Rooftop Terrace & Sky Lounge",
    shortLabel: "Terrace",
    elevation: "+41.05 m",
    area: "12,500 sq ft",
    ceiling: "Open Sky / Canopy",
    status: "Available",
    use: "Executive dining, tenant breakouts, corporate events",
    image: IMAGES.terrace,
    features: [
      "Panoramic skyline views over South Delhi corridor",
      "Landscaped garden perimeter with automated irrigation",
      "Dedicated lift bank access with private fob control",
    ],
  },
  {
    id: "floors-6-7",
    name: "Levels 06 & 07 — Penthouse Office Suites",
    shortLabel: "L06 – L07",
    elevation: "+32.05 m to +36.55 m",
    area: "18,000 sq ft / floor",
    ceiling: "14 ft 9 in (4.50 m)",
    status: "Available",
    use: "Corporate Headquarters / Flagship Workspace",
    image: IMAGES.officeFloor,
    features: [
      "Maximum natural daylight with three-sided curtain wall",
      "Double-glazed acoustic insulation with low-E thermal coating",
      "Direct vertical connectivity to rooftop sky lounge",
    ],
  },
  {
    id: "floor-5",
    name: "Level 05 — Typical High-Efficiency Plate",
    shortLabel: "L05",
    elevation: "+27.55 m",
    area: "18,000 sq ft",
    ceiling: "14 ft 9 in (4.50 m)",
    status: "Available",
    use: "Open Plan Office / Tech Hub / BFSI Operations",
    image: IMAGES.planFifthFloor,
    features: [
      "Centralized service core on south edge maximizing open spans",
      "Optimized column grid (approx. 54.6 m plate length)",
      "Designated refuge zone meeting the strictest NBC fire norms",
    ],
  },
  {
    id: "floors-2-4",
    name: "Levels 02 – 04 — Mid-Rise Workspace",
    shortLabel: "L02 – L04",
    elevation: "+14.05 m to +23.05 m",
    area: "18,000 sq ft / floor",
    ceiling: "14 ft 9 in (4.50 m)",
    status: "Available",
    use: "Scalable corporate suites, multi-tenant division",
    image: IMAGES.facadeDetail,
    features: [
      "VRV / VAV air conditioning copper piping & duct infrastructure",
      "Dual electrical shafts with 100% DG emergency busbar backup",
      "Four high-speed passenger elevators + dedicated service car",
    ],
  },
  {
    id: "ground-lobby",
    name: "Ground Level — Grand Atrium & Reception",
    shortLabel: "Ground",
    elevation: "±0.00 m",
    area: "14,200 sq ft",
    ceiling: "22 ft Grand Double-Height",
    status: "Dedicated",
    use: "Concierge desk, turnstile access, visitor waiting lounge",
    image: IMAGES.lobby,
    features: [
      "Italian marble flooring with acoustic timber ceiling baffling",
      "Biometric & RFID turnstile speed gates",
      "Dedicated drop-off portico on Mathura Road service corridor",
    ],
  },
  {
    id: "basements",
    name: "Basements B1 & B2 — Dedicated Parking & Plant",
    shortLabel: "B1 – B2",
    elevation: "-4.50 m to -9.00 m",
    area: "Two Full Slabs",
    ceiling: "12 ft Clear Driveway",
    status: "Dedicated",
    use: "Dual-side vehicle parking, 100% DG generators, STP/WTP",
    image: IMAGES.planBasementTwo,
    features: [
      "Dual ramp entry & exit for smooth one-way circulation",
      "High-capacity EV charging stations installed",
      "Advanced CO sensors with forced mechanical ventilation",
    ],
  },
];

export function LevelInspector({
  onSelectFloor,
}: {
  onSelectFloor?: (floorId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>("floors-6-7");

  const currentLevel =
    BUILDING_LEVELS.find((l) => l.id === selectedId) || BUILDING_LEVELS[1];

  function handleSelect(id: string) {
    setSelectedId(id);
    if (onSelectFloor) {
      onSelectFloor(id);
    }
  }

  function handleScrollToScheduler() {
    const el = document.getElementById("walkthrough-scheduler");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="mt-8 border border-line/70 bg-deep/50 p-6 md:p-8 lg:p-10">
      {/* Section Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line/60 pb-6">
        <div>
          <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
            Architectural Section & Stacking
          </span>
          <h3 className="mt-2 font-display text-h3 uppercase text-ink md:text-h2">
            Inspect Building Levels
          </h3>
        </div>
        <p className="max-w-[42ch] text-small text-muted">
          Select an architectural elevation to review plate dimensions, ceiling
          clearance, and structural specifications.
        </p>
      </div>

      {/* Interactive Stacking Grid: Left Level Selector, Right Level Detail */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
        {/* Left: Interactive Vertical Stacking Hierarchy */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <div className="flex items-center justify-between px-3 text-[10px] uppercase tracking-label text-muted">
            <span>Elevation Datum</span>
            <span>Floor Identity</span>
            <span>Leasing Status</span>
          </div>

          <div className="flex flex-col gap-1.5" role="tablist">
            {BUILDING_LEVELS.map((level) => {
              const isSelected = level.id === selectedId;
              return (
                <button
                  key={level.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(level.id)}
                  data-press="row"
                  className={`group flex w-full cursor-pointer items-center justify-between border px-4 py-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[#C9AD7F]/70 bg-surface/90 text-ink shadow-[0_0_24px_rgba(201,173,127,0.08)]"
                      : "border-line/40 bg-surface/30 text-muted hover:border-line hover:bg-surface/50 hover:text-ink"
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`font-sans tabular-nums text-caption ${
                        isSelected ? "text-[#C9AD7F] font-semibold" : "text-muted"
                      }`}
                    >
                      {level.elevation}
                    </span>
                    <span className="font-display text-small uppercase tracking-wide text-ink">
                      {level.shortLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-sans tabular-nums text-muted group-hover:text-ink">
                      {level.area}
                    </span>
                    <span
                      className={`inline-block size-1.5 rounded-full ${
                        level.status === "Available"
                          ? "bg-emerald-400"
                          : "bg-muted/60"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line/40 pt-4 text-micro text-muted">
            <span>Height to Parapet: 41.05 m</span>
            <span>Floor-to-Floor: 14&apos; 9&quot; (4.5 m)</span>
          </div>
        </div>

        {/* Right: Rich Floor Dossier Card */}
        <div className="lg:col-span-7 border border-line/60 bg-surface/40 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/40 pb-4">
              <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
                {currentLevel.elevation} · {currentLevel.status}
              </span>
              <span className="rounded-xs border border-line/60 px-2.5 py-0.5 text-micro uppercase tracking-micro text-muted">
                {currentLevel.use}
              </span>
            </div>

            <h4 className="mt-4 font-display text-h3 uppercase text-ink">
              {currentLevel.name}
            </h4>

            {/* Spec readout grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-y border-line/40 py-5 sm:grid-cols-3">
              <div>
                <span className="block text-[11px] uppercase tracking-label text-muted">
                  Plate Area
                </span>
                <span className="mt-1 font-sans tabular-nums text-body-lg text-ink font-medium">
                  {currentLevel.area}
                </span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-label text-muted">
                  Clear Height
                </span>
                <span className="mt-1 font-sans tabular-nums text-body-lg text-ink font-medium">
                  {currentLevel.ceiling}
                </span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-label text-muted">
                  Orientation
                </span>
                <span className="mt-1 text-body-lg text-ink">
                  Mathura Rd Frontage
                </span>
              </div>
            </div>

            {/* Image Preview */}
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden border border-line/50 bg-canvas">
              <Image
                src={currentLevel.image.src}
                alt={currentLevel.image.alt || currentLevel.name}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-micro text-ink/90">
                <span>Architectural Plate Detail</span>
                <span className="font-sans tabular-nums">{currentLevel.elevation}</span>
              </div>
            </div>

            {/* Key Features Bullet List */}
            <ul className="mt-6 space-y-2 text-small text-muted">
              {currentLevel.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#C9AD7F]" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Action to Select this level in Scheduler */}
          <div className="mt-8 border-t border-line/40 pt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="text-micro text-muted">
              Ready to walk this floor?
            </span>
            <button
              type="button"
              onClick={handleScrollToScheduler}
              data-press
              className="cursor-pointer border border-ink bg-ink px-6 py-2.5 text-label uppercase tracking-label text-canvas transition-colors hover:border-pure hover:bg-pure"
            >
              Configure Walkthrough For {currentLevel.shortLabel} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
