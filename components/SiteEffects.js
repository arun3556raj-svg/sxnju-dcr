'use client';
import { useEffect } from 'react';

/* Centralized animation engine: Lenis smooth scroll + GSAP/ScrollTrigger,
   custom cursor, reveals, counters, loader→hero timeline, marquee,
   parallax, magnetic buttons. Scans the DOM by class (legacy-style). */
export default function SiteEffects() {
  useEffect(() => {
    let cleanup = () => {};
    let killed = false;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { default: Lenis } = await import('lenis');
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      const $ = (s, p = document) => p.querySelector(s);
      const $$ = (s, p = document) => [...p.querySelectorAll(s)];
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
      const disposers = [];

      /* ── Lenis ── */
      let lenis = null;
      if (!reduced) {
        lenis = new Lenis({ duration: 2.2, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        const raf = t => lenis.raf(t * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        window.__lenis = lenis;
        disposers.push(() => { gsap.ticker.remove(raf); lenis.destroy(); window.__lenis = null; });
      }
      // anchor links
      $$('a[href^="#"]').forEach(a => {
        const onClick = e => {
          const id = a.getAttribute('href');
          if (id.length > 1) {
            const el = document.querySelector(id);
            if (el) { e.preventDefault(); lenis ? lenis.scrollTo(el, { offset: -10 }) : el.scrollIntoView({ behavior: 'smooth' }); }
          }
        };
        a.addEventListener('click', onClick);
        disposers.push(() => a.removeEventListener('click', onClick));
      });

      /* ── Text split helper ── */
      function split(el) {
        if (!el || el.dataset.splitDone) return [];
        el.dataset.splitDone = '1';
        const words = el.textContent.split(/\s+/).filter(Boolean);
        el.innerHTML = '';
        words.forEach((word, wi) => {
          const w = document.createElement('span'); w.className = 'word';
          [...word].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.appendChild(s); });
          el.appendChild(w);
          if (wi < words.length - 1) { const sp = document.createElement('span'); sp.className = 'word'; sp.innerHTML = '&nbsp;'; el.appendChild(sp); }
        });
        return $$('.ch', el);
      }
      $$('[data-split]').forEach(split);

      /* ── Counters ── */
      function counters() {
        $$('[data-count]').forEach(el => {
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          if (reduced) { el.innerHTML = Math.round(target) + (suffix ? `<em>${suffix}</em>` : ''); return; }
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target, duration: 1.6, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%' },
            onUpdate() { el.innerHTML = Math.round(obj.v) + (suffix ? `<em>${suffix}</em>` : ''); },
            onComplete() { el.innerHTML = Math.round(target) + (suffix ? `<em>${suffix}</em>` : ''); },
          });
        });
      }

      /* ── Hero entrance ── */
      function heroIn() {
        if (reduced) { counters(); return; }
        const chars = $$('.hero-title [data-split] .ch');
        if (chars.length) gsap.from(chars, { yPercent: 120, rotateZ: 4, duration: 1.1, ease: 'power4.out', stagger: 0.03, delay: 0.1 });
        gsap.from('.hero-fade', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', delay: 0.5, stagger: 0.14 });
        counters();
      }

      /* ── Loader timeline ── */
      const loader = $('.loader');
      const skip = reduced || sessionStorage.getItem('sxnju_seen');
      if (loader && !skip) {
        sessionStorage.setItem('sxnju_seen', '1');
        document.body.style.overflow = 'hidden';
        lenis && lenis.stop();
        const pct = $('.loader-pct');
        gsap.timeline({ onComplete() { document.body.style.overflow = ''; lenis && lenis.start(); heroIn(); } })
          .to('.loader-bar i', { scaleX: 1, duration: 1.2, ease: 'power2.inOut', onUpdate() { if (pct) pct.textContent = String(Math.round(this.progress() * 100)).padStart(2, '0') + '%'; } })
          .to(loader, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.15')
          .set(loader, { display: 'none' });
      } else {
        if (loader) loader.style.display = 'none';
        heroIn();
      }

      /* ── Nav scrolled ── */
      const nav = $('.nav');
      if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        disposers.push(() => window.removeEventListener('scroll', onScroll));
      }

      /* ── Scroll progress ── */
      if (!reduced) {
        const bar = document.createElement('div'); bar.className = 'scroll-progress'; document.body.appendChild(bar);
        gsap.to(bar, { width: '100%', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
        disposers.push(() => bar.remove());
      }

      /* ── Section title char reveals ── */
      if (!reduced) {
        $$('.sec-title [data-split], .contact-title [data-split], .cine-title [data-split]').forEach(el => {
          const chars = $$('.ch', el); if (!chars.length) return;
          gsap.set(chars, { yPercent: 120 });
          gsap.to(chars, { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.02, scrollTrigger: { trigger: el, start: 'top 88%' } });
        });
      }

      /* ── Generic reveals ── */
      gsap.set('.reveal', { opacity: 0, y: 28 });
      gsap.set('.reveal-left', { opacity: 0, x: -40 });
      gsap.set('.reveal-right', { opacity: 0, x: 40 });
      gsap.set('.reveal-scale', { opacity: 0, scale: 0.92 });
      const revBatch = (sel, vars) => ScrollTrigger.batch(sel, { start: 'top 90%', onEnter: b => gsap.to(b, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.85, ease: 'power3.out', stagger: 0.08, overwrite: true, ...vars }) });
      revBatch('.reveal'); revBatch('.reveal-left'); revBatch('.reveal-right'); revBatch('.reveal-scale');

      /* ── Marquee infinite + velocity ── */
      $$('.marquee-track').forEach((track, idx) => {
        if (reduced) return;
        const dir = idx % 2 === 0 ? -50 : 50;
        const anim = gsap.to(track, { xPercent: dir, duration: 24 + idx * 4, ease: 'none', repeat: -1 });
        if (idx === 0) {
          let speed = 1;
          ScrollTrigger.create({ onUpdate: self => { speed = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 600); } });
          const tick = () => { anim.timeScale(speed); speed += (1 - speed) * 0.06; };
          gsap.ticker.add(tick);
          disposers.push(() => gsap.ticker.remove(tick));
        }
      });

      /* ── Hero parallax ── */
      const hero = $('.hero');
      if (hero && !reduced) {
        gsap.to('.hero-title', { yPercent: -14, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: hero, start: '55% 55%', end: 'bottom top', scrub: true } });
      }

      /* ── Cinema pinned timeline ── */
      const cine = $('.cine');
      if (cine) {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 760px)', () => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: cine, pin: true, scrub: 0.8, end: '+=130%' } });
          tl.to('.cine-bar.top', { height: '7%', ease: 'power2.inOut' }, 0)
            .to('.cine-bar.bot', { height: '7%', ease: 'power2.inOut' }, 0)
            .from('.cine-portrait', { xPercent: -100, opacity: 0, ease: 'power3.out' }, 0.15)
            .from('.cine-title .ch', { yPercent: 120, ease: 'power3.out', stagger: 0.02 }, 0.35)
            .from('.cine-billing', { opacity: 0, y: 20, ease: 'power3.out' }, 0.55)
            .from('.cine-role', { opacity: 0, y: 20, ease: 'power3.out' }, 0.65)
            .from('.cine-btn', { opacity: 0, y: 20, ease: 'power3.out' }, 0.75)
            .from('.cine-tags', { opacity: 0, y: 20, ease: 'power3.out' }, 0.85);
        });
        mm.add('(max-width: 759px)', () => {
          gsap.set('.cine-bar', { height: '5%' });
          gsap.from('.cine-portrait', { opacity: 0, y: 30, ease: 'power3.out', scrollTrigger: { trigger: cine, start: 'top 80%' } });
        });
        disposers.push(() => mm.revert());
      }

      /* ── Custom cursor + glow + magnetic ── */
      if (fine && !reduced) {
        const dot = document.createElement('div'); dot.className = 'cur-dot';
        const ring = document.createElement('div'); ring.className = 'cur-ring';
        const label = document.createElement('span'); label.className = 'cur-label'; ring.appendChild(label);
        const glow = document.createElement('div'); glow.className = 'cursor-glow';
        document.body.append(dot, ring, glow);

        const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
        const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
        const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
        const ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
        const gx = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3.out' });
        const gy = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3.out' });
        const move = e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); gx(e.clientX); gy(e.clientY); glow.style.opacity = 1; };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseleave', () => (glow.style.opacity = 0));

        const setRing = (size, bg, border, lbl) => { ring.style.width = ring.style.height = size + 'px'; ring.style.background = bg; ring.style.borderColor = border; label.textContent = lbl || ''; label.style.opacity = lbl ? 1 : 0; };
        const reset = () => setRing(40, 'transparent', 'rgba(255,255,255,0.5)', '');
        const bind = (sel, size, bg, border, lbl) => $$(sel).forEach(el => {
          el.addEventListener('mouseenter', () => setRing(size, bg, border, lbl));
          el.addEventListener('mouseleave', reset);
        });
        bind('a, button', 60, 'rgba(139,92,246,0.15)', 'rgba(139,92,246,0.5)', '');
        bind('.reel-tile, .strip-cell', 74, 'var(--accent)', 'transparent', 'PLAY');
        bind('.book-card', 74, 'var(--accent)', 'transparent', 'OPEN');

        $$('.btn, [data-magnet]').forEach(el => {
          const mx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
          const my = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
          el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); mx((e.clientX - (r.left + r.width / 2)) * 0.3); my((e.clientY - (r.top + r.height / 2)) * 0.3); });
          el.addEventListener('mouseleave', () => { mx(0); my(0); });
        });
        disposers.push(() => { window.removeEventListener('mousemove', move); dot.remove(); ring.remove(); glow.remove(); });
      }

      /* ── Live footer clock ── */
      const footSpan = $('footer .clock-host');
      if (footSpan) {
        const t = document.createElement('span'); t.className = 'live-time'; t.style.marginLeft = '.6rem';
        const upd = () => { t.textContent = '· ' + new Date().toLocaleTimeString('en-IN', { hour12: false }); };
        upd(); const iv = setInterval(upd, 1000); footSpan.appendChild(t);
        disposers.push(() => { clearInterval(iv); t.remove(); });
      }

      /* ── Book card mouse glow ── */
      $$('.book-card').forEach(card => {
        const mm2 = e => { const r = card.getBoundingClientRect(); card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%'); };
        card.addEventListener('mousemove', mm2);
      });

      setTimeout(() => ScrollTrigger.refresh(), 300);
      cleanup = () => { disposers.forEach(d => d()); ScrollTrigger.getAll().forEach(s => s.kill()); };
    })();

    return () => { killed = true; cleanup(); };
  }, []);

  return null;
}
