'use client';
import { useState } from 'react';
import { PROFILE } from '@/lib/content';

const LINKS = [
  ['Work', '#work'],
  ['Brands', '#brands'],
  ['Cinema', '#cinema'],
  ['Contact', '#contact'],
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={`nav${open ? ' open' : ''}`}>
        <a className="wordmark" href="#top">
          SXNJU<span className="dot">·</span>DCR
        </a>
        <div className="nav-links">
          {LINKS.map(([label, href]) => (
            <a key={href} className="navlink" href={href} data-text={label}>
              <span className="nl-ch">{label}</span>
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a className="nav-cta" href={PROFILE.dm} target="_blank" rel="noopener">
            Book a shoot
          </a>
          <button className="hamburger" aria-label="Open menu" onClick={() => setOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mob-menu${open ? ' open' : ''}`}>
        {LINKS.map(([label, href]) => (
          <a key={href} href={href} onClick={close}>
            {label}
          </a>
        ))}
        <a href={PROFILE.dm} target="_blank" rel="noopener" onClick={close}>
          Book a Shoot
        </a>
      </div>
    </>
  );
}
