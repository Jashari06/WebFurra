import { useEffect, useMemo, useRef } from 'react';
import { useI18n, plain } from '../lib/i18n.jsx';
import { IMG } from '../config.js';
import { getLenis } from '../lib/smoothScroll.js';
import CircularGallery from '../components/reactbits/CircularGallery/CircularGallery.jsx';
import SplitText from '../components/reactbits/SplitText/SplitText.jsx';

const PHOTOS = [
  ['1603360946369-dc9bb6258143', 'gal.c1'],
  ['1767124664944-2df3dcb7a83d', 'd.burek'],
  ['1761828122856-8703baac8e86', 'd.baklava'],
  ['1640625314547-aee9a7696589', 'Pitalk'],
  ['1777199160034-565d154d41e9', 'd.cevapi'],
  ['1604908552986-eb22824b2150', 'gal.c2'],
  ['1774529233247-d3f34ed11994', 'd.coffee'],
  ['1509440159596-0249088772ff', 'gal.c5'],
];

export default function Gallery() {
  const { t } = useI18n();
  const stageRef = useRef(null);

  // Vertikales Mausrad scrollt die Seite weiter (statt in der Galerie hängen zu bleiben);
  // nur seitliches Wischen (Trackpad) bewegt die Galerie.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.stopPropagation();
      const lenis = getLenis();
      if (lenis) {
        e.preventDefault();
        lenis.scrollTo(lenis.targetScroll + e.deltaY);
      }
    };
    stage.addEventListener('wheel', onWheel, { capture: true, passive: false });
    return () => stage.removeEventListener('wheel', onWheel, { capture: true });
  }, []);

  // Ohne WebGL2 (alte Geräte, gesperrte GPU) zeigt die Galerie eine einfache Foto-Reihe
  const hasWebGL = useMemo(() => {
    try { return !!document.createElement('canvas').getContext('webgl2'); } catch (_) { return false; }
  }, []);

  const items = useMemo(
    () => PHOTOS.map(([id, key]) => ({ image: IMG(id, 800), text: plain(key.includes('.') ? t(key) : key) })),
    [t]
  );

  return (
    <section className="gallery section" id="galerie" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section__head">
          <p className="kicker reveal">{t('gal.kicker')}</p>
          <h2 id="gallery-title">
            <SplitText text={t('gal.title')} tag="span" splitType="chars" delay={30} duration={0.9} />
          </h2>
          <p className="section__intro reveal">{t('gal.hint')}</p>
        </header>
      </div>
      {/* React Bits: CircularGallery (WebGL) – ziehen, wischen oder Pfeiltasten */}
      {!hasWebGL ? (
        <div className="gallery__fallback reveal">
          {items.map((it) => (
            <figure key={it.image}><img loading="lazy" src={it.image} alt={it.text} /><figcaption>{it.text}</figcaption></figure>
          ))}
        </div>
      ) : (
      <div className="gallery__stage reveal" ref={stageRef}>
        <CircularGallery
          items={items}
          bend={2.2}
          textColor="#2a1c13"
          borderRadius={0.06}
          font="500 30px Fraunces"
          fontUrl="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&display=swap"
          scrollSpeed={2}
          scrollEase={0.06}
          itemSize={1}
          gap={0.24}
          shadow={0.3}
          autoScroll={0.35}
          openOnClick={false}
        />
      </div>
      )}
    </section>
  );
}
