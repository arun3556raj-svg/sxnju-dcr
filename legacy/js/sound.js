/* ============================================================
   sound.js — Howler.js Sound Manager
   Cinematic filmmaker portfolio sound effects controller.
   Sound is MUTED by default; user opts-in via a toggle button.
   All audio files are silent placeholders — see TODO comments
   for where to swap in real .mp3 assets.
   ============================================================ */

/**
 * Actual temporary sound URLs (Google Actions free sound library).
 */
const SOUND_URLS = {
  projector: 'https://actions.google.com/sounds/v1/foley/film_projector.ogg',
  tick: 'https://actions.google.com/sounds/v1/ui/button_click.ogg',
  thud: 'https://actions.google.com/sounds/v1/foley/wood_thud.ogg',
  slate: 'https://actions.google.com/sounds/v1/foley/clapperboard.ogg'
};

/* ────────────────────────────────────────────────────────────
   SoundManager Class
   ──────────────────────────────────────────────────────────── */
class SoundManager {
  /** Whether all sounds are muted (default: true — opt-in model) */
  static muted = true;

  /** Dictionary of Howl instances keyed by name */
  static sounds = {};

  /* ----------------------------------------------------------
     init() — Create all Howl instances with placeholder audio.
     Call once on DOMContentLoaded.
     ---------------------------------------------------------- */
  static init() {
    if (!window.Howl) {
      console.warn('Howler.js not loaded.');
      return;
    }

    // 1. Page load hum
    SoundManager.sounds.projector = new Howl({
      src: [SOUND_URLS.projector],
      volume: 0.15,
      loop: false
    });

    // 2. Section enter tick
    SoundManager.sounds.tick = new Howl({
      src: [SOUND_URLS.tick],
      volume: 0.2
    });

    // 3. CTA hover thud
    SoundManager.sounds.thud = new Howl({
      src: [SOUND_URLS.thud],
      volume: 0.25
    });

    // 4. Slate alternative hover
    SoundManager.sounds.slate = new Howl({
      src: [SOUND_URLS.slate],
      volume: 0.2
    });

    console.log('[SoundManager] Initialised with placeholder audio.');
  }

  /* ----------------------------------------------------------
     toggle() — Flip muted state, persist to localStorage,
     and update the toggle button icon (🔇 ↔ 🔊).
     ---------------------------------------------------------- */
  static toggle() {
    SoundManager.muted = !SoundManager.muted;

    // Persist preference
    localStorage.setItem('portfolio-sound-muted', SoundManager.muted);

    // Update button icon
    const btn = document.querySelector('.sound-toggle');
    if (btn) {
      btn.textContent = SoundManager.muted ? '🔇' : '🔊';
    }

    // If user just enabled sound, play the projector hum as feedback
    if (!SoundManager.muted) {
      SoundManager.play('projector');
    }
  }

  /* ----------------------------------------------------------
     play(name) — Play a sound by key, only when unmuted.
     ---------------------------------------------------------- */
  static play(name) {
    if (SoundManager.muted) return;

    const sound = SoundManager.sounds[name];
    if (sound) {
      sound.play();
    } else {
      console.warn(`[SoundManager] Unknown sound: "${name}"`);
    }
  }

  /* ----------------------------------------------------------
     setupToggle() — Bind the .sound-toggle button and restore
     the user's saved preference from localStorage.
     ---------------------------------------------------------- */
  static setupToggle() {
    const btn = document.querySelector('.sound-toggle');
    if (!btn) {
      console.warn('[SoundManager] .sound-toggle button not found in DOM.');
      return;
    }

    // Restore saved preference (default stays muted if nothing stored)
    const saved = localStorage.getItem('portfolio-sound-muted');
    if (saved !== null) {
      SoundManager.muted = saved === 'true';
    }

    // Set initial icon
    btn.textContent = SoundManager.muted ? '🔇' : '🔊';

    // Attach click handler
    btn.addEventListener('click', () => SoundManager.toggle());
  }

  /* ----------------------------------------------------------
     Convenience callbacks (called from main.js / ScrollTrigger)
     ---------------------------------------------------------- */

  /** Play tick sound when a new section scrolls into view */
  static onSectionEnter() {
    SoundManager.play('tick');
  }

  /** Play thud sound on CTA button hover */
  static onButtonHover() {
    SoundManager.play('thud');
  }
}

/* ────────────────────────────────────────────────────────────
   Bootstrap on DOM ready
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  SoundManager.init();
  SoundManager.setupToggle();
});

/* Expose globally so other scripts can call SoundManager.play(), etc. */
window.SoundManager = SoundManager;
