# Round 1 of changes — website observations, 13.10.26

_Source: `Website-observation_13.10.26.pdf` (7 pages), plus the WhatsApp location pins, the
Okhla / A-23 photo zip (`night vision and other images.zip`) and three notes from the brief:
"110044*", "About section ai gen image with a pointer (proposed look)", "for Okhla — don't add
extra information, only add the PDF things". Every item is below, tagged with its page.
Status: **done**, **you** (needs you), **asked** (waiting on a decision), **declined**._

## Part 1 · What's left for you

### 1. Review and commit (do this first)
**Why.** Nothing from this round is committed yet.
**Steps.** 1. Look through the changes on the dev server (`npm run dev`): home (hero, About,
Buildings), `/projects`, `/projects/okhla`, `/projects/m-39`, `/projects/m-82`,
`/projects/corporate-park`, `/contact`. 2. Say "push" and the round is committed as one commit.
**Check.** `git status` is clean afterwards and the deployed site shows the same pages.

### 2. Ask the client for original photos (optional, improves quality)
**Why.** The A-23 night photo and the six Okhla photos arrived through WhatsApp, so they are
compressed and at most 1280 px wide. They are used as supplied.
**Steps.** Ask for the camera originals and drop them over the same files:
`public/images/buildings/a23-night.jpg`, `public/images/okhla/okhla-01.jpg` … `okhla-06.jpg`.
Keep the names; update `width` / `height` in `src/lib/content.ts` (`IMAGES.corporateParkNight`,
`IMAGES.okhlaOne` … `okhlaSix`) if the sizes change.
**Check.** The Corporate Park gallery and the Okhla page look sharp at desktop width.

### 3. Confirm the About "Proposed look" picture with the client
**Why.** The About portrait is now the existing A-11 render (`public/images/tower-exterior.jpg`)
with a "Proposed look" pointer. No new image was generated.
**Steps.** If the client wants a different proposed-look visual, save it over
`public/images/tower-exterior.jpg` (portrait 3:4 crops best) or point `ABOUT.image` at a new
entry in `IMAGES`.
**Check.** Home › About shows the picture with the pointer on the tower.

## Part 2 · Ledger

| # | Page | Item (client's words, short) | Where | Status | Notes |
|---|---|---|---|---|---|
| 1 | p.1 | "Details should be written more clearly in the slide like: … A LEED Certified Grade A office building / Having Seven Floors over two basements / Now available for leasing / At: A-11, Mohan Co-operative Industrial Estate, Mathura Road, New Delhi" | Home · Hero | done | one fact per line, client's wording ("Certificed" typo fixed); brighter and one size up |
| 2 | p.1 | "Wrong Photograph used – photograph is of A-23 … details are for A-11" | Home · About portrait | done | A-23 lobby photo replaced by the A-11 render; the A-23 lobby photo moved to the Corporate Park gallery, where it belongs |
| 3 | p.1 | "Also the font size is too small to read clearly" | Home · About rail copy | done | 11px muted → 14px (16px from 1280px) in near-white; rail now bounded so it never overlaps the portrait (checked at 1024 / 1280 / 1440) |
| 4 | p.2 | "Photograph is shown Sarita Vihar Metro Station but details are for Greater Kailash properties" | Projects · M-82 and M-39 · Location | done | the shared Mathura Road aerial is replaced on every project page by a map of that property (see #12) |
| 5 | p.2–3 | "Address for M-39 is wrongly mentioned Greater Kailash-I, in place of II" | Projects · M-39 (summary, overview, specs, location), Projects index | done | now "Greater Kailash Part-2"; the GK-I landmarks (Kailash Colony Metro 800 m, South Ex 2 km…) replaced by the GK-II set M-82 already uses, since both are in the same commercial complex |
| 6 | p.4 | "It should be 'Complete' in place of Completed" | Home · Buildings · Corporate Park; Projects index; Corporate Park page lede | done | |
| 7 | p.4 | "Alignment should also be justified" + the five lines | Home · Buildings · Corporate Park | done | set as the client's five lines, one phrase per line (default taken — question went unanswered) |
| 8 | p.4 | "Drone view video not captured full building M-82 … Staple, Punjab Grill, Benne Dosa" | M-82 video (home, projects index, M-82 page) | done | loop extended from 10 s to 16 s of the same clip (DJI_0060): it now pulls back from the Staple rooftop to the whole building with Punjab Grill and Benne lit at street level. Gallery also gets a day still of the full building with all three |
| 9 | p.5 | "… Standard Chartered Bank for M-39" | M-39 video (home, projects index, M-39 page) | done | loop extended from 7.5 s to 17 s of DJI_0056, full frame (it was cropped): pulls back to the whole frontage with Standard Chartered at street level. Neighbouring shopfronts are now in shot — unavoidable once the full building is |
| 10 | p.5 | "Image missing: Night vision of A-23 … should be included in the Website" | Projects · Corporate Park · Gallery | done | first picture in the gallery (default taken) |
| 11 | p.6 | "We should also incorporate our Okhla Property in the slides" — E-43/7, Okhla Industrial Area, Phase-2, New Delhi-110020; 14,000 sq ft; Basement, Ground, First and 2nd floor; photos | Home · Buildings (4th chapter); Projects index (5th entry); `/projects/okhla` | done | titled "Okhla"; Read more opens a short page with the address, area, floors, map and a 6-photo gallery — nothing else |
| 12 | p.7 | "Location with map and complete address should be mentioned in the website" — five addresses | Every project page · Location | done | live Google map centred on the client's own pin + complete address with PIN + "Open in Google Maps" (their link). Pins: A-23 and Okhla from the coordinates they sent; A-11, M-82, M-39 resolved from their short links |
| 13 | brief | "110044*" — A-11 PIN shown as 110076 | Contact map card, Contact form, Footer, About page map | done | also: "Get directions" on Contact now opens the client's A-11 pin (the old one was ~1 km off) |
| 14 | brief | "About section ai gen image with a pointer (proposed look)" | Home · About portrait | done | existing AI render of A-11 used (no new generation, per your note); "Proposed look" label on a leader line pinned to the tower |
| 15 | brief | "For Okhla — don't add extra information, only add the PDF things" | Okhla entry | done | applied to #11 |

Also done as part of #2/#4 (you approved): the Corporate Park, M-82 and M-39 galleries no longer
show A-11 Tower renders; each shows only its own building.

Small consistency change: the estate is spelled "Mohan Co-operative Industrial Estate" site-wide,
the way the client writes it (the SEO keyword keeps the old spelling too).

## Part 3 · Decisions and rules from this round

- **Every picture must be of the building it sits beside.** The client checks this closely (#2, #3, #4). Renders of A-11 stay on A-11; footage stills stay on their own property.
- **A-11 renders are labelled "Proposed look"** while the building is under construction.
- **Okhla (E-43/7) carries only what the client wrote**: address, 14,000 sq ft, Basement + Ground + First + 2nd floor, their photographs. No invented highlights, amenities or distances.
- **Addresses are written the client's way**: "Mohan Co-operative Industrial Estate", "Greater Kailash Part-2", with PIN codes, from `PROPERTY_LOCATIONS` in `src/lib/content.ts`.
- **Superseded:** the earlier cut of the M-39 clip that cropped out the neighbouring shopfronts. The client now wants the full building and its occupants, which brings the neighbours into frame.
- **No AI image generation** for this site unless asked — "AI image" in a brief means use an existing render.

### Suggestions (not done — outside this round)
- `public/images/terrace.jpg` is captioned as the Corporate Tower's roof terrace, but it is the Staple rooftop at M-82. It appears in the Tower gallery and on the Contact page "level inspector".
- The Corporate Park, M-82 and M-39 pages reuse the A-11 Tower's floor plans, amenities list and downloads, and carry highlight copy no client document supports. Same class of error as #2 and #4.
- The About page location strip prints "28.6139° N / 77.2090° E" (central Delhi), not A-11.
- The hero picture is also an A-11 render; it could carry the same "Proposed look" label.
