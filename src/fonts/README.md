# Fonts

## PP Fragment Serif — licensed, not bundled

The display face is **PP Fragment** (Pangram Pangram Foundry) — the same family
the reference site uses. It is a commercial typeface and is **not** included in
this repo: shipping it without a licence would be redistribution.

### To switch the site onto it

1. Buy a **webfont** licence covering the expected monthly pageviews.
2. Drop the files here as:

   ```
   src/fonts/PPFragment-SerifRegular.woff2
   src/fonts/PPFragment-SerifLight.woff2      (if the licence includes it)
   ```

3. In `src/app/layout.tsx`, replace the `Instrument_Serif` loader with:

   ```ts
   import localFont from "next/font/local";

   const fragment = localFont({
     src: [
       { path: "../fonts/PPFragment-SerifLight.woff2", weight: "300", style: "normal" },
       { path: "../fonts/PPFragment-SerifRegular.woff2", weight: "400", style: "normal" },
     ],
     display: "swap",
     variable: "--font-serif-display",
     fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
   });
   ```

   Then swap `instrumentSerif.variable` for `fragment.variable` on `<html>`.
   Nothing else changes — every display element already reads the face through
   the `--font-serif-display` variable and the `font-display` utility.

`next/font/local` fails the build if a declared file is missing, so the loader
is deliberately *not* pre-wired.

### Current stand-in

**Instrument Serif** (Google Fonts, SIL Open Font Licence). High-contrast
display serif, closest free match in the same didone-adjacent register. It
ships a single 400 weight, so the light cut the reference uses at very large
sizes is not available until the licensed family lands.
