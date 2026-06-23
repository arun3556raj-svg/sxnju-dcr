import { BRAND_POINTS, BRAND_STATS } from '@/lib/content';

export default function Brands() {
  return (
    <section id="brands" className="brands section">
      <div className="shell">
        <div className="sec-head">
          <h2 className="sec-title reveal">
            <span data-split>For Brands</span>
          </h2>
          <span className="sec-kicker">Paid promotion · collabs</span>
        </div>

        <div className="brand-wrap">
          <div className="reveal-left">
            <p className="brand-lead">
              A Hyderabad audience that actually watches. <em>One creator</em> who shoots, edits and delivers the whole campaign himself.
            </p>
            <ul className="brand-list">
              {BRAND_POINTS.map((p, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: bold(p) }} />
              ))}
            </ul>
          </div>

          <div className="reveal-right brand-stats">
            {BRAND_STATS.map((s, i) => (
              <div className="brand-stat" key={i}>
                {s.text ? (
                  <div className="txt">{s.text}</div>
                ) : (
                  <div className="num" data-count={s.num} data-suffix={s.suffix}>0</div>
                )}
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// emphasize the leading clause before the dash/keywords (cheap inline bold)
function bold(text) {
  const parts = text.split(' ');
  // bold the first two-three words as the feature label
  const head = parts.slice(0, 2).join(' ');
  const rest = parts.slice(2).join(' ');
  return `<span><b>${head}</b> ${rest}</span>`;
}
