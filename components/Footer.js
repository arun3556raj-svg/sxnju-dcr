import { PROFILE } from '@/lib/content';

export default function Footer() {
  return (
    <>
      <footer>
        <span className="clock-host">
          © २०२६ <span className="footer-mark">Sxnju DCR</span> · Hyderabad
        </span>
        <span>
          <a href={PROFILE.instagram} target="_blank" rel="noopener">Instagram</a> ·{' '}
          <a href={PROFILE.threads} target="_blank" rel="noopener">Threads</a>
        </span>
      </footer>
      <div className="mob-spacer" />
      <div className="sticky-bar">
        <a className="solid" href={PROFILE.dm} target="_blank" rel="noopener">DM to book</a>
        <a className="ghost" href="#work">Reels</a>
      </div>
    </>
  );
}
