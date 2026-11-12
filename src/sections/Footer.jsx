import { useI18n, Html } from '../lib/i18n.jsx';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="kilim kilim--dark" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <img className="footer__logo" src="assets/img/logo.webp" width="1254" height="1254" alt="Balkan Bäckerei & Grill" loading="lazy" />
          <div>
            <p className="footer__name">Balkan Bäckerei &amp; Grill</p>
            <Html as="p" className="footer__tag" k="footer.tag" />
          </div>
        </div>
        <nav className="footer__nav" aria-label={t('aria.footer')}>
          <a href="#speisekarte">{t('nav.menu')}</a>
          <a href="#besuch">{t('visit.hours')}</a>
          <a href="impressum.html">{t('footer.imprint')}</a>
          <a href="datenschutz.html">{t('footer.privacy')}</a>
        </nav>
        <p className="footer__copy">© {new Date().getFullYear()} Balkan Bäckerei &amp; Grill · {t('footer.photos')}</p>
      </div>
    </footer>
  );
}
