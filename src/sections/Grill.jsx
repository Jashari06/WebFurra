import { useI18n } from '../lib/i18n.jsx';
import { IMG } from '../config.js';
import ShinyText from '../components/reactbits/ShinyText/ShinyText.jsx';
import Magnet from '../components/reactbits/Magnet/Magnet.jsx';

export default function Grill({ openGrillTab }) {
  const { t } = useI18n();
  return (
    <section className="grill" id="grill" aria-labelledby="grill-title">
      <div className="grill__media" aria-hidden="true">
        <img loading="lazy" src={IMG('1626323109252-0adb3b46692b', 2000)} alt="" />
      </div>
      <div className="container grill__inner">
        <div className="grill__card">
          <p className="kicker kicker--light">
            {/* React Bits: ShinyText */}
            <ShinyText text={t('grill.kicker')} color="#ecbd78" shineColor="#fff3dc" speed={2.6} />
          </p>
          <h2 id="grill-title">{t('grill.title')}</h2>
          <p>{t('grill.p')}</p>
          <div className="grill__chips">
            <span>Ajvar</span><span>Kajmak</span><span>Lepinja</span><span>{t('grill.onions')}</span>
          </div>
          <Magnet padding={60} magnetStrength={4}>
            <a className="btn btn--primary" href="#speisekarte" onClick={openGrillTab}>{t('grill.cta')}</a>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
