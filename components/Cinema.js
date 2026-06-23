import { PROFILE } from '@/lib/content';

export default function Cinema() {
  return (
    <section id="cinema" style={{ padding: 0, position: 'relative' }}>
      <div className="cine">
        <div className="cine-bar top" />
        <div className="cine-bar bot" />
        <div className="cine-grid section">
          <figure className="cine-portrait">
            <img src="/uploads/director.webp" alt="Sxnju, mirror portrait" />
            <div className="glow" />
            <figcaption>Sxnju · Director</figcaption>
          </figure>
          <div>
            <span className="cine-presents">Sxnju DCR presents</span>
            <div className="cine-title">
              <span data-split>Tangles</span>
            </div>
            <div className="cine-billing">A film written &amp; directed by Sxnju · २०२५</div>
            <p className="cine-role">
              Client shoots pay for the camera. <em>Cinema is why he picks it up.</em> He writes, directs and cuts his own films — and that eye shows up in every frame he delivers.
            </p>
            <a className="btn cine-btn" href={PROFILE.instagram} target="_blank" rel="noopener" style={{ marginTop: '1.4rem' }}>
              Watch on Instagram<span className="shine" />
            </a>
            <p className="cine-tags">
              Cinema <i>●</i> Direction <i>●</i> Storytelling
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
