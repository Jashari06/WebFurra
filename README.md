# WebFurra – Balkan Bäckerei & Grill

Website for **Balkan Bäckerei & Grill** in Bad Neuenahr-Ahrweiler, built with **React + Vite**. Libraries:

- [React Bits](https://github.com/DavidHDev/react-bits): animated components (copied into `src/components/reactbits/`)
- [GSAP](https://gsap.com) with ScrollTrigger: scroll animations, parallax, image wipes
- [Lenis](https://github.com/darkroomengineering/lenis): smooth scrolling, synced with GSAP

## Development

You need Node.js 20 or newer.

```bash
npm install
npm run dev       # dev server at http://localhost:5174
npm run build     # production build in dist/
npm run preview   # preview the build locally
```

**Deployment:** the contents of `dist/` are the finished website, and they work from any folder (`base: './'`). Upload `dist/` to your hosting, or publish it with GitHub Pages using a workflow that runs `npm run build`.

## Structure

```
index.html                 Vite entry point (meta tags, fonts)
public/                    Copied unchanged: logo, favicon, impressum.html, datenschutz.html
src/main.jsx               Start, language provider
src/App.jsx                Page layout, ClickSpark, Lenis + GSAP hooks
src/config.js              >>> Business details: address, phone, opening hours <<<
src/i18n.js                All text in DE / EN / NL / SQ
src/styles.css             Design (colour tokens in :root)
src/sections/              Header, Hero, Pillars, Tradition, Menu, Grill, Gallery, Visit, Footer
src/lib/                   Language system, hours, Lenis (smoothScroll.js), GSAP (useScrollAnimations.js)
src/components/reactbits/  React Bits components (source code, can be edited)
```

## React Bits components in use

| Component | Where |
|---|---|
| **SplitText** | Hero headline, section headings |
| **BlurText** | Hero subtitle, menu intro |
| **ShinyText** | Location/opening-status badge, grill label |
| **Particles** | Rising embers in the hero and the visit section (WebGL) |
| **CircularGallery** | Food gallery (WebGL, drag/swipe) |
| **SpotlightCard** | The three badges below the hero |
| **Magnet** | Main buttons |
| **ClickSpark** | Ember sparks on every click |

To add more components, run `npx shadcn@latest add https://reactbits.dev/r/<Name>-JS-CSS`, or fetch `https://reactbits.dev/r/<Name>-JS-CSS.json` and save its files under `src/components/reactbits/<Name>/`.

> Note: `src/main.jsx` deliberately does **not** use `<StrictMode>`. Its double mounting in development would discard the WebGL contexts of Particles and CircularGallery.

## Languages

**German (default)**, English, Dutch and Albanian. A fresh visit always opens in German. The globe button switches the language, and the choice is kept for the current session. Direct links: `?lang=en`, `?lang=nl`, `?lang=sq`. All text lives in `src/i18n.js`. If a key is missing in another language, the German text is used.

## Before going live

1. **Business details:** enter the address, phone, opening hours and Maps search term in `src/config.js`. Then set `hoursConfirmed: true` to show the live "open now / closed" badge.
2. **Prices:** in `src/sections/Menu.jsx`, add a price to a dish, for example `{ k: 'burek', price: '4,50 €' }`.
3. **Photos:** these are currently Unsplash stock photos. Swap them for your own photos.
4. **Legal pages:** fill in `public/impressum.html` and `public/datenschutz.html`.

Visitors with "reduce motion" turned on get a calm version with no smooth scrolling, scroll animations or particle motion.
