/* =========================================================
   Balkan Bäckerei & Grill — GSAP-Animationen
   ---------------------------------------------------------
   Benötigt gsap, ScrollTrigger und SplitText (in index.html).
   Fehlt GSAP oder ist "Bewegung reduzieren" aktiv, greifen
   die einfachen CSS-Übergänge aus main.js / styles.css.
   ========================================================= */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || !window.ScrollTrigger || reduce) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.documentElement.classList.add("gsap-on");

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const EASE = "power3.out";
  gsap.defaults({ ease: EASE, duration: 1 });

  /* ---------- 1. Intro: Header, Headline, Hero-Bild ---------- */
  function intro() {
    const h1 = $("#hero-title");
    const content = $$(".hero__content > *:not(h1)");
    const navItems = $$(".brand, .nav > a, .header__tools");
    const startLang = document.documentElement.lang;

    gsap.set(h1, { opacity: 1, y: 0 });
    const split = SplitText.create(h1, { type: "lines,words", mask: "lines", linesClass: "split-line" });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(".hero__media img", { scale: 1.18, filter: "brightness(.55)" }, { scale: 1, filter: "brightness(1)", duration: 2.4, ease: "power2.out" }, 0)
      .fromTo(navItems, { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.06, clearProps: "transform" }, 0.15)
      .fromTo(content[0], { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.3)
      .fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.07 }, 0.4)
      .fromTo(content.slice(1), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12 }, 0.9)
      .fromTo(".hero__scroll", { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.4)
      .fromTo(".pillar", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12, ease: EASE }, 1.1)
      .add(() => { if (document.documentElement.lang === startLang) split.revert(); });
  }

  /* ---------- 2. Hero beim Scrollen ---------- */
  function heroScroll() {
    gsap.to(".hero__media", {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__content", {
      y: -80, autoAlpha: 0.15, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "20% top", end: "bottom top", scrub: true },
    });
  }

  /* ---------- 3. Allgemeine Einblendungen ---------- */
  const special = ".ph, .g, .seal, .grill__card, .visit__map";
  function genericReveals() {
    const els = $$(".reveal").filter((el) => !el.matches(special));
    gsap.set(els, { autoAlpha: 0, y: 40 });
    ScrollTrigger.batch(els, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12, overwrite: true }),
    });
    // Absätze & Liste im Traditionsblock einzeln nachziehen
    gsap.from(".tradition__list li", {
      x: -30, autoAlpha: 0, duration: 0.9, stagger: 0.1,
      scrollTrigger: { trigger: ".tradition__list", start: "top 85%", once: true },
    });
  }

  /* ---------- 4. Bild-Collage (Tradition) ---------- */
  function collage() {
    $$(".tradition__collage .ph").forEach((ph, i) => {
      const img = $("img", ph);
      gsap.set(ph, { autoAlpha: 1, y: 0 });
      gsap.timeline({ scrollTrigger: { trigger: ph, start: "top 85%", once: true } })
        .fromTo(ph, { clipPath: "inset(100% 0% 0% 0% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.4, ease: "expo.inOut", delay: i * 0.12 })
        .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "expo.out" }, "<0.2");
    });
    // unterschiedliche Parallax-Geschwindigkeiten
    gsap.to(".ph--wide", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".tradition", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.to(".ph--small", { yPercent: -22, ease: "none", scrollTrigger: { trigger: ".tradition", start: "top bottom", end: "bottom top", scrub: true } });

    const seal = $(".seal");
    if (seal) {
      gsap.fromTo(seal, { scale: 0, autoAlpha: 0, y: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: "back.out(1.8)", scrollTrigger: { trigger: seal, start: "top 92%", once: true } });
      gsap.to(seal, { rotation: 140, ease: "none", scrollTrigger: { trigger: ".tradition", start: "top bottom", end: "bottom top", scrub: 1 } });
    }
  }

  /* ---------- 5. Kilim-Band läuft mit dem Scrollen ---------- */
  function kilim() {
    $$(".kilim").forEach((k) => {
      gsap.fromTo(k, { backgroundPosition: "0px 50%" }, {
        backgroundPosition: "-520px 50%", ease: "none",
        scrollTrigger: { trigger: k, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }

  /* ---------- 6. Speisekarte ---------- */
  function animatePanel(panel, first = false) {
    if (!panel) return;
    const img = $(".panel__img", panel);
    const dishes = $$(".dish", panel);
    const tl = gsap.timeline();
    tl.fromTo(img, { clipPath: "inset(0% 0% 100% 0% round 22px)" }, { clipPath: "inset(0% 0% 0% 0% round 22px)", duration: first ? 1.3 : 0.9, ease: "expo.inOut" })
      .fromTo($("img", img), { scale: 1.25 }, { scale: 1, duration: 1.4, ease: "expo.out" }, "<0.1")
      .fromTo(dishes, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07 }, first ? 0.3 : 0.1);
    return tl;
  }
  function menu() {
    const first = $(".panel:not([hidden])");
    gsap.set($$(".dish", first), { autoAlpha: 0 });
    gsap.set($(".panel__img", first), { clipPath: "inset(0% 0% 100% 0% round 22px)" });
    ScrollTrigger.create({ trigger: ".panel", start: "top 80%", once: true, onEnter: () => animatePanel($(".panel:not([hidden])"), true) });

    // Tab-Wechsel (main.js schaltet das Panel um, wir animieren danach)
    const onSwitch = () => requestAnimationFrame(() => { animatePanel($(".panel:not([hidden])")); ScrollTrigger.refresh(); });
    $$('[role="tab"]').forEach((t) => {
      t.addEventListener("click", onSwitch);
      t.addEventListener("keydown", (e) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) onSwitch(); });
    });
    $$("[data-open-tab]").forEach((a) => a.addEventListener("click", onSwitch));
  }

  /* ---------- 7. Grill-Bereich ---------- */
  function grill() {
    gsap.fromTo(".grill__media img", { yPercent: -16 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: ".grill", start: "top bottom", end: "bottom top", scrub: true },
    });
    const card = $(".grill__card");
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".grill", start: "top 70%", once: true } });
    tl.fromTo(card, { x: 80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.2 })
      .from($$(".kicker, h2, p", card), { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.9 }, "<0.25")
      .from($$(".grill__chips span", card), { scale: 0.6, autoAlpha: 0, stagger: 0.07, duration: 0.6, ease: "back.out(2)" }, "<0.4")
      .from($(".btn", card), { y: 16, autoAlpha: 0, duration: 0.7 }, "<0.2");
  }

  /* ---------- 8. Galerie ---------- */
  function gallery() {
    const items = $$(".g");
    gsap.set(items, { autoAlpha: 0, y: 0 });
    ScrollTrigger.batch(items, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(batch, { clipPath: "inset(18% 18% 18% 18% round 14px)", autoAlpha: 0 }, { clipPath: "inset(0% 0% 0% 0% round 14px)", autoAlpha: 1, duration: 1.3, stagger: 0.12, ease: "expo.out" });
        gsap.fromTo(batch.map((b) => $("img", b)), { scale: 1.3 }, { scale: 1, duration: 1.6, stagger: 0.12, ease: "expo.out" });
      },
    });
  }

  /* ---------- 9. Besuch & Karte ---------- */
  function visit() {
    const map = $(".visit__map");
    gsap.set(map, { autoAlpha: 1, y: 0 });
    gsap.fromTo(map, { clipPath: "inset(0% 0% 0% 100% round 22px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 1.4, ease: "expo.inOut",
      scrollTrigger: { trigger: map, start: "top 85%", once: true },
    });
    gsap.from("#hours-table tr", {
      x: -20, autoAlpha: 0, duration: 0.6, stagger: 0.05,
      scrollTrigger: { trigger: "#hours-table", start: "top 88%", once: true },
    });
    gsap.from(".footer__inner > *", {
      y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.9,
      scrollTrigger: { trigger: ".footer", start: "top 92%", once: true },
    });
  }

  /* ---------- 10. Magnetische Buttons (nur Maus) ---------- */
  function magnetic() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    $$(".btn--primary").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Start ---------- */
  // Schriften abwarten, damit die Zeilen der Headline richtig gemessen werden
  const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);
  fontsReady.then(() => {
    intro();
    heroScroll();
    genericReveals();
    collage();
    kilim();
    menu();
    grill();
    gallery();
    visit();
    magnetic();
    ScrollTrigger.refresh();
  });

  // Nach Sprachwechsel oder Bildladen Positionen neu berechnen
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => setTimeout(() => ScrollTrigger.refresh(), 60)));
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
