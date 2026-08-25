/*
  audio.js — Efectos de sonido generados con Web Audio API y reproductor
  de sonidos reales de los animales y audio de victoria/logros.
*/

let audioCtx = null;

function ensureAudioCtx() {
  if (audioCtx) return audioCtx;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  } catch (e) {
    audioCtx = null;
  }
  return audioCtx;
}

// Reproduce un tono simple. start/dur en segundos, relativos a "ahora".
function tone(freq, start, dur, type, gainVal) {
  if (!isSoundOn()) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  type = type || 'sine';
  gainVal = gainVal === undefined ? 0.15 : gainVal;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = gainVal;
  osc.connect(gain).connect(ctx.destination);
  const t0 = ctx.currentTime + start;
  gain.gain.setValueAtTime(gainVal, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function playCorrect() {
  tone(523.25, 0, 0.12, 'sine', 0.16);   // C5
  tone(659.25, 0.09, 0.12, 'sine', 0.16); // E5
  tone(783.99, 0.18, 0.2, 'sine', 0.18);  // G5
}

function playWrong() {
  tone(220, 0, 0.28, 'sawtooth', 0.09);
}

function playBadge() {
  tone(587.33, 0, 0.1, 'triangle', 0.16);
  tone(739.99, 0.1, 0.1, 'triangle', 0.16);
  tone(880, 0.2, 0.1, 'triangle', 0.16);
  tone(1174.66, 0.32, 0.3, 'triangle', 0.2);
}

// Reproduce el sonido de victoria oficial al completar un quiz o desbloquear un logro mayor
function playVictory() {
  if (!isSoundOn()) return;
  playRealSound('assets/audio/victoria.mp3');
  setTimeout(() => {
    // Si no cargó el archivo, usar síntesis Web Audio como respaldo
    if (!realAudioEl || realAudioEl.paused) {
      playBadge();
    }
  }, 120);
}

function isSoundOn() {
  return typeof state === 'undefined' || state.soundOn !== false;
}

let realAudioEl = null;
function playRealSound(src) {
  if (!src || !isSoundOn()) return;
  try {
    if (realAudioEl) { realAudioEl.pause(); }
    realAudioEl = new Audio(src);
    realAudioEl.volume = 0.85;
    realAudioEl.play().catch(() => {});
  } catch (e) {
    // Fallback silencioso si el navegador bloquea autoplay
  }
}
