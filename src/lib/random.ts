// Crypto-backed randomness shared by the Random tools.

/** Uniform integer in [min, max] inclusive, using a secure source. */
export function randInt(min: number, max: number): number {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  const range = hi - lo + 1;
  if (range <= 0) return lo;
  // Reject-sample to avoid modulo bias.
  const maxUnbiased = Math.floor(0xffffffff / range) * range;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= maxUnbiased);
  return lo + (x % range);
}

/** Random float in [min, max). */
export function randFloat(min: number, max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return min + (buf[0] / 0x100000000) * (max - min);
}

/** Pick a random element. */
export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

/** Return a shuffled copy (Fisher–Yates). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `n` distinct random elements (or all, shuffled, if n exceeds length). */
export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.max(0, Math.min(n, arr.length)));
}
