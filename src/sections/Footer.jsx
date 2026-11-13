import { useI18n, Html } from '../lib/i18n.jsx';
import { asset } from '../config.js';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="kilim kilim--dark" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <img className="footer__logo" src={asset('assets/img/logo.webp')} width="1254" height="1254" alt="Balkan Bäckerei & Grill" loading="lazy" />
          <div>
            <p className="footer__name">Balkan Bäckerei &amp; Grill</p>
            <Html as="p" className="footer__tag" k="footer.tag" />
          </div>
        </div>
        <nav className="footer__nav" aria-label={t('aria.footer')}>
          <a href="#speisekarte">{t('nav.menu')}</a>
          <a href="#besuch">{t('visit.hours')}</a>
          <a href={asset('impressum.html')}>{t('footer.imprint')}</a>
          <a href={asset('datenschutz.html')}>{t('footer.privacy')}</a>
        </nav>
        <div className="footer__copy">
          <span>© {new Date().getFullYear()} Balkan Bäckerei &amp; Grill · {t('footer.rights')}</span>
          <span className="footer__credit">Powered by <b>DARD</b></span>
        </div>
      </div>
    </footer>
  );
}
