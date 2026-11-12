import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './smoothScroll.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP-Scroll-Animationen für die ganze Seite.
 * Text-Effekte (SplitText, BlurText, ShinyText) kommen aus React Bits;
 * hier: Intro, Parallax, Bild-Wipes, Einblendungen.
 */
export function useScrollAnimations() {
  // useLayoutEffect: Startzustände setzen, bevor der Browser zeichnet (kein Aufblitzen)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add('reduced');
      return undefined;
    }
    document.documentElement.classList.add('gsap-on');
    const q = (s) => [...document.querySelectorAll(s)];
    const EASE = 'power3.out';

    const ctx = gsap.context(() => {
      /* ---------- Intro ---------- */
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.hero__media img', { scale: 1.18, filter: 'brightness(.55)' }, { scale: 1, filter: 'brightness(1)', duration: 2.4, ease: 'power2.out' }, 0)
        .fromTo(q('.brand, .nav > a, .header__tools'), { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.06, clearProps: 'transform' }, 0.15)
        .fromTo('.hero .eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.3)
        .fromTo('.hero__actions', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 1.0)
        .fromTo('.hero__scroll', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8 }, 1.4)
        .fromTo('.pillar', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: EASE }, 1.1);

      /* ---------- Hero beim Scrollen ---------- */
      const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__media', { yPercent: 18, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero__content', { y: -80, opacity: 0.15, ease: 'none', scrollTrigger: { ...heroST, start: '20% top' } });

      /* ---------- Allgemeine Einblendungen (.reveal) ---------- */
      const reveals = q('.reveal');
      gsap.set(reveals, { opacity: 0, y: 40 });
      ScrollTrigger.batch(reveals, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: EASE, overwrite: true }),
      });

      gsap.from('.tradition__list li', {
        x: -30, opacity: 0, duration: 0.9, stagger: 0.1, ease: EASE,
        scrollTrigger: { trigger: '.tradition__list', start: 'top 88%', once: true },
      });

      /* ---------- Collage ---------- */
      q('.tradition__collage .ph').forEach((ph, i) => {
        gsap.timeline({ scrollTrigger: { trigger: ph, start: 'top 88%', once: true } })
          .fromTo(ph, { clipPath: 'inset(100% 0% 0% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.4, ease: 'expo.inOut', delay: i * 0.12 })
          .fromTo(ph.querySelector('img'), { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, '<0.2');
      });
      const tradST = { trigger: '.tradition', start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.to('.ph--wide', { yPercent: -12, ease: 'none', scrollTrigger: tradST });
      gsap.to('.ph--small', { yPercent: -22, ease: 'none', scrollTrigger: tradST });
      gsap.fromTo('.seal', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.seal', start: 'top 94%', once: true } });
      gsap.to('.seal', { rotation: 140, ease: 'none', scrollTrigger: { ...tradST, scrub: 1 } });

      /* ---------- Kilim-Band ---------- */
      q('.kilim').forEach((k) => {
        gsap.fromTo(k, { backgroundPosition: '0px 50%' }, {
          backgroundPosition: '-520px 50%', ease: 'none',
          scrollTrigger: { trigger: k, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      /* ---------- Grill ---------- */
      gsap.fromTo('.grill__media img', { yPercent: -16 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.grill', start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.timeline({ scrollTrigger: { trigger: '.grill', start: 'top 70%', once: true } })
        .fromTo('.grill__card', { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: EASE })
        .from(q('.grill__card h2, .grill__card > p'), { y: 24, opacity: 0, stagger: 0.1, duration: 0.9, ease: EASE }, '<0.25')
        .from('.grill__chips span', { scale: 0.6, opacity: 0, stagger: 0.07, duration: 0.6, ease: 'back.out(2)' }, '<0.4');

      /* ---------- Besuch ---------- */
      gsap.fromTo('.visit__map', { clipPath: 'inset(0% 0% 0% 100% round 22px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: '.visit__map', start: 'top 85%', once: true },
      });
      gsap.from('.footer__inner > *', {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.9, ease: EASE,
        scrollTrigger: { trigger: '.footer', start: 'top 95%', once: true },
      });
    });

    // Positionen neu berechnen, wenn Bilder/Schriften fertig sind
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    // Tastatur: Wer per Tab in einen noch nicht eingeblendeten Bereich springt,
    // soll ihn sofort sehen (taste-skill: focus-visible / hidden-content)
    const onFocusIn = (e) => {
      const hidden = e.target.closest?.('.reveal, .grill__card, .tradition__list li, .dish');
      if (hidden && getComputedStyle(hidden).opacity !== '1') {
        gsap.set(hidden, { opacity: 1, y: 0, x: 0, overwrite: true });
      }
    };
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('load', refresh);
      ctx.revert();
      document.documentElement.classList.remove('gsap-on');
    };
  }, []);
}
