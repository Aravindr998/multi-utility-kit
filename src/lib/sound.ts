// Small Web Audio helper for timer/alarm alerts — no assets, no network.
// Browsers require a prior user gesture before audio can play; callers invoke
// this from a click handler chain so the AudioContext is allowed to start.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Play a short pleasant triple-beep. Returns silently if audio is unavailable. */
export function playAlarm(times = 3): void {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  for (let i = 0; i < times; i++) {
    const t = now + i * 0.28;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.24);
  }
}

/** Warm up the audio context inside a user gesture so later playback is allowed. */
export function primeAudio(): void {
  getCtx();
}
