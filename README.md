# buituantu.com — Layer Dive

React 19 + TypeScript + Vite, with a three.js scene.

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
```

## Layout

```
index.html            Vite entry
public/fonts          Geist and Geist Mono (latin + Vietnamese subsets)
public/icons          social icons, taken from the existing buituantu.com assets
src/
  main.tsx, App.tsx   entry and page shell
  i18n.tsx            every string, in Vietnamese and English (Vietnamese is the default)
  data.ts             experience, tools, links, headline words
  store.ts            state shared with the 3D scene (not React state, on purpose)
  prefs.tsx           theme, motion, sound and HUD switches (saved in localStorage)
  styles.css          all styling
  components/
    Sections.tsx      Hero, University, Work, Service, Signal (Morse), Tools, Contact
    Chrome.tsx        Nav, layer rail, depth gauge, opening sequence, 3D stage + CSS fallback, footer, HUD
    Palette.tsx       ⌘K / Ctrl K: searchable commands plus a small terminal (type `help`)
    Explore.tsx       explore mode (double-click empty space, or E): controls and layer facts; the 3D handling is in scene/layers.ts
    ui.tsx            reveal wrappers and the spring-letter headline
  lib/
    kinetic.ts        spring physics for headline letters
    useScrollState.ts which layer the page is on
    interactions.ts   cursor ring, card tilt, magnetic buttons
    reveal.ts         fade-in on first view, heading scramble
    sound.ts          UI sounds, synthesised with Web Audio (no audio files)
    aurora.ts         the flowing background, one small WebGL shader at low resolution
    fx.ts             click ripple, confetti, the line that sweeps across on a layer change
    nameMarquee.ts    footer marquee that glides to a stop with the name centred
    showcase.ts       the `demo` command: one scripted run through every effect
  scene/
    layers.ts         the five-slab stack (loaded on demand, renders only while something moves)
    textures.ts       the art painted on each slab
```

## Editing content

- Text: `src/i18n.tsx` (both languages share the same keys).
- Jobs, tools, social links, headline: `src/data.ts`.
- Layer colours: `--l0` … `--l4` at the top of `src/styles.css`.

`preview.html` is a single-file build of the same code (fonts and icons inlined, three.js from a CDN),
handy for opening the page without installing anything.

To use these components inside the existing Next.js site, copy `src/` in, add `"use client"` to
`App.tsx`, and render `<App />` from a page.

## SEO and icons

- `index.html` carries the title, description, canonical URL, Open Graph and Twitter cards, and
  schema.org data (Person, WebSite, ProfilePage). It also holds a static copy of the page content, so
  crawlers that do not run JavaScript still read it; React replaces it on load.
- `public/`: `favicon.svg` (the logo), `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png`,
  `icon-maskable-512.png`, `og.png` (1200×630 share image), `site.webmanifest`, `robots.txt`, `sitemap.xml`.
- All URLs assume the site is served at https://buituantu.com/. Change them in `index.html`,
  `public/robots.txt` and `public/sitemap.xml` if it lives elsewhere.
- The logo is also `src/components/Logo.tsx`, coloured from the theme so it follows light and dark mode.
