/* =========================================================
   Balkan Bäckerei & Grill — Interaktionen
   ---------------------------------------------------------
   >>> Hier die echten Geschäftsdaten eintragen <<<
   ========================================================= */
const CONFIG = {
  // Adresse wie sie auf der Seite erscheinen soll (HTML erlaubt, <br> für Zeilenumbruch)
  address: "Straße &amp; Hausnummer<br>53474 Bad Neuenahr-Ahrweiler",
  // Suchbegriff für Google Maps (Route & Karte), z. B. "Balkan Bäckerei & Grill, Hauptstraße 1, 53474 Bad Neuenahr-Ahrweiler"
  mapsQuery: "Bad Neuenahr-Ahrweiler",
  // Telefonnummer: Anzeige + Wählformat
  phoneDisplay: "+49 (0) 0000 000000",
  phoneDial: "+490000000000",

  // Öffnungszeiten (0 = Sonntag … 6 = Samstag). null = geschlossen.
  // ACHTUNG: Platzhalter – bitte durch die echten Zeiten ersetzen und danach hoursConfirmed auf true setzen.
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

document.documentElement.classList.remove("no-js");

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Geschäftsdaten einsetzen ---------- */
(function applyConfig() {
  $$('[data-config="address"]').forEach((el) => (el.innerHTML = CONFIG.address));
  $$('[data-config="phone"]').forEach((el) => {
    el.href = `tel:${CONFIG.phoneDial}`;
    if (!el.classList.contains("btn")) el.textContent = CONFIG.phoneDisplay;
  });
  const route = $("#route-link");
  if (route) route.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONFIG.mapsQuery)}`;
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* =========================================================
   Mehrsprachigkeit (DE · EN · NL · SQ)
   - Beim Öffnen der Seite immer Deutsch.
   - Gewählte Sprache gilt nur für die laufende Sitzung (sessionStorage),
     damit sie beim Wechsel zu Impressum/Datenschutz und zurück erhalten bleibt.
   - Link mit ?lang=en / ?lang=nl / ?lang=sq öffnet direkt eine Sprache.
   ========================================================= */
const LANGS = ["de", "en", "nl", "sq"];
const DICT = window.I18N || { de: {} };
let lang = "de";

// Deutscher Originaltext aus dem HTML als Rückfall merken
const originals = {
  html: new Map($$("[data-i18n]").map((el) => [el, el.innerHTML])),
  alt: new Map($$("[data-i18n-alt]").map((el) => [el, el.alt])),
  aria: new Map($$("[data-i18n-aria]").map((el) => [el, el.getAttribute("aria-label")])),
};

const t = (key, vars = {}) => {
  const val = DICT[lang]?.[key] ?? DICT.de?.[key] ?? "";
  return typeof val === "string" ? val.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : val;
};

function setLanguage(next, { remember = true } = {}) {
  lang = LANGS.includes(next) ? next : "de";
  const d = DICT[lang] || {};

  originals.html.forEach((de, el) => { el.innerHTML = lang !== "de" && d[el.dataset.i18n] != null ? d[el.dataset.i18n] : de; });
  originals.alt.forEach((de, el) => { el.alt = lang !== "de" && d[el.dataset.i18nAlt] != null ? d[el.dataset.i18nAlt] : de; });
  originals.aria.forEach((de, el) => { el.setAttribute("aria-label", lang !== "de" && d[el.dataset.i18nAria] != null ? d[el.dataset.i18nAria] : de); });

  document.documentElement.lang = lang;
  document.title = t("meta.title");
  $('meta[name="description"]')?.setAttribute("content", t("meta.desc"));

  $("#lang-current").textContent = lang.toUpperCase();
  $$("[data-lang]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.lang === lang)));

  const burger = $("#burger");
  if (burger) burger.setAttribute("aria-label", t(burger.getAttribute("aria-expanded") === "true" ? "aria.menuClose" : "aria.menuOpen"));
  const iframe = $("#map iframe");
  if (iframe) iframe.title = t("mapTitle");

  renderHours();

  if (remember) {
    try { sessionStorage.setItem("lang", lang); } catch (_) {}
    const url = new URL(location.href);
    if (lang === "de") url.searchParams.delete("lang"); else url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }
}

/* ---------- Öffnungszeiten & Live-Status ---------- */
function renderHours() {
  const days = t("days");
  const order = [1, 2, 3, 4, 5, 6, 0];
  const table = $("#hours-table");
  const now = new Date();
  const today = now.getDay();

  if (table) {
    table.innerHTML = order
      .map((d) => {
        const h = CONFIG.hours[d];
        const time = h ? t("timeRange", { a: h[0], b: h[1] }) : t("closedDay");
        const isToday = d === today;
        return `<tr class="${isToday ? "is-today" : ""}"><td>${days[d]}${isToday ? ` <span class="today">· ${t("today")}</span>` : ""}</td><td>${time}</td></tr>`;
      })
      .join("");
  }

  const status = $("#status");
  if (!status || !CONFIG.hoursConfirmed) return;
  const toMin = (s) => { const [hh, mm] = s.split(":").map(Number); return hh * 60 + mm; };
  const mins = now.getHours() * 60 + now.getMinutes();
  const h = CONFIG.hours[today];
  const open = h && mins >= toMin(h[0]) && mins < toMin(h[1]);
  status.dataset.state = open ? "open" : "closed";
  $("span", status).textContent = open ? t("openNow", { t: h[1] }) : t("closedNow", { next: nextOpening() });

  function nextOpening() {
    if (h && mins < toMin(h[0])) return t("opensToday", { t: h[0] });
    for (let i = 1; i <= 7; i++) {
      const d = (today + i) % 7;
      const nh = CONFIG.hours[d];
      if (!nh) continue;
      if (i === 1) return t("opensTomorrow", { t: nh[0] });
      const dayName = ["nl", "sq"].includes(lang) ? days[d].toLowerCase() : days[d];
      return t("opensDay", { d: dayName, t: nh[0] });
    }
    return "";
  }
}

/* ---------- Sprachauswahl ---------- */
(function languageSwitcher() {
  const wrap = $("#lang");
  const btn = $("#lang-btn");
  const list = $("#lang-list");
  if (!wrap || !btn || !list) return;
  const items = $$("[data-lang]", list);

  const toggle = (open) => {
    list.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    wrap.classList.toggle("is-open", open);
    if (open) (items.find((i) => i.dataset.lang === lang) || items[0]).focus();
  };
  btn.addEventListener("click", () => toggle(list.hidden));
  items.forEach((item, i) => {
    item.addEventListener("click", () => { setLanguage(item.dataset.lang); toggle(false); btn.focus(); });
    item.addEventListener("keydown", (e) => {
      const dir = { ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (dir) { e.preventDefault(); items[(i + dir + items.length) % items.length].focus(); }
    });
  });
  document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) toggle(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !list.hidden) { toggle(false); btn.focus(); } });

  // Startsprache: ?lang=… > Sitzung > immer Deutsch
  let start = "de";
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(fromUrl)) start = fromUrl;
  else { try { const s = sessionStorage.getItem("lang"); if (LANGS.includes(s)) start = s; } catch (_) {} }
  setLanguage(start, { remember: start !== "de" });
})();

/* ---------- Header & Navigation ---------- */
(function header() {
  const header = $(".header");
  const nav = $("#nav");
  const burger = $("#burger");

  const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", t(open ? "aria.menuClose" : "aria.menuOpen"));
    document.body.classList.toggle("menu-open", open);
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Aktiven Bereich in der Navigation hervorheben
  const links = $$('a[href^="#"]:not(.btn)', nav);
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.remove("is-active"));
      map.get(en.target.id)?.classList.add("is-active");
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
})();

/* ---------- Speisekarte-Tabs ---------- */
(function tabs() {
  const tabs = $$('[role="tab"]');
  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (dir) { e.preventDefault(); select(tabs[(i + dir + tabs.length) % tabs.length], true); }
      if (e.key === "Home") { e.preventDefault(); select(tabs[0], true); }
      if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });
  // Links, die direkt einen Tab öffnen (z. B. "Zum Grill-Menü")
  $$("[data-open-tab]").forEach((a) =>
    a.addEventListener("click", () => { const t = document.getElementById(a.dataset.openTab); if (t) select(t); })
  );
})();

/* ---------- Scroll-Reveal ---------- */
(function reveal() {
  const els = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((e) => io.observe(e));
})();

/* ---------- Glut-Funken im Hero ---------- */
(function embers() {
  const box = $(".hero__embers");
  if (!box || reduceMotion) return;
  const count = window.innerWidth < 640 ? 14 : 26;
  for (let i = 0; i < count; i++) {
    const e = document.createElement("i");
    const size = 2 + Math.random() * 4;
    e.style.cssText = `left:${35 + Math.random() * 65}%;width:${size}px;height:${size}px;--t:${7 + Math.random() * 9}s;--delay:${-Math.random() * 14}s;--x:${(Math.random() - 0.5) * 160}px`;
    box.appendChild(e);
  }
})();

/* ---------- Leichter Parallax im Grill-Bereich ---------- */
(function parallax() {
  const img = $(".grill__media img");
  const sec = $(".grill");
  if (!img || reduceMotion) return;
  let ticking = false;
  const update = () => {
    const r = sec.getBoundingClientRect();
    const p = (r.top + r.height) / (window.innerHeight + r.height); // 1 → 0
    img.style.transform = `translate3d(0, ${(p - 1) * 16}%, 0)`;
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
})();

/* ---------- Google-Karte erst nach Zustimmung laden (DSGVO) ---------- */
(function mapConsent() {
  const btn = $("#map-load");
  const box = $("#map");
  if (!btn || !box) return;
  btn.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.title = t("mapTitle");
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsQuery)}&hl=${lang}&output=embed`;
    box.innerHTML = "";
    box.appendChild(iframe);
  });
})();
