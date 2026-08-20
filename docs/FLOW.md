# JDKD — Site Flow & Information Architecture

**Version** 1.0 · **Date** 18 Aug 2026 · **Status** For client review
**Deliverable for** "Redesign Website Structure" (action item, 9 Aug meeting)
**Companion to** [SPEC.md](SPEC.md) · [MOTION-ANALYSIS.md](MOTION-ANALYSIS.md)

---

## 1. How the six references are actually built

Homepage section order, read top to bottom from each live site.

| # | **Elyse** | **Shivalik** | **Lagom** | **Eleos** | **Range** | **Lodha** |
|---|---|---|---|---|---|---|
| 1 | Hero (video) | Hero: "Makers of Masterpiece" | 001 Hero | Hero tagline | Hero | Our Promise |
| 2 | (ABOUT) statement | The Shivalik Intent | 002 Thoughtful spaces | Introduction / mission | Welcome intro | Our Purpose |
| 3 | **Stats ×4** | **Stats ×6** | **Stats ×3** | Projects + status | Redefining Luxury | Our Presence |
| 4 | (OUR LIVINGS) 3 types | The Ecosystem ×5 | 003 Projects | **Model ×3 pillars** | UAE portfolio | Signature Services |
| 5 | (OUR BELIEFS) **×5** | A Shivalik Standard **×5** | 004 Locations | Partners grid | Caribbean portfolio | — |
| 6 | Amenities ×3 | Our Story | 005 Management ×3 | CTA | Awards | — |
| 7 | FAQ ×4 | Recognition / awards | 007 CTA + form | Footer | Map + stats | — |
| 8 | CTA + form | Footer + **RERA** | Footer | — | Articles | — |
| 9 | Footer | — | — | — | Footer | — |

### 1.1 What every one of them does

1. **Hero is a short declarative line**, never a feature list. "Makers of Masterpiece." "Life in harmony." Not one of them opens with specifications.
2. **A statement of purpose immediately after the hero** — who we are and why, before any product.
3. **A numbers block** — 5 of 6. Counts range from 3 to 6.
4. **Portfolio** — 6 of 6.
5. **A named-pillars block** — 5 of 6. And three of them use *exactly five* pillars (Elyse's beliefs, Shivalik's standards; Eleos uses three).
6. **Proof before the ask** — awards, partners, or track record.
7. **CTA with a form**, then a contact-bearing footer.

### 1.2 Two findings worth acting on

**Not one of the six has testimonials.** The scope of work asks for them. Across six premium developer sites — Indian, European, Caribbean, American — zero use them. That is strong evidence to drop the section rather than merely defer it, and it's an easy thing to justify to the client.

**Shivalik links RERA from the footer.** Confirms the statutory disclosure slot in [SPEC.md](SPEC.md) §4.2 — the closest Indian reference already does it.

### 1.3 The structural mismatch

Every reference except Elyse is built around a **portfolio of many assets**. Lodha has hundreds, Range twelve, Shivalik five verticals. Their homepages are index pages.

**JDKD has one flagship asset.** Elyse is the only structural analogue — a single property told richly over nine sections — which is a better reason to treat it as primary reference than the visual style was.

So JDKD's homepage should behave like Elyse's structure carrying JDKD's commercial content, not like Lodha's portfolio index.

---

## 2. Finalised site map

```
/                              Home
/about                         About
/projects                      Portfolio index (all)
/projects/commercial           Category landing
/projects/residential          Category landing
/projects/[category]/[slug]    Project detail
/contact                       Contact
/careers                       Optional — feature-flagged off
```

**Navigation:** Home · About · Projects · Contact, plus a persistent **Enquire** pill (Lodha's pattern). Transparent over hero, sticky after.

**Mobile:** sticky bottom bar — *Call Mr. Roy · WhatsApp · Enquire*. Tap-to-call is the dominant conversion path in Indian commercial real estate.

Category stays in the path because it never changes; status is a filter chip because a project moves Ongoing → Completed on its own and would break its own links. Eleos independently confirms this — status lives on their project cards, not in their URLs.

---

## 3. Homepage flow — 9 sections

| # | Section | Content | Motion | Sourced from |
|---|---|---|---|---|
| **01** | **Hero** | Timelapse MP4 of the tower, dusk. One line: *"A Grade A commercial landmark."* Credential trio beneath. Scroll cue. | Mask-up reveal, < 2s | Elyse hero · deck slide 4 |
| **02** | **Statement** | Two or three editorial sentences on who JDKD is. Ends on a period. | Line-by-line mask | Shivalik Intent · Eleos intro |
| **03** | **The asset** | JDKD Corporate Tower, full width. Render, tagline, three stats, CTA. | Scrub scale, capped | Deck slide 4 |
| **04** | **By the numbers** | 23,456 sq.ft · 7 floors · 14'9" height · LEED Certified | Scroll counters | All five stat-using refs |
| **05** | **Location** | Map + distance list. 350 m metro · 500 m Apollo · 5 km NOIDA · Violet Line. | Fade + map draw | Lagom locations · Range map · deck slide 7 |
| **06** | **Why JDKD** | Five named pillars | Staggered reveal | Shivalik ×5 · Elyse ×5 |
| **07** | **Portfolio** | Commercial \| Residential, cards with status chips | Hover scale | Eleos cards · Lagom data |
| **08** | **CTA** | *"Schedule a private walkthrough."* Form + Mr. Roy's number. | Simple fade | Deck slide 18/20 |
| **09** | **Footer** | (GET IN TOUCH) · (LOCATION) · (CONTACT) · RERA · oversized wordmark | None | Elyse footer · Shivalik RERA |

### 3.1 The one deliberate deviation

**Location sits at 05, not near the bottom.**

Every reference buries location or omits it. But those are lifestyle and portfolio sites. JDKD is leasing office space, where location is the single largest decision driver — and the client's own deck agrees, putting it at slides 02 *and* 07, before the building itself.

Moving it above the portfolio is the one place this flow departs from the references, and the deck is the authority that justifies it.

### 3.2 Dropped from the scope's ten sections

| Dropped | Reason |
|---|---|
| **Testimonials** | Zero of six references use them (§1.2). No real ones exist yet. |
| **Company Vision** | Folds into 02 — it was saying the same thing twice. |
| **Why Choose Us** as prose | Becomes the numbers block (04) and pillars (06). |
| **Completed Developments** as its own section | Becomes a status filter inside 07. |

Nine sections, and every one earns its place.

---

## 4. Project detail flow

Follows the deck's own sequence, which is already well ordered for a leasing decision.

| # | Section | Notes |
|---|---|---|
| 01 | Hero banner | Full-bleed render, name, tagline, credential chips |
| 02 | Overview | Two-panel: statement left, render right |
| 03 | Key highlights | Three rule cards — Location Advantage / Future-Ready Infrastructure / Asset Differentiators, verbatim from deck slide 7 |
| 04 | Photo statement | Full-bleed punctuation |
| 05 | Location | Map, distances, site plan |
| 06 | Floor plans | Tabbed: Basement 2 · Basement 1 · Ground · Fifth · Sixth–Seventh |
| 07 | Amenities | Slate-header table + Quick Read stat panel |
| 08 | Gallery | Scroll-snap rail |
| 09 | Downloads | Brochure, floor plan PDF — gating still open |
| 10 | Enquiry | Form + direct phone |

**Floor plans are the hard part.** The deck's plans carry legends and dimension strings that are unreadable as static images on a phone. Needs a pinch-zoom/pan viewer with a text fallback listing the legend. Budget real time — it's the most technically involved component in the build.

---

## 5. About flow

Eleos's narrative arc with Shivalik's pillar structure:

1. Brand statement
2. What JDKD does
3. Track record — numbers
4. Named values *(shares the component with homepage 06)*
5. Leadership — Rakshak Kapoor, Ravish Kapoor *(confirm before publishing)*
6. CTA

---

## 6. Contact flow

Split layout: form left, details right — address, Mr. Roy's number, map embed. Mobile collapses to form-first with the sticky call bar pinned.

---

## 7. Open before this ships

Carried from [SPEC.md](SPEC.md) §7, in the order they block work:

| Item | Owner | Blocks |
|---|---|---|
| "Corporate Tower" vs "Corporate Park" naming | Kabir → client | Metadata, page titles |
| RERA registration number | Kabir → client | Footer, launch |
| Full project list + residential/commercial ratio | Kabir → client | Portfolio index (07) |
| Hosting budget — client cap or our estimate? | Prat | The quote |
| Brochure gating | Kabir → client | Nothing — built as a flag |
| Leadership names/bios | Kabir → client | Nothing — About ships without |
| Careers in scope | Kabir → client | Nothing — flagged off |
