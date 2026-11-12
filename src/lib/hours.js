import { CONFIG } from '../config.js';

const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

/** Tabelle Mo–So in Anzeige-Reihenfolge */
export function hoursRows(t) {
  const days = t('days');
  const today = new Date().getDay();
  return [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const h = CONFIG.hours[d];
    return {
      day: days[d],
      isToday: d === today,
      time: h ? t('timeRange', { a: h[0], b: h[1] }) : t('closedDay'),
    };
  });
}

/** Live-Status ("Jetzt geöffnet …") – null, solange die Zeiten nicht bestätigt sind */
export function openStatus(t, lang) {
  if (!CONFIG.hoursConfirmed) return null;
  const now = new Date();
  const today = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const h = CONFIG.hours[today];
  const open = h && mins >= toMin(h[0]) && mins < toMin(h[1]);
  if (open) return { state: 'open', text: t('openNow', { t: h[1] }) };

  let next = '';
  if (h && mins < toMin(h[0])) next = t('opensToday', { t: h[0] });
  else {
    const days = t('days');
    for (let i = 1; i <= 7; i++) {
      const d = (today + i) % 7;
      const nh = CONFIG.hours[d];
      if (!nh) continue;
      if (i === 1) next = t('opensTomorrow', { t: nh[0] });
      else next = t('opensDay', { d: ['nl', 'sq'].includes(lang) ? days[d].toLowerCase() : days[d], t: nh[0] });
      break;
    }
  }
  return { state: 'closed', text: t('closedNow', { next }) };
}
