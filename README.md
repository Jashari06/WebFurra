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
npm run build     # production build in dist/ (with pre-rendered HTML, see below)
npm run preview   # preview the build locally at http://localhost:4173
```

**Deployment:** the contents of `dist/` are the finished website. It expects to live at the **root of a domain** (`base: '/'` in `vite.config.js`). For a sub-folder, set `base` to `'/<folder>/'`.

### Search engines and AI assistants

`npm run build` does three things:
1. `vite build` creates the browser bundle.
2. `vite build --ssr src/entry-server.jsx` creates a server bundle.
3. `scripts/prerender.mjs` renders **real HTML for each language**, so Google, Bing and AI assistants (ChatGPT, Claude, Perplexity) can read the full text without running JavaScript.

| File in `dist/` | What it is |
|---|---|
| `index.html`, `en/`, `nl/`, `sq/` | One pre-rendered page per language, each with its own title, description, canonical link, `hreflang` links, Open Graph/X preview and JSON-LD (Bakery, WebSite, WebPage) |
| `robots.txt` | Allows all crawlers, explicitly including AI search bots; points to the sitemap |
| `sitemap.xml` | All four language pages, with language alternates |
| `llms.txt` | Short Markdown summary for AI assistants ([llmstxt.org](https://llmstxt.org)) |

These files are generated from `src/config.js` and `src/i18n.js`, so never edit them by hand. Opening hours and the street are only included once they are confirmed in the config. Then the browser takes over and the animations run as usual.

## Structure

```
index.html                 Page template (fonts; the SEO head is filled in per language at build time)
public/                    Copied unchanged: logo, own photos, favicon, impressum.html, datenschutz.html
scripts/prerender.mjs      Writes the per-language HTML, robots.txt, sitemap.xml and llms.txt
src/main.jsx               Start in the browser, language from the URL
src/entry-server.jsx       Build-time rendering of one language to HTML
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

**German (default)**, English, Dutch and Albanian. Each language has its own address: `/` (German), `/en/`, `/nl/` and `/sq/`. A visit to `/` is always German. The globe button switches the language and updates the address without reloading. Old links like `?lang=en` are moved to the matching address. All text lives in `src/i18n.js`. If a key is missing in another language, the German text is used.

## Before going live

1. **Domain:** set `siteUrl` in `src/config.js` to the real address, for example `https://www.your-domain.de`, and `siteUrlConfirmed: true`. Until then, canonical links, the sitemap and `llms.txt` point at the placeholder `www.example.com`, and the build prints a warning.
2. **Business details:** enter `street` and the opening hours in `src/config.js`. Then set `hoursConfirmed: true`. This turns on the live "open now / closed" badge and adds the hours to the search-engine data and `llms.txt`. "Route planen" then leads to the shop itself.
3. **Prices:** in `src/sections/Menu.jsx`, add a price to a dish, for example `{ k: 'burek', price: '4,50 €' }`.
4. **Photos:** some are still Unsplash stock photos (including the large burek photo at the top). Swap them for your own.
5. **Legal pages:** fill in `public/impressum.html` and `public/datenschutz.html`.
6. **After launch:** register the site in Google Search Console and Bing Webmaster Tools and submit `sitemap.xml`. Create or claim the Google Business Profile with the same name, address and phone.

Visitors with "reduce motion" turned on get a calm version with no smooth scrolling, scroll animations or particle motion.
