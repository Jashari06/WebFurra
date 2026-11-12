import { useI18n, plain } from '../lib/i18n.jsx';
import { IMG } from '../config.js';
import SplitText from '../components/reactbits/SplitText/SplitText.jsx';

export default function Tradition() {
  const { t } = useI18n();
  return (
    <section className="tradition section" id="tradition" aria-labelledby="tradition-title">
      <div className="container tradition__grid">
        <div className="tradition__text">
          <p className="kicker reveal">{t('trad.kicker')}</p>
          {/* React Bits: SplitText (beim Hineinscrollen) */}
          <h2 id="tradition-title">
            <SplitText text={plain(t('trad.title'))} tag="span" splitType="words" mask delay={60} duration={1.1} textAlign="left" />
          </h2>
          <p className="reveal">{t('trad.p1')}</p>
          <p className="reveal">{t('trad.p2')}</p>
          <ul className="tradition__list">
            {['trad.l1', 'trad.l2', 'trad.l3'].map((k, i) => (
              <li key={k}><span>0{i + 1}</span><i>{t(k)}</i></li>
            ))}
          </ul>
        </div>

        <div className="tradition__collage">
          <figure className="ph ph--tall"><img loading="lazy" src={IMG('1517686469429-8bdb88b9f907', 900)} alt={t('alt.dough')} /></figure>
          <figure className="ph ph--wide"><img loading="lazy" src={IMG('1606265698533-c17fc6003934', 900)} alt={t('alt.oven')} /></figure>
          <figure className="ph ph--small"><img loading="lazy" src={IMG('1732565649629-eb4932a1ec09', 700)} alt={t('alt.flour')} /></figure>
          <div className="seal" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs><path id="seal-circle" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
              <text><textPath href="#seal-circle">{t('seal')}</textPath></text>
            </svg>
            <span>Furra</span>
          </div>
        </div>
      </div>
    </section>
  );
}
