# JDKD — Website Design & Build Spec

**Version** 0.1 · **Date** 12 Aug 2026 · **Status** Draft for internal review
**Owners** Prat (design/build) · Kabir Sachdeva (client relationship)
**Source material** `JDKD_Website_refs.pdf` (scope of work) · `JDKD Tower Presentation.pdf` (client deck) · Meeting notes 9 Aug 2026

---

## 0. Purpose of this document

This spec does two things:

1. Extracts the client's **existing design language** from the JDKD Corporate Tower leasing deck, and adopts it as the authoritative design system. We are not inventing a look — JDKD already has one.
2. Analyses **each reference** named in the scope of work, and assigns each one to the specific sections it should influence — so "inspired by these sites" becomes an actionable per-section instruction rather than a mood board.

---

## 1. What we now know about the client

The tower deck materially changes the brief's framing.

| | |
|---|---|
| **Asset** | JDKD Corporate Tower — Grade A commercial office building |
| **Address** | A-11, Mohan Cooperative Industrial Estate (MCIE), Mathura Road, New Delhi |
| **Plot area** | 2,179.13 sq.m / 23,456.16 sq.ft |
| **Structure** | 7 office floors + 2 basements; terrace parapet +41.05 m |
| **Floor height** | 14 ft 9 in (4.5 m) |
| **Certification** | LEED Certified |
| **Commercial status** | Now available for **leasing** |
| **Leasing contact** | Mr. Roy — 9811998811 |
| **Entity** | JDKD Developers LLP, New Delhi (est. May 2017) |

**Location advantages** (from deck, verbatim): 350 m from Sarita Vihar Metro Station · 500 m from Apollo Hospital · direct access from Main Mathura Road · 5 km from NOIDA business hub · Violet Line metro corridor.

**Asset differentiators**: prime corner, two-side open plot · dual-side dedicated parking · North/North-West orientation · in-house gym & exclusive terrace lounge.

**Building systems**: 2 passenger elevators · 2 service elevators · firefighting equipment · DG sets · power grid transformer · switchgear/HT panel · air conditioning · water system · basement lighting · sewage treatment plant · per-floor LT panel · all-round planters · rainwater harvesting · fresh air system · gym · solar panels.

### 1.1 Implication for the site

The flagship asset is **commercial leasing**, not residential luxury. This has three consequences:

- The primary conversion action is **"schedule a private walkthrough"** — a site visit by a prospective tenant or their broker — not a brochure download or a residential enquiry.
- Elyse, the designated primary reference, is a *residential wellness* project. It is a valid reference for **composition, restraint and motion quality**, but not for content model or tone. Do not import its vocabulary.
- Floor plans and building-systems tables are first-class content, not an afterthought. They must be legible, zoomable, and readable on mobile.

> **Open item:** The deck's section-19 logo lockup reads **"CORPORATE PARK"** while every other slide reads **"CORPORATE TOWER."** Confirm the correct name with the client before it propagates into the site, page titles, and metadata.

---

## 2. Client design DNA (authoritative)

Extracted from the tower deck by sampling rendered slides. **These are measured values, not approximations.** This is the client's own taste and it supersedes the reference sites wherever they conflict.

### 2.1 Colour

```
--canvas       #F6F5F0   /* warm bone — dominant background */
--surface      #FBFAF6   /* card / panel, one step lighter than canvas */
--surface-pure #FFFFFF   /* image cards and plan containers only */
--ink          #0A0A0A   /* headings, body */
--ink-muted    #6B6B6B   /* subheads, captions, footers */
--brand-red    #C61D24   /* rules, section markers, active states */
--brand-red-lt #DB1218   /* logo mark only */
--gold         #AE8C4D   /* secondary card-header accent, used sparingly */
--slate        #2C3848   /* table headers, dense data surfaces */
```

The palette is **warm-neutral with a single hot accent**. Red is never a fill — it appears almost exclusively as a short hairline rule and as the logo. Gold appears on perhaps two card headers in the entire deck. That restraint is the point and must be preserved.

### 2.2 Typography

The deck uses a **geometric neo-grotesque** for ~90% of its type (Google Sans / Product Sans lineage), with a **high-contrast serif** reserved for two purely emotional slides:

- *"Where the city moves, business follows."*
- *"Built upward. Planned intelligently."*

That two-voice system is the single most transferable idea in the deck.

| Role | Treatment |
|---|---|
| Display (emotional moments) | Serif, regular weight, sentence case, ends with a period |
| Headline (functional slides) | Grotesque, light/regular, sentence case, ends with a period |
| Section marker | `04 / STRATEGIC COMMERCIAL INVESTMENT` — two-digit numeral, slash, uppercase, letterspaced, ~12px, with a red rule beneath |
| Subhead | Grotesque regular, `--ink-muted`, one line, no period |
| Stat numeral | Very large, light weight, tabular figures |
| Caption / footer | ~11–12px, `--ink-muted` |

**Web font mapping** (deck fonts are not web-licensed for us):

- Grotesque → **Geist** or **Inter** — Geist is closer to the deck's geometric feel
- Serif → **Instrument Serif** or **Newsreader** — for the two-to-three emotional moments only

**Critical constraint from the 9 Aug meeting:** oversized typography was explicitly criticised. The deck's own headlines sit around 48–64px on a 1600px slide — moderate, not monumental. Cap display type at **~72px desktop / ~40px mobile**. Do not import Elyse's 288px treatment.

### 2.3 Recurring components

These come straight from the deck and should become real components:

1. **Section marker** — `NN / LABEL` + red hairline rule (2–3px × ~90px). Used on every functional slide.
2. **Red-rule card** — white surface, subtle border, red hairline at top-left, uppercase card title, bulleted body. Deck uses these in threes.
3. **Photo statement** — full-bleed image, dark gradient scrim from the left, headline in white with a red rule above *and* below, one-line subhead.
4. **Stat row** — oversized numeral + small uppercase label to the right, separated by hairline dividers.
5. **Credential trio** — `LEED / CERTIFIED` · `Grade A / COMMERCIAL LANDMARK` · `Now / AVAILABLE FOR LEASING`, three columns with thin top rules. This is the deck's closing signature.
6. **Pill chip** — rounded grey pill for status labels ("LEED Certified Building").
7. **Data table** — slate header row, zebra rows in canvas/surface alternation.
8. **Persistent footer line** — address left, context label right, ~11px muted. Translates to a sticky utility bar or page footer.

### 2.4 Layout grammar

- Generous top-left anchoring; headline blocks sit left, imagery right
- Two-panel splits (content | image) are the deck's default functional layout
- Cards in threes
- Full-bleed photo slides used as **punctuation** between content slides, roughly every third slide

**This resolves the light-vs-dark question I raised earlier.** The client's own answer is: **bone canvas as the default, dark full-bleed photography as periodic punctuation.** Build it that way.

---

## 3. Reference analysis

Six references were named in the scope of work. The 9 Aug meeting elevated **Elyse to primary** and **Shivalik to backup for specific sections**. Below, each reference is assigned to the sections it should actually influence.

### 3.1 Elyse Residence — PRIMARY
`https://elyse-residence-dev.webflow.io/`

**Measured:** canvas `#121717`, accent `#254441`, cream `#E7E1DC`. Inter + Fragment Serif/Glare. Display type at 288/120/88/80px, weight 300, uppercase, tracking −0.03em. GSAP + ScrollTrigger + SplitText + Splide.

| Take | Leave |
|---|---|
| `(SECTION)` parenthetical labels — pairs naturally with JDKD's `NN /` markers | The 288px type — explicitly criticised in the meeting |
| Counter-animated stat blocks | Dark-dominant canvas — conflicts with client's bone palette |
| Numbered accordion FAQ `( 1 )` `( 2 )` | Residential wellness vocabulary |
| Line-mask heading reveals via SplitText | Green accent — JDKD's accent is red |
| Full-bleed photo punctuation between sections | Splide carousel — we'll use a native scroll-snap rail |
| Restraint: one idea per section | |

**Assign to:** hero, section rhythm, stat block, FAQ, scroll-reveal motion language.

### 3.2 Shivalik Group — BACKUP (named in meeting)
`https://shivalikgroup.com/`

**Measured:** Next.js with Turbopack (same stack we're building on). Inter only, single family. Near-black `#0A0A0A` on white/`#F2F2F2`. Type scale tops out at **48px/weight 500** — genuinely restrained. Content organised as "The Ecosystem" → Real Estate / Furniture / Fund / Institute, and "A Shivalik Standard" → Sustainability / Community / Quality / Transparency.

| Take | Leave |
|---|---|
| **The restrained type ceiling — 48px max.** Direct evidence that a premium Indian developer site does not need huge type | Multi-vertical ecosystem structure — JDKD is single-vertical |
| Values-as-named-pillars pattern (Sustainability / Community / Quality / Transparency) → maps to "Why Choose Us" | |
| Single-typeface discipline | |
| "Makers of Masterpiece" — short declarative brand line above the fold | |

**Assign to:** About page structure, Why Choose Us / values section, overall type ceiling. This is the closest reference to what we should actually ship.

### 3.3 Lodha Group
`https://lodhagroup.com/` (note: `.in` 301-redirects to `.com`)

Nav: Our Story · Our Impact · Our Projects · Careers, plus a persistent **Enquire / Call / Chat** action cluster. Portfolio filtered by type (apartment/villa/office), location, and configuration.

| Take | Leave |
|---|---|
| **Persistent Enquire/Call/Chat cluster** — the right conversion pattern for Indian real estate, and it maps directly to Mr. Roy's number | Scale of taxonomy — Lodha has hundreds of projects, JDKD has few |
| Filter model (type + location) validating our `/projects` filter approach | Generic corporate visual language |
| `Our Story / Our Impact / Our Projects` naming — warmer than About/Projects | |

**Assign to:** navigation, contact affordances, projects index filtering.

### 3.4 Range Developments
`https://www.rangedevelopmentsgroup.com/`

Fixed header, geography-led portfolio split (UAE | Caribbean), rotating hero taglines, heavy awards/recognition section, interactive location map with development statistics, media centre.

| Take | Leave |
|---|---|
| **Geography-led portfolio split** — a model for JDKD's Residential \| Commercial split | Rotating hero taglines — adds motion without meaning |
| **Interactive location map with stats overlay** — strong fit for the Mathura Road location advantages | Awards wall — JDKD has no comparable body of recognition yet |
| Aspirational-but-plain language | Citizenship-by-investment framing, irrelevant |

**Assign to:** projects index split, location/connectivity section on project pages.

### 3.5 Eleos
`https://www.eleos.la/`

Nav: About · Impact · Projects · Contact. Sections run problem statement → approach → portfolio → three-pillar methodology → partners → CTA. **Project cards carry explicit status: Completed / Ongoing.** Sticky contact modal throughout.

| Take | Leave |
|---|---|
| **Status directly on the project card** — validates status-as-attribute rather than status-as-URL | Startup/VC tone |
| Problem → approach → proof narrative arc for the About page | Placeholder-heavy portfolio |
| Three-pillar methodology block | |
| Sticky contact affordance | |

**Assign to:** About page narrative, project card anatomy, status treatment.

### 3.6 Lagom Development
`https://lagom-development.com/`

**Measured:** canvas `#F2EFE9`, ink `#38332F`, hot accent `#FB7339`. Inter + Mulish. Numbered sections `001`–`007`. Cards carry hard commercial data: price/m², floor area, payment terms, `14 будинків доступно` (units available), `01/02` pagination.

| Take | Leave |
|---|---|
| **Numbered section system** — near-identical to the deck's `NN /` markers, strong corroboration | Ukrainian residential-sales specifics |
| **Hard commercial data on cards** — for JDKD: floor plate area, floor number, availability | Orange accent |
| Warm off-white canvas + single hot accent — structurally the same formula as the deck | Heavy 800-weight type |
| Locations block with map + per-site phone number | |

**Assign to:** section numbering, project/floor card data model, locations block.

### 3.7 Cross-reference synthesis

Four of six references independently converge on the same formula:

> **Warm off-white canvas · near-black ink · exactly one hot accent · numbered sections · restrained type ceiling · full-bleed photography as punctuation**

Lagom, Shivalik, Eleos and the client's own deck all land there. That convergence — not any single reference — is the design direction, and it is worth presenting to the client exactly that way. It reframes the proposal from "we liked these sites" to "here is the pattern the whole category has settled on, and your own deck already uses it."

---

## 4. Site architecture

```
/                              Home
/about                         About / Our Story
/projects                      Portfolio index (all)
/projects/commercial           Category landing (filtered view)
/projects/residential          Category landing (filtered view)
/projects/[category]/[slug]    Project detail
/contact                       Contact / Enquire
/careers                       Optional — behind a feature flag
```

### 4.1 Why category is in the path and status is not

The scope of work lists five project sub-pages: Residential, Commercial, Ongoing, Completed, Upcoming. These are **two orthogonal axes**, not five categories — every project has both a type and a status.

**Type is permanent; status is not.** A commercial project stays commercial forever, but it moves Ongoing → Completed on its own schedule. If status is encoded in the URL, every project breaks its own links and accumulated SEO the moment it completes.

Therefore: **type in the path, status as a filter chip on the index.** This delivers all five views the scope asks for, from one content collection, with nothing to keep manually in sync. Eleos's status-on-card pattern (§3.5) confirms status belongs to the card, not the route.

### 4.2 Content model

```ts
type Project = {
  slug: string
  name: string                    // "JDKD Corporate Tower"
  tagline: string                 // "A Grade A commercial landmark."
  category: 'commercial' | 'residential'
  status: 'ongoing' | 'completed' | 'upcoming'
  city: string
  locality: string                // "Mohan Cooperative Industrial Estate"
  address: string
  hero: { image: string; video?: string }
  overview: string
  highlights: { label: string; value: string }[]   // Plot Area / 23,456.16 sq.ft
  location: {
    coords: [number, number]
    advantages: { distance: string; place: string }[]
  }
  floorPlans: { name: string; image: string; area?: string; note?: string }[]
  amenities: { group: string; items: string[] }[]
  gallery: { src: string; caption?: string }[]
  credentials: string[]           // ["LEED Certified", "Grade A"]
  brochure?: string               // gated per §7
  contact: { name: string; phone: string }
  reraNumber?: string             // statutory disclosure, India
}
```

`reraNumber` is included because Indian real estate carries a statutory RERA disclosure requirement. Designing a slot for it now is cheaper than bolting it onto the footer later. **Confirm with the client whether the tower has a RERA registration** — commercial projects above threshold generally do.

---

## 5. Page specs

### 5.1 Home

Ten sections were listed in the scope; the meeting pushed hard on minimalism. Eight, with each mapped to its governing reference:

| # | Section | Content | Reference |
|---|---|---|---|
| 01 | Hero | Full-bleed MP4 of the tower at dusk. One serif line. Credential trio beneath. | Elyse composition · deck's serif voice |
| 02 | Company statement | Short editorial paragraph. Who JDKD is. | Shivalik "Makers of Masterpiece" |
| 03 | Featured development | JDKD Corporate Tower given full width — image, three stats, CTA | Deck slide 4 |
| 04 | Portfolio | Commercial \| Residential split, cards with status chips | Range split · Eleos cards |
| 05 | By the numbers | Animated counters: plot area, floors, floor height, LEED | Elyse counters · Lagom data |
| 06 | Why JDKD | Four named pillars | Shivalik "A Shivalik Standard" |
| 07 | Location | Map + distance list | Range map · deck slide 7 |
| 08 | CTA → Footer | "Schedule a private walkthrough." + Mr. Roy's number | Deck closing slide |

Dropped from the scope's ten: **Company Vision** folds into 02; **Testimonials** deferred until the client supplies real ones — a fabricated or empty testimonial section actively damages credibility on a leasing site.

### 5.2 Project detail

Order follows the deck's own narrative, which is already well-sequenced:

1. Hero banner — full-bleed render, name, tagline, credential chips
2. Overview — two-panel: statement left, render right
3. Key highlights — three red-rule cards (Location Advantage / Future-Ready Infrastructure / Asset Differentiators, verbatim from deck slide 7)
4. Photo statement — full-bleed punctuation
5. Location advantages — map + distance list + site plan
6. Floor plans — tabbed selector (Basement 2 · Basement 1 · Ground · 5th · 6th–7th), each with zoomable plan and legend
7. Amenities — grouped table with slate header + "quick read" stat column
8. Gallery — scroll-snap rail
9. Downloads — brochure, floor plan PDF *(gating TBD, §7)*
10. Enquiry — form + direct phone

**Floor plans are the hard part.** The deck's plans are dense architectural drawings with legends and dimension strings. On mobile they are unreadable as static images. Required: pinch-zoom/pan viewer, minimum-width guard, and a text fallback listing the legend items. Budget real time for this — it is the most technically involved component in the build.

### 5.3 About

Following Eleos's arc and Shivalik's pillar structure: brand statement → what JDKD does → track record with numbers → named values → leadership (Rakshak Kapoor, Ravish Kapoor — *confirm before publishing*) → CTA.

### 5.4 Contact

Split layout: form left, details right (address, Mr. Roy's number, map embed). Lodha's persistent Enquire/Call/Chat cluster becomes a mobile sticky bar — on mobile, tap-to-call is the dominant conversion path in this category.

---

## 6. Motion & performance

Governed by two locked decisions: *MP4 over complex 3D*, and *optimise animations for cross-device performance*.

**Stack:** GSAP 3.15 + ScrollTrigger (installed) · `@gsap/react` for `useGSAP` · `motion` v13 (Framer Motion) for component-level transitions. GSAP owns scroll; Motion owns component state. Do not use both on the same element.

**Permitted motion:**
- Line-mask heading reveals (SplitText-equivalent)
- Fade/rise on section entry, ~24px travel, 600ms, `power2.out`
- Counter animations on stats
- `clip-path` wipes on imagery
- Scroll-snap horizontal rail for gallery
- Hero MP4 — muted, `playsinline`, `preload="metadata"`, poster frame, `<=2.5 MB`, H.264 + WebM

**Not permitted:** scrubbed canvas image sequences · WebGL/3D · parallax on more than one element per viewport · any effect that cannot hold 60fps on a mid-range Android.

**Rules:**
- One motion idea per section
- Full `prefers-reduced-motion` path — not a stub
- Hero video does not block LCP: poster image is the LCP element
- Targets: LCP < 2.5s on 4G, CLS < 0.1, INP < 200ms

---

## 7. Open decisions

| # | Item | Owner | Blocking? |
|---|---|---|---|
| 1 | Lead capture / brochure gating — required or not | Kabir → client | No. Build as a per-project config flag; costs ~2h either way |
| 2 | "Corporate Tower" vs "Corporate Park" naming | Kabir → client | Yes, before metadata/launch |
| 3 | RERA registration number | Kabir → client | Yes, before launch (statutory) |
| 4 | Hosting budget — is ₹1,000/mo the client's cap or our cost estimate? Does it include domain (~₹1,000–1,500/yr) and image CDN? | Prat | Yes, for the quote |
| 5 | Real testimonials available? | Kabir → client | No — section deferred until supplied |
| 6 | Full project list beyond the tower — how many, and the residential/commercial ratio | Kabir → client | Yes, shapes the portfolio index |
| 7 | Leadership names/bios for About page | Kabir → client | No — section can ship without |
| 8 | Careers page in scope? | Kabir → client | No — flagged off by default |

### Hosting note

₹1,000/month ≈ $11–12. Free tiers are ruled out, and Vercel Pro at $20/seat (~₹1,750) exceeds the figure. Options inside budget: a VPS (Hetzner/DigitalOcean, ~₹450–550) running the Next.js app, or static export to Cloudflare Pages (near-zero). Vercel Pro remains the recommended option at a ~₹750/mo overrun.

Useful argument for the client conversation: Vercel's Hobby tier **prohibits commercial use** in its terms. "No free tier" is therefore a licensing constraint, not merely a stability preference — a firmer line than the downtime argument.

---

## 8. Tech baseline

Scaffolded and verified at repo root:

- Next.js 16.3.1 (App Router, `src/`, `@/*` alias) · React 19.2.8 · TypeScript
- Tailwind CSS 4 · ESLint · Turbopack · npm
- GSAP 3.15.0 · `@gsap/react` 2.1.2 · `motion` 13.1.0

Shivalik runs the same stack (Next.js + Turbopack), which is a useful data point for the client conversation.

---

## 9. Immediate next steps

1. Encode §2 tokens into `globals.css` as CSS custom properties + Tailwind theme
2. Build the eight components in §2.3 — they compose every page in the site
3. Home page against §5.1
4. Project detail template against §5.2, using the tower as the first real record
5. Resolve §7 items 2, 3, 4 and 6 with Kabir before the client review
