import { PROFILE } from '@/lib/content';

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-glow" />
      <span className="eyebrow reveal">Bookings open · Hyderabad &amp; beyond</span>
      <h2 className="contact-title reveal">
        <span data-split>Let&apos;s make it cinematic</span>
      </h2>
      <p className="contact-blurb reveal">
        For paid promotions, shoot bookings and collabs, the fastest way to reach Sxnju is a DM on Instagram. Share the date, the occasion and the location — you&apos;ll hear back within minutes.
      </p>
      <div className="contact-btns reveal">
        <a className="btn btn-solid" href={PROFILE.dm} target="_blank" rel="noopener" data-magnet>
          DM for paid promotion<span className="shine" />
        </a>
        <a className="btn" href={PROFILE.instagram} target="_blank" rel="noopener" data-magnet>
          {PROFILE.handle}<span className="shine" />
        </a>
      </div>
    </section>
  );
}
