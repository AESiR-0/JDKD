# Elyse — Motion Analysis

**Source** `public/Elyse Video.mkv` — 47.9s screen recording, 1920×1080 @ 60fps
**Method** 63 adaptive frames sampled at 768×432 via `video-read`
**Date** 18 Aug 2026 · **Companion to** [SPEC.md](SPEC.md)

---

## 1. Timeline

| Time | Section | What happens |
|---|---|---|
| 0.0–1.2 | — | Page in settled state (dusk hero) |
| **1.24** | — | **Hard cut — page reloaded.** Everything below is the real load sequence |
| 1.3 | Load | Wordmark renders in **grotesque**, white on black. No image, no logo |
| 1.6 | Intro | Hero image fades up; serif swaps in |
| 2.1–2.4 | Intro | Image at full bleed, **all text gone**, scaled ~110% and easing down |
| 2.7 | Intro | Wordmark begins revealing **bottom-up** — "EL" emerges first |
| 3.4–3.7 | Intro | Wordmark fully out; right-hand copy fades in |
| 4.8 | Intro | Nav logo appears top-left; nav settles sticky |
| 1.6→7.2 | Hero | Background runs **day → golden hour → sunset → dusk** |
| 7.7–8.5 | Hero exit | Content scrolls faster than image — parallax |
| 9.1–10.8 | About | `(ABOUT)` label; heading reveals line-by-line |
| 11.5–14.0 | Stats | Counters animate up to 60% · 30 · 150k sq.ft · 24/7 |
| 14.6–17.2 | Our Livings | 3-image row, centre tallest; heading overlaid; images scrub-scale |
| 18.1–19.7 | Our Beliefs | `(OUR BELIEFS)` right-aligned; heading reveals; image slides in from left |
| 20.6–25.9 | Beliefs | 5 frosted-glass panels `(1)`–`(5)` over a full-bleed interior, staggered |
| 26.5–35.0 | Amenities | 3 panels sharing one frame, crossfading between them |
| 35.9–41.2 | FAQ | Numbered accordion, questions right, answers expand centre |
| 42.2–45.0 | CTA | Dusk photo + green `#254441` form panel |
| 45.6–47.1 | Footer | `(GET IN TOUCH)` `(LOCATION)` `(CONTACT)` + oversized wordmark |

Measured: 1 hard cut, 73% static frames, mean scene-change 0.0117. The recording is a slow deliberate scroll with pauses — motion is concentrated in the intro and the section boundaries.

---

## 2. Effects, individually

### 2.1 Intro reveal — the signature moment

Sequence over roughly 2.5 seconds:

1. Black canvas, wordmark in fallback type
2. Image fades up, scaled ~110%, easing toward 100% over ~1.5s
3. Wordmark and all copy clear off
4. Wordmark **masks in from the bottom**, letters rising into a fixed clip box
5. Right-hand copy fades in ~300ms behind it
6. Nav logo appears last

The mask is the whole trick: the letterforms are not fading or sliding as objects — they are being **uncovered** by a box that stays put while the type translates up inside it. `overflow:hidden` on a wrapper, `y: 100% → 0` on the inner span.

```js
gsap.timeline({ defaults: { ease: "power3.out" } })
  .from(".hero-img",  { scale: 1.1, duration: 1.6 })
  .from(".mark span", { yPercent: 100, duration: 1.0, stagger: 0.06 }, 0.4)
  .from(".hero-copy", { opacity: 0, y: 16, duration: 0.8 }, "-=0.4")
  .from(".nav-logo",  { opacity: 0, duration: 0.5 }, "-=0.2");
```

### 2.2 The hero background is a video, not an image

Between 1.6s and 7.2s the sky runs a full day-to-dusk cycle with a lens flare crossing at 3.4s. That is a **timelapse MP4**, not a static render and not a crossfade between stills.

Directly relevant: this is exactly the *"MP4 over complex 3D"* decision from the 9 Aug meeting, already proven on the primary reference. The premium feel comes from video, not from WebGL.

### 2.3 Heading reveals

Every section heading arrives line-by-line, each line masked upward — the same mechanism as the intro wordmark, at smaller scale. Visible at 10.1s where `TIMELESS DESIGN` sits complete while `WELLNESS-FOCUSED LIVING` is still emerging. This is SplitText by lines with a stagger, not by characters.

### 2.4 Counters

11.5s → 14.0s shows 54→60, 27→30, 135k→150k. Values count up, tied to scroll position rather than firing once. Numerals hold their width throughout, so tabular figures are in use.

### 2.5 Scrub-scaled image groups

In *Our Livings* (14.6–17.2s) and *Amenities* (27.3–28.5s), image groups grow and shrink continuously as you scroll rather than animating once on entry. Scroll-linked `scale`, `scrub: true`.

The *Our Livings* row puts a large serif heading **across** three images, centre image tallest — the type sits over the imagery rather than beside it.

### 2.6 Frosted belief panels — the most expensive effect

20.6–25.9s: five translucent panels with an arched notch at the top edge, laid over a full-bleed interior photograph at staggered vertical offsets, numbered `(1)`–`(5)`. They carry a real backdrop blur — the image is visibly softened behind each panel while remaining legible.

**`backdrop-filter` over a large image is one of the most expensive things you can put on a page.** On mid-range Android it drops frames badly, especially while scrolling. Flagging this as the effect most likely to violate the performance constraint.

### 2.7 Amenities crossfade

Three panels — `WELLNESS-CENTERED AMENITIES` → `ART INSPIRED SPACES` → `NATURE-INFUSED RETREATS` — share one layout frame: heading left with a thin vertical rule, two overlapping images right. At 31.3s the heading is mid-dissolve while both image sets are visible simultaneously.

Consistent with a pinned ScrollTrigger section swapping content in place. *Worth confirming against the live site before replicating* — a fast scroll past three stacked sections could produce a similar frame, and the two implementations differ a lot in cost.

### 2.8 FAQ accordion

Numbered `(1)`–`(4)`. Questions right-aligned in serif italic, answers expand in the centre column. Only one open at a time. Height animates rather than snapping.

### 2.9 Nav

Hidden during intro, appears at 4.8s, then sticky throughout with a white pill `BOOK A VISIT` at right. Background stays transparent over imagery — it never picks up a solid fill.

---

## 3. A defect worth not copying

At **1.3s the wordmark renders in a grotesque**, then swaps to the serif at ~1.6s. That is a flash of unstyled text — the display font hasn't loaded when first paint happens.

On a site whose entire identity is its serif wordmark, the first thing a visitor sees is the wrong typeface. Avoidable with `next/font`, which self-hosts, preloads, and generates a metric-matched fallback so the swap doesn't reflow.

---

## 4. What JDKD should take

Filtered against the locked constraints: *minimal, restrained type, MP4 over 3D, mobile-first, cross-device performance*.

### Adopt

| Effect | Why it survives | Cost |
|---|---|---|
| **Mask-up reveal** for headings and the wordmark | The signature move, and it's cheap — transform only | Low |
| **Timelapse MP4 hero** | Already the locked decision; proven here | Low |
| **Scroll-linked counters** | Maps to plot area / floors / height / LEED | Low |
| **Hero parallax on exit** | Two elements, differing scroll rates | Low |
| **Numbered FAQ accordion** | Matches the deck's `NN /` numbering | Low |
| **Transparent sticky nav** | Works over both bone and dark sections | Low |
| **Section labels in parens** | `(ABOUT)` pairs with the deck's `04 /` marker | None |

### Adapt

| Effect | Change for JDKD |
|---|---|
| Scrub-scaled image groups | Keep, but cap the scale range — Elyse's is large enough to feel unstable on a small viewport |
| Heading over imagery | Only where contrast is guaranteed. Floor plans and spec content must never sit under type |
| Amenities crossfade | Use three plain stacked sections instead. Same reading experience, a fraction of the complexity |

### Reject

| Effect | Why |
|---|---|
| **Frosted glass panels** | `backdrop-filter` over full-bleed imagery is the single biggest frame-rate risk here, and it fails the cross-device standard |
| **Full-viewport wordmark** | Elyse's hero type is ~288px. Explicitly criticised on 9 Aug; our ceiling is 72px |
| **Text over dense imagery generally** | JDKD's content is floor plans, amenity tables and dimensions — legibility beats atmosphere |

---

## 5. Motion budget for JDKD

Carried into [SPEC.md](SPEC.md) §6:

- **One motion idea per section.** Elyse mostly holds this; the beliefs section is where it breaks and also where it gets expensive
- **Transform and opacity only.** No `backdrop-filter`, no `filter`, no animated `box-shadow`
- **Scrub sparingly** — two or three scroll-linked effects per page, not per section
- **Intro under 2s.** Elyse spends ~3.5s before the page is readable. On a leasing site where visitors arrive from a broker's link, that is too long
- **`prefers-reduced-motion`**: reveals become instant, counters render final values, the hero video shows its poster frame
- Target: 60fps on mid-range Android, LCP < 2.5s on 4G

---

## 6. Method note

Frames only — the file carries one AAC audio stream and no subtitles, and audio wasn't analysed. For a silent scroll recording that costs nothing, but it means this analysis covers what the page *looks* like, not any narration.

Timings are read from burned-in timestamps at 60fps, accurate to roughly ±50ms. Easing curves and durations in §2.1 are inferred from frame spacing and should be treated as a starting point to tune against the live site, not as measured values.
