import { useState } from 'react';
import { useI18n, Html } from '../lib/i18n.jsx';
import { CONFIG, IMG } from '../config.js';
import { hoursRows } from '../lib/hours.js';
import Particles from '../components/reactbits/Particles/Particles.jsx';
import Magnet from '../components/reactbits/Magnet/Magnet.jsx';

export default function Visit() {
  const { t, lang } = useI18n();
  const [mapLoaded, setMapLoaded] = useState(false);
  const routeHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONFIG.mapsQuery)}`;
  const tel = `tel:${CONFIG.phoneDial}`;

  return (
    <section className="visit section" id="besuch" aria-labelledby="visit-title">
      {/* React Bits: Particles – leise Glut im Hintergrund */}
      <div className="visit__particles" aria-hidden="true">
        <Particles
          particleCount={70}
          particleSpread={14}
          speed={0.04}
          particleColors={['#e38b3f', '#ecbd78', '#a63a22']}
          particleBaseSize={60}
          alphaParticles
          glow={0.6}
          twinkle={0.4}
          drift="up"
          driftSpeed={0.4}
          moveParticlesOnHover={false}
          clickBurst={false}
          opacity={0.55}
          disableRotation
        />
      </div>

      <div className="container visit__grid">
        <div className="visit__info">
          <p className="kicker kicker--light reveal">{t('visit.kicker')}</p>
          <Html as="h2" id="visit-title" k="visit.title" className="reveal" />

          <dl className="facts reveal">
            <div>
              <dt>{t('visit.address')}</dt>
              <dd dangerouslySetInnerHTML={{ __html: CONFIG.address }} />
            </div>
            <div>
              <dt>{t('visit.phone')}</dt>
              <dd><a href={tel}>{CONFIG.phoneDisplay}</a></dd>
            </div>
          </dl>

          <div className="hours reveal">
            <h3>{t('visit.hours')}</h3>
            <table id="hours-table">
              <tbody>
                {hoursRows(t).map((r) => (
                  <tr key={r.day} className={r.isToday ? 'is-today' : undefined}>
                    <td>{r.day}{r.isToday && <span className="today"> · {t('today')}</span>}</td>
                    <td>{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="visit__actions reveal">
            <Magnet padding={60} magnetStrength={4} wrapperClassName="magnet">
              <a className="btn btn--primary" href={routeHref} target="_blank" rel="noopener">{t('nav.route')}</a>
            </Magnet>
            <a className="btn btn--ghost" href={tel}>{t('visit.call')}</a>
          </div>
        </div>

        <div className="visit__map">
          <div className="map">
            {mapLoaded ? (
              <iframe
                title={t('mapTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsQuery)}&hl=${lang}&output=embed`}
              />
            ) : (
              <>
                <img className="map__preview" loading="lazy" src={IMG('1657498023828-1e0181449d9f', 1100)} alt={t('alt.bakery')} />
                <div className="map__overlay">
                  <p>{t('map.q')}</p>
                  <small>{t('map.note')}</small>
                  <button className="btn btn--primary" type="button" onClick={() => setMapLoaded(true)}>{t('map.btn')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
