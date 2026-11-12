import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18N, LANGS } from '../i18n.js';

/* Startsprache: ?lang=… > laufende Sitzung > immer Deutsch */
function initialLang() {
  try {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    const s = sessionStorage.getItem('lang');
    if (LANGS.includes(s)) return s;
  } catch (_) { /* privates Fenster o. ä. */ }
  return 'de';
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  const t = useCallback(
    (key, vars = {}) => {
      const val = I18N[lang]?.[key] ?? I18N.de[key] ?? key;
      return typeof val === 'string' ? val.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : val;
    },
    [lang]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.desc'));
    try { sessionStorage.setItem('lang', lang); } catch (_) {}
    const url = new URL(location.href);
    if (lang === 'de') url.searchParams.delete('lang');
    else url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

/** Übersetzung mit erlaubtem Inline-HTML (<br>, <em>, <b>, <small>) aus i18n.js */
export function Html({ k, as: Tag = 'span', ...props }) {
  const { t } = useI18n();
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: t(k) }} />;
}

/** Inline-HTML entfernen (für Text-Animationen, die reinen Text brauchen) */
export const plain = (s) =>
  String(s).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
