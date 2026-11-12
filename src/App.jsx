import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from './lib/i18n.jsx';
import { useSmoothScroll } from './lib/smoothScroll.js';
import { useScrollAnimations } from './lib/useScrollAnimations.js';
import ClickSpark from './components/reactbits/ClickSpark/ClickSpark.jsx';
import Header from './sections/Header.jsx';
import Hero from './sections/Hero.jsx';
import Pillars from './sections/Pillars.jsx';
import Tradition from './sections/Tradition.jsx';
import Menu from './sections/Menu.jsx';
import Grill from './sections/Grill.jsx';
import Gallery from './sections/Gallery.jsx';
import Visit from './sections/Visit.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState('ofen');

  useSmoothScroll();      // Lenis
  useScrollAnimations();  // GSAP ScrollTrigger

  // Nach Sprachwechsel ändern sich Texthöhen → Trigger neu messen
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, [lang]);

  const openGrillTab = useCallback(() => setActiveTab('grill'), []);

  return (
    /* React Bits: ClickSpark – kleine Glutfunken bei jedem Klick */
    <ClickSpark sparkColor={['#ecbd78', '#e38b3f', '#ffd59a']} sparkSize={11} sparkRadius={22} sparkCount={9} duration={480}>
      <a className="skip" href="#main">{t('skip')}</a>
      <Header />
      <main id="main">
        <Hero />
        <Pillars />
        <Tradition />
        <div className="kilim" aria-hidden="true" />
        <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
        <Grill openGrillTab={openGrillTab} />
        <Gallery />
        <Visit />
      </main>
      <Footer />
    </ClickSpark>
  );
}
