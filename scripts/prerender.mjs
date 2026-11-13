// Prerender: writes one real HTML page per language plus robots.txt, sitemap.xml and llms.txt.
// Runs after `vite build` (browser bundle → dist/) and `vite build --ssr` (server bundle → dist-ssr/).
// Search engines and AI assistants then read the full text without running JavaScript.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const ssrDir = resolve(root, 'dist-ssr');

const { render, I18N, LANGS, CONFIG, mapsQuery } = await import(
  pathToFileURL(resolve(ssrDir, 'entry-server.js')).href
);

const SITE = CONFIG.siteUrl.replace(/\/$/, '');
const LOCALE = { de: 'de_DE', en: 'en_GB', nl: 'nl_NL', sq: 'sq_AL' };
const pathFor = (lang) => (lang === 'de' ? '/' : `/${lang}/`);
const urlFor = (lang) => `${SITE}${pathFor(lang)}`;
const SHARE_IMAGE = { path: '/assets/img/burek-theke.webp', width: 1264, height: 843, type: 'image/webp' };
const OWN_PHOTOS = ['burek-theke.webp', 'byrek-me-mish.webp', 'pitalk.webp', 'vitrine.webp', 'laden.jpg', 'trilece.webp']
  .map((f) => `${SITE}/assets/img/${f}`);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (s) => String(s).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const t = (lang, key) => I18N[lang]?.[key] ?? I18N.de[key] ?? key;

/* ---------- Structured data (schema.org) ---------- */
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function businessJson() {
  const address = {
    '@type': 'PostalAddress',
    ...(CONFIG.street ? { streetAddress: CONFIG.street } : {}),
    postalCode: CONFIG.postalCode,
    addressLocality: CONFIG.city,
    addressCountry: CONFIG.country,
  };
  const biz = {
    '@type': 'Bakery',
    '@id': `${SITE}/#business`,
    name: 'Balkan Bäckerei & Grill',
    url: `${SITE}/`,
    logo: `${SITE}/assets/img/logo.webp`,
    image: OWN_PHOTOS,
    telephone: CONFIG.phoneDisplay,
    address,
    areaServed: CONFIG.city,
    servesCuisine: ['Balkan', 'Bosnian', 'Albanian', 'Grill', 'Bakery'],
    hasMenu: `${SITE}/#speisekarte`,
    acceptsReservations: false,
  };
  // Öffnungszeiten nur, wenn sie bestätigt sind – keine falschen Zeiten an Google weitergeben
  if (CONFIG.hoursConfirmed) {
    biz.openingHoursSpecification = Object.entries(CONFIG.hours)
      .filter(([, h]) => h)
      .map(([d, h]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY[d], opens: h[0], closes: h[1] }));
  }
  return biz;
}

function jsonLd(lang) {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      businessJson(),
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'Balkan Bäckerei & Grill',
        inLanguage: LANGS,
        publisher: { '@id': `${SITE}/#business` },
      },
      {
        '@type': 'WebPage',
        '@id': `${urlFor(lang)}#webpage`,
        url: urlFor(lang),
        name: t(lang, 'meta.title'),
        description: t(lang, 'meta.desc'),
        inLanguage: lang,
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#business` },
        primaryImageOfPage: `${SITE}${SHARE_IMAGE.path}`,
      },
    ],
  };
  // "<" maskieren, damit der JSON-Block das <script>-Tag nicht beenden kann
  return JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
}

/* ---------- <head> per language ---------- */
function head(lang) {
  const title = t(lang, 'meta.title');
  const desc = t(lang, 'meta.desc');
  const img = `${SITE}${SHARE_IMAGE.path}`;
  const alternates = LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${urlFor(l)}">`).join('\n');
  const ogAlt = LANGS.filter((l) => l !== lang).map((l) => `  <meta property="og:locale:alternate" content="${LOCALE[l]}">`).join('\n');
  return `<title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${urlFor(lang)}">
${alternates}
  <link rel="alternate" hreflang="x-default" href="${urlFor('de')}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Balkan Bäckerei &amp; Grill">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${urlFor(lang)}">
  <meta property="og:locale" content="${LOCALE[lang]}">
${ogAlt}
  <meta property="og:image" content="${img}">
  <meta property="og:image:type" content="${SHARE_IMAGE.type}">
  <meta property="og:image:width" content="${SHARE_IMAGE.width}">
  <meta property="og:image:height" content="${SHARE_IMAGE.height}">
  <meta property="og:image:alt" content="${esc(t(lang, 'alt.pastry'))}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${img}">
  <script type="application/ld+json">
${jsonLd(lang)}
  </script>`;
}

/* ---------- Pages ---------- */
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
if (!SEO_BLOCK.test(template) || !template.includes('<!--app-->')) {
  throw new Error('index.html is missing the <!-- seo:start/end --> markers or <!--app-->');
}

for (const lang of LANGS) {
  const html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(SEO_BLOCK, head(lang))
    .replace('<!--app-->', render(lang));
  const outDir = lang === 'de' ? dist : resolve(dist, lang);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html, 'utf8');
  console.log(`prerendered ${pathFor(lang).padEnd(5)} (${Math.round(html.length / 1024)} KB)`);
}

/* ---------- robots.txt ---------- */
// Alle Crawler erlaubt – auch die Such-Bots der KI-Assistenten (ChatGPT, Claude, Perplexity, Apple).
// Wer KI-Training ausschließen will, ohne aus der KI-Suche zu fallen, ergänzt:
//   User-agent: GPTBot / ClaudeBot / Google-Extended  →  Disallow: /
writeFileSync(resolve(dist, 'robots.txt'), `# Balkan Bäckerei & Grill
User-agent: *
Allow: /

# KI-Suche ausdrücklich erlaubt (ChatGPT Search, Claude, Perplexity, Apple)
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: Applebot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`, 'utf8');

/* ---------- sitemap.xml ---------- */
const today = new Date().toISOString().slice(0, 10);
const links = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l)}"/>`).join('\n')
  + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('de')}"/>`;
writeFileSync(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => `  <url>
    <loc>${urlFor(l)}</loc>
    <lastmod>${today}</lastmod>
${links}
  </url>`).join('\n')}
</urlset>
`, 'utf8');

/* ---------- llms.txt (kurze Übersicht für KI-Assistenten, siehe llmstxt.org) ---------- */
const dishes = ['burek', 'sirnica', 'zeljanica', 'krompirusa', 'lepinja', 'pogaca', 'cevapi', 'pljeskavica', 'filled',
  'sudzuk', 'chicken', 'platter', 'baklava', 'tulumbe', 'kadaif', 'tufahija', 'coffee', 'yogurt', 'tea', 'soft'];
const where = [CONFIG.street, `${CONFIG.postalCode} ${CONFIG.city}`, 'Germany'].filter(Boolean).join(', ');
const hoursLines = CONFIG.hoursConfirmed
  ? Object.entries(CONFIG.hours).sort(([a], [b]) => ((+a + 6) % 7) - ((+b + 6) % 7))
      .map(([d, h]) => `- ${DAY[d]}: ${h ? `${h[0]}–${h[1]}` : 'closed'}`).join('\n')
  : '- Opening hours are listed on the website.';
writeFileSync(resolve(dist, 'llms.txt'), `# Balkan Bäckerei & Grill

> Balkan bakery and charcoal grill in ${CONFIG.city}, Germany. Freshly baked burek (byrek), pitalk flatbread, ćevapi and pljeskavica from the charcoal grill, baklava, trileçe, coffee and drinks. Website in German, English, Dutch and Albanian.

## Contact

- Phone: ${CONFIG.phoneDisplay}
- Location: ${where}
- Directions: https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery())}

## Opening hours

${hoursLines}

## Pages

- [Deutsch](${urlFor('de')}): Startseite mit Speisekarte, Grill, Galerie und Kontakt
- [English](${urlFor('en')}): Home page with menu, grill, gallery and contact
- [Nederlands](${urlFor('nl')}): Startpagina met menu, grill, galerij en contact
- [Shqip](${urlFor('sq')}): Faqja kryesore me menynë, skarën, galerinë dhe kontaktin

## Menu

${dishes.map((k) => `- ${plain(t('en', `d.${k}`))}: ${plain(t('en', `d.${k}.p`))}`).join('\n')}

## Legal

- [Impressum](${SITE}/impressum.html)
- [Datenschutz](${SITE}/datenschutz.html)
`, 'utf8');

console.log('wrote robots.txt, sitemap.xml, llms.txt');
rmSync(ssrDir, { recursive: true, force: true });

if (!CONFIG.siteUrlConfirmed) {
  console.warn(`\n⚠  CONFIG.siteUrl is still the placeholder "${SITE}". Canonical links, hreflang, sitemap.xml,`);
  console.warn('   robots.txt and llms.txt point there. Set the real domain in src/config.js before going live.\n');
}
if (!existsSync(resolve(dist, 'impressum.html'))) console.warn('⚠  impressum.html missing in dist/');
