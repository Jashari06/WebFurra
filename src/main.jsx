import { createRoot } from 'react-dom/client';
import { I18nProvider } from './lib/i18n.jsx';
import App from './App.jsx';
import './styles.css';

// Kein <StrictMode>: Dessen doppeltes Mounten im Dev-Modus verwirft die WebGL-Kontexte
// der React-Bits-Komponenten (Particles, CircularGallery) – die Canvas bleiben sonst leer/weiß.
createRoot(document.getElementById('root')).render(
  <I18nProvider>
    <App />
  </I18nProvider>
);
