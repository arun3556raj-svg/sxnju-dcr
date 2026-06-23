'use client';
import { useState, useEffect } from 'react';
import { SERVICES, PACKAGES, PROFILE } from '@/lib/content';

export default function BookShoots() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    if (open) lenis && lenis.stop();
    else lenis && lenis.start();
    const onKey = e => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <section className="section" style={{ paddingTop: 'clamp(5rem,12vh,8rem)', paddingBottom: 'clamp(3rem,8vh,5rem)' }}>
        <div
          className="book-card reveal"
          role="button"
          tabIndex={0}
          aria-label="Open shoots and packages"
          onClick={() => setOpen(true)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(true)}
        >
          <div className="eyebrow">Shoots &amp; Packages</div>
          <div className="book-title">
            Book a <em>Shoot</em>
          </div>
          <div className="book-sub">Car deliveries · Housewarmings · Weddings · Festivals · Birthdays · Reels</div>
          <div className="book-arrow">→</div>
        </div>
      </section>

      <div className={`shoots${open ? ' open' : ''}`} onClick={e => e.target.classList.contains('shoots') && setOpen(false)}>
        <button className="shoots-close" aria-label="Close" onClick={() => setOpen(false)}>
          ✕
        </button>
        <div className="shoots-inner">
          <div className="sec-head" style={{ marginTop: '3rem' }}>
            <h2 className="sec-title">The <em>Shoots</em></h2>
            <span className="sec-kicker">Concept to final cut · ०१–०६</span>
          </div>

          <div>
            {SERVICES.map(s => (
              <div className="svc" key={s.no}>
                <a className="svc-row" href={PROFILE.dm} target="_blank" rel="noopener">
                  <span className="svc-no">{s.no}</span>
                  <span className="svc-name">{s.name}</span>
                  <span className="svc-desc">{s.desc}</span>
                  <span className="svc-arrow">→</span>
                </a>
              </div>
            ))}
          </div>

          <div className="sec-head" style={{ marginTop: 'clamp(3rem,8vh,5rem)' }}>
            <h2 className="sec-title"><em>Packages</em></h2>
            <span className="sec-kicker">What&apos;s included</span>
          </div>
          <div className="pricing">
            {PACKAGES.map(p => (
              <div className={`pkg${p.feat ? ' feat' : ''}`} key={p.name}>
                <div className="pkg-head">
                  <span className="pkg-cat">{p.cat}</span>
                  <span className={`pkg-tag${p.feat ? '' : ' hide'}`}>Most booked</span>
                </div>
                <div className="pkg-name">{p.name}</div>
                <p className="pkg-blurb">{p.blurb}</p>
                <div className="pkg-price">{p.price}</div>
                <ul className="pkg-list">
                  {p.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
                <a className={`btn${p.feat ? ' btn-solid' : ''}`} href={PROFILE.dm} target="_blank" rel="noopener">
                  {p.feat ? 'Book this' : 'DM to book'}<span className="shine" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
