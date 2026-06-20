/* ============================================================
   main.js  —  Sxnju DCR  ·  Cinematic Portfolio Animation Engine
   GSAP 3 + ScrollTrigger + Lenis smooth-scroll
   ============================================================ */
;(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Wait for GSAP + ScrollTrigger ──────────────────────── */
  function boot() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      init();
    } else {
      requestAnimationFrame(boot);
    }
  }
  boot();

  /* ================================================================
     init  —  master initialiser, called once libs are ready
     ================================================================ */
  function init() {

    /* ─── 1. Lenis Smooth Scroll ──────────────────────────── */
    let lenis = null;
    if (window.Lenis && !reduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });

      // Pipe Lenis scroll events into ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // Drive Lenis from GSAP's ticker so everything stays synced
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      // Anchor links use Lenis for smooth jump
      $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const id = a.getAttribute('href');
          if (id.length > 1) {
            const el = document.querySelector(id);
            if (el) { e.preventDefault(); lenis.scrollTo(el); }
          }
        });
      });
    }

    /* ─── 2. Text Splitting ───────────────────────────────── */
    function split(el) {
      if (!el || el.dataset.splitDone) return;
      el.dataset.splitDone = '1';

      const text = el.textContent;
      const words = text.split(/\s+/).filter(Boolean);
      el.innerHTML = '';

      words.forEach((word, wi) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        [...word].forEach(ch => {
          const charSpan = document.createElement('span');
          charSpan.className = 'ch';
          charSpan.textContent = ch;
          wordSpan.appendChild(charSpan);
        });

        el.appendChild(wordSpan);

        // Insert space between words (not after the last one)
        if (wi < words.length - 1) {
          const space = document.createElement('span');
          space.className = 'word';
          space.innerHTML = '&nbsp;';
          el.appendChild(space);
        }
      });

      return el.querySelectorAll('.ch');
    }

    // Split every element that has the data-split attribute
    $$('[data-split]').forEach(split);

    /* ─── 3. Counter Animation ────────────────────────────── */
    function counters() {
      $$('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';

        // Reduced-motion: show final value immediately
        if (reduced) {
          el.innerHTML = Math.round(target) + (suffix ? `<em>${suffix}</em>` : '');
          return;
        }

        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate() {
            el.innerHTML = Math.round(obj.val) + (suffix ? `<em>${suffix}</em>` : '');
          },
          onComplete() {
            el.innerHTML = Math.round(target) + (suffix ? `<em>${suffix}</em>` : '');
          }
        });
      });
    }

    /* ─── 4. Hero Entrance ────────────────────────────────── */
    function heroIn() {
      if (reduced) {
        // Skip animations, just clear aperture and fire counters
        gsap.set('.hero-aperture svg', { opacity: 0 });
        counters();
        return;
      }

      /* Aperture shutter open */
      gsap.to('.hero-aperture svg', { opacity: 0, duration: 1.1 });
      gsap.to('.ap-b1,.ap-b2', { xPercent: -120, duration: 1, ease: 'power3.inOut', stagger: 0.04, delay: 0.2 });
      gsap.to('.ap-b3,.ap-b4', { xPercent:  120, duration: 1, ease: 'power3.inOut', stagger: 0.04, delay: 0.2 });
      gsap.to('.ap-b5,.ap-b6', { xPercent: -120, duration: 1, ease: 'power3.inOut', stagger: 0.04, delay: 0.2 });
      gsap.to('.ap-b7,.ap-b8', { xPercent:  120, duration: 1, ease: 'power3.inOut', stagger: 0.04, delay: 0.2 });

      /* Title characters cascade in */
      const heroChars = $$('.hero-title [data-split] .ch');
      if (heroChars.length) {
        gsap.from(heroChars, {
          yPercent: 120,
          rotateZ: 4,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.03,
          delay: 0.35
        });
      }

      /* Fade-in supporting elements */
      gsap.from('.hero-fade', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.7,
        stagger: 0.14
      });

      /* Hero image scale reveal */
      gsap.from('.hero-img', {
        scale: 1.12,
        duration: 2,
        ease: 'power2.out'
      });

      /* Counters */
      counters();

      /* Projector sound */
      if (window.SoundManager) SoundManager.play('projector');
    }

    /* ─── 5. Intro Loader ─────────────────────────────────── */
    const loader = $('.loader');
    const skipLoader = reduced || sessionStorage.getItem('sxnju_seen');

    if (loader && !skipLoader) {
      sessionStorage.setItem('sxnju_seen', '1');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();

      const pct = $('.loader-pct');
      const tl = gsap.timeline({
        onComplete() {
          document.body.style.overflow = '';
          if (lenis) lenis.start();
          heroIn();
        }
      });

      tl.to('.loader-bar-fill', {
        scaleX: 1,
        duration: 1.1,
        ease: 'power2.inOut',
        onUpdate() {
          if (pct) {
            const v = Math.round(this.progress() * 100);
            pct.textContent = String(v).padStart(2, '0') + '%';
          }
        }
      })
      .to(loader, {
        yPercent: -100,
        duration: 0.7,
        ease: 'power4.inOut'
      }, '+=0.15')
      .set(loader, { display: 'none' });
    } else {
      // Skip loader entirely
      if (loader) loader.style.display = 'none';
      heroIn();
    }

    /* ─── 6. Nav Scrolled State ───────────────────────────── */
    const nav = $('nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          nav.style.background = 'rgba(10,10,10,.86)';
          nav.style.backdropFilter = 'blur(14px)';
          nav.style.WebkitBackdropFilter = 'blur(14px)';
          nav.style.borderBottomColor = 'rgba(255,248,235,.08)';
        } else {
          nav.style.background = 'transparent';
          nav.style.backdropFilter = 'none';
          nav.style.WebkitBackdropFilter = 'none';
          nav.style.borderBottomColor = 'transparent';
        }
      }, { passive: true });
    }

    /* ─── 7. Hamburger Menu (Mobile) ──────────────────────── */
    const hamburger = $('.hamburger');
    const mobMenu = $('.mob-menu');

    if (hamburger && mobMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = mobMenu.classList.toggle('open');
        nav && nav.classList.toggle('open', isOpen);

        if (lenis) {
          isOpen ? lenis.stop() : lenis.start();
        }

        // Stagger-animate menu links on open
        if (isOpen) {
          const links = $$('.mob-menu a');
          gsap.from(links, {
            opacity: 0,
            y: 18,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.07
          });
        }
      });
    }

    /* ─── 8. Section Heading Reveals ──────────────────────── */
    if (!reduced) {
      const headingSelectors = '.sec-title [data-split], .contact-title [data-split], .cine-title [data-split]';
      $$(headingSelectors).forEach(splitEl => {
        const chars = $$('.ch', splitEl);
        if (!chars.length) return;

        gsap.set(chars, { yPercent: 120 });

        gsap.to(chars, {
          yPercent: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.02,
          scrollTrigger: {
            trigger: splitEl,
            start: 'top 85%',
            onEnter() {
              if (window.SoundManager) SoundManager.play('section');
            }
          }
        });
      });
    }

    /* ─── 9. Generic Reveals ──────────────────────────────── */
    gsap.set('.reveal', { opacity: 0, y: 36 });

    ScrollTrigger.batch('.reveal', {
      start: 'top 90%',
      onEnter: batch => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: true
        });
      }
    });

    /* ─── 10. Reel Card Stagger Enter ─────────────────────── */
    $$('.reel-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        scale: 0.94,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.05,
        scrollTrigger: {
          trigger: '.reel-rail',
          start: 'top 80%'
        }
      });
    });

    /* ─── 11. Hero Parallax ───────────────────────────────── */
    const header = $('header');
    if (header && !reduced) {
      gsap.to('.hero-img', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: header, start: 'top top', end: 'bottom top', scrub: true }
      });

      gsap.to('.hero-title', {
        yPercent: -14,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: header, start: '55% 55%', end: 'bottom top', scrub: true }
      });

      gsap.to('.hero-leak', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: header, start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    /* ─── 12. Marquee Velocity ────────────────────────────── */
    const marqueeTrack = $('.marquee-track');
    if (marqueeTrack && !reduced) {
      const marqueeAnim = gsap.to(marqueeTrack, {
        xPercent: -50,
        duration: 24,
        ease: 'none',
        repeat: -1
      });

      // Track scroll velocity to modulate marquee speed
      let scrollSpeed = 1;
      ScrollTrigger.create({
        onUpdate: self => {
          scrollSpeed = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 600);
        }
      });

      gsap.ticker.add(() => {
        marqueeAnim.timeScale(scrollSpeed);
        // Ease back towards 1 when not scrolling
        scrollSpeed += (1 - scrollSpeed) * 0.06;
      });
    }

    /* ─── 13. Reel Rail Progress Bar ──────────────────────── */
    const reelRail = $('#reelRail');
    const reelProgress = $('#reelProgress');

    if (reelRail && reelProgress) {
      reelRail.addEventListener('scroll', () => {
        const max = reelRail.scrollWidth - reelRail.clientWidth;
        const pct = max > 0 ? (reelRail.scrollLeft / max) * 100 : 0;
        reelProgress.style.width = pct + '%';
      }, { passive: true });
    }

    /* ─── 14. Tangles / Pinned Cine-Stage ─────────────────── */
    const cineStage = $('.cine-stage');

    if (cineStage) {
      const mmCine = gsap.matchMedia();

      /* Desktop  ≥ 760px  — pinned, scrub-driven timeline */
      mmCine.add('(min-width: 760px)', () => {
        const cineTl = gsap.timeline({
          scrollTrigger: {
            trigger: cineStage,
            pin: true,
            scrub: 0.8,
            end: '+=130%'
          }
        });

        cineTl
          // Bars contract: 50.5% → 7%
          .to('.bar-top', { height: '7%', duration: 1, ease: 'power2.inOut' }, 0)
          .to('.bar-bot', { height: '7%', duration: 1, ease: 'power2.inOut' }, 0)

          // Portrait slides in from the left
          .from('.cine-portrait', { xPercent: -100, opacity: 0, duration: 1, ease: 'power3.out' }, 0.15)

          // Image transitions from grayscale to color
          .from('.cine-portrait img', { filter: 'grayscale(100%)', duration: 1.2, ease: 'power2.out' }, 0.25)

          // Title chars cascade in
          .from('.cine-title .ch', {
            yPercent: 120,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.02
          }, 0.35)

          // Billing, role, btn, tags fade in staggered
          .from('.cine-billing', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, 0.55)
          .from('.cine-role',    { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, 0.65)
          .from('.cine-btn',     { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, 0.75)
          .from('.cine-tags',    { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, 0.85);

        return () => {}; // cleanup
      });

      /* Mobile  < 760px  — simplified, viewport-triggered */
      mmCine.add('(max-width: 759px)', () => {
        gsap.set('.bar-top, .bar-bot', { height: '5%' });

        gsap.from('.cine-portrait', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: cineStage, start: 'top 80%' }
        });

        gsap.from('.cine-title .ch', {
          yPercent: 120,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.02,
          scrollTrigger: { trigger: cineStage, start: 'top 75%' }
        });

        gsap.from('.cine-billing, .cine-role, .cine-btn, .cine-tags', {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: cineStage, start: 'top 70%' }
        });

        return () => {};
      });
    }

    /* ─── 15. Desktop Reel Drift ──────────────────────────── */
    if (!reduced) {
      const mmDrift = gsap.matchMedia();
      mmDrift.add('(min-width: 900px)', () => {
        $$('.reel-card').forEach((card, i) => {
          if (i % 2 !== 0) {
            gsap.to(card, {
              y: -30,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
            });
          }
        });
        return () => {};
      });
    }

    /* ─── 16. Shoots Overlay ──────────────────────────────── */
    const shootsOverlay = $('.shoots-overlay');
    const shootsClose = $('.shoots-close');

    if (shootsOverlay) {
      // Open overlay from any book-card
      $$('.book-card').forEach(card => {
        card.addEventListener('click', () => {
          shootsOverlay.classList.add('open');
          if (lenis) lenis.stop();

          // Stagger-reveal services & packages
          const items = $$('.shoots-overlay .srv-item, .shoots-overlay .pkg-card');
          gsap.from(items, {
            opacity: 0,
            y: 24,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.06,
            overwrite: true
          });
        });
      });

      // Close overlay
      function closeOverlay() {
        shootsOverlay.classList.remove('open');
        if (lenis) lenis.start();
      }

      if (shootsClose) shootsClose.addEventListener('click', closeOverlay);

      // Close when clicking the overlay background itself (not its content)
      shootsOverlay.addEventListener('click', e => {
        if (e.target === shootsOverlay) closeOverlay();
      });
    }

    /* ─── 17. Custom Cursor + Magnetic (fine pointer) ─────── */
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced) {
      /* Build cursor elements */
      const dot = document.createElement('div');
      dot.className = 'cur-dot';
      Object.assign(dot.style, {
        position: 'fixed', top: 0, left: 0, width: '6px', height: '6px',
        borderRadius: '50%', background: '#fff', pointerEvents: 'none',
        zIndex: 9999, transform: 'translate(-50%,-50%)'
      });

      const ring = document.createElement('div');
      ring.className = 'cur-ring';
      Object.assign(ring.style, {
        position: 'fixed', top: 0, left: 0, width: '38px', height: '38px',
        borderRadius: '50%', border: '1.5px solid rgba(255,248,235,.45)',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)', transition: 'width .3s, height .3s, background .3s'
      });

      const cursorLabel = document.createElement('span');
      Object.assign(cursorLabel.style, {
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', fontSize: '10px',
        fontWeight: 700, letterSpacing: '.08em', color: '#0a0a0a',
        opacity: 0, transition: 'opacity .25s', pointerEvents: 'none',
        whiteSpace: 'nowrap'
      });
      ring.appendChild(cursorLabel);

      document.body.appendChild(dot);
      document.body.appendChild(ring);

      /* Quick-setters for smooth follow */
      const dotX = gsap.quickTo(dot, 'left', { duration: 0.08, ease: 'power3.out' });
      const dotY = gsap.quickTo(dot, 'top',  { duration: 0.08, ease: 'power3.out' });
      const ringX = gsap.quickTo(ring, 'left', { duration: 0.35, ease: 'power3.out' });
      const ringY = gsap.quickTo(ring, 'top',  { duration: 0.35, ease: 'power3.out' });

      window.addEventListener('mousemove', e => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      });

      /* Ring states */
      function setRing(size, bg, label) {
        ring.style.width = ring.style.height = size + 'px';
        ring.style.background = bg;
        cursorLabel.textContent = label;
        cursorLabel.style.opacity = label ? 1 : 0;
      }

      function resetRing() {
        setRing(38, 'transparent', '');
        ring.style.border = '1.5px solid rgba(255,248,235,.45)';
      }

      // Links & buttons: expand with amber tint
      $$('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setRing(60, 'rgba(245,158,11,.12)', '');
          ring.style.border = '1.5px solid rgba(245,158,11,.35)';
        });
        el.addEventListener('mouseleave', resetRing);
      });

      // Reel cards: large ring with 'VIEW'
      $$('.reel-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setRing(74, 'rgba(218,165,32,.85)', 'VIEW');
          ring.style.border = 'none';
        });
        el.addEventListener('mouseleave', resetRing);
      });

      // Book cards: ring with 'OPEN'
      $$('.book-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setRing(74, 'rgba(218,165,32,.85)', 'OPEN');
          ring.style.border = 'none';
        });
        el.addEventListener('mouseleave', resetRing);
      });

      /* Magnetic effect on buttons & [data-magnet] */
      $$('.btn, .btn-solid, [data-magnet]').forEach(el => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

        el.addEventListener('mousemove', e => {
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          xTo(dx * 0.3);
          yTo(dy * 0.3);
        });

        el.addEventListener('mouseleave', () => {
          xTo(0);
          yTo(0);
        });
      });
    }

    /* ─── 18. Resize Handler ──────────────────────────────── */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });

  } // end init()
})();
