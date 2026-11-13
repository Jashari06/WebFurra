import { useEffect, useMemo, useRef } from 'react';
import { useI18n, plain } from '../lib/i18n.jsx';
import { IMG } from '../config.js';
import { getLenis } from '../lib/smoothScroll.js';
import CircularGallery from '../components/reactbits/CircularGallery/CircularGallery.jsx';
import SplitText from '../components/reactbits/SplitText/SplitText.jsx';

const PHOTOS = [
  ['1603360946369-dc9bb6258143', 'gal.c1'],
  ['1767124664944-2df3dcb7a83d', 'd.sirnica'], // Foto zeigt Burek mit Käse
  ['assets/img/byrek-me-mish.webp', 'd.burek'], // eigenes Foto: Burek mit Fleisch
  ['1761828122856-8703baac8e86', 'd.baklava'],
  ['assets/img/trilece.webp', 'Trileçe'], // eigenes Foto, Name in allen Sprachen gleich
  ['assets/img/pitalk.webp', 'Pitalk'], // eigenes Foto der Bäckerei
  ['1777199160034-565d154d41e9', 'd.cevapi'],
  ['assets/img/supe-pule.webp', 'gal.soup'], // eigenes Foto: Hühnersuppe
  ['assets/img/vitrine.webp', 'gal.c2'], // eigenes Foto: Theke mit Simit, Kifle & Brot
  ['1774529233247-d3f34ed11994', 'd.coffee'],
  ['assets/img/caffe-croissant.webp', 'Caffè & Croissant'], // eigenes Foto, Name in allen Sprachen gleich
  ['1509440159596-0249088772ff', 'gal.c5'],
];

export default function Gallery() {
  const { t, lang } = useI18n();
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
    () => PHOTOS.map(([id, key]) => ({
      // eigene Fotos liegen unter public/assets/img, alle anderen kommen von Unsplash
      image: id.startsWith('assets/') ? id : IMG(id, 800),
      text: plain(key.includes('.') ? t(key) : key),
    })),
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
          key={lang} /* liest die Beschriftungen nur beim Start: bei Sprachwechsel neu aufbauen */
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
