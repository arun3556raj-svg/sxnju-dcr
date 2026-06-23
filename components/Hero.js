import { PROFILE } from '@/lib/content';

function Aperture({ className, style }) {
  return (
    <div className={`mascot ${className}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="26" />
          {[0, 45, 90, 135].map(a => (
            <line key={a} x1="50" y1="10" x2="50" y2="90" transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <header id="top" className="hero section">
      <Aperture className="spin-slow" style={{ top: '18%', right: '12%', width: 'clamp(40px,6vw,72px)' }} />
      <Aperture className="spin-rev float-y" style={{ bottom: '30%', left: '7%', width: 'clamp(26px,4vw,44px)', opacity: 0.32 }} />

      <div className="hero-meta hero-fade">
        <span className="rec-dot" />
        <span className="label">{PROFILE.role}</span>
      </div>

      <h1 className="hero-title">
        <span className="row">
          <span data-split>SXNJU</span>
        </span>
        <span className="row">
          <span data-split>DCR</span>
        </span>
      </h1>

      <div className="hero-foot hero-fade">
        <p className="hero-tag">
          <b>Every frame, cinematic.</b> Car deliveries, housewarmings, weddings, festivals, birthdays &amp; events — shot and cut across <b>Hyderabad</b>.
        </p>
        <div className="hero-stats">
          {PROFILE.stats.map(s => (
            <div className="stat" key={s.label}>
              <div className="num" data-count={s.num} data-suffix={s.suffix}>0</div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-cue">
        Scroll
      </div>
    </header>
  );
}
