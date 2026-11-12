/* =========================================================
   >>> Hier die echten Geschäftsdaten eintragen <<<
   ========================================================= */
export const CONFIG = {
  // Adresse wie sie auf der Seite erscheinen soll (<br> für Zeilenumbruch)
  address: "Straße &amp; Hausnummer<br>53474 Bad Neuenahr-Ahrweiler",
  // Suchbegriff für Google Maps (Route & Karte)
  mapsQuery: "Bad Neuenahr-Ahrweiler",
  // Telefonnummer: Anzeige + Wählformat
  phoneDisplay: "+49 (0) 0000 000000",
  phoneDial: "+490000000000",

  // Öffnungszeiten (0 = Sonntag … 6 = Samstag). null = geschlossen.
  // ACHTUNG: Platzhalter – echte Zeiten eintragen und danach hoursConfirmed auf true setzen.
  hours: {
    1: ["07:00", "20:00"],
    2: ["07:00", "20:00"],
    3: ["07:00", "20:00"],
    4: ["07:00", "20:00"],
    5: ["07:00", "21:00"],
    6: ["08:00", "21:00"],
    0: ["09:00", "18:00"],
  },
  // Erst wenn true, zeigt die Startseite live "Jetzt geöffnet / geschlossen" an.
  hoursConfirmed: false,
};

export const IMG = (id, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
