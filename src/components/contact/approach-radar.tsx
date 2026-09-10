"use client";

import { useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/lib/content";

type TransitNode = {
  id: string;
  name: string;
  category: "metro" | "road" | "hub";
  distance: string;
  time: string;
  mode: string;
  description: string;
  coords: { x: number; y: number }; // Percentage position on the aerial plate
};

const TRANSIT_NODES: readonly TransitNode[] = [
  {
    id: "sarita-vihar",
    name: "Sarita Vihar Metro Station",
    category: "metro",
    distance: "350 m",
    time: "4 min walk",
    mode: "Delhi Metro Violet Line",
    description:
      "Direct pedestrian walk down Mathura Road corridor. Rapid links to Central Secretariat, Kashmere Gate & Faridabad.",
    coords: { x: 38, y: 52 },
  },
  {
    id: "mathura-road",
    name: "Main Mathura Road (NH-19)",
    category: "road",
    distance: "0 m",
    time: "Immediate access",
    mode: "Arterial 6-Lane Highway",
    description:
      "Plot A-11 sits directly on the service lane with dedicated entry/exit curb cuts and zero gridlock access.",
    coords: { x: 50, y: 68 },
  },
  {
    id: "apollo-hospital",
    name: "Indraprastha Apollo Hospital",
    category: "road",
    distance: "500 m",
    time: "1 min drive",
    mode: "Landmark & Emergency Hub",
    description:
      "Premier super-speciality medical campus immediately north on the same arterial carriage-way.",
    coords: { x: 32, y: 34 },
  },
  {
    id: "mohan-estate",
    name: "Mohan Estate Metro Station",
    category: "metro",
    distance: "800 m",
    time: "9 min walk",
    mode: "Delhi Metro Violet Line",
    description:
      "Secondary rapid transit station serving the southern commercial sector of Mohan Cooperative.",
    coords: { x: 68, y: 82 },
  },
  {
    id: "noida",
    name: "NOIDA Sector 18 CBD",
    category: "hub",
    distance: "5 km",
    time: "12 min drive",
    mode: "Kalindi Kunj River Corridor",
    description:
      "Swift transit across the Yamuna River bridging South Delhi corporate offices to Uttar Pradesh's prime tech cluster.",
    coords: { x: 82, y: 28 },
  },
  {
    id: "nehru-place",
    name: "Nehru Place Financial District",
    category: "hub",
    distance: "7.2 km",
    time: "15 min drive",
    mode: "Outer Ring Road Vector",
    description:
      "Key financial and IT center easily reached via the signal-free elevated corridors.",
    coords: { x: 22, y: 22 },
  },
  {
    id: "igi-airport",
    name: "IGI Airport Terminal 3",
    category: "hub",
    distance: "24 km",
    time: "35 min drive",
    mode: "Barapullah / Ring Road",
    description:
      "Direct highway routing to international and domestic aviation terminals via signal-free express corridors.",
    coords: { x: 12, y: 15 },
  },
];

export function ApproachRadar() {
  const [filter, setFilter] = useState<"all" | "metro" | "road" | "hub">("all");
  const [activeNodeId, setActiveNodeId] = useState<string>("sarita-vihar");
  const [copiedAddress, setCopiedAddress] = useState(false);

  const activeNode =
    TRANSIT_NODES.find((n) => n.id === activeNodeId) || TRANSIT_NODES[0];

  const filteredNodes =
    filter === "all"
      ? TRANSIT_NODES
      : TRANSIT_NODES.filter((n) => n.category === filter);

  function handleCopyAddress() {
    navigator.clipboard.writeText(
      "JDKD Corporate Tower, A-11, Mohan Cooperative Industrial Estate, Mathura Road, New Delhi 110044, India",
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2400);
  }

  return (
    <div className="border border-line/70 bg-deep/50 p-6 md:p-8 lg:p-10">
      {/* Top Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line/60 pb-6">
        <div>
          <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
            Spatial Connectivity & Logistics
          </span>
          <h3 className="mt-2 font-display text-h3 uppercase text-ink md:text-h2">
            The Transit Radar
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-micro uppercase tracking-label">
          {(
            [
              { key: "all", label: "All Vectors" },
              { key: "metro", label: "Metro (Violet Line)" },
              { key: "road", label: "Road & Highway" },
              { key: "hub", label: "Air & Business Hubs" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              data-press
              className={`cursor-pointer rounded-xs border px-3 py-1.5 transition-colors ${
                filter === t.key
                  ? "border-[#C9AD7F] bg-surface text-[#C9AD7F]"
                  : "border-line/50 text-muted hover:border-line hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Interactive Aerial Radar, Right Node Details & Quick Maps */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
        {/* Left: Aerial Plate with Beacon Pins */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[16/10] w-full overflow-hidden border border-line/60 bg-canvas">
            <Image
              src={IMAGES.locationAerial.src}
              alt={IMAGES.locationAerial.alt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-deep/40 to-deep/80" />

            {/* Simulated Radar Sweep Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,173,127,0.06)_0%,transparent_60%)]" />

            {/* Interactive Pins on Image */}
            {filteredNodes.map((node) => {
              const isActive = node.id === activeNodeId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeId(node.id)}
                  style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                  title={`${node.name} (${node.distance})`}
                >
                  <span className="relative flex items-center justify-center">
                    {/* Pulsing ring for active pin */}
                    {isActive && (
                      <span className="absolute size-8 animate-ping rounded-full bg-[#C9AD7F]/40" />
                    )}
                    <span
                      className={`relative flex size-4 items-center justify-center rounded-full border transition-transform ${
                        isActive
                          ? "scale-125 border-[#C9AD7F] bg-[#C9AD7F] text-deep"
                          : "border-ink/70 bg-deep/90 text-ink hover:scale-110 hover:border-[#C9AD7F]"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                    </span>
                  </span>

                  {/* Tooltip Tag */}
                  <span
                    className={`absolute left-1/2 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-xs px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-xs transition-opacity ${
                      isActive
                        ? "bg-deep/95 text-[#C9AD7F] border border-[#C9AD7F]/60 opacity-100"
                        : "bg-deep/80 text-ink/80 border border-line/40 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {node.name.split(" ")[0]} · {node.distance}
                  </span>
                </button>
              );
            })}

            {/* Corner Coordinate HUD */}
            <div className="absolute bottom-3 left-3 bg-deep/85 border border-line/40 px-2.5 py-1 text-[10px] font-sans tabular-nums text-muted backdrop-blur-xs">
              RADAR BEACON: 28°31&apos;42.2&quot;N 77°17&apos;40.6&quot;E
            </div>
          </div>

          {/* Quick Wayfinding Actions Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border border-line/50 bg-surface/40 px-4 py-3 text-micro">
            <span className="text-muted">Direct GPS Launchers:</span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=28.5284,77.2946"
                target="_blank"
                rel="noreferrer noopener"
                data-press
                className="text-ink underline decoration-[#C9AD7F] underline-offset-4 hover:text-[#C9AD7F]"
              >
                Google Maps ↗
              </a>
              <span className="text-line">/</span>
              <a
                href="https://maps.apple.com/?ll=28.5284,77.2946&q=JDKD+Corporate+Tower"
                target="_blank"
                rel="noreferrer noopener"
                data-press
                className="text-ink underline decoration-[#C9AD7F] underline-offset-4 hover:text-[#C9AD7F]"
              >
                Apple Maps ↗
              </a>
              <span className="text-line">/</span>
              <button
                type="button"
                onClick={handleCopyAddress}
                data-press
                className="cursor-pointer text-muted hover:text-ink"
              >
                {copiedAddress ? "✓ Copied Plot Address" : "Copy Plot Address"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Selected Node Detail & Full Vector List */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Highlight Card */}
          <div className="border border-line/60 bg-surface/60 p-6">
            <div className="flex items-center justify-between border-b border-line/40 pb-3">
              <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
                {activeNode.mode}
              </span>
              <span className="font-sans tabular-nums text-body font-semibold text-[#C9AD7F]">
                {activeNode.distance} · {activeNode.time}
              </span>
            </div>

            <h4 className="mt-4 font-display text-h3 uppercase text-ink">
              {activeNode.name}
            </h4>
            <p className="mt-3 text-small text-muted leading-relaxed">
              {activeNode.description}
            </p>
          </div>

          {/* List of other transit nodes to click */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-label text-muted px-1">
              Select Vector To Inspect:
            </span>
            {filteredNodes.map((node) => {
              const isCurrent = node.id === activeNodeId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeId(node.id)}
                  data-press="row"
                  className={`flex w-full cursor-pointer items-center justify-between border px-4 py-3 text-left transition-colors ${
                    isCurrent
                      ? "border-[#C9AD7F]/70 bg-surface text-ink"
                      : "border-line/30 bg-surface/20 text-muted hover:border-line hover:text-ink"
                  }`}
                >
                  <div>
                    <div className="text-small font-medium text-ink">
                      {node.name}
                    </div>
                    <div className="text-[11px] text-muted">{node.mode}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-sans tabular-nums text-caption font-semibold text-ink">
                      {node.distance}
                    </div>
                    <div className="text-[10px] text-muted font-sans tabular-nums">
                      {node.time}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
