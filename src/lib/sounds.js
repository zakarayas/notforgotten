/**
 * UI sounds: organic pop sound by Roy S.
 * File: organic pop sound.mp3 (by Roy S)
 * Per-session cache-buster so the first tap gets the correct file (not a stale cached one).
 */

const CACHE_BUST = '?v=5&s=' + Date.now();
const CLICK_URL = (import.meta.env.BASE_URL || '/') + 'assets/organic%20pop%20sound.mp3' + CACHE_BUST;

let audioContext = null;
let preloadedAudio = null;
let warmedUp = false;

function warmUp() {
  if (warmedUp) return;
  warmedUp = true;
  ensurePreloaded();
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();
}

if (typeof document !== 'undefined') {
  document.addEventListener('touchstart', warmUp, { once: true, passive: true });
  document.addEventListener('pointerdown', warmUp, { once: true, passive: true });
}

function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function runWhenReady(ctx, fn) {
  if (ctx.state === 'running') {
    fn();
    return;
  }
  if (ctx.state === 'suspended') {
    ctx.resume().then(fn);
    return;
  }
  fn();
}

function ensurePreloaded() {
  if (preloadedAudio !== null) return;
  preloadedAudio = new Audio(CLICK_URL);
  preloadedAudio.preload = 'auto';
  preloadedAudio.volume = 0.25;
  preloadedAudio.load();
}

function playFromFile() {
  try {
    ensurePreloaded();
    if (preloadedAudio.readyState >= 2) {
      preloadedAudio.currentTime = 0;
      preloadedAudio.play();
      return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}

function playTapSynth() {
  const ctx = getContext();
  runWhenReady(ctx, () => {
    try {
      const now = ctx.currentTime;
      const dur = 0.028;
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + dur);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      oscGain.gain.setValueAtTime(0.32, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.start(now);
      osc.stop(now + dur);
      const noiseDur = 0.018;
      const buf = ctx.createBuffer(1, ctx.sampleRate * noiseDur, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 2200;
      bp.Q.value = 1.2;
      const ng = ctx.createGain();
      noise.connect(bp);
      bp.connect(ng);
      ng.connect(ctx.destination);
      ng.gain.setValueAtTime(0.2, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + noiseDur);
      noise.start(now);
      noise.stop(now + noiseDur);
    } catch (_) {}
  });
}

export function playTap() {
  warmUp();
  if (playFromFile()) return;
  playTapSynth();
}

export function playMenuToggle() {
  warmUp();
  if (playFromFile()) return;
  playTapSynth();
}
