// Build-time rendering: turns the app into plain HTML for one language,
// so search engines and AI crawlers see the full text without running JavaScript.
// Used by scripts/prerender.mjs (not loaded in the browser).
import { renderToString } from 'react-dom/server';
import { I18nProvider } from './lib/i18n.jsx';
import App from './App.jsx';

export { I18N, LANGS } from './i18n.js';
export { CONFIG, mapsQuery } from './config.js';

export function render(lang) {
  return renderToString(
    <I18nProvider initialLang={lang}>
      <App />
    </I18nProvider>
  );
}
