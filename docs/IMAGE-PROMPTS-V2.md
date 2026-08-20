# JDKD — Image Prompts (v2, art-directed homepage)

**For** bulk generation in the Gemini app (Nano Banana), then drop into `public/images/`
**Count** 12 images · **Everything else** is already covered by real client renders

---

## 0. Before you start

### 0.1 Never generate the tower

`docs/assets/deck/` holds 27 real professional renders of JDKD Corporate Tower.
The hero, About, Beliefs A and the CTA all use them. **Nothing below depicts the
actual building** — these are contextual, atmospheric and placeholder images
only. A prospective tenant looking at a fabricated image of the asset they are
being asked to lease is a misrepresentation problem, not a style choice.

### 0.2 Drop-in paths

Each prompt names the exact file path the site already points at. Save to that
path and the image appears — no code change. Until then a labelled placeholder
frame renders in its place.

### 0.3 Workflow

1. Paste the **house style block** (§1), then the specific prompt
2. Generate ~4, keep the best
3. Save to the exact path given
4. Compress to **under 300 KB** at 1600px wide before committing

Aspect ratios are stated per prompt — say them in the prompt text, the app
honours explicit ratio requests.

---

## 1. House style block

Prepend to **every** prompt.

```
Architectural interior/exterior photography for a premium commercial office
development in New Delhi. Editorial, restrained, quiet.

Palette: charcoal and near-black, warm off-white, travertine and honed
limestone, pale concrete, dark bronze and blackened steel, clear glass,
natural greenery. Warm low sunlight or blue-hour light.

Mood: calm, considered, expensive, unhurried. Deep shadow is welcome — these
images sit on a near-black page, so a dark, low-key exposure is correct.

Composition: architectural framing, corrected verticals, no lens distortion,
generous negative space. Photoreal, high detail, natural colour grading.

Avoid: text, lettering, signage, logos, watermarks, crowds, people in the
foreground, motion blur, fisheye, heavy vignette, neon, gold or brass
opulence, HDR halos, oversaturation, sci-fi or futuristic styling,
wide-angle real-estate-listing look.
```

---

## 2. Buildings & Parks — 3 placeholders

Chapters standing in until the client supplies the real portfolio. Flag these
clearly as placeholder — they must not read as completed JDKD projects.

### 2.1 `public/images/buildings/park-01.jpg` — 4:3

```
A contemporary low-rise commercial office campus at golden hour. Two or three
buildings in pale concrete and dark glass, connected by a landscaped courtyard
with mature trees and stone paving. Shot from the courtyard looking up at an
angle. Warm raking light across the facades. No signage, no people.
4:3 aspect ratio.
```

### 2.2 `public/images/buildings/park-02.jpg` — 4:3

```
The entrance forecourt of a commercial office building at dusk. A deep
cantilevered canopy over smooth stone paving, warm downlighting washing the
soffit, clipped hedging and slender trees along the approach. Eye level,
facing the entrance obliquely. No signage, no lettering, no people.
4:3 aspect ratio.
```

### 2.3 `public/images/buildings/park-03.jpg` — 16:9 (full-width)

```
Wide elevated view of a modern commercial district at blue hour. Mid-rise
office buildings with warmly lit floor plates, a tree-lined boulevard, long
shadows. Hazy warm sky above a cool foreground. Panoramic, generous sky, very
low-key overall exposure. 16:9 aspect ratio.
```

---

## 3. Beliefs — bento background

### 3.1 `public/images/beliefs/office-interior.jpg` — 16:9

```
A large empty contemporary office interior, early morning, unoccupied.
Full-height glazing along one wall, pale concrete soffit, warm oak floor,
a long travertine counter. Soft directional daylight raking across the floor.
Deliberately dark and low-contrast overall — frosted translucent panels will
sit on top of this image and text must stay readable over it, so avoid bright
highlights in the centre of the frame. No people, no screens, no signage.
16:9 aspect ratio.
```

> Keep this one quieter and darker than instinct suggests. It is a backdrop,
> not a subject.

---

## 4. Features — 4 chapters, 2 images each

Each chapter pairs a **large** image (4:5, sits behind) with a **small** one
(1:1, overlaps it, offset up and to the left). The small image should be a
detail or a closer view of the same subject, not an unrelated scene.

### 4.1 Terrace Lounge

`public/images/features/terrace-large.jpg` — 4:5

```
A rooftop terrace lounge on a commercial office building at dusk. Timber
decking, low built-in seating in stone and pale upholstery, planters with
ornamental grasses, a slim pergola overhead. Warm concealed lighting. City
skyline soft and out of focus beyond the parapet. No people.
4:5 portrait aspect ratio.
```

`public/images/features/terrace-small.jpg` — 1:1

```
Close detail of a rooftop terrace: the corner of a stone bench meeting timber
decking, a planter edge with ornamental grass, warm low light grazing the
surfaces. Shallow depth of field, tactile, almost abstract. No people.
1:1 square aspect ratio.
```

### 4.2 Fitness Studio

`public/images/features/fitness-large.jpg` — 4:5

```
A private fitness studio in a commercial office building, unoccupied. Full-
height windows with sheer daylight, pale oak floor, a mirrored wall, minimal
dark equipment arranged sparsely. Calm and uncluttered — closer to a gallery
than a gym. No people, no branding on the equipment.
4:5 portrait aspect ratio.
```

`public/images/features/fitness-small.jpg` — 1:1

```
Close detail inside a fitness studio: the end of a dark steel dumbbell rack
against a pale plaster wall, sunlight falling across the oak floor in a hard
diagonal. Minimal, graphic, shallow depth of field. No people, no logos.
1:1 square aspect ratio.
```

### 4.3 Structured Parking

`public/images/features/parking-large.jpg` — 4:5

```
A clean structured basement car park in a premium office building. Smooth
sealed concrete floor, crisp white line markings, pale painted walls, even
recessed lighting, a row of dark columns receding into the distance. Almost
empty. Orderly and well-lit rather than utilitarian. No signage text,
no number plates, no people. 4:5 portrait aspect ratio.
```

`public/images/features/parking-small.jpg` — 1:1

```
Close detail of a structured car park: the base of a concrete column meeting a
polished floor, a crisp painted line curving past, soft even overhead light.
Graphic and minimal, almost abstract. No text, no signage. 1:1 square ratio.
```

### 4.4 Always-On Infrastructure

`public/images/features/infrastructure-large.jpg` — 4:5

```
A building services plant room in a premium commercial tower, immaculately
kept. Neatly ordered stainless ductwork and conduit against smooth pale
concrete, precise alignment, clean installation, even cool light. Engineered
and quiet rather than industrial or grimy. No people, no warning signage,
no labels. 4:5 portrait aspect ratio.
```

`public/images/features/infrastructure-small.jpg` — 1:1

```
Extreme close detail of building services: parallel runs of brushed stainless
conduit against a concrete soffit, precise shadow gaps between them, cool even
light. Repetitive, graphic, nearly abstract. No text, no labels.
1:1 square aspect ratio.
```

---

## 5. Checklist

- [ ] House style block prepended to every prompt
- [ ] Aspect ratio stated in the prompt text
- [ ] Saved to the exact path given
- [ ] Compressed under 300 KB at 1600px wide
- [ ] Buildings & Parks images still flagged as placeholder in the CMS
- [ ] Bento background kept dark enough for text to sit on it
- [ ] No generated image presented as the actual JDKD Corporate Tower

## 6. Already covered — do not generate

| Slot | File |
|---|---|
| Hero | `/images/hero-tower.jpg` |
| About portrait | `/images/lobby.jpg` |
| Beliefs A | `/images/lobby-wide.jpg` |
| CTA full-bleed | `/images/tower-exterior.jpg` |
| Spare / location | `/images/location-aerial.jpg`, `/images/facade-detail.jpg` |
