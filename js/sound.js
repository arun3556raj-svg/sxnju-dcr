/* ============================================================
   sound.js — Howler.js Sound Manager
   Cinematic filmmaker portfolio sound effects controller.
   Sound is MUTED by default; user opts-in via a toggle button.
   All audio files are silent placeholders — see TODO comments
   for where to swap in real .mp3 assets.
   ============================================================ */

/**
 * Silent MP3 placeholder (base64-encoded).
 * Replace individual sound URLs with real .mp3 files when ready.
 */
const SILENT_MP3 =
  'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA' +
  '//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7' +
  'u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7////////////////////////////' +
  '//////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAA' +
  'AAABhvwN6OIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UGQAD/AAADSAAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAA//tQZAAP8AAAaQAAAAgAAA0gAAABAAAANIAAAAQAAAaQAAAAgAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAA';

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
    // TODO: Replace SILENT_MP3 with a real film-projector hum loop (≈0.5 s)
    //       e.g. src: ['/audio/projector-hum.mp3']
    SoundManager.sounds.projector = new Howl({
      src: [SILENT_MP3],
      volume: 0.2,
      loop: false,
    });

    // TODO: Replace SILENT_MP3 with a soft tactile click / tick (≈0.15 s)
    //       e.g. src: ['/audio/tick.mp3']
    SoundManager.sounds.tick = new Howl({
      src: [SILENT_MP3],
      volume: 0.25,
    });

    // TODO: Replace SILENT_MP3 with a subtle bass hit / thud (≈0.3 s)
    //       e.g. src: ['/audio/thud.mp3']
    SoundManager.sounds.thud = new Howl({
      src: [SILENT_MP3],
      volume: 0.15,
    });

    // TODO: Replace SILENT_MP3 with a film-slate clap variant (≈0.25 s)
    //       e.g. src: ['/audio/slate-clap.mp3']
    SoundManager.sounds.slate = new Howl({
      src: [SILENT_MP3],
      volume: 0.3,
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
