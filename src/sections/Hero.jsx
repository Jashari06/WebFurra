import { useI18n } from '../lib/i18n.jsx';
import { openStatus } from '../lib/hours.js';
import { IMG } from '../config.js';
import Particles from '../components/reactbits/Particles/Particles.jsx';
import SplitText from '../components/reactbits/SplitText/SplitText.jsx';
import BlurText from '../components/reactbits/BlurText/BlurText.jsx';
import ShinyText from '../components/reactbits/ShinyText/ShinyText.jsx';
import Magnet from '../components/reactbits/Magnet/Magnet.jsx';

export default function Hero() {
  const { t, lang } = useI18n();
  const status = openStatus(t, lang);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <img src={IMG('1767124664944-2df3dcb7a83d', 2000)} alt="" fetchPriority="high" />
      </div>

      {/* React Bits: Particles – aufsteigende Glut */}
      <div className="hero__particles" aria-hidden="true">
        <Particles
          particleCount={140}
          particleSpread={12}
          speed={0.08}
          particleColors={['#ffd59a', '#e38b3f', '#ecbd78', '#a63a22']}
          particleBaseSize={70}
          sizeRandomness={1.2}
          alphaParticles
          glow={0.9}
          twinkle={0.5}
          drift="up"
          driftSpeed={0.7}
          moveParticlesOnHover
          particleHoverFactor={0.6}
          disableRotation
          clickBurst
        />
      </div>

      <div className="hero__content">
        <p className="eyebrow">
          <span className="status" data-state={status?.state ?? 'unknown'}>
            <i />
            {/* React Bits: ShinyText */}
            <ShinyText text={status?.text ?? 'Bad Neuenahr-Ahrweiler'} color="#e9d9c2" shineColor="#ffffff" speed={3} />
          </span>
        </p>

        {/* React Bits: SplitText */}
        <h1 id="hero-title" aria-label={`${t('hero.title1')} ${t('hero.title2')}`}>
          <SplitText
            text={t('hero.title1')}
            tag="span"
            className="hero__line"
            splitType="words"
            mask
            delay={70}
            duration={1.3}
            textAlign="left"
            trigger="load"
          />
          <br />
          <em>
            <SplitText
              text={t('hero.title2')}
              tag="span"
              className="hero__line"
              splitType="words"
              mask
              delay={70}
              duration={1.3}
              textAlign="left"
              trigger="load"
            />
          </em>
        </h1>

        {/* React Bits: BlurText */}
        <BlurText
          key={lang}
          text={t('hero.lead')}
          className="hero__lead"
          animateBy="words"
          direction="bottom"
          delay={35}
          stepDuration={0.4}
          trigger="load"
        />

        <div className="hero__actions">
          {/* React Bits: Magnet */}
          <Magnet padding={70} magnetStrength={4} wrapperClassName="magnet">
            <a className="btn btn--primary" href="#speisekarte">{t('hero.cta1')}</a>
          </Magnet>
          <a className="btn btn--ghost" href="#besuch">{t('hero.cta2')}</a>
        </div>
      </div>

      <a className="hero__scroll" href="#tradition" aria-label={t('aria.scroll')}><span /></a>
    </section>
  );
}
