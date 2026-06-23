'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REELS, PROFILE } from '@/lib/content';

export default function ReelWall() {
  const wallRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const stageVid = useRef(null);
  const frameRef = useRef(null);
  const progRef = useRef(null);
  const switching = useRef(false);

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = typeof window !== 'undefined' && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ── Wall entrance stagger (batch = robust even if already in view) ── */
  useEffect(() => {
    if (!wallRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const tiles = [...wallRef.current.querySelectorAll('.reel-tile')];
    if (reduced) { gsap.set(tiles, { opacity: 1, y: 0, scale: 1, rotateZ: 0 }); return; }
    gsap.set(tiles, { opacity: 0, y: 100, scale: 0.98 });
    const bt = ScrollTrigger.batch(tiles, {
      start: 'top 85%',
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: 'power4.out', stagger: 0.1, overwrite: true }),
    });
    // safety: never leave the centerpiece hidden
    const safety = setTimeout(() => gsap.to(tiles.filter(t => +getComputedStyle(t).opacity < 0.05), { opacity: 1, y: 0, scale: 1, duration: 1.2 }), 2500);
    ScrollTrigger.refresh();
    return () => { bt.forEach(s => s.kill()); clearTimeout(safety); };
  }, [reduced]);

  /* ── Open theater ── */
  const openAt = useCallback((i) => {
    setActive(i);
    setOpen(true);
  }, []);

  /* ── Theater open animation + body lock ── */
  useEffect(() => {
    const lenis = window.__lenis;
    if (open) {
      lenis && lenis.stop();
      document.body.style.overflow = 'hidden';
      if (!reduced && frameRef.current) {
        gsap.fromTo('.theater', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
        gsap.fromTo(frameRef.current,
          { scale: 0.9, y: 80, filter: 'blur(20px)', opacity: 0 },
          { scale: 1, y: 0, filter: 'blur(0px)', opacity: 1, duration: 1.4, ease: 'power4.out' });
        gsap.from('.filmstrip .strip-cell', { y: 40, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.08, delay: 0.2 });
      }
      playActive();
    } else {
      lenis && lenis.start();
      document.body.style.overflow = '';
      if (stageVid.current) stageVid.current.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const playActive = () => {
    const v = stageVid.current;
    if (!v) return;
    v.muted = muted;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  /* ── Reel-to-reel transition ── */
  const goTo = useCallback((i, dir = 1) => {
    const next = (i + REELS.length) % REELS.length;
    if (next === active || switching.current) { setActive(next); return; }
    switching.current = true;
    const frame = frameRef.current;
    if (frame && !reduced) {
      frame.classList.remove('advancing'); void frame.offsetWidth; frame.classList.add('advancing');
      const v = stageVid.current;
      gsap.fromTo(v, { opacity: 1 }, { opacity: 0.1, duration: 0.4, ease: 'power2.inOut', onComplete() {
        setActive(next);
        gsap.fromTo(v,
          { opacity: 0.1, scale: 1.04, xPercent: dir * 4, filter: 'blur(12px)' },
          { opacity: 1, scale: 1, xPercent: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out', onComplete() { switching.current = false; } });
      }});
    } else {
      setActive(next);
      switching.current = false;
    }
  }, [active, reduced]);

  /* ── load + play whenever active changes while open ── */
  useEffect(() => {
    if (!open) return;
    const v = stageVid.current;
    if (!v) return;
    v.muted = muted;
    v.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  /* ── progress bar ── */
  useEffect(() => {
    const v = stageVid.current;
    if (!v) return;
    const onTime = () => { if (progRef.current && v.duration) progRef.current.style.width = (v.currentTime / v.duration * 100) + '%'; };
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [open]);

  /* ── keyboard + swipe ── */
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowRight') goTo(active + 1, 1);
      else if (e.key === 'ArrowLeft') goTo(active - 1, -1);
    };
    window.addEventListener('keydown', onKey);
    let sx = 0;
    const ts = e => (sx = e.touches[0].clientX);
    const te = e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) goTo(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    };
    const frame = frameRef.current;
    frame && frame.addEventListener('touchstart', ts, { passive: true });
    frame && frame.addEventListener('touchend', te);
    return () => {
      window.removeEventListener('keydown', onKey);
      frame && frame.removeEventListener('touchstart', ts);
      frame && frame.removeEventListener('touchend', te);
    };
  }, [open, active, goTo]);

  /* ── tap stage = play/pause ── */
  const toggleStage = () => {
    const v = stageVid.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  };

  const toggleMute = () => {
    setMuted(m => {
      const nm = !m;
      if (stageVid.current) stageVid.current.muted = nm;
      return nm;
    });
  };

  /* ── desktop tile hover: preview + tilt + focus pull ── */
  const onTileEnter = (e) => {
    const card = e.currentTarget;
    if (fine) { const v = card.querySelector('video'); v && v.play().catch(() => {}); }
    wallRef.current && wallRef.current.classList.add('has-focus');
  };
  const onTileLeave = (e) => {
    const card = e.currentTarget;
    if (fine) { const v = card.querySelector('video'); if (v) { v.pause(); v.currentTime = 0; } }
    if (!reduced) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power4.out' });
    wallRef.current && wallRef.current.classList.remove('has-focus');
  };
  const onTileMove = (e) => {
    if (!fine || reduced) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotateY: px * 8, rotateX: -py * 8, transformPerspective: 1200, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
  };

  const reel = REELS[active];

  return (
    <section id="work" className="reel-section section">
      <div className="shell">
        <div className="sec-head">
          <h2 className="sec-title reveal">
            <span data-split>The Work</span>
          </h2>
          <span className="sec-kicker">Selected reels · {PROFILE.handle} · ०५</span>
        </div>

        <div className="reel-wall" ref={wallRef}>
          {REELS.map((r, i) => (
            <div
              className="reel-tile"
              key={r.id}
              onClick={() => openAt(i)}
              onMouseEnter={onTileEnter}
              onMouseLeave={onTileLeave}
              onMouseMove={onTileMove}
            >
              <video src={r.src} muted loop playsInline preload="metadata" />
              <div className="vig" />
              <div className="scan" />
              <div className="meta-top">
                <span>{r.code}</span>
                <span>{r.ratio}</span>
              </div>
              <div className="play" aria-label="Play reel">
                <span className="tri" />
              </div>
              <div className="foot">
                <div className="r-title">{r.title}</div>
                <div className="r-cat">{r.cat}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="reel-note">
          Tap any frame to open the theater · or view everything on{' '}
          <a href={PROFILE.instagram} target="_blank" rel="noopener">Instagram</a>.
        </p>
      </div>

      {/* ── THEATER ── */}
      <div className={`theater${open ? ' open' : ''}`}>
        <div className="theater-bg" />
        <button className="theater-close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>

        <div className="theater-stage">
          <button className="stage-arrow prev" aria-label="Previous" onClick={() => goTo(active - 1, -1)}>‹</button>

          <div className="stage-frame" ref={frameRef} onClick={toggleStage}>
            <video ref={stageVid} src={reel.src} loop playsInline muted={muted} />
            <div className="stage-vig" />
            <div className="advance" />
            <div className="stage-progress" ref={progRef} />
            <div className="stage-info" onClick={e => e.stopPropagation()}>
              <div className="s-code">{reel.code} · {reel.ratio}</div>
              <div className="s-title">{reel.title}</div>
              <a className="s-ig" href={reel.href} target="_blank" rel="noopener">↗ View on Instagram</a>
            </div>
            <button className="stage-mute" aria-label="Toggle sound" onClick={e => { e.stopPropagation(); toggleMute(); }}>
              {muted ? '🔇' : '🔊'}
            </button>
          </div>

          <button className="stage-arrow next" aria-label="Next" onClick={() => goTo(active + 1, 1)}>›</button>
        </div>

        <div className="filmstrip">
          {REELS.map((r, i) => (
            <div
              className={`strip-cell${i === active ? ' active' : ''}`}
              key={r.id}
              onClick={() => goTo(i, i > active ? 1 : -1)}
            >
              <span className="num">{r.code}</span>
              <video src={r.src} muted loop playsInline preload="metadata" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
