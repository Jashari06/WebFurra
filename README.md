# WebFurra – Balkan Bäckerei & Grill

Website for **Balkan Bäckerei & Grill** in Bad Neuenahr-Ahrweiler. Plain HTML, CSS and JavaScript, with no build step.

## Structure

```
index.html        One-page site: hero, tradition, menu, grill, gallery, visit
css/styles.css    All styles (colour tokens in :root)
js/main.js        Interactions, language switching + CONFIG with business details
js/i18n.js        Translations (EN, NL, SQ)
js/animations.js  GSAP animations (intro, scroll reveals, parallax, menu tabs)
impressum.html    Legal notice (placeholder)
datenschutz.html  Privacy policy (placeholder)
assets/           Favicon
```

## Languages

The site is in **German (default)**, **English**, **Dutch** and **Albanian**.

- A fresh visit always opens in German. The globe button in the header switches the language.
- The chosen language is kept for the current browser session, including trips to the legal pages and back.
- Direct links: `?lang=en`, `?lang=nl`, `?lang=sq`.
- German text lives in `index.html`. The other languages are in `js/i18n.js`, under the same `data-i18n` keys.
- To translate a new piece of text, give the element `data-i18n="key"` and add that key to `en`, `nl` and `sq` in `js/i18n.js`.

## Animations

Animations use [GSAP](https://gsap.com) 3.13 (with ScrollTrigger and SplitText), loaded from jsDelivr.
If GSAP doesn't load, or the visitor has "reduce motion" turned on, the site falls back to simple CSS fade-ins.

## Before going live

1. **Business details:** enter the address, phone number, opening hours and Maps search term in the `CONFIG` block at the top of `js/main.js`. Then set `hoursConfirmed: true` to show the live "open now / closed" status in the hero.
2. **Prices:** add a price to a menu item with `<span class="dish__price">4,50 €</span>` inside its `.dish__top`.
3. **Photos:** the images are currently Unsplash stock photos. Swap them for your own photos of your products and shop (for example in `assets/img/`).
4. **Legal pages:** fill in `impressum.html` and `datenschutz.html` with the required details.

## Running locally

Open `index.html` in a browser, or start a local server:

```bash
python -m http.server 8000
```
