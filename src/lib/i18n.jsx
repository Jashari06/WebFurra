import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18N, LANGS } from '../i18n.js';

/* Jede Sprache hat ihre eigene Adresse: / (Deutsch), /en/, /nl/, /sq/.
   Ein frischer Besuch auf / ist immer Deutsch. */
const BASE = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';

/** Sprache aus dem Pfad lesen, z. B. "/en/" → "en" */
export function langFromPath(pathname) {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
  const first = rest.split('/')[0];
  return LANGS.includes(first) && first !== 'de' ? first : 'de';
}

/** Pfad einer Sprache, z. B. "en" → "/en/" */
export const langPath = (lang) => (lang === 'de' ? BASE : `${BASE}${lang}/`);

function browserInitialLang() {
  if (typeof window === 'undefined') return 'de';
  // Alte Links mit ?lang=en weiter unterstützen
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
  } catch (_) { /* ignore */ }
  return langFromPath(location.pathname);
}

const I18nContext = createContext(null);

export function I18nProvider({ children, initialLang }) {
  const [lang, setLang] = useState(() => initialLang || browserInitialLang());

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
    // Adresse an die Sprache anpassen (ohne Neuladen), Abschnitt (#…) behalten
    const target = langPath(lang);
    if (location.pathname !== target || location.search) {
      history.replaceState(null, '', target + location.hash);
    }
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
