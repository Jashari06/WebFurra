import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n, Html, plain } from '../lib/i18n.jsx';
import { IMG } from '../config.js';
import { prefersReducedMotion } from '../lib/smoothScroll.js';
import SplitText from '../components/reactbits/SplitText/SplitText.jsx';
import BlurText from '../components/reactbits/BlurText/BlurText.jsx';

/* Preise: in i18n bleibt der Name; Preis hier ergänzen, z. B. price: '4,50 €' */
export const PANELS = [
  { id: 'ofen', tab: 'tab.oven', img: '1785884040273-345673bee948', alt: 'alt.pastry',
    dishes: ['burek', 'sirnica', 'zeljanica', 'krompirusa', 'lepinja', 'pogaca'].map((k) => ({ k })) },
  { id: 'grill', tab: 'tab.grill', img: '1777199160034-565d154d41e9', alt: 'alt.cevapi',
    dishes: ['cevapi', 'pljeskavica', 'filled', 'sudzuk', 'chicken', 'platter'].map((k) => ({ k })) },
  { id: 'suess', tab: 'tab.sweet', img: '1761828122856-8703baac8e86', alt: 'alt.baklava',
    dishes: ['baklava', 'tulumbe', 'kadaif', 'tufahija'].map((k) => ({ k })) },
  { id: 'trinken', tab: 'tab.drinks', img: '1774529233247-d3f34ed11994', alt: 'alt.coffee',
    dishes: ['coffee', 'yogurt', 'tea', 'soft'].map((k) => ({ k })) },
];

export default function Menu({ activeTab, setActiveTab }) {
  const { t, lang } = useI18n();
  const tabRefs = useRef([]);
  const panelRef = useRef(null);
  const seen = useRef(false);
  const idx = PANELS.findIndex((p) => p.id === activeTab);
  const panel = PANELS[idx];

  // Panel-Animation: beim ersten Hineinscrollen und bei jedem Tab-Wechsel
  useEffect(() => {
    const el = panelRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    const img = el.querySelector('.panel__img');
    const dishes = el.querySelectorAll('.dish');
    const ctx = gsap.context(() => {
      const play = (first) =>
        gsap.timeline()
          .fromTo(img, { clipPath: 'inset(0% 0% 100% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: first ? 1.3 : 0.9, ease: 'expo.inOut' })
          .fromTo(img.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1.4, ease: 'expo.out', clearProps: 'transform' }, '<0.1')
          .fromTo(dishes, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, first ? 0.3 : 0.1);

      if (seen.current) play(false);
      else {
        gsap.set(img, { clipPath: 'inset(0% 0% 100% 0% round 22px)' });
        gsap.set(dishes, { opacity: 0 });
        ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => { seen.current = true; play(true); } });
      }
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [activeTab]);

  const onKey = (e, i) => {
    const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: PANELS.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (map[e.key] + PANELS.length) % PANELS.length;
    setActiveTab(PANELS[n].id);
    tabRefs.current[n]?.focus();
  };

  return (
    <section className="menu section" id="speisekarte" aria-labelledby="menu-title">
      <div className="container">
        <header className="section__head">
          <p className="kicker reveal">{t('menu.kicker')}</p>
          <h2 id="menu-title">
            <SplitText text={plain(t('menu.title'))} tag="span" splitType="words" mask delay={60} duration={1.1} />
          </h2>
          <BlurText key={lang} text={t('menu.intro')} className="section__intro section__intro--blur" animateBy="words" delay={25} direction="bottom" />
        </header>

        <div className="tabs reveal" role="tablist" aria-label={t('aria.tabs')}>
          {PANELS.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={p.id === activeTab}
              aria-controls={`panel-${p.id}`}
              tabIndex={p.id === activeTab ? 0 : -1}
              onClick={() => setActiveTab(p.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {t(p.tab)}
            </button>
          ))}
        </div>

        <div className="panel" role="tabpanel" id={`panel-${panel.id}`} aria-labelledby={`tab-${panel.id}`} ref={panelRef} key={panel.id}>
          <figure className="panel__img"><img loading="lazy" src={IMG(panel.img)} alt={t(panel.alt)} /></figure>
          <ul className="dishes">
            {panel.dishes.map(({ k, price }) => (
              <li className="dish" key={k}>
                <div className="dish__top">
                  <Html as="h3" k={`d.${k}`} />
                  {price && <span className="dish__price">{price}</span>}
                </div>
                <p>{t(`d.${k}.p`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
