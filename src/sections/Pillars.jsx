import { Html } from '../lib/i18n.jsx';
import SpotlightCard from '../components/reactbits/SpotlightCard/SpotlightCard.jsx';

const ICONS = [
  <svg viewBox="0 0 40 40" aria-hidden="true" key="oven"><path d="M6 30c3-10 9-14 14-14s11 4 14 14" /><path d="M10 30c2-6 5-9 10-9s8 3 10 9" /><path d="M4 30h32" /><path d="M14 11c0-3 3-3 3-6M21 11c0-3 3-3 3-6" /></svg>,
  <svg viewBox="0 0 40 40" aria-hidden="true" key="grill"><path d="M5 22h30" /><path d="M8 22c0 7 5 12 12 12s12-5 12-12" /><path d="M13 17c0-3 3-4 3-7 0 3 3 4 3 7M21 17c0-3 3-4 3-7 0 3 3 4 3 7" /></svg>,
  <svg viewBox="0 0 40 40" aria-hidden="true" key="recipe"><path d="M20 4 34 20 20 36 6 20Z" /><path d="M20 12l8 8-8 8-8-8Z" /><circle cx="20" cy="20" r="1.6" /></svg>,
];

export default function Pillars() {
  return (
    <div className="pillars" role="list">
      {['pillar1', 'pillar2', 'pillar3'].map((k, i) => (
        /* React Bits: SpotlightCard */
        <SpotlightCard
          key={k}
          className="pillar"
          spotlightColor="rgba(236, 189, 120, 0.28)"
          intensity={0.22}
          spotlightSize={220}
          borderGlow={0.7}
          theme="dark"
          role="listitem"
        >
          {ICONS[i]}
          <Html k={k} />
        </SpotlightCard>
      ))}
    </div>
  );
}
