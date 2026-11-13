/* =========================================================
   >>> Hier die echten Geschäftsdaten eintragen <<<
   Alles hier fließt in die Seite, die Suchmaschinen-Daten (JSON-LD),
   sitemap.xml, robots.txt und llms.txt (siehe scripts/prerender.mjs).
   ========================================================= */
export const CONFIG = {
  // Öffentliche Adresse der Website, ohne Schrägstrich am Ende.
  // ACHTUNG: Platzhalter – vor dem Veröffentlichen die echte Domain eintragen.
  siteUrl: "https://www.example.com",
  siteUrlConfirmed: false,

  // Anschrift. street leer lassen, solange sie nicht feststeht:
  // dann zeigt die Seite einen Platzhalter und die Suchmaschinen-Daten nur den Ort.
  street: "Sebastianstraße 2",
  postalCode: "53474",
  city: "Bad Neuenahr-Ahrweiler",
  country: "DE",

  // Telefonnummer: Anzeige + Wählformat
  phoneDisplay: "+49 2641 3966006",
  phoneDial: "+4926413966006",

  // Öffnungszeiten (0 = Sonntag … 6 = Samstag). null = geschlossen.
  // Stand 13.11.2026 (laut Google-Unternehmensprofil): Mo–Fr 06–21, Sa–So 07–21 Uhr.
  hours: {
    1: ["06:00", "21:00"],
    2: ["06:00", "21:00"],
    3: ["06:00", "21:00"],
    4: ["06:00", "21:00"],
    5: ["06:00", "21:00"],
    6: ["07:00", "21:00"],
    0: ["07:00", "21:00"],
  },
  // true: live "Jetzt geöffnet / geschlossen" auf der Seite und
  // Öffnungszeiten in den Suchmaschinen-Daten und llms.txt.
  hoursConfirmed: true,
};

/** Adresse für die Anzeige (HTML) */
export const addressHtml = () =>
  `${CONFIG.street || 'Straße &amp; Hausnummer'}<br>${CONFIG.postalCode} ${CONFIG.city}`;

/** Ziel für "Route planen": Straße + Ort, sobald die Straße bekannt ist */
export const mapsQuery = () =>
  [CONFIG.street, `${CONFIG.postalCode} ${CONFIG.city}`].filter(Boolean).join(', ');

/** Pfad zu einer Datei in public/ – funktioniert auch unter /en/, /nl/, /sq/ */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const IMG = (id, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
