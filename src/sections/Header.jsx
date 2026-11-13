import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../lib/i18n.jsx';
import { LANGS, I18N } from '../i18n.js';
import { getLenis } from '../lib/smoothScroll.js';

const SECTIONS = [
  ['tradition', 'nav.tradition'],
  ['speisekarte', 'nav.menu'],
  ['grill', 'nav.grill'],
  ['galerie', 'nav.gallery'],
  ['besuch', 'nav.visit'],
];

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [active, setActive] = useState(null);
  const langRef = useRef(null);
  const langBtnRef = useRef(null);
  const itemRefs = useRef([]);

  // Header wird beim Scrollen dunkel
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Aktiven Bereich hervorheben
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // Mobiles Menü: Seite (und Lenis) anhalten
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    const lenis = getLenis();
    if (menuOpen) lenis?.stop(); else lenis?.start();
  }, [menuOpen]);

  // Sprachmenü schließen bei Klick außerhalb / Escape
  useEffect(() => {
    const onDoc = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (langOpen) { setLangOpen(false); langBtnRef.current?.focus(); }
      setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, [langOpen]);

  useEffect(() => {
    if (langOpen) itemRefs.current[LANGS.indexOf(lang)]?.focus();
  }, [langOpen, lang]);

  const choose = (l) => { setLang(l); setLangOpen(false); langBtnRef.current?.focus(); };

  return (
    <header className={`header${solid ? ' is-solid' : ''}`} id="top">
      <div className="header__inner">
        <a className="brand" href="#top" aria-label={t('aria.home')}>
          <img className="brand__logo" src="assets/img/logo.webp" width="1254" height="1254" alt="Balkan Bäckerei & Grill" />
          <span className="brand__text">
            <span className="brand__name">Balkan Bäckerei</span>
            <span className="brand__sub">&amp; Grill<span className="brand__dot"> · </span><span className="brand__place">Bad Neuenahr-Ahrweiler</span></span>
          </span>
        </a>

        <nav className={`nav${menuOpen ? ' is-open' : ''}`} id="nav" aria-label={t('aria.nav')}>
          {SECTIONS.map(([id, key]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined} onClick={() => setMenuOpen(false)}>
              {t(key)}
            </a>
          ))}
          <a className="btn btn--primary nav__cta" href="#besuch" onClick={() => setMenuOpen(false)}>{t('nav.route')}</a>
        </nav>

        <div className="header__tools">
          <div className={`lang${langOpen ? ' is-open' : ''}`} ref={langRef}>
            <button
              ref={langBtnRef}
              className="lang__btn"
              type="button"
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-controls="lang-list"
              aria-label={t('aria.lang')}
              onClick={() => setLangOpen((o) => !o)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></svg>
              <span>{lang.toUpperCase()}</span>
              <svg className="lang__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {langOpen && (
              <ul className="lang__list" id="lang-list" role="menu">
                {LANGS.map((l, i) => (
                  <li role="none" key={l}>
                    <button
                      ref={(el) => (itemRefs.current[i] = el)}
                      role="menuitemradio"
                      type="button"
                      lang={l}
                      aria-checked={l === lang}
                      onClick={() => choose(l)}
                      onKeyDown={(e) => {
                        const dir = { ArrowDown: 1, ArrowUp: -1 }[e.key];
                        if (dir) { e.preventDefault(); itemRefs.current[(i + dir + LANGS.length) % LANGS.length]?.focus(); }
                      }}
                    >
                      <b>{l.toUpperCase()}</b> {I18N[l].label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="burger"
            aria-label={t(menuOpen ? 'aria.menuClose' : 'aria.menuOpen')}
            aria-expanded={menuOpen}
            aria-controls="nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
