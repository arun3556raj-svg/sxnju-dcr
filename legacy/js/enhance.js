/* ============================================================
   enhance.js — Cinematic Enhancement Layer
   Animation & interaction upgrades inspired by
   Lusion · Eszter Bial · Uncommon Design Group.
   Augments main.js (does not replace it).
   ============================================================ */
;(function () {
  'use strict';

  const $  = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  function boot() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      init();
    } else {
      requestAnimationFrame(boot);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function init() {

    /* ═══ 1. AMBIENT BACKGROUND ═══ (Lusion-style depth)
       Floating orbs + drifting dust motes + cursor glow. */
    function buildAmbient() {
      if (reduced) return;

      // Ambient stage with orbs
      const stage = document.createElement('div');
      stage.className = 'ambient-stage';
      stage.innerHTML = `
        <div class="ambient-orb o1"></div>
        <div class="ambient-orb o2"></div>
        <div class="ambient-orb o3"></div>`;
      document.body.appendChild(stage);

      // Drifting dust motes
      const dust = document.createElement('div');
      dust.className = 'dust-layer';
      const count = isTouch ? 18 : 38;
      for (let i = 0; i < count; i++) {
        const m = document.createElement('span');
        m.className = 'dust';
        const size = 1 + Math.random() * 2.5;
        m.style.width = m.style.height = size + 'px';
        m.style.left = Math.random() * 100 + 'vw';
        m.style.top = Math.random() * 100 + 'vh';
        m.style.opacity = 0.2 + Math.random() * 0.6;
        dust.appendChild(m);
      }
      document.body.appendChild(dust);

      // Animate orbs with parallax drift
      $$('.ambient-orb').forEach((orb, i) => {
        gsap.to(orb, {
          x: (i % 2 ? 1 : -1) * (60 + i * 30),
          y: (i % 2 ? -1 : 1) * (40 + i * 20),
          duration: 14 + i * 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      });

      // Animate dust rising slowly
      $$('.dust').forEach((m, i) => {
        gsap.to(m, {
          y: -(80 + Math.random() * 160),
          x: (Math.random() - 0.5) * 60,
          opacity: 0,
          duration: 8 + Math.random() * 12,
          ease: 'none',
          repeat: -1,
          delay: Math.random() * 8,
          onRepeat() {
            gsap.set(m, {
              y: 0,
              x: 0,
              left: Math.random() * 100 + 'vw',
              top: 100 + Math.random() * 10 + 'vh',
              opacity: 0.2 + Math.random() * 0.6
            });
          }
        });
      });

      // Cursor-follow glow (desktop only)
      if (!isTouch) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        const gx = gsap.quickTo(glow, 'left', { duration: 0.6, ease: 'power3.out' });
        const gy = gsap.quickTo(glow, 'top',  { duration: 0.6, ease: 'power3.out' });
        window.addEventListener('mousemove', e => {
          gx(e.clientX); gy(e.clientY);
          glow.style.opacity = 1;
        });
        window.addEventListener('mouseleave', () => glow.style.opacity = 0);
      }
    }
    buildAmbient();

    /* ═══ 2. FLOATING MASCOTS ═══ (Eszter Bial playfulness)
       Decorative spinning apertures/stars floating in sections. */
    const apertureSVG = (cls) => `
      <div class="floater ${cls}" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <g fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="50" cy="50" r="40"/>
            <circle cx="50" cy="50" r="26"/>
            ${[0,45,90,135].map(a=>`<line x1="50" y1="10" x2="50" y2="90" transform="rotate(${a} 50 50)"/>`).join('')}
          </g>
          <circle cx="50" cy="50" r="6" fill="currentColor"/>
        </svg>
      </div>`;

    const starSVG = (cls) => `
      <div class="floater ${cls}" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <path d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z"
                fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>`;

    function injectFloaters() {
      if (reduced) return;
      // Hero
      const hero = $('header');
      if (hero) {
        hero.insertAdjacentHTML('beforeend',
          `<div class="hero-mascot m1 spin-slow" style="color:var(--marigold)">${apertureSVG('').innerHTML}</div>`);
      }
      // Brands
      const brands = $('#brands');
      if (brands) {
        brands.style.position = 'relative';
        brands.insertAdjacentHTML('afterbegin', starSVG('bob breathe').replace('class="floater bob breathe"',
          'class="floater bob breathe" style="top:8%;right:6%;width:clamp(40px,5vw,64px);color:var(--marigold)"'));
      }
      // Contact
      const contact = $('#contact');
      if (contact) {
        contact.insertAdjacentHTML('afterbegin',
          `<div class="hero-mascot" style="top:14%;left:10%;width:clamp(34px,4vw,52px);color:var(--marigold);opacity:.35">${apertureSVG('spin-rev').innerHTML}</div>`);
      }
    }
    injectFloaters();

    /* ═══ 3. HERO TITLE PARALLAX DEPTH ═══
       Title chars respond to mouse + subtle flicker. */
    if (!reduced && !isTouch) {
      const hero = $('header');
      const title = $('.hero-title');
      if (hero && title) {
        const chars = $$('.hero-title .ch');
        hero.addEventListener('mousemove', e => {
          const rect = hero.getBoundingClientRect();
          const cx = (e.clientX - rect.left) / rect.width - 0.5;
          const cy = (e.clientY - rect.top) / rect.height - 0.5;
          chars.forEach((ch, i) => {
            const depth = (i % 5 + 1) * 3;
            gsap.to(ch, {
              x: cx * depth,
              y: cy * depth * 0.6,
              duration: 0.8,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          });
        });
      }
    }

    /* ═══ 4. REEL CARD TRANSFORMATIONS ═══
       - Open faces (no cover curtain)
       - Tap to play (with reel-to-reel transitions)
       - 3D tilt on hover, focus dimming siblings */
    function enhanceReels() {
      const rail = $('#reelRail');
      if (!rail) return;
      const cards = $$('.reel-card', rail);

      cards.forEach(card => {
        // Inject extra layers (only once)
        if (!card.querySelector('.reel-corners')) {
          card.insertAdjacentHTML('beforeend', `
            <span class="reel-vignette" aria-hidden="true"></span>
            <span class="reel-scan" aria-hidden="true"></span>
            <span class="reel-corners" aria-hidden="true"><i></i></span>
            <span class="reel-sprockets left" aria-hidden="true"></span>
            <span class="reel-sprockets right" aria-hidden="true"></span>
            <span class="tap-hint">tap ▸</span>
          `);
          // Inject play badge if missing
          if (!card.querySelector('.reel-play-badge')) {
            const badge = document.createElement('span');
            badge.className = 'reel-play-badge';
            badge.innerHTML = '<span class="play-tri"></span>';
            badge.setAttribute('role', 'button');
            badge.setAttribute('aria-label', 'Play reel');
            card.querySelector('.reel-frame')?.appendChild(badge);
          }
        }

        const vid = card.querySelector('.reel-vid');
        const badge = card.querySelector('.reel-play-badge');

        // Hide existing reticle (replaced by play badge)
        const oldReticle = card.querySelector('.reel-reticle');
        if (oldReticle) oldReticle.style.display = 'none';

        /* ---- TAP TO PLAY ---- */
        function togglePlay(e) {
          if (!vid) return;
          // Don't interfere with the anchor navigation if user wants to leave
          // We intercept only when badge/center is tapped OR on mobile anywhere on card
          if (e) {
            const target = e.target.closest('.reel-play-badge, .reel-frame');
            if (!target && !isTouch) return;
            e.preventDefault();
            e.stopPropagation();
          }

          if (card.classList.contains('playing')) {
            // Pause + reset
            vid.pause();
            vid.currentTime = 0;
            card.classList.remove('playing');
            rail.classList.remove('has-focus');
          } else {
            // Pause all others first (reel-to-reel transition)
            cards.forEach(other => {
              if (other !== card && other.classList.contains('playing')) {
                const ov = other.querySelector('.reel-vid');
                if (ov) { ov.pause(); ov.currentTime = 0; }
                other.classList.remove('playing');
              }
            });
            card.classList.add('playing');
            rail.classList.add('has-focus');
            vid.muted = true;
            vid.play().catch(() => {});
            if (window.SoundManager) SoundManager.play('tick');
          }
        }

        if (badge) badge.addEventListener('click', togglePlay);
        if (isTouch) {
          // On touch, tapping the card toggles play
          card.addEventListener('click', togglePlay);
        }

        // Desktop hover: 3D tilt + parallax (preview play handled by main.js)
        if (!isTouch && !reduced) {
          card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
              rotationY: px * 12,
              rotationX: -py * 12,
              transformPerspective: 900,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            // Parallax inner layers
            const scan = card.querySelector('.reel-scan');
            if (scan) gsap.to(scan, { x: px * 10, y: py * 10, duration: 0.4 });
            rail.classList.add('has-focus');
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: 'power3.out' });
            if (!$$('.reel-card.playing').length) rail.classList.remove('has-focus');
          });
        }
      });

      /* Reel rail horizontal: subtle reel-strip film advance feel.
         When scrubbing through, push each card slightly on enter. */
      if (!reduced) {
        ScrollTrigger.create({
          trigger: '#work',
          start: 'top 80%',
          once: true,
          onEnter() {
            gsap.from(cards, {
              opacity: 0,
              y: 60,
              rotationZ: -2,
              duration: 0.9,
              ease: 'power3.out',
              stagger: { each: 0.06, from: 'start' }
            });
          }
        });
      }
    }
    enhanceReels();

    /* ═══ 5. SCROLL PROGRESS BAR ═══ */
    if (!reduced) {
      const bar = document.createElement('div');
      bar.className = 'scroll-progress';
      document.body.appendChild(bar);
      gsap.to(bar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.3
        }
      });
    }

    /* ═══ 6. BUTTON SHINE SWEEPS ═══ */
    $$('.btn, .btn-solid').forEach(btn => {
      if (!btn.querySelector('.btn-shine')) {
        const shine = document.createElement('span');
        shine.className = 'btn-shine';
        btn.appendChild(shine);
      }
    });

    /* ═══ 7. BOOK CARD MOUSE GLOW ═══ */
    if (!isTouch) {
      $$('.book-card').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
      });
    }

    /* ═══ 8. NAV LINK CHAR FLIP ═══ */
    $$('.navlink').forEach(link => {
      const txt = link.textContent;
      link.setAttribute('data-text', txt);
      link.innerHTML = `<span class="nl-ch">${txt}</span>`;
    });

    /* ═══ 9. SECTION TRANSITION WIPES ═══ */
    if (!reduced) {
      $$('section').forEach(sec => {
        sec.style.position = sec.style.position || 'relative';
        const wipe = document.createElement('div');
        wipe.className = 'section-wipe';
        sec.appendChild(wipe);
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 70%',
          once: true,
          onEnter() {
            gsap.fromTo(wipe,
              { opacity: 1, scaleX: 0 },
              { scaleX: 1, duration: 0.8, ease: 'power3.inOut',
                onComplete() { gsap.to(wipe, { opacity: 0, duration: 0.4 }); } }
            );
          }
        });
      });
    }

    /* ═══ 10. COUNTER + STAT GLOW TRIGGERS ═══ */
    if (!reduced) {
      $$('.stat, .brand-stat').forEach(el => {
        const num = el.querySelector('.num');
        if (num) {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter() {
              gsap.fromTo(el, { scale: .92 }, { scale: 1, duration: .6, ease: 'back.out(2)' });
            }
          });
        }
      });
    }

    /* ═══ 11. CONTACT TITLE RIPPLE ═══ */
    if (!reduced) {
      const ct = $('.contact-title');
      if (ct) {
        ct.addEventListener('mouseenter', () => {
          gsap.fromTo(ct,
            { scale: 1 },
            { scale: 1.03, duration: .4, yoyo: true, repeat: 1, ease: 'power2.inOut' });
        });
      }
    }

    /* ═══ 12. REEL-RAIL CONTINUOUS FILM ADVANCE FEEL ═══
       Subtle vertical bob on alternate cards synced to scroll. */
    if (!reduced) {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        $$('.reel-card').forEach((card, i) => {
          if (i % 2 === 0) {
            gsap.to(card, {
              y: 18,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4
              }
            });
          }
        });
        return () => {};
      });
    }

    /* ═══ 13. MARQUEE PAUSE ON HOVER ═══ */
    if (!isTouch) {
      $$('.marquee').forEach(m => {
        m.addEventListener('mouseenter', () => {
          const track = m.querySelector('.marquee-track');
          if (track) gsap.to(track, { timeScale: 0.2, duration: 0.5 });
        });
        m.addEventListener('mouseleave', () => {
          const track = m.querySelector('.marquee-track');
          if (track) gsap.to(track, { timeScale: 1, duration: 0.5 });
        });
      });
    }

    /* ═══ 14. FOOTER TIME STAMP ═══ */
    const footer = document.querySelector('footer span:first-child');
    if (footer && !footer.querySelector('.live-time')) {
      const t = document.createElement('span');
      t.className = 'live-time';
      t.style.cssText = 'margin-left:.8rem;color:var(--marigold)';
      const update = () => {
        const d = new Date();
        t.textContent = '· ' + d.toLocaleTimeString('en-IN', { hour12: false });
      };
      update();
      setInterval(update, 1000);
      footer.appendChild(t);
    }

    /* ═══ 15. SECOND MARQUEE ROW (opposite direction) ═══ */
    const firstMarquee = $('.marquee');
    if (firstMarquee && !document.querySelector('.marquee.marquee-row-2') && !reduced) {
      const m2 = document.createElement('div');
      m2.className = 'marquee marquee-row-2';
      m2.innerHTML = `<div class="marquee-track">
        <span>Reels <i>●</i> Edits <i>●</i> Colour Grade <i>●</i> Direction <i>●</i> Sound Design <i>●</i> Storytelling <i>●</i> Hyderabad <i>●</i> </span>
        <span>Reels <i>●</i> Edits <i>●</i> Colour Grade <i>●</i> Direction <i>●</i> Sound Design <i>●</i> Storytelling <i>●</i> Hyderabad <i>●</i> </span>
      </div>`;
      firstMarquee.insertAdjacentElement('afterend', m2);
      gsap.to(m2.querySelector('.marquee-track'), {
        xPercent: 50,
        duration: 28,
        ease: 'none',
        repeat: -1
      });
    }

    /* ═══ 16. CINEMA STAGE — filmstrip drift + portrait parallax ═══ */
    if (!reduced) {
      const filmstrip = $('.cine-filmstrip');
      if (filmstrip) {
        gsap.to(filmstrip, {
          backgroundPositionX: -300,
          ease: 'none',
          scrollTrigger: {
            trigger: '.cine-stage',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
      // Portrait subtle parallax follow
      if (!isTouch) {
        const portrait = $('.cine-portrait');
        const stage = $('.cine-stage');
        if (portrait && stage) {
          stage.addEventListener('mousemove', e => {
            const r = stage.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(portrait, {
              x: px * 18,
              y: py * 12,
              duration: 0.8,
              ease: 'power3.out'
            });
          });
        }
      }
    }

    /* ═══ 17. SERVICE ROW NUMBER FLIP ═══ */
    if (!reduced) {
      $$('.svc').forEach((row, i) => {
        const no = row.querySelector('.svc-no');
        if (no) {
          gsap.from(no, {
            opacity: 0,
            y: -10,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 90%' }
          });
        }
      });
    }

    /* ═══ 18. PRICING CARD STAGGER ENTRANCE ═══ */
    if (!reduced) {
      const pkgGrid = $('.pricing-grid');
      if (pkgGrid) {
        gsap.from('.pkg', {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: pkgGrid, start: 'top 80%' }
        });
      }
    }

    /* ═══ 19. MAGNETIC ON REEL PLAY BADGES ═══ */
    if (!isTouch && !reduced) {
      $$('.reel-play-badge').forEach(badge => {
        const xTo = gsap.quickTo(badge, 'x', { duration: 0.3, ease: 'power3.out' });
        const yTo = gsap.quickTo(badge, 'y', { duration: 0.3, ease: 'power3.out' });
        badge.addEventListener('mousemove', e => {
          const r = badge.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * 0.4);
          yTo(dy * 0.4);
        });
        badge.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
      });
    }

    /* ═══ 20. SOUND ON REEL PLAY / SECTION ENTER ═══ */
    if (window.SoundManager) {
      // Play tick on reel play toggle
      const observer = new MutationObserver(() => {});
      $$('.reel-card').forEach(card => {
        card.addEventListener('click', () => {
          if (card.classList.contains('playing')) SoundManager.play('tick');
        }, true);
      });
    }

    /* ═══ 21. KEYBOARD: ESC PAUSES ALL REELS ═══ */
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        $$('.reel-card.playing').forEach(card => {
          const vid = card.querySelector('.reel-vid');
          if (vid) { vid.pause(); vid.currentTime = 0; }
          card.classList.remove('playing');
        });
        $('#reelRail')?.classList.remove('has-focus');
      }
    });

    /* Refresh ScrollTrigger after DOM mutations */
    setTimeout(() => ScrollTrigger.refresh(), 300);
  }
})();
