# JDKD — Image Generation Prompts

**Version** 0.1 · **Date** 12 Aug 2026
**For** bulk generation in the Gemini app (Nano Banana), then drop into `public/images/`
**Companion to** [SPEC.md](SPEC.md)

---

## 0. Read this first

### 0.1 Never generate the building

The JDKD Corporate Tower has **27 real professional renders** already extracted to `docs/assets/deck/`. Use those.

**Do not generate images that purport to show the actual tower.** This is a commercial leasing site — a prospective tenant or broker looking at a fabricated image of the asset they're being asked to lease is a genuine misrepresentation problem, not a stylistic one. Every prompt below is deliberately for *contextual, abstract, or placeholder* imagery that is never presented as a depiction of the real asset.

Where a prompt produces a building, it is either (a) explicitly labelled placeholder for an unnamed future project, or (b) abstract/architectural texture with no identity.

### 0.2 What already exists — do not generate

| Need | Source |
|---|---|
| Tower exteriors, dusk & aerial | `deck/slide-01, 04, 05, 06, 21, 25, 26, 27` |
| Lobby & interior | `deck/slide-03, 15` |
| Mathura Road aerial context | `deck/slide-02` |
| Facade detail / fin texture | `deck/slide-11` |
| Floor plans, site plan | `deck/slide-09, 13, 17, 19` |
| Amenities chart | `deck/slide-23` |

### 0.3 Workflow

1. Paste the **house style block** (§1) at the top of each prompt
2. Append the specific prompt
3. Generate, pick the best of ~4
4. Save as the filename given, into `public/images/<folder>/`
5. Compress before commit — target **< 300 KB** per image at 1600px wide (`squoosh`, `sharp`, or TinyPNG)

Aspect ratios are stated per prompt. In the Gemini app, state it in the prompt text — it honours explicit ratio requests reliably.

---

## 1. House style block

Prepend to **every** prompt below.

```
Architectural photography, blue hour just after sunset. Warm interior light
spilling through glazing. Damp asphalt with soft specular reflections. Mature
palm and neem planting. Contemporary New Delhi context.

Palette: warm bone and stone neutrals, near-black structure, deep charcoal
glazing with bronze and champagne-metal mullions, amber interior glow.

Calm and editorial. Wide-angle architectural framing at tripod height.
Corrected verticals, no lens distortion. Photoreal, high detail, natural
colour grading.

Avoid: text, lettering, signage, logos, watermarks, crowds, people in the
foreground, motion blur, fisheye, heavy vignette, neon, HDR halos,
oversaturation, sci-fi or futuristic styling.
```

---

## 2. Portfolio — residential placeholders

Three cards on `/projects` need imagery before real residential projects are confirmed (SPEC §7, item 6). Mark these clearly as placeholder in the CMS so they cannot ship by accident.

### 2.1 `public/images/placeholder/residential-01.jpg` — 4:3

```
A low-rise contemporary residential building in New Delhi, four storeys,
warm sandstone and off-white render with deep recessed balconies and slim
bronze railings. Soft landscaping and a paved forecourt in the foreground.
Blue hour, warm light from windows. Three-quarter view from across a quiet
residential street. 4:3 aspect ratio.
```

### 2.2 `public/images/placeholder/residential-02.jpg` — 4:3

```
A garden-level residential courtyard, contemporary Indian architecture.
Stone paving, planted beds with ornamental grasses, a shallow reflecting
channel. Warm light from adjacent ground-floor glazing. Evening. Eye-level
view along the courtyard axis. 4:3 aspect ratio.
```

### 2.3 `public/images/placeholder/upcoming.jpg` — 4:3

```
An abstract architectural study for an unbuilt project: a clean massing
model in warm off-white plaster, soft directional studio light, deep shadow
on one face, plain seamless bone-coloured backdrop. Physical model
photography, shallow depth of field. No context, no landscaping, no people.
4:3 aspect ratio.
```

---

## 3. About page

### 3.1 `public/images/about/craft-01.jpg` — 3:2

```
Close detail of a building facade under construction: exposed concrete
column meeting a bronze-anodised mullion, precise shadow gap, dust-free
finish. Late afternoon raking light. Shallow depth of field, macro
architectural detail. No people, no tools, no signage. 3:2 aspect ratio.
```

### 3.2 `public/images/about/craft-02.jpg` — 3:2

```
An architect's desk from directly above: rolled technical drawings, a scale
rule, a matte grey material sample tray with stone and metal swatches, a
single warm desk lamp pooling light. Warm bone-coloured desk surface.
Overhead flat-lay, natural shadow. No faces, no screens, no branded objects,
no legible text on the drawings. 3:2 aspect ratio.
```

### 3.3 `public/images/about/context-delhi.jpg` — 21:9

```
Wide elevated view of a South Delhi commercial corridor at dusk. Low- and
mid-rise office buildings, a tree-lined arterial road, an elevated metro
viaduct crossing the middle distance, warm street lighting beginning to
take over. Hazy warm sky. Panoramic composition with generous sky.
21:9 aspect ratio.
```

---

## 4. Why JDKD — four values

These sit behind or beside the four named pillars (SPEC §5.1, section 06). Keep them quiet — they are backdrops, not subjects.

### 4.1 `public/images/values/location.jpg` — 1:1

```
Abstract overhead view of a road interchange and metro viaduct at dusk,
strongly geometric, reduced to clean curves and lines. Warm amber vehicle
light trails on dark asphalt. Near-top-down drone perspective. Minimal,
graphic, high contrast. 1:1 square aspect ratio.
```

### 4.2 `public/images/values/infrastructure.jpg` — 1:1

```
Detail of a building services core: neatly ordered stainless ductwork and
conduit against a smooth concrete soffit, precise alignment, clean
installation. Cool even light. Graphic, repetitive, almost abstract.
No people, no labels, no warning signage. 1:1 square aspect ratio.
```

### 4.3 `public/images/values/sustainability.jpg` — 1:1

```
A rooftop array of solar panels seen at a low oblique angle, dusk sky
reflected across the panel faces in warm amber and deep blue. Planted
sedum edge in the near foreground. Graphic repetition, clean geometry.
1:1 square aspect ratio.
```

### 4.4 `public/images/values/quality.jpg` — 1:1

```
Extreme close detail of two materials meeting: honed beige limestone
against a dark bronze metal reveal, a perfect shadow gap between them.
Raking side light showing surface texture. Abstract, tactile, almost
monochrome. 1:1 square aspect ratio.
```

---

## 5. Careers

Only needed if the optional Careers page is in scope (SPEC §7, item 8).

### 5.1 `public/images/careers/studio.jpg` — 3:2

```
A contemporary open-plan office interior, unoccupied, early morning.
Warm oak desks, soft grey task chairs, large windows with sheer light,
plants along a low partition. Calm and ordered. Wide interior view.
No people, no computer screens on, no branded material. 3:2 aspect ratio.
```

### 5.2 `public/images/careers/site-visit.jpg` — 3:2

```
Two hard hats and a rolled drawing resting on a folding site table, seen
from a low angle with an out-of-focus building structure behind. Warm
afternoon light, fine construction dust in the air. No faces, no logos,
no legible text. 3:2 aspect ratio.
```

---

## 6. Contact & location

### 6.1 `public/images/contact/arrival.jpg` — 16:9

```
The arrival forecourt of a contemporary office building at dusk: a covered
drop-off canopy, warm downlighting on smooth paving, low clipped hedging,
a single parked car out of focus. Inviting and quiet. Eye-level view facing
the entrance. No signage, no lettering, no people. 16:9 aspect ratio.
```

### 6.2 `public/images/contact/map-context.jpg` — 16:9

```
An abstract stylised city map fragment rendered as a flat graphic: warm
bone background, thin near-black road lines, one road emphasised in deep
red, a subtle dashed metro corridor. Clean cartographic style, generous
white space. No text, no labels, no place names, no icons.
16:9 aspect ratio.
```

> Note: for the live location section, use a real map (Mapbox or Google Maps, styled to the palette in SPEC §2.1). This generated image is only a decorative fallback.

---

## 7. Textures & abstracts

Used as section dividers, card backgrounds, and loading states. All should be quiet enough to sit behind type.

### 7.1 `public/images/texture/facade-fins.jpg` — 21:9

```
Abstract close crop of a repeating vertical facade fin system in dark
patinated metal, shallow angle so the fins compress into a rhythmic
pattern. Warm reflected light along each leading edge. Near-monochrome,
graphic, no context, no sky. 21:9 aspect ratio.
```

### 7.2 `public/images/texture/stone.jpg` — 16:9

```
Seamless flat texture of honed beige limestone, very fine natural veining,
even diffuse light, no shadows, no edges, no joints. Photographed square-on.
Subtle enough to sit behind text. 16:9 aspect ratio.
```

### 7.3 `public/images/texture/glass-dusk.jpg` — 16:9

```
Abstract close crop of a glass curtain wall at dusk, reflecting a gradient
sky from deep blue to warm amber, broken into a clean rectangular grid by
dark mullions. Some panels lit warmly from within. Purely graphic, no
building silhouette, no context. 16:9 aspect ratio.
```

---

## 8. Social & OG cards

Generated as **backgrounds only** — type is composited in code so it stays crisp and editable.

### 8.1 `public/images/og/og-base.jpg` — 1200×630

```
A dark atmospheric background for a social share card: deep charcoal to
near-black gradient, a very subtle out-of-focus suggestion of warm building
lights in the lower right third, heavy empty space in the upper left for
text. Extremely low contrast in the text area. No subject, no building
silhouette, no text. 1200x630 pixels.
```

### 8.2 `public/images/og/og-light.jpg` — 1200×630

```
A warm bone-coloured background for a social share card, very subtle paper
texture, a faint soft shadow gradient entering from the right edge only.
Almost entirely empty. No subject, no text, no pattern. 1200x630 pixels.
```

---

## 9. Empty & error states

### 9.1 `public/images/states/not-found.jpg` — 4:3

```
An abstract architectural model of a staircase that leads nowhere, in warm
off-white plaster, on a plain bone-coloured seamless backdrop. Soft
directional studio light, long clean shadow. Quiet and slightly witty, not
comic. Physical model photography. No people, no text. 4:3 aspect ratio.
```

### 9.2 `public/images/states/no-results.jpg` — 4:3

```
An empty architectural display plinth in warm off-white plaster on a bone
seamless backdrop, soft studio light, gentle shadow. Minimal and calm.
Nothing on the plinth. No people, no text. 4:3 aspect ratio.
```

---

## 10. Generation checklist

- [ ] House style block prepended to every prompt
- [ ] Aspect ratio stated in the prompt text
- [ ] Generated ~4 variants per prompt, kept the best
- [ ] Saved to the exact filename and folder given
- [ ] Compressed to < 300 KB at 1600px wide
- [ ] Residential and upcoming placeholders flagged as placeholder in the CMS
- [ ] No generated image is presented as a depiction of the actual JDKD tower
- [ ] `docs/assets/deck/` used for all real asset imagery

## 11. Not worth generating

For reference, these were considered and rejected — better produced another way:

| Asset | Better source |
|---|---|
| Sitemap, routing diagram | Mermaid / SVG written in code — editable and diffable |
| Component previews | The live `design-system/` HTML |
| Wireframes | HTML/SVG — accurate rather than approximate |
| Floor plans | Client's originals in the deck; needs a zoom viewer, not new art |
| Logo, brand marks | Client's existing logo — never regenerate a brand mark |
