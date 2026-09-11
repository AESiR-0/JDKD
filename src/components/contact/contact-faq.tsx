"use client";

import { useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const CONTACT_FAQS: readonly FaqItem[] = [
  {
    id: "walkthrough-protocol",
    question: "What is the site inspection protocol for prospective tenants?",
    answer:
      "Walkthroughs are conducted privately with our leasing director, Mr. Roy. Visitors can inspect the double-height ground lobby, typical floor plates (Level 05), upper executive suites (Levels 06-07), and the rooftop terrace lounge. Direct advance notice via phone or WhatsApp allows us to arrange dedicated parking and security clearance.",
  },
  {
    id: "parking-access",
    question: "How is vehicular access and basement parking managed?",
    answer:
      "JDKD Corporate Tower provides dual-side dedicated basement parking across two full underground slabs (B1 and B2). The property features separate entry and exit ramps on Mathura Road ensuring seamless one-way vehicular circulation, with designated visitor parking slots and EV charging bays.",
  },
  {
    id: "clear-height",
    question: "What are the ceiling clearances and floor load specifications?",
    answer:
      "All office floors feature a generous 14 ft 9 in (4.50 m) slab-to-slab clear height, providing expansive vertical volume for raised flooring and exposed ceiling designs. The structural slab is engineered to standard commercial live-load capacities suitable for high-density tech operations, BFSI workstations, and heavy corporate filing setups.",
  },
  {
    id: "power-mep",
    question: "What are the power backup, HVAC, and MEP provisions?",
    answer:
      "The tower is equipped with 100% DG emergency busbar backup with automatic transfer switching (AMF). Provisions for high-efficiency VRV/VRF air conditioning systems are integrated into designated service shafts, accompanied by dedicated fresh air louvers, centralized water treatment, and state-of-the-art fire suppression systems.",
  },
  {
    id: "handover-fitout",
    question: "What is the handover condition and fit-out timeline?",
    answer:
      "The building is ready for immediate handover in bare-shell / warm-shell condition with finished lift lobbies, common core washrooms, and active utility connections. Tenants can commence architectural fit-outs immediately upon lease execution.",
  },
];

export function ContactFaq() {
  const [openId, setOpenId] = useState<string | null>("walkthrough-protocol");

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="border border-line/70 bg-deep/50 p-6 md:p-8 lg:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line/60 pb-6">
        <div>
          <span className="text-micro uppercase tracking-label text-[#C9AD7F]">
            Technical Due Diligence
          </span>
          <h3 className="mt-2 font-display text-h3 uppercase text-ink md:text-h2">
            Inspection & Leasing Protocol
          </h3>
        </div>
        <p className="max-w-[42ch] text-small text-muted">
          Frequently consulted technical, architectural, and operational details
          for corporate decision makers.
        </p>
      </div>

      <div className="mt-6 divide-y divide-line/40">
        {CONTACT_FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="py-5">
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                data-press="row"
                className="flex w-full cursor-pointer items-start justify-between gap-4 text-left group"
              >
                <span className="font-display text-small md:text-body-lg uppercase tracking-tight text-ink group-hover:text-[#C9AD7F] transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`mt-1 font-sans text-h3 font-light text-[#C9AD7F] transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div className="mt-4 max-w-[68ch] text-small text-muted leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
